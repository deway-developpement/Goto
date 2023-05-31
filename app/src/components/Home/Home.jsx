import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import { SafeAreaView, KeyboardAvoidingView, Text, View, Platform } from 'react-native';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from '../Map/Map';
import DiscoverScreen from '../DiscoverScreen/DiscoverScreen';
import { useFonts } from 'expo-font';
import { Icon } from '../Icon/Icon';
import ProfileScreen from '../Profile/Profile';
import SearchScreen from '../SearchScreen/SearchScreen';
import FocusHikeScreen from '../Hike/FocusHikeScreen';
import { Provider } from 'react-redux';
import store from '../../store/overlay.store.js';
import OverlayImage from '../Map/OverlayImage';
import OverlayModification from '../Map/Menu/OverlayModification';
import GpxPathLine from '../Map/GpxPathLine';
import CameraOverlay from '../Camera/menu/CameraOverlay';
import TrackFocusOverlay from '../Map/Menu/TrackFocusOverlay';
import { MapState } from '../Map/enum';

function MapScreen({ route }) {
    const [isCamera, setIsCamera] = useState(false);

    const [mapState, setMapState] = useState(MapState.NONE);

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    if (route.params?.dataImg && (image == null || image.paraUri != route.params.dataImg.uri)) {
        setImage({
            paraUri: route.params?.dataImg.uri,
            uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
            heigth: route.params.dataImg.height,
            width: route.params.dataImg.width,
        });
        route.params.fileData = null;
        setMapState(MapState.NONE);
    } else if (image !== null && route.params?.dataImg === null) {
        setImage(null);
    }

    if (route.params?.fileData && (file == null || file.paraUri != route.params.fileData.uri)) {
        setFile(route.params.fileData);
        route.params.dataImg = null;
        setMapState(MapState.FOCUS_HIKE);
    } else if (file !== null && route.params?.fileData === null) {
        setFile(null);
    }

    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            {(() => {
                if (isCamera) {
                    return <CameraScreen setIsCamera={setIsCamera} />;
                } else {
                    return (
                        <Provider store={store}>
                            <View style={{ flex: 1 }}>
                                <Map mapState={mapState}>
                                    <OverlayImage image={image} />
                                    {file && <GpxPathLine fileData={file} mapState={mapState} />}
                                </Map>
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
                                    {file === null && (
                                        <CameraOverlay setIsCamera={setIsCamera} styles={styles} />
                                    )}
                                    {image !== null && <OverlayModification />}
                                    {file !== null && (
                                        <TrackFocusOverlay
                                            styles={styles}
                                            setMapState={setMapState}
                                        />
                                    )}
                                </View>
                                <SafeAreaView />
                            </View>
                        </Provider>
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
                        initialRouteName={'Discover'}
                        backBehavior="history"
                        screenOptions={{
                            tabBarStyle: styles.tabBar,
                            headerShown: false,
                            tabBarIconStyle: styles.tabBarIcon,
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarActiveTintColor: colors.active,
                            tabBarInactiveTintColor: colors.backgroundSecondary,
                            tabBarHideOnKeyboard: true,
                        }}
                    >
                        <Tab.Screen
                            name="Discover"
                            component={DiscoverScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="list" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="search" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Directions"
                            component={MapScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="position" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Favorites"
                            component={FavoritesScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="hiker" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="user" size={props.size} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="FocusHike"
                            component={FocusHikeScreen}
                            options={{
                                headerShown: false,
                                tabBarButton: () => null,
                            }}
                        />
                    </Tab.Navigator>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
