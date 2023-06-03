import React from 'react';
import { connect } from 'react-redux';
import {
    changeAngle,
    changeHeight,
    changeMapState,
    changePosition,
    changeWidth,
    mapStateToProps,
} from '../../../reducer/map.reducer';
import { MapState } from '../../Map/enum';
import { Pressable } from 'react-native';
import { Icon } from '../../Icon/Icon';
import { useTheme } from '@react-navigation/native';

function CameraOverlay({ dispatch, styles }) {
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={() => {
                dispatch(changeMapState(MapState.CAMERA));
                dispatch(changeAngle(0));
                dispatch(changeHeight(0.01));
                dispatch(changeWidth(0.01));
                dispatch(changePosition({ x: 0, y: 0 }));
            }}
            style={[
                styles.btnContainer,
                {
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    padding: 10,
                    zIndex: 100,
                },
            ]}
        >
            <Icon name="turn_camera" size={35} color={colors.darkIcon} />
        </Pressable>
    );
}

export default connect(mapStateToProps)(CameraOverlay);
