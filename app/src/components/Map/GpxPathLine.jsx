import React, { useState, useEffect, useContext } from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { distance2Coordonate, parseFile } from '../../services/gpx.services';
import { LocationContext } from '../../providers/LocationProvider';
import { MapState } from './enum';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../reducer/map.reducer';

function GpxPathLine({
    fileData,
    cameraRef,
    edgePadding = { top: 100, right: 100, bottom: 100, left: 100 },
    animated = true,
    mapState,
    isRecording,
}) {
    const { colors } = useTheme();
    const [leftPoints, setLeftPoints] = useState([]);
    const [passedPoints, setPassedPoints] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { location } = useContext(LocationContext);

    let maxLat = null;
    let maxLon = null;
    let minLat = null;
    let minLon = null;

    useEffect(() => {
        setLeftPoints(parseFile(fileData));
        setLoaded(false);
    }, [fileData]);

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

    useEffect(() => {
        if (
            (leftPoints.length || 0) == 0 ||
            location?.coords?.latitude == null ||
            location?.coords?.longitude == null ||
            mapState != MapState.FOCUS_HIKE ||
            !isRecording
        ) {
            return;
        }
        const distances = leftPoints.map(
            (point) =>
                distance2Coordonate(
                    {
                        latitude: parseFloat(location?.coords?.latitude),
                        longitude: parseFloat(location?.coords?.longitude),
                    },
                    point
                ) < 0.035
        );
        const index = distances.lastIndexOf(true);
        advance(index + 1);
    }, [location, leftPoints]);

    function advance(number = 1) {
        if (number == 0 || leftPoints.length == 0) {
            return;
        }
        const newPassedPoints = [
            ...passedPoints.slice(),
            ...leftPoints.slice().splice(0, Math.min(number, leftPoints.length) + 1),
        ];
        const newLeftPoints = leftPoints.slice(Math.min(number, leftPoints.length));
        setPassedPoints(newPassedPoints);
        setLeftPoints(newLeftPoints);
    }

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

export default connect(mapStateToProps)(GpxPathLine);
