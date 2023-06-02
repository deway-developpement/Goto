import React from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Pressable,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';
import { gql, useQuery } from '@apollo/client';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import HikeInfos from '../Hike/HikeInfos';
import { Icon } from '../Icon/Icon';
import { FlatList } from 'react-native-gesture-handler';
import { FILES_URL } from '../../providers/AxiosContext';

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

function HikeCard({ performance, MyID, FriendPseudo }) {
    const hike = performance.hike;
    const navigation = useNavigation();

    function handleClickHike(performanceId) {
        navigation.navigate('Performance', { performanceId, MyID, FriendPseudo });
    }

    return (
        <TouchableWithoutFeedback onPress={() => handleClickHike(performance.id)}>
            <View style={{ marginRight: 25 }}>
                <Image
                    source={{
                        uri: `${FILES_URL}/photos/${hike.photos[0].filename}`,
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

function Historic({ hikes, MyID, FriendPseudo = '' }) {
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
                renderItem={({ item }) => (
                    <HikeCard performance={item} MyID={MyID} FriendPseudo={FriendPseudo} />
                )}
                keyExtractor={(item) => item.id}
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
        navigation.navigate('FocusUser', { friendId, isFriend });
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
                                uri: `${FILES_URL}/photos/${friend.avatar.filename}`,
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
                filter: { pseudo: { like: $pseudoPart }, id: { neq: $MyID } }
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
                color={colors.loading}
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

export { Stats, Historic, Friends };
