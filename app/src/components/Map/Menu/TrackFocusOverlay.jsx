import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native-elements';
import { MapState } from '../enum';
import { connect } from 'react-redux';
import {
    changeIsRecording,
    changeMapState,
    init,
    mapStateToProps,
} from '../../../reducer/map.reducer';

function TrackFocusOverlay({ styles, dispatch, isRecording }) {
    const navigation = useNavigation();

    return (
        <>
            <Button
                buttonStyle={[styles.btn, { width: 200 }]}
                titleStyle={styles.btnText}
                title={'Close'}
                onPress={() => {
                    dispatch(changeMapState(MapState.NONE));
                    navigation.navigate('Directions', { fileData: null });
                }}
            />
            <Button
                buttonStyle={[styles.btn, { width: 200 }]}
                titleStyle={styles.btnText}
                title={isRecording ? 'Stop recording' : 'Start recording'}
                onPress={() => {
                    if (isRecording) {
                        dispatch(changeIsRecording(false));
                    } else {
                        dispatch(init());
                    }
                }}
            />
        </>
    );
}

export default connect(mapStateToProps)(TrackFocusOverlay);
