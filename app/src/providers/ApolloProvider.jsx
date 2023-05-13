import {
    ApolloClient,
    InMemoryCache,
    from,
    ApolloProvider,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from 'apollo-link';
import { setContext } from '@apollo/client/link/context';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';
import { refreshAuth } from '../services/auth.service';
import { default as config } from '../config.json';
import apolloLogger from 'apollo-link-logger';
import { createUploadLink } from 'apollo-upload-client';

function createApolloClient(authContext) {
    const authLink = setContext(() => {
        return {
            headers: {
                Authorization: `Bearer ${authContext.getAccessToken()}`,
            },
        };
    });

    let isRefreshing = false;
    let pendingRequests = [];

    // @ts-ignore
    const refreshLink = onError(
        ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.code) {
                    case 'UNAUTHENTICATED': {
                        // check if error is authentication error
                        if (err.message !== 'Unauthorized') {
                            console.log('401 Exception', err);
                            return forward(operation);
                        }
                        // Here we create a new Promise that will be resolved when the token refresh is complete
                        let _forward;
                        if (!isRefreshing) {
                            isRefreshing = true;
                            _forward = fromPromise(
                                refreshAuth(authContext)
                                    .then((token) => {
                                        // Once the token refresh is complete, we update the pending requests with the new token
                                        operation.setContext({
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        });
                                        return token;
                                    })
                                    .catch(() => {
                                        // If the token refresh fails, we remove the pending requests and log the user out
                                        pendingRequests = [];
                                        authContext.logout();
                                        return;
                                    })
                                    .finally(() => {
                                        // Finally, we send the requests that were pending and reset the isRefreshing flag
                                        isRefreshing = false;
                                    })
                            ).filter((value) => Boolean(value));
                        } else {
                            // Will only emit once the Promise is resolved
                            _forward = fromPromise(
                                new Promise((resolve) => {
                                    pendingRequests.push(() => resolve());
                                }) // this line create a Promise and add its resolve function to the pendingRequests array
                            );
                        }
                        // We return the Observable that will be fetched once the token refresh is complete
                        return _forward.flatMap(() => forward(operation));
                    }
                    }
                }
            }
            if (networkError) {
                console.log(
                    `[Network error]: ${JSON.stringify(networkError, null, 2)}`
                );
                return forward(operation);
            }
        }
    );

    const httpLink = new createUploadLink({
        uri: config.graphQLLink,
        print: true,
    });

    const client = new ApolloClient({
        link: from([apolloLogger, authLink, refreshLink, httpLink]),
        cache: new InMemoryCache(),
    });

    return client;
}

const AuthApolloProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const client = createApolloClient(authContext);
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthApolloProvider;
