import React, { useState, useEffect } from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { DOMParser } from 'xmldom';

export default function GpxPathLine({ fileData }) {
    const { colors } = useTheme();
    let [leftPoints, setLeftPoints] = useState([]);
    let [passedPoints, setPassedPoints] = useState([]);

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
