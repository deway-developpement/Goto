import React, { useEffect, useState } from 'react';
import stylesheet from './style';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen({ setIsCamera }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    // safe area insets
    const insets = useSafeAreaInsets();

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
                style={{flex: 1 }}
                type={type}
                ratio={'16:9'}
            >
                <View
                    style={[
                        styles.btnContainer,
                        {
                            backgroundColor: '',
                            position: 'absolute',
                            top: 0 + insets.top,
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
