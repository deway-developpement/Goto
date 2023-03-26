import HomeScreen from './src/components/home/home';
import LoginScreen from './src/components/login/login';
import RegisterScreen from './src/components/register/register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/providers/AuthContext';
import { AxiosProvider } from './src/providers/AxiosContext';
import React from 'react';
// @ts-ignore
import { useColorScheme } from 'react-native';
import { Classic, Dark } from './src/theme/theme';
import AuthApolloProvider from './src/providers/ApolloProvider';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {

    const theme = useColorScheme();

    // pass status bar color to black
    (() => {
        StatusBar.setBarStyle('dark-content');
    })();

    return (
        <AuthProvider>
            <AxiosProvider>
                <AuthApolloProvider>
                    <NavigationContainer theme={theme !== 'dark' ? Classic : Dark}>
                        <Stack.Navigator initialRouteName="Login">
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{ headerShown: false, gestureEnabled: false }}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                                options={{ headerShown: false, gestureEnabled: false }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </AuthApolloProvider>
            </AxiosProvider>
        </AuthProvider>
    );
}
