import React from 'react';
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

export default function Search({ route, navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const GET_HIKES = gql`
        query hikes($filter: HikeFilter) {
            hikes(filter: $filter) {
                id
            }
        }
    `;

    const { data } = useQuery(
        GET_HIKES,
        route.params?.category && {
            variables: {
                filter: {
                    category: {
                        name: {
                            eq: route.params?.category,
                        },
                    },
                },
            },
        }
    );

    function handleTextInput() {}

    function removeFilter() {
        route.params?.category && navigation.navigate('Search');
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={data?.hikes}
                renderItem={({ item }) => <Hike id={item.id} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                emptyListComponent={
                    <Text style={styles.textLink}>No hikes</Text>
                }
                ListHeaderComponent={
                    <>
                        <View
                            style={[
                                styles.textInputContainer,
                                { marginTop: 28 },
                            ]}
                        >
                            <TextInput
                                placeholder="search"
                                autoCorrect={false}
                                autoCapitalize="none"
                                placeholderTextColor={colors.border}
                                style={[styles.textInput, { width: '90%' }]}
                                onSubmitEditing={() => handleTextInput()}
                            />
                            <IconComp
                                color={colors.border}
                                name={'search'}
                                size={24}
                            />
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
                                    <TouchableWithoutFeedback
                                        onPress={() => removeFilter()}
                                    >
                                        <View>
                                            <IconComp
                                                color={colors.logo}
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
            />
        </SafeAreaView>
    );
}
