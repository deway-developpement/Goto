import React, { useState, useEffect } from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { parseFile } from '../../services/gpx.services';

export default function GpxPathLineLite({
    fileData,
    cameraRef,
    edgePadding = { top: 100, right: 100, bottom: 100, left: 100 },
    animated = true,
}) {
    const { colors } = useTheme();
    const [points, setPoints] = useState([]);
    const [loaded, setLoaded] = useState(false);

    let maxLat = null;
    let maxLon = null;
    let minLat = null;
    let minLon = null;

    useEffect(() => {
        setPoints(parseFile(fileData));
        setLoaded(false);
    }, []);

    useEffect(() => {
        if (!loaded) {
            points.map((point) => {
                if (point.latitude > maxLat || maxLat == null) {
                    maxLat = point.latitude;
                }
                if (point.latitude < minLat || minLat == null) {
                    minLat = point.latitude;
                }
                if (point.longitude > maxLon || maxLon == null) {
                    maxLon = point.longitude;
                }
                if (point.longitude < minLon || minLon == null) {
                    minLon = point.longitude;
                }
            });
            if (cameraRef.current == null) {
                return;
            } else if (maxLat != null && maxLon != null && minLat != null && minLon != null) {
                cameraRef.current.fitToCoordinates(
                    [
                        { latitude: maxLat, longitude: maxLon },
                        { latitude: minLat, longitude: minLon },
                    ],
                    {
                        edgePadding,
                        animated,
                    }
                );
                setLoaded(true);
            }
        }
    }, [points]);

    return (
        <>
            <Polyline coordinates={points} strokeColor={colors.borderLinePrimary} strokeWidth={6} />
            <Polyline coordinates={points} strokeColor={colors.linePrimary} strokeWidth={4} />
        </>
    );
}
