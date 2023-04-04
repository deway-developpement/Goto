import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import CONTENTGPX from './gpx';
import { DOMParser } from 'xmldom';

function Map({ location }) {
    const { colors } = useTheme();
    let [leftPoints, setLeftPoints] = useState([]);
    let [passedPoints, setPassedPoints] = useState([]);

    function parseFile() {
        const doc = new DOMParser().parseFromString(CONTENTGPX, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);
        const trkptsArrayLat = trkptsArray.map((trkpt) =>
            trkpt.getAttribute('lat')
        );
        const trkptsArrayLon = trkptsArray.map((trkpt) =>
            trkpt.getAttribute('lon')
        );
        return trkptsArrayLat.map((lat, index) => {
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(trkptsArrayLon[index]),
            };
        });
    }

    useEffect(() => {
        setLeftPoints(parseFile());
    }, []);

    function advance() {
        if (leftPoints.length == 0) {
            return;
        }
        const gpxPathLeft = leftPoints.slice();
        const gpxPathpassedPoints = passedPoints.slice();
        gpxPathpassedPoints.push(gpxPathLeft.shift());
        gpxPathpassedPoints.push(gpxPathLeft[0]);
        setPassedPoints(gpxPathpassedPoints);
        setLeftPoints(gpxPathLeft);
    }

    return (
        <MapView
            initialRegion={{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }}
            region={{
                latitude: parseFloat(location?.coords?.latitude),
                longitude: parseFloat(location?.coords?.longitude),
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }}
            showsPointsOfInterest={false}
            style={{ flex: 1, width: '100%' }}
            maxZoomLevel={17}
        >
            <Polyline
                coordinates={passedPoints}
                strokeColor={colors.borderlinesecondary}
                strokeWidth={6}
            />
            <Polyline
                coordinates={passedPoints}
                strokeColor={colors.linesecondary}
                strokeWidth={4}
            />
            <Polyline
                coordinates={leftPoints}
                strokeColor={colors.borderlineprimary}
                strokeWidth={6}
            />
            <Polyline
                coordinates={leftPoints}
                strokeColor={colors.lineprimary}
                strokeWidth={4}
            />
            <Marker
                coordinate={{
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                }}
                onPress={() => {
                    advance();
                }}
            />
        </MapView>
    );
}

export default function MapScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [permission, request] = Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (permission === null) {
            request();
        } else if (
            permission.granted === false &&
            permission.canAskAgain === false
        ) {
            setErrorMsg('Permission to access location was denied');
        } else if (
            permission.granted === false &&
            permission.canAskAgain === true
        ) {
            request();
        } else if (permission.granted === true) {
            Location.getLastKnownPositionAsync({}).then((response) => {
                setLocation(response);
            });
            Location.watchPositionAsync({}, (response) => {
                setLocation(response);
            });
        }
    }, [permission]);

    useEffect(() => {
        console.log(location?.coords?.latitude);
    }, [location]);

    return (
        <View style={styles.container}>
            {(() => {
                if (location == null) {
                    if (errorMsg != null) {
                        return (
                            <Text style={{ alignSelf: 'center' }}>
                                {errorMsg}
                            </Text>
                        );
                    } else {
                        return (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                style={{ flex: 3, width: '100%' }}
                            />
                        );
                    }
                } else {
                    return <Map location={location} />;
                }
            })()}
        </View>
    );
}
