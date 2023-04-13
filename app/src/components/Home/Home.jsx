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
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from '../Map/Map';
import Discover from '../Discover/Discover';
import { createIconSetFromFontello } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

function SearchScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '' }}>
            <SafeAreaView />
            <Text>Search</Text>
        </View>
    );
}

function MapScreen({ route }) {
    const [permission, request] = Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isCamera, setIsCamera] = useState(false);

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);

    if (
        route.params?.dataImg &&
        (image == null || image.paraUri != route.params.dataImg.uri)
    ) {
        setImage({
            paraUri: route.params?.dataImg.uri,
            uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
        });
    }

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

    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            {(() => {
                if (isCamera) {
                    return <CameraScreen setIsCamera={setIsCamera} />;
                } else if (location == null) {
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
                                color={colors.primary}
                                style={{ flex: 3, width: '100%' }}
                            />
                        );
                    }
                } else {
                    return (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Map
                                location={location}
                                setIsCamera={setIsCamera}
                                image={image}
                                styles={styles}
                            />
                            <View
                                style={[
                                    styles.btnContainer,
                                    {
                                        position: 'absolute',
                                        top: 0 + insets.top,
                                        right: 10,
                                        backgroundColor: 'transparent',
                                    },
                                ]}
                            >
                                <Button
                                    buttonStyle={[styles.btn, { width: 200 }]}
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
            })()}
        </View>
    );
}

function FavoritesScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '' }}>
            <SafeAreaView />
            <Text>Favorites</Text>
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

const Tab = createBottomTabNavigator();
const Icon = createIconSetFromFontello(
    require('../../../assets/font/config.json'),
    'goto',
    'goto.ttf'
);

function HomeScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const authContext = useContext(AuthContext);

    // return to login if not logged in
    useEffect(() => {
        if (!authContext.authState.connected) {
            navigation.navigate('Login');
        }
    }, [authContext.authState.connected]);

    if (!fontsLoaded) {
        return <View />;
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <Tab.Navigator
                        initialRouteName={'Directions'}
                        screenOptions={{
                            tabBarStyle: styles.tabBar,
                            headerShown: false,
                            tabBarIconStyle: styles.tabBarIcon,
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarActiveTintColor: colors.iconprimary,
                            tabBarInactiveTintColor: colors.label,
                        }}
                    >
                        <Tab.Screen
                            name="Discover"
                            component={Discover}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="list"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="search"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Directions"
                            component={MapScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="position"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="My Hikes"
                            component={FavoritesScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="hiker"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profile"
                            component={ProfilScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="user"
                                        size={props.size}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
