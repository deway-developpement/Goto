import React, { useContext } from 'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { LocationContext } from '../../providers/LocationProvider';
import { FILES_URL } from '../../providers/AxiosContext';

const GET_IMAGE_CATEGORIES = (categoryName, location) => {
    if (categoryName == 'Around you') {
        if (!location?.coords) {
            return null;
        }
        return {
            query: gql`
                query getHikeAround($lat: Float!, $lon: Float!) {
                    hikes: getHikeAround(lat: $lat, lon: $lon, distance: 50, limit: 1) {
                        edges {
                            node {
                                photos {
                                    filename
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                lat: location?.coords.latitude,
                lon: location?.coords.longitude,
            },
        };
    }
    if (categoryName == 'Added this month') {
        const today = new Date();
        const thismonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return {
            query: gql`
                query hikes($filter: HikeFilter, $limit: Int) {
                    hikes(
                        filter: $filter
                        paging: { first: $limit }
                        sorting: { field: id, direction: DESC }
                    ) {
                        edges {
                            node {
                                photos {
                                    filename
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                filter: {
                    createdAt: {
                        gt: thismonth,
                    },
                },
                limit: 1,
            },
        };
    }
    if (categoryName == 'To redo') {
        return {
            query: gql`
                query {
                    hikes: getHikeAlreadyDone(limit: 1) {
                        edges {
                            node {
                                photos {
                                    filename
                                }
                            }
                        }
                    }
                }
            `,
            variables: {},
        };
    } else {
        return null;
    }
};

export default function Category(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const windowWidth = Dimensions.get('window').width;

    const { location } = useContext(LocationContext);

    function handleClickCategory(category, categoryName) {
        navigation.navigate('Search', {
            category: categoryName,
        });
    }

    if (GET_IMAGE_CATEGORIES(props.name, location) !== null) {
        var { data: imageCategory } = useQuery(GET_IMAGE_CATEGORIES(props.name, location).query, {
            variables: GET_IMAGE_CATEGORIES(props.name, location).variables,
        });
    }

    return (
        <TouchableWithoutFeedback onPress={() => handleClickCategory(props.id, props.name)}>
            <View
                style={[
                    styles.container,
                    {
                        flexDirection: 'row',
                        marginTop: 20,
                        marginRight: 40,
                        paddingRight: 40,
                        backgroundColor: colors.backgroundSecondary,
                        borderRadius: 12,
                    },
                    props.horizontal ? { width: windowWidth * 0.7 } : {},
                ]}
            >
                <Image
                    source={
                        props.defaultPhoto
                            ? {
                                uri: `${FILES_URL}/photos/${props.defaultPhoto.filename}`,
                            }
                            : imageCategory?.hikes?.edges[0]?.node.photos[0]?.filename
                                ? {
                                    uri: `${FILES_URL}/photos/${imageCategory?.hikes?.edges[0]?.node.photos[0]?.filename}`,
                                }
                                : require('../../../assets/images/Dalle_background.png')
                    }
                    style={[
                        {
                            height: windowWidth * 0.2,
                            width: windowWidth * 0.2,
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                            marginRight: 17,
                        },
                    ]}
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        width: windowWidth * 0.5,
                        height: windowWidth * 0.2,
                        borderBottomRightRadius: 12,
                        borderTopRightRadius: 12,
                    }}
                >
                    <Text style={[styles.textHeader, { marginLeft: 0, fontSize: 20 }]}>
                        {props.name}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
