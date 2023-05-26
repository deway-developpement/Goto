import React, { useContext, useEffect, useState } from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { IconComp } from '../Icon/Icon';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Share } from 'react-native';
import { AxiosContext } from '../../providers/AxiosContext';
import { Buffer } from 'buffer';

const WHOAMI = gql`
    query whoami($hikeID: ID) {
        whoami {
            id
            reviews(filter: { hike: { id: { eq: $hikeID } } }) {
                rating
            }
        }
    }
`;

const GET_REVIEWS = gql`
    query hike($hikeId: ID!) {
        hike(id: $hikeId) {
            id
            reviewsAggregate {
                avg {
                    rating
                }
            }
            track
        }
    }
`;

const ADD_REVIEW = gql`
    mutation addReview($id: String!, $rating: Float!) {
        addReview(input: { rating: $rating, hikeId: $id }) {
            id
        }
    }
`;

export default function HikeInfos({ hike, borderRadius, inProfile = false }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();
    const { authAxios } = useContext(AxiosContext);

    const { data: dataReview, refetch } = useQuery(WHOAMI, {
        variables: {
            hikeID: hike.id,
        },
    });

    const { data: dataAvg } = useQuery(GET_REVIEWS, {
        variables: {
            hikeId: hike.id,
        },
    });

    const StarsMode = Object.freeze({
        average: true,
        reviewed: false,
    });

    const [starsMode, setStarsMode] = useState(StarsMode.average);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        setStarsMode(
            dataReview?.whoami?.reviews.length > 0 ? StarsMode.reviewed : StarsMode.average
        );
    }, [dataReview]);

    useEffect(() => {
        switch (starsMode) {
        case StarsMode.average: {
            let rate =
                    Math.round(dataAvg?.hike.reviewsAggregate[0]?.avg.rating + Number.EPSILON) || 0;
            setRating(rate);
            break;
        }
        case StarsMode.reviewed: {
            let rate = Math.round(dataReview.whoami.reviews[0].rating + Number.EPSILON);
            setRating(rate);
            break;
        }
        }
    }, [dataAvg, dataReview, starsMode]);

    async function rate(star) {
        if (starsMode !== StarsMode.reviewed) {
            await client.mutate({
                mutation: ADD_REVIEW,
                variables: {
                    id: hike.id,
                    rating: star + 1,
                },
                errorPolicy: 'all',
            });
            refetch();
        }
    }

    async function share(filename) {
        //     // read content of file to base64
        //     const res = await authAxios.get('files/tracks/' + filename);
        //     const fileData = res.data;
        //     const base64Data = Buffer.from(fileData, 'ascii').toString('base64');

        //     const base64 = 'data:application/gpx+xml;base64,' + base64Data;

        Share.share({
            title: hike.name,
            url: 'https://deway.fr/goto-api/files/tracks/' + filename,
        });
    }

    return (
        <View
            style={[
                styles.containerFocus,
                { marginTop: 0 },
                borderRadius ? { borderRadius: 12 } : {},
                inProfile
                    ? {
                        width: 190,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                    }
                    : {},
            ]}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                }}
            >
                <Text style={[styles.textDescription, { marginLeft: 0, marginBottom: 4 }]}>
                    {hike.category.name}
                </Text>
                {!inProfile ? (
                    <View
                        style={{
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => share(dataAvg.hike.track)}>
                            <View>
                                <IconComp color={colors.primary} name={'share'} pos={0} size={18} />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ width: 10 }} />
                        <TouchableWithoutFeedback
                            onPress={() => console.log('LIKE HIKE', hike.name)}
                        >
                            <View>
                                <IconComp
                                    color={colors.primary}
                                    name={'heartempty'}
                                    pos={0}
                                    size={18}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                ) : null}
            </View>
            <Text
                numberOfLines={2}
                style={[
                    styles.textHeader,
                    {
                        alignSelf: 'flex-start',
                        paddingLeft: 0,
                        marginTop: 0,
                        paddingTop: 0,
                    },
                ]}
            >
                {hike.name}
            </Text>
            <Text
                numberOfLines={3}
                style={[
                    styles.textDescription,
                    { alignSelf: 'flex-start', marginTop: 8, paddingBottom: 8 },
                ]}
            >
                {hike.description}
            </Text>
            {!inProfile ? (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        marginTop: 8,
                    }}
                >
                    {Array.from({ length: 5 }, () => 0).map((_, index) => {
                        return (
                            <TouchableWithoutFeedback key={index} onPress={() => rate(index)}>
                                <View style={{ marginRight: 7 }}>
                                    <IconComp
                                        color={
                                            index < rating
                                                ? starsMode === StarsMode.reviewed
                                                    ? colors.text
                                                    : colors.filled
                                                : colors.empty
                                        }
                                        name={'star'}
                                        size={22}
                                        pos={0}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
}
