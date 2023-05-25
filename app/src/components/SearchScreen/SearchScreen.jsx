import React, { useContext, useRef } from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';
import Hike from '../Hike/Hike';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import { IconComp } from '../Icon/Icon';
import { LocationContext } from '../../providers/LocationProvider';

const GET_HIKES_AROUND_ME = gql`
    query hikes($lon: Float!, $lat: Float!, $limit: Int!, $cursor: String, $search: String) {
        hikes: getHikeAround(
            lon: $lon
            lat: $lat
            distance: 69
            limit: $limit
            cursor: $cursor
            search: $search
        ) {
            edges {
                node {
                    id
                }
            }
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

const GET_HIKES_POPULAR = gql`
    query hikes($limit: Int!, $cursor: String, $search: String) {
        hikes: getHikePopular(limit: $limit, cursor: $cursor, search: $search) {
            edges {
                node {
                    id
                }
            }
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

const GET_HIKES_ALREADY_DONE = gql`
    query hikes($limit: Int!, $cursor: String, $search: String) {
        hikes: getHikeAlreadyDone(limit: $limit, cursor: $cursor, search: $search) {
            edges {
                node {
                    id
                }
            }
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

const GET_HIKES = gql`
    query hikes($filter: HikeFilter, $limit: Int, $cursor: ConnectionCursor) {
        hikes(
            filter: $filter
            paging: { first: $limit, after: $cursor }
            sorting: { field: id, direction: DESC }
        ) {
            edges {
                node {
                    id
                }
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

export const QUERIES_CONFIG = (category, search, cursor, limit, location) => {
    if (category === 'Around you' && location?.coords) {
        return {
            query: GET_HIKES_AROUND_ME,
            variables: {
                limit: limit,
                cursor: cursor,
                lon: location?.coords.longitude,
                lat: location?.coords.latitude,
            },
            variablesSearch: {
                search: search.split(' ').join('%') + '%',
                limit: limit,
                cursor: cursor,
                lon: location?.coords.longitude,
                lat: location?.coords.latitude,
            },
        };
    }
    if (category === 'Added this month') {
        const today = new Date();
        const thismonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return {
            query: GET_HIKES,
            variables: {
                filter: {
                    createdAt: {
                        gt: thismonth,
                    },
                },
                limit: limit,
                cursor: cursor,
            },
            variablesSearch: {
                filter: {
                    name: {
                        like: search.split(' ').join('%') + '%',
                    },
                    createdAt: {
                        gt: thismonth,
                    },
                },
                limit: limit,
                cursor: cursor,
            },
        };
    }
    if (category === 'Popular') {
        return {
            query: GET_HIKES_POPULAR,
            variables: {
                limit: limit,
                cursor: cursor,
            },
            variablesSearch: {
                search: search.split(' ').join('%') + '%',
                limit: limit,
                cursor: cursor,
            },
        };
    }
    if (category === 'To redo') {
        return {
            query: GET_HIKES_ALREADY_DONE,
            variables: {
                limit: limit,
                cursor: cursor,
            },
            variablesSearch: {
                search: search.split(' ').join('%') + '%',
                limit: limit,
                cursor: cursor,
            },
        };
    }
    return {
        query: GET_HIKES,
        variables: {
            filter: {
                category: {
                    name: {
                        eq: category,
                    },
                },
            },
            limit: limit,
            cursor: cursor,
        },
        variablesSearch: {
            filter: {
                name: {
                    like: search.split(' ').join('%') + '%',
                },
                category: {
                    name: {
                        eq: category,
                    },
                },
            },
            limit: limit,
            cursor: cursor,
        },
    };
};

export default function SearchScreen({ route, navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const searchBarRef = useRef(null);

    const limitByPage = 2;
    const { location } = useContext(LocationContext);

    const CONFIG = QUERIES_CONFIG(route.params?.category, '', '', limitByPage, location);

    const { data, loading, fetchMore, refetch } = useQuery(CONFIG.query, {
        variables: CONFIG.variables,
    });

    const nodes = data?.hikes?.edges.map((hike) => hike.node);

    function removeFilter() {
        route.params?.category && navigation.navigate('Search');
        searchBarRef.current.clear();
    }

    function handleSearch(text) {
        const CONFIG = QUERIES_CONFIG(route.params?.category, text, '', limitByPage, location);
        refetch(CONFIG.variablesSearch);
    }

    let onEndReachedCalledDuringMomentum = false;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={nodes}
                extraData={data?.hikes.edges}
                renderItem={({ item }) => <Hike id={item.id} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                emptyListComponent={<Text style={styles.textLink}>No hikes</Text>}
                ListHeaderComponent={
                    <>
                        <View style={[styles.textInputContainer, { marginTop: 28 }]}>
                            <TextInput
                                placeholder="Search"
                                autoCorrect={false}
                                autoCapitalize="none"
                                placeholderTextColor={colors.border}
                                style={[styles.textInput, { width: '90%' }]}
                                onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
                                ref={searchBarRef}
                            />
                            <IconComp color={colors.border} name={'search'} size={24} />
                        </View>
                        {route?.params?.category && (
                            <>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 20,
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={[styles.textHeader]}>
                                        {route?.params?.category}
                                    </Text>
                                    <TouchableWithoutFeedback onPress={() => removeFilter()}>
                                        <View>
                                            <IconComp
                                                color={colors.primary}
                                                name={'filter'}
                                                pos={0}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </>
                        )}
                    </>
                }
                ListFooterComponent={<View style={{ height: 100 }} />}
                style={[styles.container, { paddingHorizontal: '7%' }]}
                onEndReachedThreshold={0.2}
                onEndReached={() => {
                    if (
                        data?.hikes?.pageInfo?.hasNextPage &&
                        !loading &&
                        !onEndReachedCalledDuringMomentum
                    ) {
                        fetchMore({
                            variables: {
                                cursor: data?.hikes?.pageInfo?.endCursor,
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) {
                                    return prev;
                                }
                                return {
                                    hikes: {
                                        __typename: prev.hikes.__typename,
                                        edges: [
                                            ...prev.hikes.edges,
                                            ...fetchMoreResult.hikes.edges,
                                        ],
                                        pageInfo: {
                                            ...fetchMoreResult.hikes.pageInfo,
                                        },
                                    },
                                };
                            },
                        });
                    }
                    onEndReachedCalledDuringMomentum = true;
                }}
                onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum = false;
                }}
            />
        </SafeAreaView>
    );
}
