import React, { useContext } from 'react';
import { Text, Image, View, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import HikeInfos from './HikeInfos';
import PointsOfInterests from './PointOfInterest';
import SplashScreen from '../SplashScreen/SplashScreen';
import { ScrollView } from 'react-native';
import { LocationContext } from '../../providers/LocationProvider';
import { AxiosContext } from '../../providers/AxiosContext';

function Tag(props) {
    const { colors } = useTheme();
    return (
        <View
            style={{
                marginTop: 5,
                backgroundColor: colors.filled,
                paddingHorizontal: 15,
                paddingVertical: 4,
                borderRadius: 24,
                marginHorizontal: 5,
            }}
        >
            <Text style={{ color: colors.backgroundSecondary }}>{props.name}</Text>
        </View>
    );
}

export default function FocusHikeScreen({ route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();
    const hikeId = route.params?.hikeId;
    const { location, permission } = useContext(LocationContext);
    const { authAxios } = useContext(AxiosContext);

    if (!hikeId) {
        navigation.goBack();
    }

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const GET_HIKE = gql`
        query hike($id: ID!, $lat: Float!, $lon: Float!) {
            hike(id: $id) {
                id
                name
                description
                duration
                distance
                track
                difficulty
                createdAt
                elevation
                photos {
                    id
                    filename
                }
                category {
                    id
                    name
                }
                tags {
                    id
                    name
                }
                owner {
                    pseudo
                    avatar {
                        filename
                    }
                }
                pointsOfInterests {
                    id
                    name
                    description
                    photo {
                        filename
                    }
                }
                distanceFrom(lat: $lat, lon: $lon)
            }
        }
    `;

    const { data, loading } = useQuery(GET_HIKE, {
        variables: {
            id: hikeId,
            lat: location?.coords.latitude,
            lon: location?.coords.longitude,
        },
    });

    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    async function loadHike() {
        if (!data.hike.track) {
            return;
        }
        const res = await authAxios.get('files/tracks/' + data.hike.track);
        const fileData = res.data;
        navigation.navigate('Directions', { fileData });
    }

    if (loading) {
        return <SplashScreen />;
    } else {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <View
                        style={[
                            styles.logoContainer,
                            {
                                position: 'absolute',
                                top: '5%',
                                left: '5%',
                                zIndex: 1000,
                            },
                        ]}
                    >
                        <IconComp color={colors.background} name={'back'} pos={0} />
                    </View>
                </TouchableWithoutFeedback>
                <Image
                    source={
                        data.hike.photos && data.hike.photos.length > 0
                            ? {
                                uri: `https://deway.fr/goto-api/files/photos/${data.hike.photos[0].filename}`,
                            }
                            : require('../../../assets/images/Dalle_background.png')
                    }
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            minHeight: windowHeight,
                            width: 'auto',
                            zIndex: 0,
                        },
                    ]}
                />
                <ScrollView
                    style={styles.containerNoBg}
                    keyboardShouldPersistTaps={'handled'}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    marginHorizontal: 14,
                                    marginTop: 48,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                },
                            ]}
                        >
                            <View style={{ height: windowHeight * 0.6 }} />
                            <HikeInfos hike={data.hike} borderRadius={true} />
                            <View style={[styles.containerFocus, { paddingHorizontal: 0 }]}>
                                <Text
                                    style={[
                                        styles.textDescription,
                                        {
                                            marginBottom: 10,
                                            paddingHorizontal: 24,
                                        },
                                    ]}
                                >
                                    Principals characteristics
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.textHeader,
                                                { marginTop: 10, fontSize: 20 },
                                            ]}
                                        >
                                            {data.hike.duration}h
                                        </Text>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    color: colors.text,
                                                    marginLeft: 8,
                                                    fontSize: 12,
                                                },
                                            ]}
                                        >
                                            of walking
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.textHeader,
                                                { marginTop: 10, fontSize: 20 },
                                            ]}
                                        >
                                            {data.hike.distance}km
                                        </Text>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    color: colors.text,
                                                    marginLeft: 8,
                                                    fontSize: 12,
                                                },
                                            ]}
                                        >
                                            to cover
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.textHeader,
                                                { marginTop: 10, fontSize: 20 },
                                            ]}
                                        >
                                            {data.hike.elevation}m
                                        </Text>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    color: colors.text,
                                                    marginLeft: 8,
                                                    fontSize: 12,
                                                },
                                            ]}
                                        >
                                            of elevation
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: colors.empty,
                                            height: '100%',
                                            width: 2,
                                            marginTop: 5,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                marginTop: 20,
                                            }}
                                        >
                                            {Array.from(
                                                { length: 3 },
                                                (_, i) =>
                                                    difficulties.indexOf(data.hike.difficulty) >= i
                                            ).map((item, index) => (
                                                <View
                                                    style={[
                                                        {
                                                            width: 14,
                                                            height: 14,
                                                            marginLeft: 5,
                                                            borderRadius: 7,
                                                        },
                                                        item
                                                            ? {
                                                                backgroundColor: colors.filled,
                                                            }
                                                            : {
                                                                backgroundColor: colors.empty,
                                                            },
                                                    ]}
                                                    key={index}
                                                />
                                            ))}
                                        </View>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    color: colors.text,
                                                    marginLeft: 8,
                                                    fontSize: 12,
                                                },
                                            ]}
                                        >
                                            difficulty
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: 10,
                                        marginTop: 10,
                                        marginHorizontal: 28,
                                    }}
                                >
                                    {data?.hike?.tags.map((item) => (
                                        <Tag key={item.name} name={item.name} />
                                    ))}
                                </View>
                            </View>
                            <View style={[styles.containerFocus, { flexDirection: 'column' }]}>
                                <Text style={styles.textDescription}>
                                    Hike&apos;s characteristics
                                </Text>
                                {data?.hike?.pointsOfInterests.map((item) => (
                                    <PointsOfInterests key={item.name} {...item} />
                                ))}
                                <View
                                    style={{
                                        backgroundColor: colors.empty,
                                        width: windowWidth * 0.8,
                                        height: 2,
                                        marginTop: 15,
                                    }}
                                />
                                {permission.granted && (
                                    <>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    marginTop: 15,
                                                    marginBottom: 10,
                                                },
                                            ]}
                                        >
                                            Distance from here
                                        </Text>
                                        <Text
                                            style={[
                                                styles.textDescription,
                                                {
                                                    color: colors.text,
                                                },
                                            ]}
                                        >
                                            {
                                                // round to 2 decimals
                                                Math.round(
                                                    (data?.hike?.distanceFrom + Number.EPSILON) *
                                                        100
                                                ) / 100
                                            }{' '}
                                            Km
                                        </Text>
                                    </>
                                )}
                                <TouchableWithoutFeedback onPress={() => loadHike()}>
                                    <View
                                        style={[
                                            styles.containerFocus,
                                            {
                                                backgroundColor: colors.primary,
                                                marginTop: 15,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            },
                                        ]}
                                    >
                                        <IconComp
                                            color={colors.backgroundSecondary}
                                            name={'map'}
                                            size={20}
                                        />
                                        <Text
                                            style={
                                                ([styles.textHeader],
                                                {
                                                    fontSize: 16,
                                                    marginTop: 0,
                                                    color: colors.backgroundSecondary,
                                                    marginLeft: 20,
                                                })
                                            }
                                        >
                                            See the Hike on the map
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View
                                style={[
                                    styles.containerFocus,
                                    {
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    },
                                ]}
                            >
                                <Image
                                    source={
                                        data?.hike?.owner?.avatar?.filename
                                            ? {
                                                uri: `https://deway.fr/goto-api/files/photos/${data?.hike?.owner?.avatar?.filename}`,
                                            }
                                            : require('../../../assets/images/Dalle_background.png')
                                    }
                                    style={[
                                        {
                                            height: 30,
                                            width: 30,
                                            borderRadius: 15,
                                            marginBottom: 10,
                                        },
                                    ]}
                                />
                                <Text style={styles.textDescription}>
                                    Hike Created on the {data?.hike?.createdAt.slice(8, 10)}/
                                    {data?.hike?.createdAt.slice(5, 7)}/
                                    {data?.hike?.createdAt.slice(0, 4)}
                                </Text>
                                <Text style={styles.textDescription}>
                                    by{' '}
                                    <Text style={[styles.textDescription, { color: colors.text }]}>
                                        {data?.hike?.owner?.pseudo}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={{ height: 150 }} />
                    </>
                </ScrollView>
            </>
        );
    }
}
