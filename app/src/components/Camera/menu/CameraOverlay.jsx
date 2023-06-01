import React from 'react';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { changeMapState, mapStateToPropsMapState } from '../../../reducer/map.reducer';
import { MapState } from '../../Map/enum';

function CameraOverlay({ styles, dispatch }) {
    return (
        <Button
            buttonStyle={[styles.btn, { width: 200 }]}
            titleStyle={styles.btnText}
            title={'Open your camera'}
            onPress={() => {
                dispatch(changeMapState(MapState.CAMERA));
            }}
        />
    );
}

export default connect(mapStateToPropsMapState)(CameraOverlay);
