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
    TouchableWithoutFeedback,
    TextInput,
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
import { useNavigation } from '@react-navigation/native';
import HikeInfos from '../Hike/HikeInfos';
import { FlatList } from 'react-native-gesture-handler';

function ProfileModal({ setModalVisible, profil, reload }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const [status, requestPermission] =
        ImagePicker.useMediaLibraryPermissions();
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

            console.log('update', update);

            const MUTATION = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    createPhoto(
                        input: { objId: $objId, objType: $objType, file: $file }
                    ) {
                        id
                    }
                }
            `;

            const MUTATION_UPDATE = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    changeAvatar(
                        input: { objId: $objId, objType: $objType, file: $file }
                    ) {
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
                    <Icon
                        name="user"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
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

    function changePseudo(pseudo) {
        if (pseudo == '') {
            Alert.alert('Error', 'Please enter a pseudo');
            return;
        }
        client.mutate({
            mutation: gql`
                mutation updateUser($id: String!, $pseudo: String!) {
                    updateUser(id: $id, input: { pseudo: $pseudo }) {
                        pseudo
                    }
                }
            `,
            variables: {
                id: profil.whoami.id,
                pseudo: pseudo,
            },
            errorPolicy: 'all',
        });
        reload();
        setModalVisible(modalActive.None);
    }

    return (
        <KeyboardDismissView>
            <View style={styles.modalView}>
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
                        value={pseudo}
                    />
                    <Pressable
                        style={{ marginBottom: 44 }}
                        onPress={() => changePseudo(pseudo)}
                    >
                        <Text style={styles.buttonText}>Change</Text>
                    </Pressable>
                </View>
            </View>
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
                        deleteAccount();
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Icon
                        name="reload"
                        size={14}
                        style={{ marginTop: 2 }}
                        color={colors.link}
                    />
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

function Stats({ count, distance, duration, elevation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    return (
        <View style={{ marginTop: 22 }}>
            <Text style={styles.textContent}>This month</Text>
            <View style={styles.statContainer}>
                {count === 0 ? (
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={styles.statNumber}>
                                No statistics for this month
                            </Text>
                            <View style={{ height: 10 }} />
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="hikes" size={28} color={colors.stats} />
                            <Text style={styles.statNumber}>{count}</Text>
                            <Text style={styles.statLabel}>hikes</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Icon
                                name="info" //TODO change to clock
                                size={28}
                                color={colors.stats}
                            />
                            <Text style={styles.statNumber}>{duration}h</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="hikes" size={28} color={colors.stats} />
                            <Text style={styles.statNumber}>{distance}km</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="hikes" size={28} color={colors.stats} />
                            <Text style={styles.statNumber}>{elevation}m</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

function HikeCard({ hike }) {
    const navigation = useNavigation();

    function handleClickHike(hikeId) {
        navigation.navigate('FocusHike', { hikeId });
    }

    return (
        <TouchableWithoutFeedback onPress={() => handleClickHike(hike.id)}>
            <View style={{ marginRight: 25 }}>
                <Image
                    source={{
                        uri: `https://deway.fr/goto-api/files/photos/${hike.photos[0].filename}`,
                    }}
                    style={{
                        height: 150,
                        width: 190,
                        borderTopRightRadius: 12,
                        borderTopLeftRadius: 12,
                    }}
                />
                <HikeInfos hike={hike} inProfile={true} />
            </View>
        </TouchableWithoutFeedback>
    );
}

