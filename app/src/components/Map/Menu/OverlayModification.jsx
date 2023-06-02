import React from 'react';
import { Slider, Icon as IconThemed } from '@rneui/themed';
import { connect } from 'react-redux';
import { View } from 'react-native';
import stylesheet from '../style';
import { Icon } from '../../Icon/Icon';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
    changeAngle,
    changeHeight,
    changeMapState,
    changePosition,
    changeWidth,
    mapStateToProps,
} from '../../../reducer/map.reducer';
import { Pressable } from 'react-native';
import { MapState } from '../enum';

function OverlayModification({ dispatch, mapState }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const isHidden = () => mapState === MapState.IMAGE_EDIT_LOCK;

    return (
        <>
            {!isHidden() && (
                <>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Directions', { dataImg: null });
                        }}
                        style={[
                            styles.btnContainer,
                            {
                                backgroundColor: colors.accent,
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
                    <Pressable
                        onPress={() => {
                            dispatch(changeWidth(0.01));
                            dispatch(changeHeight(0.01));
                            dispatch(changePosition({ x: 0, y: 0 }));
                            dispatch(changeAngle(0));
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
                        <Icon name="reload" size={35} color={colors.background} />
                    </Pressable>
                </>
            )}
            <Pressable
                onPress={() => {
                    dispatch(
                        changeMapState(isHidden() ? MapState.IMAGE_EDIT : MapState.IMAGE_EDIT_LOCK)
                    );
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
                <Icon name={isHidden() ? 'lock' : 'unlock'} size={35} color={colors.background} />
            </Pressable>
        </>
    );
}

export default connect(mapStateToProps)(OverlayModification);

function OverlayModificationSlider({ overlay, dispatch, mapState }) {
    const { colors } = useTheme();

    if (mapState === MapState.IMAGE_EDIT_LOCK) {
        return null;
    }
    return (
        <View
            style={{
                width: '100%',
            }}
        >
            <Slider
                value={overlay.angle}
                onValueChange={(value) => dispatch(changeAngle(value))}
                maximumValue={360}
                minimumValue={0}
                step={360 / 100}
                allowTouchTrack
                trackStyle={{
                    height: 10,
                    backgroundColor: 'transparent',
                }}
                thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: 'transparent',
                }}
                thumbProps={{
                    children: (
                        <IconThemed
                            type="font-awesome"
                            size={10}
                            reverse
                            containerStyle={{
                                bottom: 10,
                                right: 10,
                            }}
                            color={colors.primary}
                        />
                    ),
                }}
                style={{
                    width: '100%',
                }}
            />
        </View>
    );
}

export const SliderAngle = connect(mapStateToProps)(OverlayModificationSlider);
