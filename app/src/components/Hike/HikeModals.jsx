import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { gql, useApolloClient } from '@apollo/client';
import { BlurView } from 'expo-blur';
import { FlatList } from 'react-native';
import { Pressable } from 'react-native';
import { Dimensions } from 'react-native';
import { Icon } from '../Icon/Icon';

const ADD_HIKE_TO_TABLE = gql`
    mutation addHikeToTable($tableId: String!, $hikeId: String!) {
        addHikeToTable(tableId: $tableId, hikeId: $hikeId) {
            id
        }
    }
`;

export default function HikeModal({ setModalVisible, tables, hikeId }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const height = Dimensions.get('window').height;

    async function handleClickTable(tableId) {
        if (tableId === null) {
            return;
        }
        const res = await client.mutate({
            mutation: ADD_HIKE_TO_TABLE,
            variables: {
                tableId: tableId,
                hikeId: hikeId,
            },
            errorPolicy: 'all',
            refetchQueries: ['whoami'],
        });
        if (res && res.data && res.data.addHikeToTable && res.data.addHikeToTable.id) {
            setModalVisible(false);
        } else {
            alert('An error occured.');
        }
    }

    return (
        <>
            <BlurView
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                intensity={50}
                tint="dark"
            />
            <View style={styles.modalView}>
                <Icon
                    name="cross"
                    size={17}
                    style={[styles.closeIcon, { alignSelf: 'flex-end' }]}
                    onPress={() => setModalVisible(false)}
                />
                <View
                    style={{
                        backgroundColor: colors.backgroundSecondary,
                        borderRadius: 15,
                        marginTop: 15,
                        paddingHorizontal: 15,
                    }}
                >
                    <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>
                        Select a table
                    </Text>
                    <FlatList
                        data={tables || []}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    marginBottom: 15,
                                    backgroundColor: colors.background,
                                }}
                            >
                                <Pressable onPress={() => handleClickTable(item.id)}>
                                    <Text
                                        style={[
                                            styles.textLoginMiddle,
                                            {
                                                marginRight: 30,
                                                paddingVertical: 15,
                                                textAlign: 'center',
                                                width: '100%',
                                                color: colors.border,
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 15,
                                }}
                            >
                                <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>
                                    No table.
                                </Text>
                            </View>
                        }
                        showsHorizontalScrollIndicator={false}
                        style={{
                            maxHeight: height - 200,
                        }}
                    />
                </View>
            </View>
        </>
    );
}
