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
import { AuthContext } from '../../providers/AuthContext';
import { AxiosContext } from '../../providers/AxiosContext';
import { useTheme } from '@react-navigation/native';
import { useApolloClient, gql } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';


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

    let emailInput = useRef(null);
    let pseudoInput = useRef(null);
    let passwordInput = useRef(null);
    let vPasswordInput = useRef(null);

    useEffect(() => {
        if (vPassword == password) {
            vPasswordInput.current.style = styles.textInput;
        } else {
            vPasswordInput.current.style.borderColor = 'red';
        }
    }, [password, vPassword]);

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
            emailInput.current.style.borderColor = 'red';
            return true;
        } else {
            emailInput.current.style = styles.textInput;
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
            style={styles.container}
        >
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <View>
                        <TextInput
                            placeholder="email"
                            style={styles.textInput}
                            onSubmitEditing={() => {
                                isRegister();
                                pseudoInput.current.focus();
                            }}
                            onChangeText={(text) => setEmail(text)}
                            ref={emailInput}
                            value={email}
                        />
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
                        <TextInput
                            ref={vPasswordInput}
                            placeholder="Confirm Password"
                            placeholderColor="#c4c3cb"
                            style={[styles.textInput]}
                            secureTextEntry={true}
                            onChangeText={(text) => setVPassword(text)}
                            onSubmitEditing={() => {
                                register();
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
                            <Text style={styles.textBtn_text}>Cancel</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
