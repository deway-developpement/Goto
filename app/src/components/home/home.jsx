import React, { useContext, useEffect, useState, useRef } from 'react';
import stylesheet from './style';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    ActivityIndicator,
    Image,
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
import TabBarButton from '../TabBarButton/TabBarButton';
import { Camera, CameraType } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
// const Tab = createBottomTabNavigator();


function HikeScreen() {
    return (
        <View>
            <Text>Hike</Text>
        </View>
    );
}

function ProfilScreen() {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const {
        data: profil,
        loading,
        refetch,
    } = useQuery(gql`
        query whoami {
            whoami {
                pseudo
                email
                publicKey
            }
        }
    `);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <KeyboardDismissView>
                <SafeAreaView style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Image
                            source={require('../../../assets/images/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text>This is your profil :</Text>
                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                                style={{ flex: 3, width: '100%' }}
                            />
                        ) : (
                            <>
                                <Text>
                                    {profil.whoami.pseudo}#
                                    {profil.whoami.publicKey}
                                </Text>
                                <Text>{profil.whoami.email}</Text>
                            </>
                        )}
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
                                    style={{ alignSelf: 'center' }}
                                />
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Actualize"
                                    onPress={() => refetch()}
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="refresh"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => refetch()}
                                    style={{ alignSelf: 'center' }}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

function CameraCompComp({setType, type, setIsCamera, styles}) {

    const renderCounter  = useRef(0);
    renderCounter.current = renderCounter.current + 1;

    useFocusEffect(
        () => {
            renderCounter.current = renderCounter.current + 1;
            return () => {
                if (renderCounter.current==4) 
                {
                    setIsCamera(false);
                }
            };
        },
    );

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <Camera style={{width:'100%', height:'100%', flex:1}} type={type} zoom={1}>
            <View style={[styles.btnContainer, {backgroundColor: '', position:'absolute', top:0, right:10}]}>
                <Button
                    buttonStyle={[styles.btn, {width:200}]}
                    titleStyle={styles.btnText}
                    title={'Close your camera'}
                    
                    onPress={() => {
                        setIsCamera(false);
                    }}
                />
                <Button
                    buttonStyle={[styles.btn, {width:200}]}
                    titleStyle={styles.btnText}
                    title={'Toggle'}
                    onPress={() => toggleCameraType()}
                />
            </View>
        </Camera>
    );
}

function CameraComp({setIsCamera}){

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();



    if (!permission) {
        requestPermission();
        return <View/>;
    } 

    if (!permission.granted){
        console.log('Permission not granted');
        setIsCamera(false);
        return <View/>;
    }

    

    
    return (
        <View style={{flex:1, width:'100%', height:'100%'}}>
            <CameraCompComp setType={setType} type={type} setIsCamera={setIsCamera} styles={styles}/>
        </View>
    );
}

function Map({ location, setIsCamera}) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    
    return (
        <View style={{width:'100%', height:'100%'}}>
            <MapView
                initialRegion={{
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
                style={{ flex: 1, width: '100%' }}
                maxZoomLevel={17}
            >
                <UrlTile
                    urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                    maximumZ={19}
                    tileCachePath={
                        Platform.OS === 'android' ? '/assets/maps' : 'assets/maps'
                    }
                    tileMaxCacheSize={100000}
                    shouldReplaceMapContent={true}
                />
                <Marker
                    coordinate={{
                        latitude: parseFloat(location?.coords?.latitude),
                        longitude: parseFloat(location?.coords?.longitude),
                    }}
                />
            </MapView>
            <View style={[styles.btnContainer, {position:'absolute', top:0, right:10}]}>
                <Button
                    buttonStyle={[styles.btn, {width:200}]}
                    titleStyle={styles.btnText}
                    title={'Open your camera'}
                    onPress={() => {
                        setIsCamera(true);
                    }}
                />
            </View>
        </View>
    );
}

function MapScreen() {
    const [permission, request] = Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isCamera, setIsCamera] = useState(false);

    useEffect(() => {
        if (permission === null) {
            request();
        } else if (
            permission.granted === false &&
            permission.canAskAgain === false
        ) {
            setErrorMsg('Permission to access location was denied');
        } else if (
            permission.granted === false &&
            permission.canAskAgain === true
        ) {
            request();
        } else if (permission.granted === true) {
            Location.getLastKnownPositionAsync({}).then((response) => {
                setLocation(response);
            });
            Location.watchPositionAsync({}, (response) => {
                setLocation(response);
            });
        }
    }, [permission]);

    useEffect(() => {
        console.log(location?.coords?.latitude);
    }, [location]);
    return (
        <View style={{width:'100%', height:'100%', flex:1}}>
            
            <SafeAreaView />
            { isCamera == false && (() => {
                if (location == null) {
                    if (errorMsg != null) {
                        return (
                            <Text style={{ alignSelf: 'center' }}>
                                {errorMsg}
                            </Text>
                        );
                    } else {
                        return (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                style={{ flex: 3, width: '100%' }}
                            />
                        );
                    }
                } else {
                    return <Map location={location} setIsCamera={setIsCamera}/>;
                }
            })()}

            { isCamera == true && <CameraComp setIsCamera={setIsCamera}/>}
            
            
        </View>
    );
}

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
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
            style={styles.container}
        >
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <SafeAreaView />
                    <Tab.Navigator
                        initialRouteName={'Map'}
                        screenOptions={{
                            tabBarStyle: styles.tabBar,
                            headerShown: false,
                        }}
                    >
                        <Tab.Screen
                            name="Hikes"
                            component={HikeScreen}
                            options={{
                                tabBarButton: (props) => (
                                    <TabBarButton icon="list" {...props} />
                                ),
                                tabBarShowLabel: false,
                            }}
                        />
                        <Tab.Screen
                            name="Map"
                            component={MapScreen}
                            options={{
                                tabBarButton: (props) => (
                                    <TabBarButton icon="position" {...props} />
                                ),
                                tabBarShowLabel: false,
                            }}
                        />
                        <Tab.Screen
                            name="Profil"
                            component={ProfilScreen}
                            options={{
                                tabBarButton: (props) => {
                                    return (
                                        <TabBarButton icon="user" {...props} />
                                    );
                                },
                                tabBarShowLabel: false,
                            }}
                        />
                    </Tab.Navigator>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
