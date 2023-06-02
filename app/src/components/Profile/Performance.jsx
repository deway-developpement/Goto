import React, { useContext, useEffect, useRef, useState } from 'react';
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
import GpxPathLineLite from '../Map/GpxPathLineLite';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { AxiosContext } from '../../providers/AxiosContext';
import { default as MAP_STYLE } from '../../../assets/maps/style.json';
import { Pressable } from 'react-native';
import { addTimeTagToGPXFile, parseFile, performanceStats } from '../../services/gpx.services';
import { getCalorie } from '../../services/stats.service';
import Charts, { ChartMode } from '../Chart/Chart';
import { FILES_URL } from '../../providers/AxiosContext';

const GET_PERFORMANCE = gql`
    query performance($PerfId: ID!, $UserId: ID!) {
        performance(id: $PerfId) {
            id
            elevation
            duration
            distance
            date
            track
            hike {
                id
                name
                description
                difficulty
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

export default function Performance({ route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();
    const mapRef = useRef(null);
    const { authAxios } = useContext(AxiosContext);

    const [file, setFile] = useState(null);
    const [stats, setStats] = useState(null);

    const performanceId = route.params?.performanceId;
    const MyID = route.params?.MyID;
    const FriendPseudo = route.params?.FriendPseudo;

    const windowHeight = Dimensions.get('window').height;

    const { data, loading, error } = useQuery(GET_PERFORMANCE, {
        variables: { PerfId: performanceId, UserId: MyID },
        errorPolicy: 'all',
    });

    const hikeId = data?.performance.hike.id;

    function handleClick() {
        navigation.navigate('FocusHike', { hikeId });
    }

    async function loadTrack() {
        const res = await authAxios.get('files/tracks/' + data?.performance.track);
        if (res.status === 200) {
            return res.data;
        }
    }

    useEffect(() => {
        if (mapRef.current) {
            loadTrack().then((track) => {
                setFile(track);
                setStats(
                    performanceStats(
                        parseFile(
                            addTimeTagToGPXFile(
                                track,
                                data?.performance.duration * 1000 * 3600,
                                new Date(data?.performance.date)
                            )
                        )
                    )
                );
            });
        }
    }, [mapRef.current, data?.performance.track]);

    if (loading) {
        return <SplashScreen />;
    }

    if (error || !data.performance) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    },
                ]}
            >
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 20,
                    }}
                >
                    Une erreur est survenue
                </Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <View
                        style={{
                            marginTop: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: colors.primary,
                            padding: 20,
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.background,
                                fontSize: 20,
                            }}
                        >
                            Retour
                        </Text>
                    </View>
                </Pressable>
            </View>
        );
    }

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
                    data.performance.hike.photos && data.performance.hike.photos.length > 0
                        ? {
                            uri: `${FILES_URL}/photos/${data.performance.hike.photos[0].filename}`,
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
                                    {new Date(data.performance.date).toLocaleDateString('en-EN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'long',
                                    })}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    display: 'flex',
                                    width: '100%',
                                }}
                            >
                                <Text
                                    style={[
                                        styles.textHeader,
                                        { alignSelf: 'flex-start', maxWidth: '80%' },
                                    ]}
                                >
                                    {data.performance.hike.name}
                                </Text>
                                <TouchableWithoutFeedback
                                    onPress={handleClick}
                                    style={{ marginRHorizontal: 7 }}
                                >
                                    <Icon
                                        name="export"
                                        color={colors.primary}
                                        size={25}
                                        style={{ marginHorizontal: 7 }}
                                    />
                                </TouchableWithoutFeedback>
                            </View>
                            <Text style={[styles.textDescription]}>
                                {data.performance.hike.description}
                            </Text>
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
                                    <Text style={[styles.statHeader]}>
                                        {data.performance.duration}h
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
                                    <Text style={[styles.statHeader]}>
                                        {data.performance.distance}km
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
                                    <Text style={[styles.statHeader]}>
                                        {data.performance.elevation}m
                                    </Text>
                                    <Text style={[styles.textDescription]}>of elevation</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    height: 2,
                                    width: '100%',
                                    alignSelf: 'center',
                                    marginVertical: 10,
                                    backgroundColor: colors.empty,
                                    borderRadius: 12,
                                }}
                            />
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
                                    <Text style={[styles.statHeader]}>
                                        {Math.round(
                                            (data.performance.distance /
                                                data.performance.duration) *
                                                10
                                        ) / 10}
                                        km/h
                                    </Text>
                                    <Text style={[styles.textDescription]}>as mean speed</Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Text style={[styles.statHeader]}>
                                        {getCalorie(
                                            data?.performance?.distance,
                                            data?.performance?.elevation,
                                            data?.performance?.duration,
                                            data?.performance?.hike?.difficulty
                                        )}
                                    </Text>
                                    <Text style={[styles.textDescription]}>calories burned</Text>
                                </View>
                            </View>
                        </View>
                        {/*Track*/}
                        <View style={[styles.containerFocus]}>
                            <Text
                                style={[
                                    styles.textDescription,
                                    {
                                        marginBottom: 10,
                                    },
                                ]}
                            >
                                {FriendPseudo === '' ? 'Your' : FriendPseudo + '\'s'} Track
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <MapView
                                    style={{ width: '100%', height: 300 }}
                                    initialRegion={{
                                        latitude: 48.856614,
                                        longitude: 2.3522219,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={MAP_STYLE}
                                    panEnabled={false}
                                    scrollEnabled={false}
                                    pitchEnabled={false}
                                    zoomEnabled={false}
                                    ref={mapRef}
                                >
                                    {file && (
                                        <GpxPathLineLite
                                            fileData={file}
                                            cameraRef={mapRef}
                                            edgePadding={{
                                                top: 50,
                                                right: 50,
                                                bottom: 50,
                                                left: 50,
                                            }}
                                            animated={false}
                                        />
                                    )}
                                </MapView>
                            </View>
                        </View>
                        {/*Charts*/}
                        <View style={[styles.containerFocus]}>
                            <Text
                                style={[
                                    styles.textDescription,
                                    {
                                        marginBottom: 10,
                                    },
                                ]}
                            >
                                {FriendPseudo === '' ? 'Your' : FriendPseudo + '\'s'} Charts
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
                                        paddingHorizontal: 10,
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.header,
                                            { color: colors.primary, fontSize: 24 },
                                        ]}
                                    >
                                        Elevation
                                    </Text>
                                    <Charts
                                        absciissa={stats?.distanceDeltas}
                                        ordinate={stats?.elevationDeltas}
                                        xLen={Math.min(stats?.distanceDeltas.length, 5)}
                                        yLen={Math.min(stats?.elevationDeltas.length, 20)}
                                        title="Elevation"
                                        colors={colors}
                                        xUnit="km"
                                        yUnit="m"
                                        width={Dimensions.get('window').width - 60}
                                        xMode={ChartMode.cumulative}
                                        yMode={ChartMode.cumulative}
                                    />
                                    <Text
                                        style={[
                                            styles.header,
                                            { color: colors.primary, fontSize: 24, marginTop: 20 },
                                        ]}
                                    >
                                        Speed
                                    </Text>
                                    <Charts
                                        absciissa={stats?.distanceDeltas}
                                        ordinate={stats?.speedDeltas}
                                        xLen={Math.min(stats?.distanceDeltas.length, 5)}
                                        yLen={Math.min(stats?.speedDeltas.length, 20)}
                                        title="Elevation"
                                        colors={colors}
                                        xUnit="km"
                                        yUnit="km/h"
                                        width={Dimensions.get('window').width - 60}
                                        xMode={ChartMode.cumulative}
                                        yMode={ChartMode.average}
                                    />
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
