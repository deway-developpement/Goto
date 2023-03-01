import React, { createContext, useEffect, useState } from 'react'; 
import { storeAuth, getAuth } from '../store/authStore';

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        connected: false,
        loading: true,
    });

    const logout = async () => {
        setAuthState({
            ...authState,
            accessToken: null,
            refreshToken: null,
            connected: false,
        });
        storeAuth(null, null); // force update local storage
    };

    const getAccessToken = () => {
        return authState.accessToken;
    };

    // store auth in local storage when updated
    useEffect(() => {
        if (authState.accessToken) {
            storeAuth(authState.accessToken, authState.refreshToken);
        }
    }, [authState]);

    // get auth from local storage on mount
    useEffect(() => {
        getAuth().then((auth) => {
            if (auth) {
                setAuthState({
                    ...authState,
                    accessToken: auth.accessToken,
                    refreshToken: auth.refreshToken,
                    loading: false,
                });
            }
        }).catch(() => {
            setAuthState({
                ...authState,
                accessToken: null,
                refreshToken: null,
                loading: false,
            });
        });
    }, []);

    return (
        <Provider
            value={{
                authState,
                getAccessToken,
                setAuthState,
                logout,
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };
