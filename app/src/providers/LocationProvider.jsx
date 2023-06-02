import React, { createContext, useEffect, useState, useRef } from 'react';
import {
    useForegroundPermissions,
    getLastKnownPositionAsync,
    watchPositionAsync,
    watchHeadingAsync,
    getCurrentPositionAsync,
} from 'expo-location';
import { points } from './localisationFake';

const useSetInterval = (cb, time) => {
    const cbRef = useRef(null);
    useEffect(() => {
        cbRef.current = cb;
    });
    useEffect(() => {
        const interval = setInterval(() => cbRef.current(), time);
        return () => clearInterval(interval);
    }, [time]);
};

const LocationContext = createContext(null);
const { Provider } = LocationContext;

const LocationProvider = ({ children }) => {
    const [permission, request] = useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [heading, setHeading] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (permission === null) {
            request();
        } else if (permission.granted === false && permission.canAskAgain === true) {
            request();
        } else if (permission.granted === true) {
            getLastKnownPositionAsync({}).then((response) => {
                setLocation(response);
            });
            // watchPositionAsync({}, (response) => {
            //     setLocation(response);
            // });
            // watchHeadingAsync((response) => {
            //     setHeading(response);
            // });
        }
    }, [permission]);

    useSetInterval(() => {
        setLocation({
            ...location,
            coords: {
                ...location?.coords,
                latitude: points[index].latitude,
                longitude: points[index].longitude,
            },
            timestamp: new Date().getTime(),
        });
        setIndex((index + 1) % points.length);
    }, 1000);

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
