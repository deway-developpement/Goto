import React from 'react';
import { View, Text, Pressable, Image, SafeAreaView, ScrollView } from 'react-native';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../Icon/Icon';
import SplashScreen from '../SplashScreen/SplashScreen';
import { Historic, Stats } from './ProfileComplements';
import { Button } from 'react-native-elements';

export default function FocusUser({ route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();
    const friendId = route.params?.friendId;
    const client = useApolloClient();
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const GET_FRIEND = gql`
        query user($id: ID!, $lastMonth: DateTime!) {
            user(id: $id) {
                pseudo
                publicKey
                isFriend
                avatar {
                    filename
                }
                performances(sorting: { field: date, direction: DESC }) {
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
                performancesAggregate(filter: { date: { gte: $lastMonth } }) {
                    count {
                        id
                    }
                    sum {
                        duration
                        distance
                        elevation
                    }
                }
                isFriend
            }
        }
    `;
    const ADD_FRIEND = gql`
        mutation addFriend($id: String!) {
            addFriend(id: $id) {
                id
            }
        }
    `;
    const REMOVE_FRIEND = gql`
        mutation removeFriend($id: String!) {
            removeFriend(id: $id) {
                id
            }
        }
    `;

    async function updateFriend() {
        if (profile.user.isFriend) {
            await client.mutate({
                mutation: REMOVE_FRIEND,
                variables: {
                    id: friendId,
                },
                errorPolicy: 'all',
            });
        } else {
            await client.mutate({
                mutation: ADD_FRIEND,
                variables: {
                    id: friendId,
                },
                errorPolicy: 'all',
            });
        }
        refetch();
    }

    const {
        data: profile,
        loading: loadingProfile,
        refetch,
    } = useQuery(GET_FRIEND, {
        variables: {
            id: friendId,
            lastMonth: lastMonth.toISOString(),
        },
    });

    if (loadingProfile) {
        return <SplashScreen />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <View style={styles.logoContainer}>
                            <Icon name="back" size={30} color={colors.background} />
                        </View>
                    </Pressable>
                    <View
                        style={[
                            styles.avatarContainer,
                            profile.user.isFriend && {
                                width: 68,
                                height: 68,
                                padding: 2,
                                backgroundColor: colors.stats,
                            },
                        ]}
                    >
                        <Image
                            style={styles.avatar}
                            source={
                                profile.user.avatar
                                    ? {
                                        uri: `https://deway.fr/goto-api/files/photos/${profile.user.avatar.filename}`,
                                    }
                                    : require('../../../assets/images/default_pp.jpeg')
                            }
                        />
                    </View>
                    <Text style={styles.pseudo}>
                        {profile.user.pseudo}#{profile.user.publicKey}
                    </Text>

                    <View style={styles.btnContainer}>
                        <View style={styles.btn}>
                            <Button
                                title={profile.user.isFriend ? 'Remove Friend' : 'Add Friend'}
                                onPress={() => {
                                    updateFriend();
                                }}
                                buttonStyle={[styles.btn, !profile.user.isFriend && styles.btnAdd]}
                                titleStyle={{
                                    color: colors.primary,
                                    fontSize: 12,
                                    fontWeight: '500',
                                }}
                            />
                        </View>
                    </View>

                    <Stats
                        count={profile.user.performancesAggregate[0].count.id}
                        duration={profile.user.performancesAggregate[0].sum.duration}
                        distance={profile.user.performancesAggregate[0].sum.distance}
                        elevation={profile.user.performancesAggregate[0].sum.elevation}
                    />

                    <Historic
                        hikes={profile.user.performances}
                        FriendPseudo={profile.user.pseudo}
                    />

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
