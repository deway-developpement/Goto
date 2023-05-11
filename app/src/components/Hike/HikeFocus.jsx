import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import HikeInfos from './HikeInfos';
import PointsOfInterests from './PointOfInterest';
import SplashScreen from '../SplashScreen/SplashScreen';
import { ScrollView } from 'react-native';

function Tag(props) {
    const { colors } = useTheme();
    return (
        <View
            style={{
                marginLeft: 25,
                marginTop: 5,
                backgroundColor: colors.starFill,
                flex: 1,
                paddingHorizontal: 15,
                paddingVertical: 4,
                borderRadius: 24,
            }}
        >
            <Text style={{ color: colors.backgroundTextInput }}>
                {props.name}
            </Text>
        </View>
    );
}

export default function FocusHikeScreen({ route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();
    const hikeId = route.params?.hikeId;

    if (!hikeId) {
        navigation.goBack();
    }

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const GET_HIKE = gql`
        query hike($id: ID!) {
            hike(id: $id) {
                id
                name
                description
                duration
                distance
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
            }
        }
    `;

    const { data, loading } = useQuery(GET_HIKE, {
        variables: {
            id: hikeId,
        },
    });

    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    if (loading) {
        return <SplashScreen />;
    } else {
        return (
            <ScrollView
                style={styles.containerBasic}
                keyboardShouldPersistTaps={'handled'}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <>
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
                            { minHeight: windowHeight, width: 'auto' },
                        ]}
                    />
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
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate('Search')}
                        >
                            <View
                                style={[
                                    styles.logoContainer,
                                    { marginBottom: 36 },
                                ]}
                            >
                                <IconComp
                                    color={colors.background}
                                    name={'back'}
                                    pos={0}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <HikeInfos hike={data.hike} borderRadius={true} />
                        <View
                            style={[
                                styles.containerFocus,
                                { paddingHorizontal: 0 },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textDescription,
                                    { marginBottom: 10, paddingHorizontal: 24 },
                                ]}
                            >
                                Principals caracteristics
                            </Text>
                            <View
                                style={{ flexDirection: 'row', width: '100%' }}
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
                                        to gotò
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
                                        backgroundColor: colors.styleBar,
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
                                                difficulties.indexOf(
                                                    data.hike.difficulty
                                                ) >= i
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
                                                            backgroundColor:
                                                                  colors.starFill,
                                                        }
                                                        : {
                                                            backgroundColor:
                                                                  colors.starEmpty,
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
                            {data?.hike?.tags.map((item) => (
                                <Tag key={item.name} name={item.name} />
                            ))}
                        </View>
                        <View
                            style={[
                                styles.containerFocus,
                                { flexDirection: 'column' },
                            ]}
                        >
                            <Text style={styles.textDescription}>
                                Hike&apos;s caracteristics
                            </Text>
                            {data?.hike?.pointsOfInterests.map((item) => (
                                <PointsOfInterests key={item.name} {...item} />
                            ))}
                            <View
                                style={{
                                    backgroundColor: colors.starEmpty,
                                    width: windowWidth * 0.8,
                                    height: 2,
                                    marginTop: 15,
                                }}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => console.log('OPEN HIKE PATH')}
                            >
                                <View
                                    style={[
                                        styles.containerFocus,
                                        {
                                            backgroundColor: colors.logo,
                                            marginTop: 15,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        },
                                    ]}
                                >
                                    <IconComp
                                        color={colors.backgroundTextInput}
                                        name={'map'}
                                        size={20}
                                    />
                                    <Text
                                        style={
                                            ([styles.textHeader],
                                            {
                                                fontSize: 16,
                                                marginTop: 0,
                                                color: colors.backgroundTextInput,
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
                                Hike Created on the{' '}
                                {data?.hike?.createdAt.slice(8, 10)}/
                                {data?.hike?.createdAt.slice(5, 7)}/
                                {data?.hike?.createdAt.slice(0, 4)}
                            </Text>
                            <Text style={styles.textDescription}>
                                by{' '}
                                <Text
                                    style={[
                                        styles.textDescription,
                                        { color: colors.text },
                                    ]}
                                >
                                    {data?.hike?.owner?.pseudo}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </>
            </ScrollView>
        );
    }
}
