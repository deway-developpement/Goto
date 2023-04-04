import React from 'react';
import stylesheet from './style';
import { View, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const Icon = createIconSetFromFontello(
    require('../../../assets/font/config.json'),
    'goto',
    'goto.ttf'
);

export default function TabBarButton({ icon, accessibilityState, onPress }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [fontsLoaded] = Font.useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });

    if (!fontsLoaded) {
        return <View />;
    }

    return (
        <View
            style={[
                styles.wrapper,
                accessibilityState.selected && styles.selected,
            ]}
        >
            <SafeAreaProvider>
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
                <SafeAreaView />
            </SafeAreaProvider>
        </View>
    );
}
