import React, { useContext, useEffect } from 'react';
import { Overlay } from 'react-native-maps';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';

function OverlayImage({ image, overlay, cameraRef }) {
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
        );
    }
}

const mapStateToProps = (state) => {
    return { overlay: state };
};

export default connect(mapStateToProps)(OverlayImage);
