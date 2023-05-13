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
    Dimensions,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from '../Map/Map';
import { Icon } from '../Icon/Icon';
import { useFonts } from 'expo-font';
import ProfileScreen from '../Profile/Profile';

function HikeScreen({ route }) {
    const [image, setImage] = useState(null);

    const windowWidth = Dimensions.get('window').width;

    if (
        route.params?.dataImg &&
        (image == null || image.paraUri != route.params.dataImg.uri)
    ) {
        setImage({
            paraUri: route.params?.dataImg.uri,
            uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
        });
    }
    return (
        <View style={{ flex: 1, backgroundColor: '' }}>
            <SafeAreaView />
            <Text>
                {route.params?.dataImg
                    ? 'This should display a photo '
                    : 'Hikes'}
            </Text>
            {image != null && (
                <Image
                    style={{
                        transform: [{ rotate: '45deg' }],
                        width: windowWidth,
                        height:
                            (windowWidth * route.params.dataImg.height) /
                            route.params.dataImg.width,
                        backgroundColor: '',
                    }}
                    source={{ uri: image.uri }}
                />
            )}
        </View>
    );
}

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

const Tab = createBottomTabNavigator();

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
                        initialRouteName={'Profile'}
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
                            component={HikeScreen}
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
                            component={ProfileScreen}
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
