import React, { useContext, cloneElement, useRef, isValidElement, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';
import { MapState } from './enum';
import { changeMapState, mapStateToProps } from '../../reducer/map.reducer';
// import { distance2Coordonate } from '../../services/gpx.services';

function Map({ children, mapState, dispatch }) {
    const { location, permission } = useContext(LocationContext);
    const cameraRef = useRef(null);

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
            // if (
            //     lastPoint == null ||
            //     lastPoint.time < new Date().getTime() - 1000 * 60 ||
            //     distance2Coordonate(
            //         {
            //             latitude: parseFloat(location?.coords?.latitude),
            //             longitude: parseFloat(location?.coords?.longitude),
            //         },
            //         lastPoint
            //     ) > 0.1
            // ) {
            //     console.log('addPoint');
            //     dispatch(
            //         addPoint({
            //             latitude: parseFloat(location?.coords?.latitude),
            //             longitude: parseFloat(location?.coords?.longitude),
            //             elevation: parseFloat(location?.coords?.altitude),
            //             time: new Date(),
            //         })
            //     );
            // }
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
            onPanDrag={() => {
                if (mapState === MapState.FOLLOW_POSITION) {
                    dispatch(changeMapState(MapState.NONE));
                }
            }}
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

export default connect(mapStateToProps)(Map);
