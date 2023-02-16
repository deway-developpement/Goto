import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    ActivityIndicator,
    Image,
    StatusBar,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function ProfilScreen() {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const { data:profil, refetch } = useQuery(gql`query whoami {
        whoami {
            pseudo,
            email,
            publicKey,
            }
            }`
    );

    return (
        <KeyboardAvoidingView style={styles.container}>
            <KeyboardDismissView >
                <SafeAreaView style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>This is your profil :</Text>
                        <Text>{profil?.whoami?.pseudo}#{profil?.whoami?.publicKey}</Text>
                        <Text>{profil?.whoami?.email}</Text>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Logout"
                                    onPress={() => {
                                        authContext.logout();
                                    }}
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="logout"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => {
                                        authContext.logout();
                                    }}
                                    style={{alignSelf: 'center'}}
                                />
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Actualize"
                                    onPress={() => 
                                        refetch()
                                    }
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="refresh"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => refetch()}
                                    style={{alignSelf: 'center'}}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

function MapScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        Location.requestForegroundPermissionsAsync().then((response) => {
            if (response.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            } else
                Location.getCurrentPositionAsync({}).then((response) => {
                    setLocation(response);
                });
        });
    }, []);

    useEffect(() => {
        console.log(location?.coords?.latitude);
    }, [location]);

    return (
        <View style={styles.container}>
            <SafeAreaView />
            {location == null ? (errorMsg != null ? 
                <Text>{errorMsg}</Text> :
                <ActivityIndicator size="large" color="#0000ff" style={{flex: 3, width: '100%'}} />) :
                <MapView initialRegion={{
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }} 
                region={{
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }}
                showsPointsOfInterest={false}
                style={{flex: 1, width: '100%'}} >
                    <UrlTile
                        urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        maximumZ={19}
                        tileCachePath={Platform.OS === 'android' ? '/assets/maps' : 'assets/maps'}
                        tileMaxCacheSize={100000}
                        shouldReplaceMapContent={true}
                    />
                    <Marker coordinate={{
                        latitude: location?.coords?.latitude,
                        longitude: location?.coords?.longitude,
                    }}
                    title="Position"
                    description="You are here"
                    pinColor="blue"
                    flat={true}
                    />
                </MapView>
            }
        </View>
    );
}

const Tabs = {
    Map: {
        component: MapScreen,
        label: 'Map',
    },
    Profil: {
        component: ProfilScreen,
        label: 'Profil',
    },
};

function HomeScreen({navigation}) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const authContext = useContext(AuthContext);

    // return to login if not logged in
    useEffect(() => {
        if (!authContext.authState.connected) {
            navigation.navigate('Login');
        }
    }, [authContext.authState.connected]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <SafeAreaView />
                    <StatusBar animated={true} />
                    <Tab.Navigator
                        initialRouteName={Object.entries(Tabs)[0].name}
                        screenOptions={{ headerShown: false }}
                    >
                        {Object.entries(Tabs).map(
                            ([name, { component, label }], key) => (
                                <Tab.Screen
                                    key={key}
                                    name={name}
                                    component={component}
                                    //initialParams={{ navigation }}
                                    options={{
                                        tabBarLabel: label,
                                    }}
                                />
                            )
                        )}
                    </Tab.Navigator>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
