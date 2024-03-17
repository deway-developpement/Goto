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
    platforms: [
        'ios',
        'android',
    ],
    assetBundlePatterns: ['**/*'],
    ios: {
        icon: './assets/icon.png',
        bundleIdentifier: 'com.pooolm.deway-development',
        supportsTablet: true,
        config: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
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
                apiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
        },
    },
    extra: {
        eas: {
            projectId: '79a15c27-3de5-4776-a4d9-0bcd304dbf6f',
        },
    },
    plugins: [
        'expo-secure-store',
    ]
});
