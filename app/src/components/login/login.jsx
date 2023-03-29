import React, { 
    useState, 
    useRef, 
    useEffect, 
    useContext } from 'react';
import stylesheet from './style';
import {
    KeyboardAvoidingView,
    Text,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Platform,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../providers/AuthContext';
import { AxiosContext } from '../../providers/AxiosContext';
import { gql, useApolloClient } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { refreshAuth } from '../../services/auth.service';
import SplashScreen from '../SplashScreen/SplashScreen';
import { BlurView } from 'expo-blur';

function LoginComponent({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [appState, setAppState] = useState({
        email_valid: null,
        password_valid: null,
    });

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
                    query: gql`
                        query exists($email: String!) {
                            exist(email: $email)
                        }
                    `,
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
            setAppState({ ...appState, email_valid: true });
            passwordRef.current.focus();
        } else {
            setAppState({ ...appState, email_valid: false });
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
            setAppState({ ...appState, password_valid: false });
        }
    }

    return (
        <View style={{flex:1}}>
            <Image source={require('../../../assets/images/Dalle_background.png')} style={[StyleSheet.absoluteFill, {width:'100%', height:'100%'}]}/>
            <ScrollView style={{flex:1}}>
                <BlurView style={styles.containerLogin} intensity={100} tint='light'>
                    <View style={styles.header}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                        { appState.email_valid ?
                            <Text style={styles.textHeader}> Login</Text> :
                            <Text style={styles.textHeader}> Enter your email</Text>
                        }
                    </View>
                    <View style={styles.loginMiddle}>
                        <Text style={styles.textLoginMiddle}>Adress email</Text>
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
                        {
                            appState.email_valid && <Text style={styles.textLoginMiddle}>Password</Text>
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
                                    paddingLeft:12
                                },
                            ]}
                            secureTextEntry={true}
                            autoFocus={true}
                            onSubmitEditing={() => login()}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                        />
                        {
                            appState.email_valid && appState.password_valid === false ? <TouchableWithoutFeedback
                                onPress={() =>
                                    console.log('forgot password')
                                }
                                style={styles.textBtn}
                            >
                                <Text style={styles.textBtn_text}>
                                    Forgot password ?
                                </Text>
                            </TouchableWithoutFeedback>: null
                        }
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            buttonStyle={[styles.btn, {width: appState.email_valid ? 200 : 100}]}
                            titleStyle={styles.btnText}
                            disabled={appState.email_valid ? password == '' : email == ''}
                            title={appState.email_valid ? 'Sign in' : 'Next'}
                            onPress={() => (appState.email_valid ? login() : isRegister())}
                        />
                        <TouchableWithoutFeedback onPress={() => (navigation.navigate('Register', { email: email }))} style={{flex:1}}>
                            <Text style={{fontSize:16, fontWeight:'600', paddingVertical:'3%'}}>
                                Register
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                
                </BlurView>
            </ScrollView>
        </View>
    );
}

export default function LoginScreen({ navigation }) {
    const [loadingState, setLoadingState] = useState(true);

    const authContext = useContext(AuthContext);

    const isFocused = useIsFocused();

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
            style={{flex: 1}}
        >
            <KeyboardDismissView>
                <View style={{flex:1}}>
                    {
                        loadingState ? <SplashScreen /> : <LoginComponent navigation={navigation}/>
                    }
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}