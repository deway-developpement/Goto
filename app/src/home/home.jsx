import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import {
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Image,
    StatusBar,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/auth.service';
import { useTheme } from '@react-navigation/native';
import { useApolloClient, gql } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function ProfilScreen({navigation}) {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const [profil, setProfil] = useState({
        pseudo: '',
        email: '',
        publicKey: '',
    });

    async function getUser() {
        const response = await client.query({
            query: gql`query whoami {
                whoami {
                    _id,
                    pseudo,
                    email,
                    publicKey
                }
            }`,
            options: {
                context: {
                    headers: {
                        'Authorization': `Bearer ${authContext.getAccessToken()}`,
                    },
                },
            },
        });
        if (response) {
            setProfil(response.data.whoami);
        }
    }
    useEffect(() => {
        getUser();
    } , [authContext.authState]);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <KeyboardDismissView >
                <SafeAreaView style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
                        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>This is your profil :</Text>
                        <Text>{profil.pseudo}#{profil.publicKey}</Text>
                        <Text>{profil.email}</Text>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Logout"
                                    onPress={() => {
                                        logout(authContext);
                                        navigation.navigate('Login');
                                    }}
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="logout"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => {
                                        logout(authContext);
                                        navigation.navigate('Login');
                                    }}
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
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let templocation = await (await Location.getCurrentPositionAsync({}));
            console.log(templocation);
            setLocation(templocation);
        })();
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
                    latitude: location?.coords?.latitude || 48.99007834363359,
                    longitude: location?.coords?.longitude || 2.76576986365421,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }} 
                region={{
                    latitude: location?.coords?.latitude,
                    longitude: location?.coords?.longitude,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }}
                style={{flex: 1, width: '100%'}} >
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
                                    initialParams={{ navigation }}
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
