import React, {useEffect} from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';
import { FlatList } from 'react-native-gesture-handler';
import Hike from '../Hike/Hike';
import { useIsFocused } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function Scroll(){
    const WHOAMI = gql`
    query whoami($limit: Int, $cursor: ConnectionCursor) {
            whoami{
                likes (paging: { first: $limit, after: $cursor },sorting: { field: id, direction: DESC }) {
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
        }
    `;
    var limit=2;
    var cursor='';
    const {
        data,
        loading,
        fetchMore,
        refetch,
    } = useQuery(WHOAMI, {
        variables: {
            limit: limit,
            cursor: cursor,
        },
    });
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    let onEndReachedCalledDuringMomentum = false;
    const nodes = data?.whoami?.likes.edges.map((hike) => hike.node);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            refetch();
        }
    }, [isFocused]);

    return(
        <FlatList
            data={nodes}
            extraData={data?.whoami?.likes.edges}
            renderItem={({ item }) => <Hike id={item.id} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            emptyListComponent={<Text style={styles.textLink}>No hikes</Text>}
            ListFooterComponent={<View style={{ height: 100 }} />}
            style={[styles.container, { paddingHorizontal: '7%' }]}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
                if (
                    data?.whoami?.likes?.pageInfo?.hasNextPage &&
                    !loading &&
                    !onEndReachedCalledDuringMomentum
                ) {
                    fetchMore({
                        variables: {
                            cursor: data?.whoami?.likes?.pageInfo?.endCursor,
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
    );
}

function List(){
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    return(
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Text>List</Text>
        </View>
    );
}

export default function FavoritesScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    return (
        <View style={{flex:1, paddingHorizontal:'7%'}}>
            <SafeAreaView />
            <View style={{marginHorizontal:'4%'}}>
                <Text style={[styles.textHeader, {marginTop:'10%'}]}>Your hikes</Text>
                <Text style={styles.textSubHeader}>List of your liked hikes</Text>
            </View>
            <Tab.Navigator  screenOptions={{tabBarContentContainerStyle:{
                backgroundColor:colors.background,
                marginBottom:5
            },tabBarIndicatorContainerStyle:{
                backgroundColor:colors.lineSecondary,
            },
            tabBarIndicatorStyle:
            {
                backgroundColor:colors.filled, 
                height:5,
            },tabBarStyle:{
                shadowColor:colors.background,
                margin:'4%',
                backgroundColor:colors.background,
            },tabBarLabelStyle :[styles.textSubHeader, {fontSize:16}]}}>
                <Tab.Screen name="Scroll" component={Scroll} />
                <Tab.Screen name="List" component={List} />
            </Tab.Navigator>
        </View>
    );
}