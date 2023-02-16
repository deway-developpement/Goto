import React, { createContext, useEffect, useState } from 'react'; 
import { storeAuth, getAuth } from '../store/authStore';

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
    });

    const logout = async () => {
        setAuthState({
            accessToken: null,
            refreshToken: null,
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
                    accessToken: auth.accessToken,
                    refreshToken: auth.refreshToken,
                });
            }
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
