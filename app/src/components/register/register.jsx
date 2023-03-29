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
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { AxiosContext } from '../../providers/AxiosContext';
import { useTheme } from '@react-navigation/native';
import { useApolloClient, gql } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { BlurView } from 'expo-blur';

export default function RegisterScreen({navigation, route}) {
    const [email, setEmail] = useState(route.params.email);
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [vPassword, setVPassword] = useState('');
    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);
    const client = useApolloClient();

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const [emailInvalid, setEmailInvalid] = useState(false);
    const [passwordsInvalid, setPasswordsInvalid] = useState(false);

    const emailInput = useRef(null);
    const pseudoInput = useRef(null);
    const passwordInput = useRef(null);
    const vPasswordInput = useRef(null);

    useEffect(() => {
        pseudoInput.current.focus();
    }, []);

    useEffect(() => {
        setPasswordsInvalid(vPassword != password && vPassword != '' && !vPasswordInput.current.isFocused());
    }, [vPassword, password]);

    async function isRegister() {
        // check if user exists here
        const checkEmail = async () => {
            try {
                const response = await client.query({
                    query: gql`
                    query exists($email : String!) {
                        exist(email: $email)
                        }`,
                    variables: {
                        email: email,
                    },
                });
                return response.data.exist;
            } catch (error) {
                console.error(error);
            }
        };
        if (!/\S+@\S+\.\S+/.test(email) || (await checkEmail())) {
            setEmailInvalid(true);
            return true;
        } else {
            setEmailInvalid(false);
            return false;
        }
    }

    async function register() {
        if (
            email &&
            password &&
            pseudo &&
            !(await isRegister()) &&
            vPassword == password
        ) {
            try {
                const response = await client.mutate({
                    mutation: gql`
                        mutation newUser($email : String!, $password : String!, $pseudo : String!) {
                            newUser(input: {
                                email: $email,
                                password: $password,
                                pseudo: $pseudo,
                            }) {
                                _id,
                            }
                        } 
                    `,
                    variables: {
                        email: email,
                        password: password,
                        pseudo: pseudo,
                    },
                });
                if (response.data.newUser) {
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
                    
                    navigation.navigate('Home');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex:1}}
        >
            <KeyboardDismissView>
                <View style={{flex:1}}>
                    <Image source={require('../../../assets/images/Dalle_background.png')} style={[StyleSheet.absoluteFill, {width:'100%', height:'100%'}]}/>
                    <ScrollView style={{flex:1}}>
                        <BlurView style={styles.containerLogin} intensity={100} tint='light'>
                            <View style={styles.header}>
                                <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                                <Text style={styles.textHeader}>Register</Text>
                            </View>
                            <View style={styles.loginMiddle}>
                                <Text style={styles.textLoginMiddle}>Adress email</Text>
                                <TextInput
                                    placeholder="email"
                                    style={[styles.textInput, emailInvalid && {borderColor:'red'}]}
                                    onSubmitEditing={() => {
                                        isRegister();
                                        pseudoInput.current.focus();
                                    }}
                                    onChangeText={(text) => setEmail(text)}
                                    ref={emailInput}
                                    value={email}
                                />
                                <Text style={styles.textLoginMiddle}>Pseudo</Text>
                                <TextInput
                                    placeholder="Pseudo"
                                    placeholderColor="#c4c3cb"
                                    style={[styles.textInput]}
                                    onChangeText={(text) => setPseudo(text)}
                                    onSubmitEditing={() => {
                                        passwordInput.current.focus();
                                    }}
                                    ref={pseudoInput}
                                />
                                <Text style={styles.textLoginMiddle}>Password</Text>
                                <TextInput
                                    placeholder="Password"
                                    placeholderColor="#c4c3cb"
                                    style={[styles.textInput]}
                                    secureTextEntry={true}
                                    onChangeText={(text) => setPassword(text)}
                                    onSubmitEditing={() => {
                                        vPasswordInput.current.focus();
                                    }}
                                    ref={passwordInput}
                                />
                                <Text style={styles.textLoginMiddle}>Confirm Password</Text>
                                <TextInput
                                    ref={vPasswordInput}
                                    placeholder="Confirm Password"
                                    placeholderColor="#c4c3cb"
                                    style={[styles.textInput, passwordsInvalid && {borderColor:'red'}]}
                                    secureTextEntry={true}
                                    onChangeText={(text) => setVPassword(text)}
                                    onSubmitEditing={() => {
                                        if (vPassword == password && vPassword != '')
                                            register();
                                        else
                                            setPasswordsInvalid(true);
                                    }}
                                />
                            </View>
                            <View style={styles.btnContainer}>
                                <Button
                                    buttonStyle={styles.btn}
                                    disabled={
                                        email == '' ||
                                        password == '' ||
                                        pseudo == '' ||
                                        vPassword != password
                                    }
                                    title={'Sign up'}
                                    onPress={() => register()}
                                />
                                <TouchableWithoutFeedback
                                    onPress={() => navigation.navigate('Login')}
                                    style={styles.textBtn}
                                >
                                    <Text style={{fontSize:16, fontWeight:'600', paddingVertical:'3%'}}>Cancel</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </BlurView>
                    </ScrollView>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
