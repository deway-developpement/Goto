import React, { useContext } from 'react';
import { Overlay } from 'react-native-maps';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';

function OverlayImage({ image, overlay }) {
    const { location } = useContext(LocationContext);

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
                opacity={0.8}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return { overlay: state };
};

export default connect(mapStateToProps)(OverlayImage);
