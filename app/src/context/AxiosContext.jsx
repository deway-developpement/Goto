import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { storeAuth } from '../store/authStore';

const AxiosContext = createContext(null);
const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

    const authAxios = axios.create({
        baseURL: 'http://localhost:3000/',
    });

    const publicAxios = axios.create({
        baseURL: 'http://localhost:3000/',
    });

    authAxios.interceptors.request.use(
        (config) => {
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const refreshAuthLogic = (failedRequest) => {
        const options = {
            method: 'GET',
            url: 'http://localhost:3000/auth/refresh',
            headers: {
                refresh_token: authContext.authState.refreshToken,
            },
        };

        return axios(options)
            .then(async (tokenRefreshResponse) => {
                failedRequest.response.config.headers.Authorization =
                    'Bearer ' + tokenRefreshResponse.data.access_token;

                authContext.setAuthState({
                    ...authContext.authState,
                    accessToken: tokenRefreshResponse.data.access_token,
                    refreshToken: tokenRefreshResponse.data.refresh_token,
                });

                storeAuth(
                    tokenRefreshResponse.data.access_token,
                    tokenRefreshResponse.data.refresh_token
                );

                return Promise.resolve();
            })
            .catch(() => {
                authContext.setAuthState({
                    accessToken: null,
                    refreshToken: null,
                });
            });
    };

    createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

    return (
        <Provider
            value={{
                authAxios,
                publicAxios,
            }}
        >
            {children}
        </Provider>
    );
};

export { AxiosContext, AxiosProvider };
