import React, { useContext } from 'react';
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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../providers/AuthContext';
import { Icon } from '../Icon/Icon';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import { useState } from 'react';

function ProfileModal({ setModalVisible }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const modalActive = Object.freeze({
        None: 0,
        Settings: 1,
        ModifyProfile: 2,
    });
    return (
        <View style={styles.centeredView}>
            <Text style={styles.modalText}>Settings</Text>
            <Icon
                name="cross"
                size={17}
                style={styles.closeIcon}
                onPress={() => setModalVisible(modalActive.None)}
            />
        </View>
    );
}

export default function ProfileScreen() {
    const authContext = useContext(AuthContext);
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

    // async function createPhoto(Blobimage) {
    //     try {
    //         await client.mutate({
    //             mutation: gql`
    //                 mutation createPhoto($objId: String!, $file: Upload!) {
    //                     createPhoto(
    //                         input: {
    //                             objId: $objId
    //                             objType: "User"
    //                             file: $file
    //                         }
    //                     )
    //                 }
    //             `,
    //             variables: {
    //                 objId: profil.whoami.id,
    //                 file: Blobimage,
    //             },
    //             errorPolicy: (graphQLErrors, networkError) => {
    //                 console.log('Gql', graphQLErrors);
    //                 console.log('Net', networkError);
    //             },
    //         });
    //         console.log('Photo created');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

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
                        <View
                            style={{
                                width: 55,
                                alignItems: 'center',
                            }}
                        >
                            <Icon //TODO Add Pressable
                                name="settings"
                                size={35}
                                color={colors.link}
                            />
                            <Text style={styles.textSettings}>Settings</Text>
                        </View>
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
                                />
                            </Modal>
                        </View>
                    )}

                    {/* <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
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
                    </View> */}
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}
                    >
                        <Button
                            title="Pick an image from gallery"
                            onPress={pickImage}
                            style={{ flex: 1, height: 250 }}
                        />
                    </View>
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
