import {
    ApolloClient,
    InMemoryCache,
    from,
    HttpLink,
    ApolloProvider,
    split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from 'apollo-link';
import { setContext } from '@apollo/client/link/context';
import { AuthContext } from './AuthContext';
import { AxiosContext } from './AxiosContext';
import React, { useContext } from 'react';
import { refreshCustom } from '../services/auth.service';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

function createApolloClient(authContext, publicAxios) {
    const authLink = setContext(() => {
        return {
            headers: {
                Authorization: `Bearer ${authContext.getAccessToken()}`,
            },
        };
    });

    let isRefreshing = false;
    let pendingRequests = [];

    const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                case 'UNAUTHENTICATED': {
                    let _forward;
                    if (!isRefreshing) {
                        isRefreshing = true;
                        _forward = fromPromise(
                            refreshCustom(publicAxios, authContext)
                                .then((token) => {
                                    operation.setContext({
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });
                                    return token;
                                })
                                .catch(() => {
                                    pendingRequests = [];
                                    authContext.logout();
                                    return;
                                })
                                .finally(() => {
                                    isRefreshing = false;
                                })
                        ).filter(value => Boolean(value));
                    } else {
                        // Will only emit once the Promise is resolved
                        _forward = fromPromise(
                            new Promise(resolve => {
                                pendingRequests.push(() => resolve());
                            })
                        );
                    }
                    return _forward.flatMap(() => forward(operation));
                }
                }  
            }
        }
    });
    
    const httpLink = new HttpLink({
        uri: 'http://localhost:3000/graphql',
    });


    const wsLink = new GraphQLWsLink(createClient({
        url: 'ws://localhost:3000/graphql',
        shouldRetry: true,
        keepAlive: true,
        connectionParams: {
            Authorization: `Bearer ${authContext.getAccessToken()}`,
        },
    }));

    const splitLink = split( ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink,
    );
    
    const client = new ApolloClient({
        link: from([ splitLink, refreshLink , httpLink ]),
        cache: new InMemoryCache(),
    });

    return client;
}

const AuthApolloProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);
    const client = createApolloClient(authContext, publicAxios);
    return <ApolloProvider client={client}>
        {children}
    </ApolloProvider>;
};

export default AuthApolloProvider;
