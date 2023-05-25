import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { IconComp } from '../Icon/Icon';
import { gql, useApolloClient, useQuery } from '@apollo/client';


export default function HikeInfos({ hike, borderRadius, inProfile = false, inSearch}) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const WHOAMI = gql `
        query whoami($hikeID:ID) {
            whoami {
                reviews(filter:{hike:{id:{eq:$hikeID}}}){
                    rating
                }
            }
        }
    `;
    //rating={(DataReview?.whoami?.reviews.length>0 && DataReview?.whoami?.reviews[0]?.rating) || 0} canRate={DataReview?.whoami?.reviews.length>0 && DataReview?.whoami?.reviews[0]?.rating ? false : true
    const { 
        data:DataReview, 
        loading:loadingReview 
    } = useQuery(WHOAMI, {
        variables: {
            hikeID: hike.id,
        },
    });

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
    const [avgRatingState, setAvgRatingState] = React.useState(0);    
    const [canRateState, setCanRateState] = React.useState(true);
    
    React.useEffect(() => {
        if(!loading && avgRatingState!=data?.hike?.reviewsAggregate[0]?.avg?.rating && (!canRateState || inSearch)){
            setAvgRatingState(data?.hike?.reviewsAggregate[0]?.avg?.rating);
        }
    }, [loading]);
    
    React.useEffect(() => {
        if (!inSearch && !loadingReview && DataReview?.whoami?.reviews.length>0 && DataReview?.whoami?.reviews[0]?.rating){
            setCanRateState(false);
            setAvgRatingState(DataReview?.whoami?.reviews[0]?.rating);
        }
    }, [loadingReview]);

    async function rate(star){
        if (!inSearch && canRateState){
            setCanRateState(false);
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
                                    <View style={{marginRight:7}}>
                                        <IconComp
                                            color={
                                                index < avgRatingState ? ((inSearch || canRateState) ? colors.starFill : colors.logo) : colors.starEmpty
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
