import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { default as config } from '../config.json';
import { refreshAuth } from '../services/auth.service';

const AxiosContext = createContext(null);
const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

    const authAxios = axios.create({
        baseURL: config.baseLink,
    });

    const publicAxios = axios.create({
        baseURL: config.baseLink,
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
        return refreshAuth(authContext).then(() => {
            failedRequest.response.config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
            return Promise.resolve();
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

const BASE_URL = config.baseLink;
const FILES_URL = config.filesLink;
const GRAPHQL_URL = config.graphqlLink;

export { AxiosContext, AxiosProvider, BASE_URL, FILES_URL, GRAPHQL_URL };
