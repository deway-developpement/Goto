import React, { useState, useEffect } from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { DOMParser } from 'xmldom';

export default function GpxPathLine({
    fileData,
    cameraRef,
    edgePadding = { top: 100, right: 100, bottom: 100, left: 100 },
    animated = true,
}) {
    const { colors } = useTheme();
    const [leftPoints, setLeftPoints] = useState([]);
    const [passedPoints, setPassedPoints] = useState([]);
    const [loaded, setLoaded] = useState(false);

    let maxLat = null;
    let maxLon = null;
    let minLat = null;
    let minLon = null;

    function parseFile() {
        const doc = new DOMParser().parseFromString(fileData, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);
        const trkptsArrayLat = trkptsArray.map((trkpt) => trkpt.getAttribute('lat'));
        const trkptsArrayLon = trkptsArray.map((trkpt) => trkpt.getAttribute('lon'));
        return trkptsArrayLat.map((lat, index) => {
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(trkptsArrayLon[index]),
            };
        });
    }

    useEffect(() => {
        setLeftPoints(parseFile());
        setLoaded(false);
    }, []);

    useEffect(() => {
        if (!loaded) {
            const points = [...leftPoints, ...passedPoints];
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
    }, [leftPoints]);

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

    useEffect(() => {
        advance();
    }, []);

    return (
        <>
            <Polyline
                coordinates={passedPoints}
                strokeColor={colors.borderLineSecondary}
                strokeWidth={6}
            />
            <Polyline
                coordinates={passedPoints}
                strokeColor={colors.lineSecondary}
                strokeWidth={4}
            />
            <Polyline
                coordinates={leftPoints}
                strokeColor={colors.borderLinePrimary}
                strokeWidth={6}
            />
            <Polyline coordinates={leftPoints} strokeColor={colors.linePrimary} strokeWidth={4} />
        </>
    );
}
