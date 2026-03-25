import productionConfig from './config.json';

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

const config = apiUrl
    ? {
        refreshLink: `${apiUrl}/auth/refresh`,
        baseLink: `${apiUrl}/`,
        graphQLLink: `${apiUrl}/graphql`,
        filesLink: `${apiUrl}/files`,
    }
    : productionConfig;

export default config;
