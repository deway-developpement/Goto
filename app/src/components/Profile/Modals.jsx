import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Icon } from '../Icon/Icon';
import stylesheet from './style';
import { AuthContext } from '../../providers/AuthContext';
import { useApolloClient, gql } from '@apollo/client';
import ReactNativeFile from 'apollo-upload-client';
import * as ImagePicker from 'expo-image-picker';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';

function ProfileModal({ setModalVisible, profil, reload }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const client = useApolloClient();
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
        ModifyPseudo: 3,
    });
    const pickImage = async (update) => {
        if (status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const file = new ReactNativeFile({
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
            console.log('photo upload', file);

            console.log('update', update);

            const MUTATION = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    createPhoto(input: { objId: $objId, objType: $objType, file: $file }) {
                        id
                    }
                }
            `;

            const MUTATION_UPDATE = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    changeAvatar(input: { objId: $objId, objType: $objType, file: $file }) {
                        id
                    }
                }
            `;
            await client.mutate({
                mutation: update ? MUTATION_UPDATE : MUTATION,
                variables: {
                    file,
                    objId: profil.whoami.id,
                    objType: 'USER',
                },
                errorPolicy: 'all',
            });
            setModalVisible(modalActive.None);
            reload();
        }
    };

    return (
        <View style={styles.modalView}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text style={styles.modalText}>Modify Profile</Text>
                <Icon
                    name="cross"
                    size={17}
                    style={styles.closeIcon}
                    onPress={() => setModalVisible(modalActive.None)}
                />
            </View>
            <View>
                <Pressable
                    onPress={() => pickImage(profil.whoami.avatar !== null)}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                    }}
                >
                    <Icon name="avatar" size={16} style={{ marginTop: 2 }} color={colors.primary} />
                    <Text style={styles.smallModalText}>
                        {profil.whoami.avatar ? 'Change avatar' : 'Add avatar'}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setModalVisible(modalActive.ModifyPseudo);
                    }}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}
                >
                    <Icon name="pseudo" size={16} style={{ marginTop: 2 }} color={colors.primary} />
                    <Text style={styles.smallModalText}>Change pseudo</Text>
                </Pressable>
            </View>
        </View>
    );
}

function PseudoModal({ setModalVisible, profil, reload }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const [pseudo, setPseudo] = useState(profil.whoami.pseudo);
    const client = useApolloClient();
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
        ModifyPseudo: 3,
    });
    const UPDATE_USER = gql`
        mutation updateUser($id: String!, $pseudo: String!) {
            updateUser(id: $id, input: { pseudo: $pseudo }) {
                pseudo
            }
        }
    `;

    async function changePseudo(pseudo) {
        if (pseudo == '') {
            Alert.alert('Error', 'Please enter a pseudo');
            return;
        }
        await client.mutate({
            mutation: UPDATE_USER,
            variables: {
                id: profil.whoami.id,
                pseudo: pseudo,
            },
            errorPolicy: 'all',
        });
        setModalVisible(modalActive.None);
        reload();
    }

    return (
        <KeyboardDismissView>
            <ScrollView style={styles.modalView} keyboardShouldPersistTaps={'handled'}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={styles.modalText}>Change pseudo</Text>
                    <Icon
                        name="cross"
                        size={17}
                        style={styles.closeIcon}
                        onPress={() => {
                            setModalVisible(modalActive.ModifyProfile);
                        }}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your new pseudo"
                        onChangeText={(text) => setPseudo(text)}
                        onSubmitEditing={() => changePseudo(pseudo)}
                        autoFocus={true}
                        value={pseudo}
                    />
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingTop: 10,
                        }}
                    >
                        <Pressable
                            // title={'Cancel'}
                            style={{
                                marginBottom: 10,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                setModalVisible(modalActive.ModifyProfile);
                            }}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={{
                                marginBottom: 10,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => changePseudo(pseudo)}
                        >
                            <Text style={styles.buttonText}>Change</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardDismissView>
    );
}

function SettingsModal({ setModalVisible, reload }) {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const client = useApolloClient();
    const styles = stylesheet(colors);
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
        ModifyPseudo: 3,
    });

    function actualize() {
        reload();
        setModalVisible(modalActive.None);
    }

    function deleteAccount() {
        Alert.alert(
            'Are you sure ?',
            'This action is irreversible !',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        const MUTATION = gql`
                            mutation {
                                deleteAccount {
                                    id
                                }
                            }
                        `;
                        client
                            .mutate({
                                mutation: MUTATION,
                                errorPolicy: 'all',
                            })
                            .then(() => {
                                authContext.logout();
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return (
        <View style={styles.modalView}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text style={styles.modalText}>Settings</Text>
                <Icon
                    name="cross"
                    size={17}
                    style={styles.closeIcon}
                    onPress={() => setModalVisible(modalActive.None)}
                />
            </View>
            <View>
                <Pressable
                    onPress={() => actualize()}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Icon name="reload" size={14} style={{ marginTop: 2 }} color={colors.primary} />
                    <Text style={styles.smallModalText}>Actualize</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        deleteAccount();
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Icon name="delete" size={14} style={{ marginTop: 2 }} color={colors.primary} />
                    <Text style={styles.smallModalText}>Delete account</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        authContext.logout();
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}
                >
                    <Icon name="exit" size={14} style={{ marginTop: 2 }} color={colors.primary} />
                    <Text style={styles.smallModalText}>Log out</Text>
                </Pressable>
            </View>
        </View>
    );
}

export { ProfileModal, PseudoModal, SettingsModal };
