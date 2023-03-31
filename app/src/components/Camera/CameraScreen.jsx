import React, { useEffect, useState } from 'react';
import stylesheet from './style';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';

export default function CameraScreen({ setIsCamera }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    //TODO: make the same as for map permission

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            // close camera when we leave the screen
            setIsCamera(false);
        }
    }, [isFocused]);

    function toggleCameraType() {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    }

    if (!permission) {
        requestPermission();
        return <View />;
    }

    if (!permission.granted) {
        console.log('Permission not granted');
        setIsCamera(false);
        return <View />;
    }

    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Camera
                style={{ width: '100%', height: '100%', flex: 1 }}
                type={type}
            >
                <View
                    style={[
                        styles.btnContainer,
                        {
                            backgroundColor: '',
                            position: 'absolute',
                            top: 0,
                            right: 10,
                        },
                    ]}
                >
                    <Button
                        buttonStyle={[styles.btn, { width: 200 }]}
                        titleStyle={styles.btnText}
                        title={'Close your camera'}
                        onPress={() => {
                            setIsCamera(false);
                        }}
                    />
                    <Button
                        buttonStyle={[styles.btn, { width: 200 }]}
                        titleStyle={styles.btnText}
                        title={'Toggle'}
                        onPress={() => toggleCameraType()}
                    />
                </View>
            </Camera>
        </View>
    );
}
