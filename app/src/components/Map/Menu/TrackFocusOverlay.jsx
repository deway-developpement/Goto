import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native-elements';

export default function TrackFocusOverlay({ styles }) {
    const navigation = useNavigation();

    return (
        <Button
            buttonStyle={[styles.btn, { width: 200 }]}
            titleStyle={styles.btnText}
            title={'Close'}
            onPress={() => {
                console.log('TrackFocusOverlay');
                navigation.navigate('Directions', { fileData: null });
            }}
        />
    );
}