function Historic({ hikes }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    if (hikes.length === 0) {
        return (
            <View style={{ marginTop: 22 }}>
                <Text style={styles.textContent}>Historic of my hikes</Text>
                <View style={styles.statContainer}>
                    <Text style={[styles.statNumber, { marginBottom: 10 }]}>
                        You haven{"'"}t done any hike yet
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ marginTop: 22 }}>
            <Text style={styles.textContent}>Historic of my hikes</Text>
            <FlatList
                data={hikes}
                style={{ marginBottom: 26 }}
                renderItem={({ item }) => (
                    <HikeCard hike={item.hike} key={item.hike.id} />
                )}
                keyExtractor={(item) => item.hike.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

function FriendCard({ friend }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    return (
        <View
            style={{
                marginBottom: 64,
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: 16,
            }}
        >
            <View style={[styles.avatarContainer, { width: 56, height: 56 }]}>
                <Image
                    source={
                        friend.avatar
                            ? {
                                  uri: `https://deway.fr/goto-api/files/photos/${friend.avatar.filename}`,
                              }
                            : require('../../../assets/images/default_pp.jpeg')
                    }
                    style={[styles.avatar, { width: 54, height: 54 }]}
                />
            </View>
            <View style={{ flexDirection: 'column' }}>
                <Text style={styles.smallpseudo}>{friend.pseudo}</Text>
            </View>
        </View>
    );
}

function Friends({ friends }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    if (friends.length === 0) {
        return (
            <View style={{ marginTop: 22, marginBottom: 86 }}>
                <Text style={styles.textContent}>My friends</Text>
                <View style={styles.statContainer}>
                    <Text style={[styles.statNumber, { marginBottom: 10 }]}>
                        You haven{"'"}t added any friend yet
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ marginTop: 22, marginBottom: 58 }}>
            <Text style={styles.textContent}>My friends</Text>
            {friends.length !== 0 ? (
                <View style={[styles.textInputContainer, { marginBottom: 24 }]}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search"
                        placeholderTextColor={colors.border}
                        onChangeText={(text) => console.log(text)}
                    />
                    <Icon name="search" size={15} color={colors.border} />
                </View>
            ) : null}
            <FlatList
                data={friends}
                renderItem={({ item }) => <FriendCard friend={item} />}
                style={styles.friendsContainer}
                horizontal={true}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={{ marginTop: 22, marginBottom: 58 }}>
                        <Text style={styles.textContent}>My friends</Text>
                        <View style={styles.statContainer}>
                            <Text
                                style={[
                                    styles.statNumber,
                                    { marginBottom: 10 },
                                ]}
                            >
                                You don{"'"}t have any friends yet
                            </Text>
                        </View>
                    </View>
                )}
            />
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
        ModifyPseudo: 3,
    });
    const [modalVisible, setModalVisible] = useState(modalActive.None);
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const {
        data: profil,
        loading: loadingProfile,
        refetch: refetchProfile,
    } = useQuery(
        gql`
            query whoami(
                $lastMonth: DateTime!
                $field: PerformanceSortFields!
                $direction: SortDirection!
            ) {
                whoami {
                    id
                    pseudo
                    email
                    publicKey
                    avatar {
                        filename
                    }
                    friends {
                        id
                        pseudo
                        publicKey
                        avatar {
                            filename
                        }
                    }
                    performances(
                        sorting: { field: $field, direction: $direction }
                    ) {
                        hike {
                            id
                            name
                            description
                            category {
                                id
                                name
                            }
                            photos {
                                id
                                filename
                            }
                        }
                    }
                    performancesAggregate(
                        filter: { date: { gte: $lastMonth } }
                    ) {
                        count {
                            id
                        }
                        sum {
                            duration
                            distance
                            elevation
                        }
                    }
                }
            }
        `,
        {
            variables: {
                lastMonth: lastMonth.toISOString(),
                field: 'date',
                direction: 'DESC',
            },
        }
    );

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
                            if (loadingProfile) {
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
                                                    source={
                                                        profil.whoami.avatar
                                                            ? {
                                                                  uri: `https://deway.fr/goto-api/files/photos/${profil.whoami.avatar.filename}`,
                                                              }
                                                            : require('../../../assets/images/default_pp.jpeg')
                                                    }
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
                                                    reload={refetchProfile}
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
                                                    reload={refetchProfile}
                                                />
                                            </Modal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={
                                                    modalVisible ==
                                                    modalActive.ModifyPseudo
                                                }
                                                onRequestClose={() => {
                                                    setModalVisible(
                                                        modalActive.ModifyProfile
                                                    );
                                                }}
                                            >
                                                <PseudoModal
                                                    setModalVisible={
                                                        setModalVisible
                                                    }
                                                    profil={profil}
                                                    reload={refetchProfile}
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
                                                        <Stats
                                                            count={
                                                                profil.whoami
                                                                    .performancesAggregate[0]
                                                                    .count.id
                                                            }
                                                            duration={
                                                                profil.whoami
                                                                    .performancesAggregate[0]
                                                                    .sum
                                                                    .duration
                                                            }
                                                            distance={
                                                                profil.whoami
                                                                    .performancesAggregate[0]
                                                                    .sum
                                                                    .distance
                                                            }
                                                            elevation={
                                                                profil.whoami
                                                                    .performancesAggregate[0]
                                                                    .sum
                                                                    .elevation
                                                            }
                                                        />
                                                        {/* Historic Part */}
                                                        <Historic
                                                            hikes={
                                                                profil.whoami
                                                                    .performances
                                                            }
                                                        />
                                                        {/* Friends Part */}
                                                        <Friends
                                                            friends={
                                                                profil.whoami
                                                                    .friends
                                                            }
                                                        />
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
