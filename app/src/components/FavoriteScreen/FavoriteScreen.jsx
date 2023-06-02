import React, {useEffect,useState} from 'react';
import { SafeAreaView, Text, View,TouchableWithoutFeedback,Modal,TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { FlatList } from 'react-native-gesture-handler';
import Hike from '../Hike/Hike';
import { useIsFocused } from '@react-navigation/native';
import { IconComp, Icon } from '../Icon/Icon';
import { Button } from 'react-native-elements';
import Table from './Table';
import { BlurView } from 'expo-blur';

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
    const [modalVisible, setModalVisible] = useState('');
    const [name, setName] = useState('');
    const client = useApolloClient();

    const ADD_TABLE = gql`
        mutation createTable($name: String!) {
            createTable(input: { name: $name}) {
                id
            }
        }
    `;

    async function create_table() {
        await client.mutate({
            mutation: ADD_TABLE,
            variables: {
                name: name,
            },
            errorPolicy: 'all',
        });
        //refetch();
        setModalVisible('');
        setName('');
    }

    const WHOAMI = gql`
    query whoami{
            whoami{
                tables(sorting: { field: createdAt, direction: DESC }) {
                    id
                    name
                    createdAt
                    hikes {
                        id
                        name
                        photos {
                            filename
                        }
                    }
                }
            }
        }
    `;

    const [nbrTable, setNbrTable] = useState(0);

    useEffect(() => {
        if (!loading && modalVisible!='create') {
            for (let i = 0; i < data?.whoami?.tables?.length; i++) {
                if (data?.whoami?.tables[i].id == modalVisible) {
                    setNbrTable(i);
                }
            }
        }
    }, [modalVisible]);

    const {
        data,
        loading,
    } = useQuery(WHOAMI);
    console.log(data?.whoami?.tables[nbrTable]?.length);
    
    return(
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end' }}>
                <TouchableWithoutFeedback onPress={() => setModalVisible('create')}>
                    <View
                        style={[
                            styles.container,
                            {
                                flexDirection: 'row',
                                marginTop: 20,
                            },
                        ]}
                    >
                        <IconComp color={colors.primary} name={'plus'} />
                        <Text
                            style={[
                                styles.textLink,
                                {
                                    textDecorationLine: 'none',
                                    marginLeft: '5%',
                                    alignSelf: 'center',
                                },
                            ]}
                        >
                            Add a hike
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {!loading && 
                <FlatList
                    data={data?.whoami?.tables}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Table t={item} setModal={setModalVisible}/>
                    )}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible!='' && modalVisible!='create'}
                onRequestClose={() => {
                    setModalVisible('');
                }}
            >
                <BlurView
                    style={{flex:1, position:'absolute', top:0, left:0, width:'100%', height:'100%'}}
                    intensity={50}
                    tint="dark"
                />
                <View style={styles.modalView}>
                    <Icon
                        name="cross"
                        size={17}
                        style={styles.closeIcon}
                        onPress={() => setModalVisible('')}
                    />
                    <View
                        style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderRadius: 15,
                            marginTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        { !loading && 
                            <Text style={styles.textHeader}>{data?.whoami?.tables[nbrTable]?.name}</Text>
                        }
                        {
                            !loading && data?.whoami?.tables[nbrTable]?.hikes?.length>0 &&
                            <FlatList
                                data={data?.whoami?.tables[nbrTable]?.hikes}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <Hike id={item.id} />}
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                ListFooterComponent={<View style={{ height: 100 }} />}
                            />
                        }
                        
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible=='create'}
                onRequestClose={() => {
                    setModalVisible('');
                }}
            >
                <View style={styles.modalView}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={styles.modalText}>Name of your Table</Text>
                        <Icon
                            name="cross"
                            size={17}
                            style={styles.closeIcon}
                            onPress={() => setModalVisible('')}
                        />
                    </View>
                    <Text style={styles.textLoginMiddle}>Adress email</Text>
                    <TextInput
                        textContentType="username"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Table name"
                        placeholderTextColor={colors.border}
                        style={styles.textInput}
                        onSubmitEditing={() => create_table()}
                        onChangeText={(text) => setName(text)}
                        value={name}
                    />
                    <View style={styles.btnContainer}>
                        <Button
                            buttonStyle={[
                                styles.btn,
                                { width: 100 },
                            ]}
                            titleStyle={styles.btnText}
                            disabled={
                                name == ''
                            }
                            title={'Submit'}
                            onPress={() =>
                                create_table()
                            }
                        />
                    </View>
                </View>
            </Modal>
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