import { useNavigation, useTheme } from '@react-navigation/native';
import React from 'react';
import { MapState } from '../enum';
import { connect } from 'react-redux';
import { changeMapState, init, mapStateToProps } from '../../../reducer/map.reducer';
import { Pressable } from 'react-native';
import { Icon } from '../../Icon/Icon';

function TrackFocusOverlay({ styles, dispatch, isRecording, mapState }) {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <>
            {!isRecording && mapState !== MapState.MODAL_PERFORMANCE && (
                <Pressable
                    onPress={() => {
                        dispatch(changeMapState(MapState.NONE));
                        navigation.navigate('Directions', { fileData: null });
                    }}
                    style={[
                        styles.btnContainer,
                        {
                            backgroundColor: colors.primary,
                            borderRadius: 10,
                            padding: 10,
                            zIndex: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 10,
                        },
                    ]}
                >
                    <Icon name="cross" size={35} color={colors.background} />
                </Pressable>
            )}
            <Pressable
                onPress={() => {
                    if (isRecording) {
                        dispatch(changeMapState(MapState.MODAL_PERFORMANCE));
                    } else {
                        dispatch(init());
                    }
                }}
                style={[
                    styles.btnContainer,
                    {
                        backgroundColor: colors.primary,
                        borderRadius: 10,
                        padding: 10,
                        zIndex: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                <Icon
                    name={isRecording || mapState === MapState.MODAL_PERFORMANCE ? 'stop' : 'start'}
                    size={35}
                    color={colors.background}
                />
            </Pressable>
        </>
    );
}

export default connect(mapStateToProps)(TrackFocusOverlay);
