import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { IconComp } from '../Icon/Icon';
import { gql, useApolloClient, useQuery } from '@apollo/client';


export default function HikeInfos({ hike, borderRadius, rating=69, inProfile = false, canRate=false }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const GET_REVIEWS = gql`
        query hike($hikeId: ID!) {
            hike(id: $hikeId) {
                id
                reviewsAggregate {
                    avg {
                        rating
                    }
                }
            }
        }
    `;
    const { data, loading } = useQuery(GET_REVIEWS, {
        variables: {
            hikeId: hike.id,
        },
    });

    const [avgRatingState, setAvgRatingState] = React.useState(rating===69  ? data?.hike?.reviewsAggregate[0]?.avg?.rating || 0 : rating);
    const [canRateState, setCanRateState] = React.useState(canRate);
    async function rate(star){
        if (canRateState){
            console.log('rate', star+1);
            const ADD_REVIEW = gql `
            mutation addReview($id: String!, $rating: Float!){
                addReview(input:{
                    rating:$rating
                    hikeId:$id
                }) {
                    id
                }
                }
            `;
            setAvgRatingState(star+1);
            await client.mutate({
                mutation: ADD_REVIEW,
                variables: {
                    id: hike.id,
                    rating: star+1,
                },
                errorPolicy: 'all',
            });
            setCanRateState(false);
        }

        

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
                    width: '100%',
                }}
            >
                <Text style={[styles.textDescription, { marginLeft: 0, marginBottom: 4 }]}>
                    {hike.category.name}
                </Text>
                {!inProfile ? (
                    <TouchableWithoutFeedback onPress={() => console.log('LIKE HIKE', hike.name)}>
                        <View>
                            <IconComp color={colors.logo} name={'heartempty'} pos={0} />
                        </View>
                    </TouchableWithoutFeedback>
                ) : null}
            </View>
            <Text
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
                    {!loading &&
                        Array.from({ length: 5 }, () => 0).map((_, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={()=>rate(index)}>
                                    <View style={{backgroundColor:'#FF0000', marginRight:7}}>
                                        <IconComp
                                            color={
                                                index < avgRatingState ? colors.starFill : colors.starEmpty
                                            }
                                            name={'star'}
                                            size={22}
                                            pos={0}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    <Text
                        style={[
                            styles.textDescription,
                            {
                                color: styles.text,
                                paddingTop: 2,
                                marginLeft: 10,
                            },
                        ]}
                    >
                        See reviews
                    </Text>
                </View>
            ) : null}
        </View>
    );
}
