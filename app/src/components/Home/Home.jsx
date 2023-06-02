import React, { useContext, useEffect } from 'react';
import stylesheet from './style';
import { SafeAreaView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoverScreen from '../DiscoverScreen/DiscoverScreen';
import { useFonts } from 'expo-font';
import { Icon } from '../Icon/Icon';
import ProfileScreen from '../Profile/Profile';
import SearchScreen from '../SearchScreen/SearchScreen';
import FocusHikeScreen from '../Hike/FocusHikeScreen';
import MapWrapper from '../Map/MapScreen';
import FavoritesScreen from '../FavoriteScreen/FavoriteScreen';


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
                            component={MapWrapper}
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
