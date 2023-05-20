import React, { useState, useEffect } from 'react';
import MapView, { Marker, Polyline, Overlay } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import CONTENTGPX from './gpx';
import { DOMParser } from 'xmldom';

export default function Map({ location, image, leftImage, topImage, widthImage, setWidthImage, heightImage, setHeightImage, angleImage}) {
    const { colors } = useTheme();
    let [leftPoints, setLeftPoints] = useState([]);
    let [passedPoints, setPassedPoints] = useState([]);

    useEffect(() => {
        setWidthImage(0.01);
        setHeightImage(0.01);
        //image.height / image.width) * widthImage
    }, [image]);

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
    const y1=parseFloat(location?.coords?.latitude) + topImage;
    const x1=parseFloat(location?.coords?.longitude) + leftImage;
    const y2=parseFloat(location?.coords?.latitude) + topImage + heightImage;
    const x2=parseFloat(location?.coords?.longitude) + leftImage + widthImage;
    
    console.log(y1, x1, y2, x2);
    console.log(y1-parseFloat(location?.coords?.latitude), x1-parseFloat(location?.coords?.longitude), y2-parseFloat(location?.coords?.latitude), x2-parseFloat(location?.coords?.longitude));
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
            {image && (
                <Overlay
                    bounds={[
                        [
                            y1,
                            x1,
                        ],
                        [
                            y2,
                            x2,
                        ],
                    ]}
                    image={{ uri: image.uri }}
                    bearing={angleImage}
                    opacity={0.8}
                />
            )}
        </MapView>
    );
}
