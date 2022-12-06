import { storeAuth, getAuth, removeAuth } from '../store/authStore';

async function login(authContext, accessToken = null, refreshToken = null) {
    if (accessToken && refreshToken) {
        await storeAuth(accessToken, refreshToken);
        authContext.setAuthState({
            accessToken,
            refreshToken,
            authenticated: true,
        });
        return true;
    } else {
        const auth = await getAuth();
        if (auth) {
            authContext.setAuthState({
                accessToken: auth.accessToken,
                refreshToken: auth.refreshToken,
                authenticated: true,
            });
            return true;
        }
        return false;
    }
}

async function logout(authContext) {
    await removeAuth();
    authContext.logout();
    return true;
}

async function refresh(publicAxios, authContext) {
    const data = await getAuth();
    if (data) {
        const res = await publicAxios.get('/auth/refresh', {
            headers: {
                refresh_token: data.refreshToken,
            },
        });
        if (res.status === 200) {
            return await login(
                authContext,
                res.data.access_token,
                res.data.refresh_token
            );
        } else {
            logout(authContext);
            return false;
        }
    }
    return false;
}

async function refreshCustom(publicAxios, authContext) {
    const data = await getAuth();
    if (data) {
        const res = await publicAxios.get('/auth/refresh', {
            headers: {
                refresh_token: data.refreshToken,
            },
        });
        if (res.status === 200) {
            await storeAuth(res.data.access_token, res.data.refresh_token);
            authContext.setAuthState({
                accessToken: res.data.access_token,
                refreshToken: res.data.refresh_token,
                authenticated: true,
            });
            return res.data.access_token;
        } else {
            logout(authContext);
            return false;
        }
    }
    return false;
}

export { login, logout, refresh, refreshCustom };
