import React, { useEffect, useState, useRef } from 'react';
import stylesheet from './style';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useIsFocused, useTheme, useNavigation  } from '@react-navigation/native';
import { Camera, CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen({ setIsCamera }) {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    // safe area insets
    const insets = useSafeAreaInsets();

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const cameraRef = useRef();

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

    const takePicture = async () => {
        if (cameraRef.current) {
            //const options = { quality: 0.5, base64: true, skipProcessing: true };
            const data = await cameraRef.current.takePictureAsync({base64:true});
            const source = data;
            if (source) {
                navigation.navigate('Hikes', {dataImg:data});
                
            }
        }
    };

    return (
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
            <Camera
                ref={cameraRef}
                style={{
                    flex:1,
                    overflow: 'hidden',
                    alignSelf:'center'
                }}
                type={type}
                aspectRatio={3/4}
            ></Camera>
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
                <Button
                    buttonStyle={[styles.btn, { width: 200 }]}
                    titleStyle={styles.btnText}
                    title={'Take a photo'}
                    onPress={() => takePicture()}
                />
            </View>
        </View>
    );
}
