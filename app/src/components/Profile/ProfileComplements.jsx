import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Pressable,
    Alert,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
} from 'react-native';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../providers/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import { useNavigation } from '@react-navigation/native';
import HikeInfos from '../Hike/HikeInfos';
import { Icon } from '../Icon/Icon';
import { FlatList } from 'react-native-gesture-handler';

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
                    <Icon name="avatar" size={16} style={{ marginTop: 2 }} color={colors.link} />
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
                    <Icon name="pseudo" size={16} style={{ marginTop: 2 }} color={colors.link} />
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
                    <Icon name="reload" size={14} style={{ marginTop: 2 }} color={colors.link} />
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
                    <Icon name="delete" size={14} style={{ marginTop: 2 }} color={colors.link} />
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
                    <Icon name="exit" size={14} style={{ marginTop: 2 }} color={colors.link} />
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
                            <Text style={styles.statNumber}>No statistics for this month</Text>
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
                            <Icon name="clock" size={28} color={colors.stats} />
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

function Historic({ hikes, FriendPseudo = '' }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    if (hikes.length === 0) {
        return (
            <View style={{ marginTop: 22 }}>
                <Text style={styles.textContent}>
                    Historic of {FriendPseudo == '' ? 'my' : FriendPseudo + '\'s'} hikes
                </Text>
                <View style={styles.statContainer}>
                    <Text style={[styles.statNumber, { marginBottom: 10 }]}>
                        You haven{'\''}t done any hike yet
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ marginTop: 22 }}>
            <Text style={styles.textContent}>
                Historic of {FriendPseudo == '' ? 'my' : FriendPseudo + '\'s'} hikes
            </Text>
            <FlatList
                data={hikes}
                style={{ marginBottom: 26 }}
                renderItem={({ item }) => <HikeCard hike={item.hike} key={item.hike.id} />}
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
    const navigation = useNavigation();

    function handleClick({ friendId, isFriend }) {
        navigation.navigate('FocusFriend', { friendId, isFriend });
    }

    return (
        <Pressable
            onPress={() => {
                handleClick({ friendId: friend.id, isFriend: friend.isFriend });
            }}
            style={{
                marginBottom: 64,
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: 16,
            }}
        >
            <View
                style={[
                    styles.avatarContainer,
                    {
                        width: 58,
                        height: 58,
                        padding: 2,
                        backgroundColor: friend.isFriend
                            ? colors.stats
                            : colors.backgroundSecondary,
                    },
                ]}
            >
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
        </Pressable>
    );
}

function Friends({ friends, MyID, reload, search, setSearch }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const limitByPage = 6;
    let onEndReachedCalledDuringMomentum = false;

    const GET_USERS = gql`
        query users($pseudoPart: String!, $MyID: ID!, $limit: Int!, $cursor: ConnectionCursor!) {
            users(
                filter: {
                    pseudo: { like: $pseudoPart }
                    id: { neq: $MyID }
                    # isFriend: { eq: false }
                }
                sorting: { field: pseudo, direction: ASC }
                paging: { first: $limit, after: $cursor }
            ) {
                edges {
                    node {
                        id
                        pseudo
                        publicKey
                        avatar {
                            filename
                        }
                    }
                }
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
    `;
    const { data, loading, fetchMore, refetch } = useQuery(GET_USERS, {
        variables: {
            pseudoPart: '',
            MyID,
            limit: limitByPage,
            cursor: '',
        },
        errorPolicy: 'all',
    });

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ flex: 3, width: '100%' }}
            />
        );
    }

    const nodes = data?.users?.edges.map((user) => user.node);

    function removeDuplicatesFromArray2(array1, array2) {
        // add a filter to remove duplicates from the array so that there is no two objects with the same id
        const myarray = array2.filter((item) => array1.findIndex((t) => t.id === item.id) === -1);
        return [...array1, ...myarray];
    }

    function handleSearch(search) {
        reload(search);
        const variables = search === '' ? { pseudoPart: '' } : { pseudoPart: '%' + search + '%' };
        refetch(variables);
    }

    return (
        <View style={{ marginTop: 22, marginBottom: 58 }}>
            <Text style={styles.textContent}>My friends</Text>
            <View style={[styles.textInputContainer, { marginBottom: 24 }]}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search"
                    placeholderTextColor={colors.border}
                    onChangeText={(text) => setSearch(text)}
                    onSubmitEditing={() => handleSearch(search)}
                    value={search}
                />
                {search !== '' ? (
                    <Icon
                        name="cross"
                        size={15}
                        color={colors.border}
                        onPress={() => {
                            setSearch('');
                            handleSearch('');
                        }}
                    />
                ) : (
                    <Icon name="search" size={15} color={colors.border} />
                )}
            </View>
            <FlatList
                data={removeDuplicatesFromArray2(friends, nodes)}
                renderItem={({ item }) => <FriendCard friend={item} allFriends={friends} />}
                style={styles.friendsContainer}
                horizontal={true}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => <View style={{ height: 58 }} />}
                onEndReached={() => {
                    if (
                        data?.users?.pageInfo?.hasNextPage &&
                        !loading &&
                        !onEndReachedCalledDuringMomentum
                    ) {
                        fetchMore({
                            variables: {
                                cursor: data?.users?.pageInfo?.endCursor,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                return {
                                    users: {
                                        __typename: prev.users.__typename,
                                        edges: [
                                            ...prev.users.edges,
                                            ...fetchMoreResult.users.edges,
                                        ],
                                        pageInfo: {
                                            ...fetchMoreResult.users.pageInfo,
                                        },
                                    },
                                };
                            },
                        });
                    }
                    onEndReachedCalledDuringMomentum = true;
                }}
                onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum = false;
                }}
            />
        </View>
    );
}

export { ProfileModal, PseudoModal, SettingsModal, Stats, Historic, Friends };
