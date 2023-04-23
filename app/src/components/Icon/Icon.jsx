import { createIconSetFromFontello } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React from 'react';
import {View} from 'react-native';


export const Icon = createIconSetFromFontello(
    require('../../../assets/font/config.json'),
    'goto',
    'goto.ttf'
);

export function IconComp(props) {
    const [fontsLoaded] = useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });
    if (!fontsLoaded) {
        return <View />;
    }
    return (
        <Icon
            name={props.name}
            size={props.size || 30}
            color={props.color}
        />
    );
}
