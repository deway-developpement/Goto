import HomeScreen from './src/home/home';
import LoginScreen from './src/login/login';
import RegisterScreen from './src/register/register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { AxiosProvider } from './src/context/AxiosContext';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Classic, Dark } from './src/theme/theme';
import AuthApolloProvider from './src/context/ApolloProvider';


const Stack = createNativeStackNavigator();

export default function App() {

    const theme = useColorScheme();

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
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Register"
                                component={RegisterScreen}
                                options={{ headerShown: false }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </AuthApolloProvider>
            </AxiosProvider>
        </AuthProvider>
    );
}
