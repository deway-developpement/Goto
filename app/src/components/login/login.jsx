import React, { useState, useRef, useEffect, useContext } from 'react';
import stylesheet from './style';
import {
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Platform,
    Image,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../providers/AuthContext';
import { AxiosContext } from '../../providers/AxiosContext';
import { gql, useApolloClient } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { refreshAuth } from '../../services/auth.service';
import SplashScreen from '../SlashScreen/SlashScreen';


function LoginComponent({ navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [appState, setAppState] = useState({ email_valid: null, password_valid: null });

    const isFocused = useIsFocused();

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);

    const passwordRef = useRef(null);

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const client = useApolloClient();
    
    useEffect(() => {
        if (isFocused) {
            setEmail('');
            setPassword('');
            setAppState({ email_valid: null, password_valid: null });
        }
    }, [isFocused]);

    async function isRegister() {
        // check if user exists here
        /**
         * @returns {Promise<boolean>}
         */
        const checkEmail = async () => {
            try {
                const response = await client.query({
                    query: gql`query exists($email : String!) {
                        exist(email: $email)
                    }`,
                    variables: {
                        email,
                    },
                });
                return response.data.exist;
            } catch (error) {
                console.error(error);
            }
        };
        if (/\S+@\S+\.\S+/.test(email) && (await checkEmail())) {
            setAppState({...appState, email_valid: true});
            passwordRef.current.focus();
        } else {
            setAppState({...appState, email_valid: false});
        }
    }

    async function login() {
        try {
            const response = await publicAxios.post('/auth/login', {
                email,
                password,
            });

            const { access_token, refresh_token } = response.data;

            authContext.setAuthState({
                ...authContext.authState,
                accessToken: access_token,
                refreshToken: refresh_token,
                connected: true,
            });
            
            console.log('login success');

            navigation.navigate('Home');
        } catch (error) {
            setAppState({...appState, password_valid: false});
        }
    }

    return (
        <View style={styles.inner}>
            <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
                <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.header}>Gotò</Text>
            </View>
            <View>
                <TextInput
                    textContentType='username'
                    autoCorrect={false}
                    autoCapitalize='none'
                    placeholder="email"
                    placeholderTextColor={colors.border}
                    style={[styles.textInput, {
                        borderColor: appState.email_valid === false ? colors.accent : colors.border,
                    }]}
                    onSubmitEditing={() => isRegister()}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                {
                    appState.email_valid === false && email != '' ? <TouchableWithoutFeedback
                        onPress={() =>
                            navigation.navigate('Register', { email: email })
                        }
                        style={styles.textBtn}
                    >
                        <Text style={styles.textBtn_text}>
                            Create Account ?
                        </Text>
                    </TouchableWithoutFeedback>: null
                }
                <TextInput
                    textContentType='password'
                    ref={passwordRef}
                    placeholder="Password"
                    placeholderTextColor={colors.border}
                    style={[
                        styles.textInput,
                        { 
                            display: appState.email_valid ? 'flex' : 'none',
                            borderColor: appState.password_valid === false ? colors.accent : colors.border, 
                        },
                    ]}
                    secureTextEntry={true}
                    autoFocus={true}
                    onSubmitEditing={() => login()}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
            </View>
            <View style={styles.btnContainer}>
                <Button
                    buttonStyle={styles.btn}
                    disabled={appState.email_valid ? password == '' : email == ''}
                    title={appState.email_valid ? 'Sign in' : 'Next'}
                    onPress={() => (appState.email_valid ? login() : isRegister())}
                />
            </View>
        </View>
    );
}

export default function LoginScreen({navigation}) {
    const [loadingState, setLoadingState] = useState(true);

    const authContext = useContext(AuthContext);
    
    const isFocused = useIsFocused();

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    // force reload on focus of screen
    useEffect(() => {
        if (isFocused) {
            // if authState is still loading, show splash screen
            if (authContext.authState.connected === null) {
                setLoadingState(true);
            }
        }
    }, [isFocused]);

    useEffect(() => {
        if (authContext.authState.connected) {
            navigation.navigate('Home');
        } else if (authContext.authState.refreshToken !== null) {
            // try to refresh token
            refreshAuth(authContext).catch(() => {
                authContext.logout();
                setLoadingState(false);
            });
        } else if (authContext.authState.loading === false) {
            // if authState is not loading and we are not connected, hide splash screen
            setLoadingState(false);
        }
    }, [authContext]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <KeyboardDismissView>
                <View style={styles.inner}>
                    {
                        loadingState ? <SplashScreen /> : <LoginComponent navigation={navigation}/>
                    }
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
