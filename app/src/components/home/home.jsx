import React, { useContext, useEffect } from 'react';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarButton from '../TabBarButton/TabBarButton';
import MapScreen from '../map/map';

// const Tab = createBottomTabNavigator();

function HikeScreen() {
    return (
        <View>
            <SafeAreaView />
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
