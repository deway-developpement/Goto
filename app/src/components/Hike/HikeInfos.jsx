import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';

export default function HikeInfos({ hike, borderRadius }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

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

    const avgRating = data?.hike?.reviewsAggregate[0]?.avg?.rating || 0;

    return (
        <View
            style={[
                styles.containerFocus,
                { marginTop: 0 },
                borderRadius ? { borderRadius: 12 } : {},
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
                <Text style={[styles.textDescription, { marginLeft: 0 }]}>
                    {hike.category.name}
                </Text>
                <TouchableWithoutFeedback
                    onPress={() => console.log('LIKE HIKE', hike.name)}
                >
                    <View>
                        <IconComp color={colors.logo} name={'heart'} pos={0} />
                        <IconComp
                            color={colors.backgroundTextInput}
                            name={'heart'}
                            size={22}
                            pos={4.7}
                        />
                    </View>
                </TouchableWithoutFeedback>
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
                            <IconComp
                                color={
                                    index < avgRating - 1
                                        ? colors.starFill
                                        : colors.starEmpty
                                }
                                key={index}
                                name={'star'}
                                marginRight={7}
                                size={22}
                            />
                        );
                    })}
                <Text
                    style={[
                        styles.textDescription,
                        { color: styles.text, paddingTop: 2, marginLeft: 10 },
                    ]}
                >
                    See reviews
                </Text>
            </View>
        </View>
    );
}
