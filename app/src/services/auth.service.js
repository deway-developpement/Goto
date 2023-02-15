import axios from 'axios';
import { default as config } from '../config.json';

async function refreshAuth(authContext) {
    if (!authContext.authState.refreshToken) {
        return null;
    }
    return axios
        .get(config.refreshLink, {
            headers: {
                refresh_token: authContext.authState.refreshToken,
            },
        })
        .then((response) => {
            authContext.setAuthState({
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
            });

            return response.data.access_token;
        })
        .catch(() => {
            return null;
        });
}

export { refreshAuth };
