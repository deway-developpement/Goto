import React, { useState, useEffect, useContext } from 'react';
import MapView, { Polyline, Overlay, PROVIDER_GOOGLE } from 'react-native-maps';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import { useTheme } from '@react-navigation/native';
import CONTENTGPX from './gpx';
import { DOMParser } from 'xmldom';
import { LocationContext } from '../../providers/LocationProvider';

export default function Map({
    image,
    leftImage,
    topImage,
    widthImage,
    setWidthImage,
    heightImage,
    setHeightImage,
    angleImage,
}) {
    const { colors } = useTheme();
    let [leftPoints, setLeftPoints] = useState([]);
    let [passedPoints, setPassedPoints] = useState([]);

    const { location, permission } = useContext(LocationContext);

    useEffect(() => {
        setWidthImage(0.01);
        setHeightImage(0.01);
    }, [image]);

    function parseFile() {
        const doc = new DOMParser().parseFromString(CONTENTGPX, 'text/xml');
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

    advance();

    const y1 = parseFloat(location?.coords?.latitude) + topImage;
    const x1 = parseFloat(location?.coords?.longitude) + leftImage;
    const y2 = parseFloat(location?.coords?.latitude) + topImage + heightImage;
    const x2 = parseFloat(location?.coords?.longitude) + leftImage + widthImage;

    console.log(y1, x1, y2, x2);
    console.log(
        y1 - parseFloat(location?.coords?.latitude),
        x1 - parseFloat(location?.coords?.longitude),
        y2 - parseFloat(location?.coords?.latitude),
        x2 - parseFloat(location?.coords?.longitude)
    );

    return (
        <MapView
            initialRegion={{
                latitude: parseFloat(location?.coords?.latitude),
                longitude: parseFloat(location?.coords?.longitude),
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }}
            showsPointsOfInterest={false}
            showsUserLocation={permission.granted === true}
            pitchEnabled={false}
            provider={PROVIDER_GOOGLE}
            customMapStyle={MAP_STYLE}
            style={{ flex: 1, width: '100%' }}
            maxZoomLevel={18}
        >
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
            {image && (
                <Overlay
                    bounds={[
                        [y1, x1],
                        [y2, x2],
                    ]}
                    image={{ uri: image.uri }}
                    bearing={angleImage}
                    opacity={0.8}
                />
            )}
        </MapView>
    );
}
