import React, { useContext, cloneElement, useRef, isValidElement, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';
import { MapState } from './enum';
import { distance2Coordonate } from '../../services/gpx.services';

function Map({ children, mapState }) {
    const { location, permission } = useContext(LocationContext);
    const cameraRef = useRef(null);

    const points = [];

    const childrenWithProps = children.map((child, index) => {
        if (isValidElement(child)) {
            return cloneElement(child, {
                cameraRef,
                key: index,
            });
        }
    });

    useEffect(() => {
        if (mapState === MapState.FOLLOW_POSITION) {
            cameraRef.current.animateCamera({
                center: {
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                },
            });
        }
    }, [mapState]);

    useEffect(() => {
        if (mapState === MapState.FOLLOW_POSITION) {
            cameraRef.current.animateCamera({
                center: {
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                },
            });
        }
        if (mapState === MapState.FOLLOW_AND_RECORD_POSITION) {
            cameraRef.current.animateCamera({
                center: {
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                },
            });
            if (
                points.length === 0 ||
                distance2Coordonate(points[points.length - 1], location.coords) > 0.01
            ) {
                points.push({
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                    time: new Date(),
                });
            }
        }
    }, [location]);

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
            showsMyLocationButton={false}
            pitchEnabled={false}
            provider={PROVIDER_GOOGLE}
            customMapStyle={MAP_STYLE}
            style={{ flex: 1, width: '100%' }}
            maxZoomLevel={18}
            ref={cameraRef}
        >
            {childrenWithProps}
        </MapView>
    );
}

const mapStateToProps = (state) => {
    return { overlay: state };
};

export default connect(mapStateToProps)(Map);
