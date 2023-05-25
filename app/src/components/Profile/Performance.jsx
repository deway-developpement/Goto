import React from 'react';
import {
    TouchableWithoutFeedback,
    View,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import SplashScreen from '../SplashScreen/SplashScreen';
import { Icon } from '../Icon/Icon';

export default function Performance({ route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();
    const performanceId = route.params?.performanceId;
    const MyID = route.params?.MyID;
    const FriendPseudo = route.params?.FriendPseudo;

    const windowHeight = Dimensions.get('window').height;

    const GET_PERFORMANCE = gql`
        query performance($PerfId: ID!, $UserId: ID!) {
            performance(id: $PerfId) {
                id
                elevation
                duration
                distance
                date
                hike {
                    id
                    name
                    description
                    photos {
                        id
                        filename
                    }
                    reviews(filter: { user: { id: { eq: $UserId } } }) {
                        rating
                    }
                    reviewsAggregate {
                        avg {
                            rating
                        }
                    }
                }
            }
        }
    `;

    const { data: performance, loading } = useQuery(GET_PERFORMANCE, {
        variables: { PerfId: performanceId, UserId: MyID },
        errorPolicy: 'all',
    });

    if (loading) {
        return <SplashScreen />;
    }

    const avgRating = performance?.performance?.hike?.reviewsAggregate[0]?.avg?.rating || 0;
    const rating = performance?.performance?.hike?.reviews[0]?.rating
        ? performance?.performance?.hike?.reviews[0]?.rating
        : avgRating;

    return (
        <>
            <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <View
                    style={[styles.logoContainer, { position: 'absolute', top: '5%', left: '5%' }]}
                >
                    <Icon name="back" size={30} color={colors.background} />
                </View>
            </TouchableWithoutFeedback>
            <Image
                source={
                    performance.performance.hike.photos &&
                    performance.performance.hike.photos.length > 0
                        ? {
                            uri: `https://deway.fr/goto-api/files/photos/${performance.performance.hike.photos[0].filename}`,
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
                keyboardShouldPersistTaps={'handled'}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <>
                    <View
                        style={{
                            flex: 1,
                            marginHorizontal: 14,
                            marginTop: 48,
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <View style={{ height: windowHeight * 0.6 }} />
                        {/*Hike Infos*/}
                        <View style={[styles.containerFocus]}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <Text style={[styles.textDescription]}>
                                    {new Date(performance.performance.date).toUTCString()}
                                </Text>
                            </View>
                            <Text style={[styles.textHeader, { alignSelf: 'flex-start' }]}>
                                {performance.performance.hike.name}
                            </Text>
                            <Text style={[styles.textDescription]}>
                                {performance.performance.hike.description}
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignSelf: 'flex-start',
                                    marginTop: 16,
                                }}
                            >
                                {Array.from({ length: 5 }, () => 0).map((_, index) => {
                                    return (
                                        <Icon
                                            color={index < rating ? colors.filled : colors.empty}
                                            key={index}
                                            name={'star'}
                                            style={{ marginRight: 7 }}
                                            size={22}
                                        />
                                    );
                                })}
                                <Text
                                    style={[
                                        styles.textDescription,
                                        {
                                            color: styles.textContent,
                                            marginLeft: 10,
                                            paddingTop: 2,
                                        },
                                    ]}
                                >
                                    See reviews
                                </Text>
                            </View>
                        </View>
                        {/*Perf*/}
                        <View style={[styles.containerFocus]}>
                            <Text
                                style={[
                                    styles.textDescription,
                                    {
                                        marginBottom: 10,
                                    },
                                ]}
                            >
                                {FriendPseudo === '' ? 'Your' : FriendPseudo + '\'s'} performance
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
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
                                    <Text style={[styles.header]}>
                                        {performance.performance.duration}h
                                    </Text>
                                    <Text style={[styles.textDescription]}>of walking</Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={[styles.header]}>
                                        {performance.performance.distance}km
                                    </Text>
                                    <Text style={[styles.textDescription]}>covered</Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={[styles.header]}>
                                        {performance.performance.elevation}m
                                    </Text>
                                    <Text style={[styles.textDescription]}>of elevation</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 100 }} />
                </>
            </ScrollView>
        </>
    );
}
