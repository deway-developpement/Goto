import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native-elements';
import { MapState } from '../enum';
import { connect } from 'react-redux';
import { changeMapState, mapStateToPropsMapState } from '../../../reducer/map.reducer';

function ImageFocusOverlay({ styles, dispatch }) {
    const navigation = useNavigation();

    return (
        <Button
            buttonStyle={[styles.btn, { width: 200 }]}
            titleStyle={styles.btnText}
            title={'Close'}
            onPress={() => {
                dispatch(changeMapState(MapState.FOLLOW_POSITION));
                navigation.navigate('Directions', { ImageData: null });
            }}
        />
    );
}

export default connect(mapStateToPropsMapState)(ImageFocusOverlay);
