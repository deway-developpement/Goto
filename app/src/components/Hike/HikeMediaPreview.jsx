import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { FILES_URL } from '../../providers/AxiosContext';
import { parseFile } from '../../services/gpx.services';
import MAP_STYLE from '../../../assets/maps/style.json';

const IMAGE_TIMEOUT_MS = 2500;
const MINIMUM_DELTA = 0.008;

function getRegion(points) {
    if (points.length === 0) {
        return null;
    }

    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);
    const minLatitude = Math.min(...latitudes);
    const maxLatitude = Math.max(...latitudes);
    const minLongitude = Math.min(...longitudes);
    const maxLongitude = Math.max(...longitudes);

    return {
        latitude: (minLatitude + maxLatitude) / 2,
        longitude: (minLongitude + maxLongitude) / 2,
        latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.35, MINIMUM_DELTA),
        longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.35, MINIMUM_DELTA),
    };
}

function RouteMarker({ coordinate, color }) {
    return (
        <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <View style={[styles.markerBorder, { borderColor: color }]}>
                <View style={[styles.marker, { backgroundColor: color }]} />
            </View>
        </Marker>
    );
}

function GpxMapPreview({ trackFilename }) {
    const { colors } = useTheme();
    const [points, setPoints] = useState([]);

    useEffect(() => {
        let cancelled = false;

        if (!trackFilename) {
            setPoints([]);
            return () => {
                cancelled = true;
            };
        }

        fetch(`${FILES_URL}/tracks/${encodeURIComponent(trackFilename)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Unable to load GPX preview (${response.status})`);
                }
                return response.text();
            })
            .then((file) => {
                if (cancelled) {
                    return;
                }

                const parsedPoints = parseFile(file).filter(
                    (point) =>
                        Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
                );
                setPoints(parsedPoints);
            })
            .catch(() => {
                if (!cancelled) {
                    setPoints([]);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [trackFilename]);

    const region = useMemo(() => getRegion(points), [points]);

    if (!region) {
        return (
            <Image
                source={require('../../../assets/images/Dalle_background.png')}
                resizeMode="cover"
                style={StyleSheet.absoluteFill}
            />
        );
    }

    return (
        <MapView
            accessible={false}
            customMapStyle={MAP_STYLE}
            initialRegion={region}
            mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            pitchEnabled={false}
            pointerEvents="none"
            rotateEnabled={false}
            scrollEnabled={false}
            showsBuildings={false}
            showsCompass={false}
            showsIndoors={false}
            showsMyLocationButton={false}
            showsPointsOfInterest={false}
            showsScale={false}
            showsTraffic={false}
            style={StyleSheet.absoluteFill}
            toolbarEnabled={false}
            zoomEnabled={false}
        >
            <Polyline
                coordinates={points}
                strokeColor={colors.primary}
                strokeWidth={7}
            />
            <Polyline coordinates={points} strokeColor={colors.active} strokeWidth={4} />
            <RouteMarker coordinate={points[0]} color={colors.primary} />
            <RouteMarker coordinate={points[points.length - 1]} color={colors.accent} />
        </MapView>
    );
}

export default function HikeMediaPreview({
    photoFilename,
    trackFilename,
    style,
    resizeMode = 'cover',
    timeout = IMAGE_TIMEOUT_MS,
}) {
    const [showPhoto, setShowPhoto] = useState(Boolean(photoFilename));
    const timeoutRef = useRef(null);

    function clearImageTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    useEffect(() => {
        clearImageTimeout();
        setShowPhoto(Boolean(photoFilename));

        if (!photoFilename) {
            return undefined;
        }

        timeoutRef.current = setTimeout(() => setShowPhoto(false), timeout);
        return clearImageTimeout;
    }, [photoFilename, timeout]);

    return (
        <View style={[styles.container, style]}>
            <GpxMapPreview trackFilename={trackFilename} />
            {showPhoto && (
                <Image
                    onError={() => {
                        clearImageTimeout();
                        setShowPhoto(false);
                    }}
                    onLoad={clearImageTimeout}
                    resizeMode={resizeMode}
                    source={{ uri: `${FILES_URL}/photos/${photoFilename}` }}
                    style={StyleSheet.absoluteFill}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D9E3E0',
        overflow: 'hidden',
    },
    marker: {
        borderRadius: 4,
        height: 8,
        width: 8,
    },
    markerBorder: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 2,
        height: 16,
        justifyContent: 'center',
        width: 16,
    },
});
