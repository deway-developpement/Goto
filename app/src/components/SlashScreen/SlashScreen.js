import React from 'react';
import stylesheet from './style';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    return (
        <SafeAreaView
            style={[
                styles.container,
                { alignItems: 'center', justifyContent: 'center' },
            ]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Image
                    source={require('../../../assets/images/logo.png')}
                    style={styles.logo}
                />
                <Text style={[styles.header, { marginBottom: 10 }]}>Gotò</Text>
            </View>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Loading...</Text>
            <ActivityIndicator size={'large'} />
        </SafeAreaView>
    );
}
