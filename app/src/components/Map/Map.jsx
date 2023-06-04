import React, { useContext, cloneElement, useRef, isValidElement, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';
import { addPoint, changeIsFollowing, mapStateToProps } from '../../reducer/map.reducer';
import { distance2Coordonate } from '../../services/gpx.services';
// import { distance2Coordonate } from '../../services/gpx.services';

function Map({ children, isFollowing, performance, isRecording, dispatch }) {
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
        if (isFollowing) {
            cameraRef.current.animateCamera({
                center: {
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                },
                zoom: 16,
            });
        }
        if (isRecording) {
            if (
                performance.lastPoint == null ||
                performance.lastPoint.time + 1000 * 6 < new Date().getTime() ||
                distance2Coordonate(
                    {
                        latitude: parseFloat(location?.coords?.latitude),
                        longitude: parseFloat(location?.coords?.longitude),
                    },
                    performance.lastPoint
                ) > 0.0005
            ) {
                dispatch(
                    addPoint({
                        latitude: parseFloat(location?.coords?.latitude),
                        longitude: parseFloat(location?.coords?.longitude),
                        elevation: parseFloat(location?.coords?.altitude),
                        time: new Date(),
                    })
                );
            }
        }
    }, [location, isFollowing]);

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
                if (isFollowing) {
                    dispatch(changeIsFollowing(false));
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
