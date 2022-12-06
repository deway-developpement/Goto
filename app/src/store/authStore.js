import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeAuth(accessToken, refreshToken) {
    try {
        const data = JSON.stringify({ accessToken, refreshToken });
        await AsyncStorage.setItem('auth', data);
    } catch (error) {
        console.log(error);
    }
}

async function getAuth() {
    try {
        const data = await AsyncStorage.getItem('auth');
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.log(error);
    }
}

async function removeAuth() {
    try {
        await AsyncStorage.removeItem('auth');
    } catch (err) {
        console.log(err);
    }
}

export { storeAuth, getAuth, removeAuth };
