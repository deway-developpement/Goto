import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native-elements';
import { MapState } from '../enum';

export default function TrackFocusOverlay({ styles, setMapState }) {
    const navigation = useNavigation();

    return (
        <Button
            buttonStyle={[styles.btn, { width: 200 }]}
            titleStyle={styles.btnText}
            title={'Close'}
            onPress={() => {
                setMapState(MapState.FOLLOW_POSITION);
                navigation.navigate('Directions', { fileData: null });
            }}
        />
    );
}
