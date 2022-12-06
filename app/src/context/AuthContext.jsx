import React, { createContext, useState } from 'react';

const AuthContext = createContext(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
    });

    const logout = async () => {
        setAuthState({
            accessToken: null,
            refreshToken: null,
            authenticated: false,
        });
    };

    const getAccessToken = () => {
        return authState.accessToken;
    };

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
