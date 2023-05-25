import React from 'react';
import { Button } from 'react-native-elements';

export default function CameraOverlay({ setIsCamera, styles }) {
    return (
        <Button
            buttonStyle={[styles.btn, { width: 200 }]}
            titleStyle={styles.btnText}
            title={'Open your camera'}
            onPress={() => {
                setIsCamera(true);
            }}
        />
    );
}
