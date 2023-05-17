import React, { useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { gql, useQuery } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { Icon } from '../Icon/Icon';
import {
    ProfileModal,
    PseudoModal,
    SettingsModal,
    Stats,
    Historic,
    Friends,
} from './ProfileComplements.jsx';

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

    const WHOAMI = gql`
        query whoami($lastMonth: DateTime!) {
            whoami {
                id
                pseudo
                email
                publicKey
                avatar {
                    filename
                }
                friends(sorting: { field: pseudo, direction: ASC }) {
                    id
                    pseudo
                    publicKey
                    avatar {
                        filename
                    }
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
            }
        }
    `;

    const {
        data: profil,
        loading: loadingProfile,
        refetch: refetchProfile,
    } = useQuery(WHOAMI, {
        variables: {
            lastMonth: lastMonth.toISOString(),
        },
    });

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
                                    width: 'auto',
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
                                        <View style={{ marginTop: 12 }}>
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
                                                        {/* Avatar Part */}
                                                        <View
                                                            style={
                                                                styles.avatarContainer
                                                            }
                                                        >
                                                            <Image
                                                                style={
                                                                    styles.avatar
                                                                }
                                                                source={
                                                                    profil
                                                                        .whoami
                                                                        .avatar
                                                                        ? {
                                                                              uri: `https://deway.fr/goto-api/files/photos/${profil.whoami.avatar.filename}`,
                                                                          }
                                                                        : require('../../../assets/images/default_pp.jpeg')
                                                                }
                                                            />
                                                        </View>
                                                        <Text
                                                            style={
                                                                styles.pseudo
                                                            }
                                                        >
                                                            {
                                                                profil.whoami
                                                                    .pseudo
                                                            }
                                                            #
                                                            {
                                                                profil.whoami
                                                                    .publicKey
                                                            }
                                                        </Text>
                                                        <View
                                                            style={
                                                                styles.btnContainer
                                                            }
                                                        >
                                                            <View
                                                                style={
                                                                    styles.btn
                                                                }
                                                            >
                                                                <Button
                                                                    title="Modify profile"
                                                                    onPress={() =>
                                                                        setModalVisible(
                                                                            modalActive.ModifyProfile
                                                                        )
                                                                    }
                                                                    buttonStyle={
                                                                        styles.btn
                                                                    }
                                                                    titleStyle={{
                                                                        color: colors.link,
                                                                        fontSize: 12,
                                                                        fontWeight:
                                                                            '500',
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>

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
