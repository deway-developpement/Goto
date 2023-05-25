import React, { useEffect, useState } from 'react';
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
import { CommonActions, useIsFocused, useTheme } from '@react-navigation/native';
import { Icon } from '../Icon/Icon';
import { ProfileModal, SettingsModal, PseudoModal } from './Modals';
import { Stats, Historic, Friends } from './ProfileComplements.jsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Performance from './Performance';
import FocusUser from './FocusUser';

const stack = createNativeStackNavigator();

export default function ProfileWrapper({ navigation }) {
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'ProfileScreen' }],
                })
            );
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <stack.Screen name="FocusUser" component={FocusUser} />
            <stack.Screen name="Performance" component={Performance} />
        </stack.Navigator>
    );
}

function ProfileScreen() {
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
    const isFocused = useIsFocused();
    const [search, setSearch] = useState('');

    const WHOAMI = gql`
        query whoami($lastMonth: DateTime!, $PseudoFilter: String!) {
            whoami {
                id
                pseudo
                email
                publicKey
                avatar {
                    filename
                }
                friends(
                    filter: { pseudo: { like: $PseudoFilter } }
                    sorting: { field: pseudo, direction: ASC }
                ) {
                    id
                    pseudo
                    publicKey
                    isFriend
                    avatar {
                        filename
                    }
                }
                performances(sorting: { field: date, direction: DESC }) {
                    id
                    hike {
                        # id
                        name
                        description
                        category {
                            id
                            name
                        }
                        photos {
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
            PseudoFilter: '%',
        },
    });

    function handleSearch(text) {
        refetchProfile({
            lastMonth: lastMonth.toISOString(),
            PseudoFilter: '%' + text + '%',
        });
    }

    useEffect(() => {
        if (isFocused) {
            setSearch('');
            refetchProfile({
                lastMonth: lastMonth.toISOString(),
                PseudoFilter: '%',
            });
        }
    }, [isFocused]);

    return (
        <KeyboardAvoidingView
            style={[
                styles.container,
                {
                    backgroundColor:
                        modalVisible == modalActive.None
                            ? colors.background
                            : colors.backgroundModal,
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
                                onPress={() => setModalVisible(modalActive.Settings)}
                                style={{
                                    width: 'auto',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon name="settings" size={35} color={colors.primary} />
                                <Text style={styles.textSettings}>Settings</Text>
                            </Pressable>
                        </View>
                        {(() => {
                            if (loadingProfile) {
                                return (
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.loading}
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
                                                visible={modalVisible == modalActive.ModifyProfile}
                                                onRequestClose={() => {
                                                    setModalVisible(modalActive.None);
                                                }}
                                            >
                                                <ProfileModal
                                                    setModalVisible={setModalVisible}
                                                    profil={profil}
                                                    reload={refetchProfile}
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
                                                    reload={refetchProfile}
                                                />
                                            </Modal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={modalVisible == modalActive.ModifyPseudo}
                                                onRequestClose={() => {
                                                    setModalVisible(modalActive.ModifyProfile);
                                                }}
                                            >
                                                <PseudoModal
                                                    setModalVisible={setModalVisible}
                                                    profil={profil}
                                                    reload={refetchProfile}
                                                />
                                            </Modal>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={modalVisible == modalActive.Performance}
                                                onRequestClose={() => {
                                                    setModalVisible(modalActive.None);
                                                }}
                                            ></Modal>
                                        </View>
                                        {(() => {
                                            if (modalVisible == modalActive.None) {
                                                return (
                                                    <>
                                                        {/* Avatar Part */}
                                                        <View style={styles.avatarContainer}>
                                                            <Image
                                                                style={styles.avatar}
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
                                                                        color: colors.primary,
                                                                        fontSize: 12,
                                                                        fontWeight: '500',
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>

                                                        {/* Stats Part */}
                                                        <Stats
                                                            count={
                                                                profil.whoami
                                                                    .performancesAggregate[0].count
                                                                    .id
                                                            }
                                                            duration={
                                                                profil.whoami
                                                                    .performancesAggregate[0].sum
                                                                    .duration
                                                            }
                                                            distance={
                                                                profil.whoami
                                                                    .performancesAggregate[0].sum
                                                                    .distance
                                                            }
                                                            elevation={
                                                                profil.whoami
                                                                    .performancesAggregate[0].sum
                                                                    .elevation
                                                            }
                                                        />
                                                        {/* Historic Part */}
                                                        <Historic
                                                            hikes={profil.whoami.performances}
                                                            MyID={profil.whoami.id}
                                                        />
                                                        {/* Friends Part */}
                                                        <Friends
                                                            friends={profil.whoami.friends}
                                                            MyID={profil.whoami.id}
                                                            reload={handleSearch}
                                                            search={search}
                                                            setSearch={setSearch}
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
