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
    ScrollView,
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
        <KeyboardAvoidingView
            style={[
                styles.container,
                {
                    backgroundColor:
                        modalVisible == modalActive.None
                            ? colors.background
                            : colors.backgroundsecondary,
                },
            ]}
        >
            <KeyboardDismissView>
                <SafeAreaView style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 5,
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
                                <Text style={styles.textSettings}>
                                    Settings
                                </Text>
                            </Pressable>
                        </View>
                        {(() => {
                            if (loading) {
                                return (
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                        style={{ flex: 3, width: '100%' }}
                                    />
                                );
                            } else {
                                return (
                                    <>
                                        {/* Avatar Part */}
                                        <View style={{ marginTop: 12 }}>
                                            <View
                                                style={styles.avatarContainer}
                                            >
                                                <Image
                                                    style={styles.avatar} //TODO Default pp
                                                    source={{
                                                        uri:
                                                            'https://deway.fr/goto-api/files/photos/' +
                                                            profil.whoami.avatar
                                                                .filename,
                                                    }}
                                                />
                                            </View>
                                            <Text style={styles.pseudo}>
                                                {profil.whoami.pseudo}#
                                                {profil.whoami.publicKey}
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
                                                    modalVisible ==
                                                    modalActive.ModifyProfile
                                                }
                                                onRequestClose={() => {
                                                    setModalVisible(
                                                        modalActive.None
                                                    );
                                                }}
                                            >
                                                <ProfileModal
                                                    setModalVisible={
                                                        setModalVisible
                                                    }
                                                    profil={profil}
                                                />
                                            </Modal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={
                                                    modalVisible ==
                                                    modalActive.Settings
                                                }
                                                onRequestClose={() => {
                                                    setModalVisible(
                                                        modalActive.None
                                                    );
                                                }}
                                            >
                                                <SettingsModal
                                                    setModalVisible={
                                                        setModalVisible
                                                    }
                                                    reload={refetch}
                                                />
                                            </Modal>
                                        </View>
                                        {(() => {
                                            if (
                                                modalVisible == modalActive.None
                                            ) {
                                                return (
                                                    <>
                                                        {/* Stats Part */}
                                                        <View
                                                            style={{
                                                                marginTop: 22,
                                                            }}
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.textContent
                                                                }
                                                            >
                                                                This month
                                                            </Text>
                                                            <View
                                                                style={
                                                                    styles.statContainer
                                                                }
                                                            >
                                                                <View
                                                                    style={{
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        name="hikes"
                                                                        size={
                                                                            28
                                                                        }
                                                                        color={
                                                                            colors.stats
                                                                        }
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            styles.statNumber
                                                                        }
                                                                    >
                                                                        Goto
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            styles.statLabel
                                                                        }
                                                                    >
                                                                        Hikes
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        name="info" //TODO Change to clock
                                                                        size={
                                                                            28
                                                                        }
                                                                        color={
                                                                            colors.stats
                                                                        }
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            styles.statNumber
                                                                        }
                                                                    >
                                                                        Goto
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            styles.statLabel
                                                                        }
                                                                    >
                                                                        Total
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        name="hikes"
                                                                        size={
                                                                            28
                                                                        }
                                                                        color={
                                                                            colors.stats
                                                                        }
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            styles.statNumber
                                                                        }
                                                                    >
                                                                        Goto
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            styles.statLabel
                                                                        }
                                                                    >
                                                                        Total
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        alignItems:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <Icon
                                                                        name="hikes"
                                                                        size={
                                                                            28
                                                                        }
                                                                        color={
                                                                            colors.stats
                                                                        }
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            styles.statNumber
                                                                        }
                                                                    >
                                                                        Goto
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            styles.statLabel
                                                                        }
                                                                    >
                                                                        Elevation
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {/* Historic Part */}
                                                        <View>
                                                            <Text
                                                                style={
                                                                    styles.textContent
                                                                }
                                                            >
                                                                Historic of my
                                                                hikes
                                                            </Text>
                                                            <ScrollView
                                                                horizontal={
                                                                    true
                                                                }
                                                                showsHorizontalScrollIndicator={
                                                                    false
                                                                }
                                                                style={{
                                                                    height: 230,
                                                                    backgroundColor:
                                                                        colors.backgroundTextInput,
                                                                    borderRadius: 10,
                                                                    marginHorizontal: 5,
                                                                }}
                                                            >
                                                                <View
                                                                    style={
                                                                        styles.historicContainer
                                                                    }
                                                                >
                                                                    <View
                                                                        style={
                                                                            styles.historic
                                                                        }
                                                                    >
                                                                        <Text
                                                                            style={
                                                                                styles.historicText
                                                                            }
                                                                        >
                                                                            12/12/2020
                                                                        </Text>
                                                                        <Text
                                                                            style={
                                                                                styles.historicText
                                                                            }
                                                                        >
                                                                            12:00
                                                                        </Text>
                                                                        <Text
                                                                            style={
                                                                                styles.historicText
                                                                            }
                                                                        >
                                                                            12:00
                                                                        </Text>
                                                                        <Text
                                                                            style={
                                                                                styles.historicText
                                                                            }
                                                                        >
                                                                            12:00
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </ScrollView>
                                                        </View>
                                                        {/* Friends Part */}
                                                        <View>
                                                            <Text
                                                                style={
                                                                    styles.textContent
                                                                }
                                                            >
                                                                My friends
                                                            </Text>
                                                            <ScrollView
                                                                horizontal={
                                                                    true
                                                                }
                                                                showsHorizontalScrollIndicator={
                                                                    false
                                                                }
                                                                style={{
                                                                    height: 230,
                                                                    backgroundColor:
                                                                        colors.backgroundTextInput,
                                                                    borderRadius: 10,
                                                                    marginHorizontal: 5,
                                                                    marginBottom: 120,
                                                                }}
                                                            >
                                                                <View
                                                                    style={
                                                                        styles.historicContainer
                                                                    }
                                                                >
                                                                    <View
                                                                        style={
                                                                            styles.historic
                                                                        }
                                                                    >
                                                                        <Text
                                                                            style={
                                                                                styles.historicText
                                                                            }
                                                                        >
                                                                            La
                                                                            Poste
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </ScrollView>
                                                        </View>
                                                    </>
                                                );
                                            }
                                        })()}
                                    </>
                                );
                            }
                        })()}
                    </ScrollView>
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}
