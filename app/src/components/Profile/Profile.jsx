import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Modal,
    Alert,
    Pressable,
} from 'react-native';
import { Button } from 'react-native-elements';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../providers/AuthContext';
import { Icon } from '../Icon/Icon';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';

function ProfileModal({ setModalVisible, profil }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const [status, requestPermission] =
        ImagePicker.useMediaLibraryPermissions();
    const client = useApolloClient();
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
    });

    const pickImage = async () => {
        if (status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert(
                    'Sorry, we need camera roll permissions to make this work!'
                );
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

            const MUTATION = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    createPhoto(
                        input: { objId: $objId, objType: $objType, file: $file }
                    ) {
                        id
                    }
                }
            `;
            await client.mutate({
                mutation: MUTATION,
                variables: {
                    file,
                    objId: profil.whoami.id,
                    objType: 'USER',
                },
                errorPolicy: 'all',
            });
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
                    onPress={() => pickImage()}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                    }}
                >
                    <Icon
                        name="user"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
                    <Text style={styles.smallModalText}>
                        Change profile picture
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        Alert.alert('Not yet implemented', 'Coming soon !');
                    }}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}
                >
                    <Icon
                        name="user"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
                    <Text style={styles.smallModalText}>Change pseudo</Text>
                </Pressable>
            </View>
        </View>
    );
}

function SettingsModal({ setModalVisible, reload }) {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
    });

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
                    onPress={() => reload()}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                    }}
                >
                    <Icon
                        name="reload"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
                    <Text style={styles.smallModalText}>Actualize</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        authContext.logout();
                    }}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                    }}
                >
                    <Icon
                        name="exit"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
                    <Text style={styles.smallModalText}>Log out</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function ProfileScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
    });
    const [modalVisible, setModalVisible] = useState(modalActive.None);

    const {
        data: profil,
        loading,
        refetch,
    } = useQuery(gql`
        query whoami {
            whoami {
                id
                pseudo
                email
                publicKey
                avatar {
                    filename
                }
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
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={styles.header}>Profile</Text>
                        <Pressable
                            onPress={() =>
                                setModalVisible(modalActive.Settings)
                            }
                            style={{
                                width: 55,
                                alignItems: 'center',
                            }}
                        >
                            <Icon
                                name="settings"
                                size={35}
                                color={colors.link}
                            />
                            <Text style={styles.textSettings}>Settings</Text>
                        </Pressable>
                    </View>
                    {loading ? (
                        <ActivityIndicator
                            size="large"
                            color={colors.primary}
                            style={{ flex: 3, width: '100%' }}
                        />
                    ) : (
                        <View style={{ marginTop: 12 }}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    style={styles.avatar} //TODO Default pp
                                    source={{
                                        uri:
                                            'https://deway.fr/goto-api/files/photos/' +
                                            profil.whoami.avatar.filename,
                                    }}
                                />
                            </View>
                            <Text style={styles.pseudo}>
                                {profil.whoami.pseudo}#{profil.whoami.publicKey}
                            </Text>
                            <View style={styles.btnContainer}>
                                <View style={styles.btn}>
                                    <Button
                                        title="Modify profile"
                                        // onPress={pickImage}
                                        onPress={() =>
                                            setModalVisible(
                                                modalActive.ModifyProfile
                                            )
                                        }
                                        buttonStyle={styles.btn}
                                        titleStyle={{
                                            color: colors.link,
                                            fontSize: 12,
                                            fontWeight: '500',
                                        }}
                                    />
                                </View>
                            </View>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={
                                    modalVisible == modalActive.ModifyProfile
                                }
                                onRequestClose={() => {
                                    setModalVisible(modalActive.None);
                                }}
                            >
                                <ProfileModal
                                    setModalVisible={setModalVisible}
                                    profil={profil}
                                />
                            </Modal>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible == modalActive.Settings}
                                onRequestClose={() => {
                                    setModalVisible(modalActive.None);
                                }}
                            >
                                <SettingsModal
                                    setModalVisible={setModalVisible}
                                    reload={refetch}
                                />
                            </Modal>
                        </View>
                    )}
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
