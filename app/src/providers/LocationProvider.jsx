import React, { createContext, useEffect, useState } from 'react';
import {
    useForegroundPermissions,
    getLastKnownPositionAsync,
    watchPositionAsync,
    watchHeadingAsync,
} from 'expo-location';

const LocationContext = createContext(null);
const { Provider } = LocationContext;

const LocationProvider = ({ children }) => {
    const [permission, request] = useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [heading, setHeading] = useState(null);

    useEffect(() => {
        if (permission === null) {
            request();
        } else if (permission.granted === false && permission.canAskAgain === true) {
            request();
        } else if (permission.granted === true) {
            getLastKnownPositionAsync({}).then((response) => {
                setLocation(response);
            });
            watchPositionAsync({}, (response) => {
                setLocation(response);
            });
            watchHeadingAsync((response) => {
                setHeading(response);
            });
        }
    }, [permission]);

    return (
        <Provider
            value={{
                location,
                heading,
                permission,
            }}
        >
            {children}
        </Provider>
    );
};

export { LocationContext, LocationProvider };
