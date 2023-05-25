import React, { useState, useEffect, useContext } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import CONTENTGPX from './gpx';
import { DOMParser } from 'xmldom';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';

function Map({ children }) {
    let [leftPoints, setLeftPoints] = useState([]);
    let [passedPoints, setPassedPoints] = useState([]);

    const { location, permission } = useContext(LocationContext);

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

    useEffect(() => {
        advance();
    }, []);

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
            {children}
        </MapView>
    );
}

const mapStateToProps = (state) => {
    return { overlay: state };
};

export default connect(mapStateToProps)(Map);
