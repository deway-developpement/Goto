import React, { useContext, useEffect } from 'react';
import { Marker, Overlay } from 'react-native-maps';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';
import {
    changeHeight,
    changePosition,
    changeWidth,
    mapStateToProps,
} from '../../reducer/map.reducer';
import { MapState } from './enum';

function OverlayImage({ image, overlay, cameraRef, dispatch, mapState }) {
    const { location } = useContext(LocationContext);

    useEffect(() => {
        if (cameraRef.current == null) {
            return;
        } else if (location != null && image != null) {
            cameraRef.current.animateCamera({
                center: {
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                },
                zoom: 14,
            });
        }
    }, [image]);

    if (!image) {
        return null;
    } else {
        return (
            <>
                {mapState === MapState.IMAGE_EDIT && (
                    <>
                        <Marker
                            coordinate={{
                                latitude: location?.coords.latitude + overlay.position.y,
                                longitude: location?.coords.longitude + overlay.position.x,
                            }}
                            anchor={{ x: 0.5, y: 0.5 }}
                            pinColor="blue"
                            draggable={true}
                            onDrag={(e) => {
                                dispatch(
                                    changePosition({
                                        x:
                                            e.nativeEvent.coordinate.longitude -
                                            location?.coords.longitude,
                                        y:
                                            e.nativeEvent.coordinate.latitude -
                                            location?.coords.latitude,
                                    })
                                );
                            }}
                        />
                        <Marker
                            coordinate={{
                                latitude:
                                    location?.coords.latitude + overlay.position.y + overlay.height,
                                longitude:
                                    location?.coords.longitude + overlay.position.x + overlay.width,
                            }}
                            anchor={{ x: 0.5, y: 0.5 }}
                            pinColor="blue"
                            draggable={true}
                            onDrag={(e) => {
                                dispatch(
                                    changeHeight(
                                        e.nativeEvent.coordinate.latitude -
                                            location?.coords.latitude -
                                            overlay.position.y
                                    )
                                );
                                dispatch(
                                    changeWidth(
                                        e.nativeEvent.coordinate.longitude -
                                            location?.coords.longitude -
                                            overlay.position.x
                                    )
                                );
                            }}
                        />
                    </>
                )}
                <Overlay
                    bounds={[
                        [
                            location?.coords.latitude + overlay.position.y,
                            location?.coords.longitude + overlay.position.x,
                        ],
                        [
                            location?.coords.latitude + overlay.position.y + overlay.height,
                            location?.coords.longitude + overlay.position.x + overlay.width,
                        ],
                    ]}
                    image={{ uri: image.uri }}
                    bearing={overlay.angle}
                    opacity={0.7}
                />
            </>
        );
    }
}

export default connect(mapStateToProps)(OverlayImage);
