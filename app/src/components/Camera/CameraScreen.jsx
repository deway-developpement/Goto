import React, { useEffect, useRef } from 'react';
import stylesheet from './style';
import { View } from 'react-native';
import { useIsFocused, useTheme, useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { changeMapState, mapStateToProps } from '../../reducer/map.reducer';
import { MapState } from '../Map/enum';
import { connect } from 'react-redux';
import { Icon } from '../Icon/Icon';
import { Pressable } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function CameraScreen({ dispatch }) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    // safe area insets
    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabBarHeight();

    const [permission, requestPermission] = Camera.useCameraPermissions();

    const cameraRef = useRef();

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            // close camera when we leave the screen
            dispatch(changeMapState(MapState.NONE));
        }
    }, [isFocused]);

    if (!permission) {
        requestPermission();
        return <View />;
    }

    if (!permission.granted) {
        dispatch(changeMapState(MapState.NONE));
        return <View />;
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            //const options = { quality: 0.5, base64: true, skipProcessing: true };
            const data = await cameraRef.current.takePictureAsync({
                base64: true,
            });
            const source = data;
            if (source) {
                dispatch(changeMapState(MapState.IMAGE_EDIT));
                navigation.navigate('Directions', { dataImg: data });
            }
        }
    };

    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Camera
                ref={cameraRef}
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    alignSelf: 'center',
                }}
                aspectRatio={3 / 4}
            ></Camera>
            <View
                style={[
                    styles.btnContainer,
                    {
                        backgroundColor: '',
                        position: 'absolute',
                        top: 10 + insets.top,
                        right: 15,
                    },
                ]}
            >
                <Pressable
                    onPress={() => {
                        dispatch(changeMapState(MapState.NONE));
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
                    <Icon name="map_back" size={35} color={colors.background} />
                </Pressable>
            </View>
            <View
                style={[
                    styles.btnContainer,
                    {
                        backgroundColor: '',
                        position: 'absolute',
                        bottom: 30 + tabBarHeight,
                        alignSelf: 'center',
                    },
                ]}
            >
                <Pressable
                    onPress={() => takePicture()}
                    style={[
                        styles.btnContainer,
                        {
                            backgroundColor: colors.primary,
                            borderRadius: 10,
                            padding: 13,
                            zIndex: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    <Icon name="photo" size={40} color={colors.background} />
                </Pressable>
            </View>
        </View>
    );
}

export default connect(mapStateToProps)(CameraScreen);
