import React, { useContext, useEffect, useRef, useState } from 'react';
import stylesheet from './style';
import {
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/auth.service';
import { useTheme } from '@react-navigation/native';
import { useApolloClient, gql, useQuery } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

function ListConnectedUsers() {
    const authContext = useContext(AuthContext);

    const flatListRef = useRef(null);

    const { data } = useQuery(gql`query {
        Users {
            pseudo
            publicKey
            isConnected
        }
    }`, {
        context: {
            headers: {
                'Authorization': `Bearer ${authContext.getAccessToken()}`,
            },
        },
        pollInterval: 5000,
    });

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={data?.Users || []}
                renderItem={({item}) => (
                    <TouchableOpacity>
                        <View>
                            <Text>{item?.pseudo}</Text>
                            <Text>{item?.isConnected ? 'connected' : 'deconnected'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.pseudo + '#' + item.publicKey}
                ListEmptyComponent={() => (
                    <View>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
                extraData={data}
                style={{flexGrow: 1, flex:1}}
                ref={flatListRef}
                onLayout={() => {
                    if (flatListRef.current && data) {
                        flatListRef.current.scrollToEnd({animated: true});
                    }
                } }
                onContentSizeChange={() => {
                    if (flatListRef.current && data) {
                        flatListRef.current.scrollToEnd({animated: true});
                    }
                } }
            />
        </SafeAreaView>
    );
}

function Profil({navigation}) {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const [profil, setProfil] = useState({
        pseudo: '',
        email: '',
        publicKey: '',
    });

    async function getUser() {
        const response = await client.query({
            query: gql`query whoami {
                whoami {
                    _id,
                    pseudo,
                    email,
                    publicKey
                }
            }`,
            options: {
                context: {
                    headers: {
                        'Authorization': `Bearer ${authContext.getAccessToken()}`,
                    },
                },
            },
        });
        if (response) {
            setProfil(response.data.whoami);
        }
    }
    useEffect(() => {
        getUser();
    } , [authContext.authState]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>This is your profil :</Text>
            <Text>{profil.pseudo}#{profil.publicKey}</Text>
            <Text>{profil.email}</Text>
            <View style={styles.btnContainer}>
                <View style={styles.btn}>
                    <Button
                        title="Logout"
                        onPress={() => {
                            logout(authContext);
                            navigation.navigate('Login');
                        }}
                        buttonStyle={styles.btn}
                    />
                    <MaterialIcon
                        name="logout"
                        size={30}
                        color={colors.link}
                        onPress={() => {
                            logout(authContext);
                            navigation.navigate('Login');
                        }}
                        style={{alignSelf: 'center'}}
                    />
                </View>
            </View>
           
        </View>
    );
}

function HomeScreen({navigation}) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <SafeAreaView />
                    <View style={{flexDirection: 'row', alignItems:'start'}}>
                        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <Profil navigation={navigation}/>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
