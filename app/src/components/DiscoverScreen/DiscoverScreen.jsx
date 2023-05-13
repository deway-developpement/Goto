import React from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import Category from '../Category/Category';
import { FlatList } from 'react-native';

export default function DiscoverScreen() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const GET_CATEGORIES = gql`
        query categories(
            $field: CategorySortFields!
            $direction: SortDirection!
        ) {
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

    const windowHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={categorie?.categories}
                renderItem={({ item }) => (
                    <Category
                        key={item.id}
                        styles={styles}
                        horizontal={false}
                        {...item}
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                emptyListComponent={
                    <Text style={styles.textLink}>No categories</Text>
                }
                ListHeaderComponent={
                    <DiscoverHeader windowHeight={windowHeight} />
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

function DiscoverHeader({ windowHeight }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    return (
        <View style={styles.container}>
            <Text style={[styles.textHeader, { marginTop: '6%' }]}>
                Discover
            </Text>
            <TouchableWithoutFeedback onPress={() => console.log('DISCORVER')}>
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
                <Category
                    styles={styles}
                    horizontal={true}
                    name={'Around you'}
                    id={'around-you'}
                />
                <Category
                    styles={styles}
                    horizontal={true}
                    name={'Added this month'}
                    id={'added-this-month'}
                />
                <Category
                    styles={styles}
                    horizontal={true}
                    name={'To redo'}
                    id={'to-redo'}
                />
            </ScrollView>
            <Image
                source={require('../../../assets/images/Dalle_background.png')}
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
                <Text
                    style={[
                        styles.textLink,
                        { alignSelf: 'center', marginTop: 5 },
                    ]}
                >
                    Discover
                </Text>
            </View>
            <Text style={[styles.textHeader, { marginTop: 40 }]}>
                Unique places
            </Text>
        </View>
    );
}
