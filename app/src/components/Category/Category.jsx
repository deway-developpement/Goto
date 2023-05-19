import React from 'react';
import { Text, Image, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';

const GET_IMAGE_CATEGORIES = (categoryName) => {
    if (categoryName == 'Around you') {
        return {
            query: gql`
                query {
                    hikes: getHikeAround(lat: 1, lon: 1, distance: 50, limit: 1) {
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
    }
    if (categoryName == 'Added this month') {
        const today = new Date();
        const thismonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return {
            query: gql`
                query hikes($filter: HikeFilter, $limit: Int) {
                    hikes(filter: $filter, paging: { first: $limit }) {
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
                        lt: thismonth,
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

    function handleClickCategory(category, categoryName) {
        navigation.navigate('Search', {
            category: categoryName,
        });
    }

    if (GET_IMAGE_CATEGORIES(props.name) !== null) {
        var { data: imageCategory } = useQuery(GET_IMAGE_CATEGORIES(props.name).query, {
            variables: GET_IMAGE_CATEGORIES(props.name).variables,
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
                        backgroundColor: colors.backgroundTextInput,
                        borderRadius: 12,
                    },
                    props.horizontal ? { width: windowWidth * 0.7 } : {},
                ]}
            >
                <Image
                    source={
                        props.defaultPhoto
                            ? {
                                uri: `https://deway.fr/goto-api/files/photos/${props.defaultPhoto.filename}`,
                            }
                            : imageCategory?.hikes?.edges[0]?.node.photos[0]?.filename
                                ? {
                                    uri: `https://deway.fr/goto-api/files/photos/${imageCategory?.hikes?.edges[0]?.node.photos[0]?.filename}`,
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
