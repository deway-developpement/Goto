import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

// initialize dotenv
dotenv.config();

export default ({ config }) => ({
    ...config,
    name: 'goto',
    slug: 'goto',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        config: {
            googleMapsApiKey: 'AIzaSyBeJpFARAqM4l_uTzf3jcwCDek5iWzXzFY',
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF',
        },
        package: 'com.pooolm.deway_development',
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_CLOUD_API_KEY,
            },
        },
    },
    extra: {
        eas: {
            projectId: process.env.GOOGLE_CLOUD_API_KEY,
        },
    },
});
