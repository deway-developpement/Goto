import React from 'react';
import stylesheet from './style';
import { View, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import SplashScreen from '../SplashScreen/SplashScreen';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const Icon = createIconSetFromFontello(
    require('../../../assets/font/config.json'),
    'goto',
    'goto.ttf'
);

export default function TabBarButton({ icon, accessibilityState, onPress }) {
    const styles = stylesheet();

    const [fontsLoaded] = Font.useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });

    if (!fontsLoaded) {
        return <SplashScreen />;
    }

    if (accessibilityState.selected) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onPress}
                        style={styles.tabBarButton}
                    >
                        <Icon
                            name={icon}
                            size={35}
                            color={'#EEEFEF'}
                            style={{
                                alignSelf: 'center',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                style={styles.tabBarButton}
            >
                <Icon
                    name={icon}
                    size={35}
                    color={'#EEEFEF'}
                    style={{
                        alignSelf: 'center',
                    }}
                />
            </TouchableOpacity>
        );
    }
}
