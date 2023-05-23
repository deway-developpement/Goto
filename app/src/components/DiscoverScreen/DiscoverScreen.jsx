import React from 'react';
import { Text, Image, View, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import Category from '../Category/Category';
import { FlatList } from 'react-native';
import HikeCreationScreen from '../HikeCreationSreen/HikeCreationSreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const stack = createNativeStackNavigator();

export default function DiscoverWrapper() {
    return (
        <stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
            <stack.Screen name="HikeCreation" component={HikeCreationScreen} />
        </stack.Navigator>
    );
}

function DiscoverScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const GET_CATEGORIES = gql`
        query categories($field: CategorySortFields!, $direction: SortDirection!) {
            categories(sorting: { field: $field, direction: $direction }) {
                id
                name
                createdAt
                defaultPhoto {
                    filename
                }
            }
        }
    `;

    const { data: categorie } = useQuery(GET_CATEGORIES, {
        variables: {
            field: 'id',
            direction: 'ASC',
        },
    });

    const categoryNameId = [];
    categorie?.categories.map((category) => {
        categoryNameId.push({ id: category.id, name: category.name });
    });

    const windowHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={categorie?.categories}
                renderItem={({ item }) => (
                    <Category key={item.id} styles={styles} horizontal={false} {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                emptyListComponent={<Text style={styles.textLink}>No categories</Text>}
                ListHeaderComponent={
                    <DiscoverHeader windowHeight={windowHeight} navigation={navigation} />
                }
                ListFooterComponent={
                    <View
                        style={{
                            height: windowHeight * 0.2,
                        }}
                    />
                }
                style={[styles.container, { paddingHorizontal: '7%' }]}
                keyboardShouldPersistTaps={'handled'}
            />
        </SafeAreaView>
    );
}

function DiscoverHeader({ windowHeight, navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const GET_POPULAR_IMAGE = gql`
        query {
            getHikePopular(limit: 1) {
                edges {
                    node {
                        photos {
                            filename
                        }
                    }
                }
            }
        }
    `;

    const { data: popularImage } = useQuery(GET_POPULAR_IMAGE);

    return (
        <View style={styles.container}>
            <Text style={[styles.textHeader, { marginTop: '6%' }]}>Discover</Text>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('HikeCreation')}>
                <View
                    style={[
                        styles.container,
                        {
                            flexDirection: 'row',
                            marginLeft: '4%',
                            marginTop: 20,
                        },
                    ]}
                >
                    <IconComp color={colors.logo} name={'plus'} />
                    <Text
                        style={[
                            styles.textLink,
                            {
                                textDecorationLine: '',
                                marginLeft: '5%',
                                alignSelf: 'center',
                            },
                        ]}
                    >
                        Add a hike
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            <ScrollView
                style={[styles.container, { marginBottom: 40 }]}
                keyboardShouldPersistTaps={'handled'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <Category styles={styles} horizontal={true} name={'Around you'} id={'around-you'} />
                <Category
                    styles={styles}
                    horizontal={true}
                    name={'Added this month'}
                    id={'added-this-month'}
                />
                <Category styles={styles} horizontal={true} name={'To redo'} id={'to-redo'} />
            </ScrollView>
            <TouchableWithoutFeedback
                onPress={() => {
                    console.log('DISCORVER');
                    navigation.navigate('Search', {
                        category: 'Popular',
                    });
                }}
            >
                <View>
                    <Image
                        source={
                            popularImage?.getHikePopular?.edges[0]?.node.photos[0]?.filename
                                ? {
                                    uri: `https://deway.fr/goto-api/files/photos/${popularImage?.getHikePopular?.edges[0]?.node?.photos[0]?.filename}`,
                                }
                                : require('../../../assets/images/Dalle_background.png')
                        }
                        style={[
                            {
                                width: '100%',
                                height: windowHeight * 0.5,
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                            },
                        ]}
                    />
                    <View
                        style={[
                            styles.container,
                            {
                                paddingBottom: '5%',
                                borderBottomRightRadius: 12,
                                borderBottomLeftRadius: 12,
                                backgroundColor: colors.backgroundTextInput,
                            },
                        ]}
                    >
                        <Text style={[styles.textHeader, { alignSelf: 'center' }]}>
                            Most popular
                        </Text>
                        <Text style={[styles.textLink, { alignSelf: 'center', marginTop: 5 }]}>
                            {' '}
                            Discover{' '}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Text style={[styles.textHeader, { marginTop: 40 }]}>Unique places</Text>
        </View>
    );
}
