// basic component for the table focus
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { Icon } from '../Icon/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import Hike from '../Hike/Hike';
import { FlatList } from 'react-native';

const QUERY_TABLE = gql`
    query table($id: ID!) {
        table(id: $id) {
            id
            name
            hikes {
                id
            }
        }
    }
`;

export default function TableFocus({ navigation, route }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const { table } = route.params;

    const { data } = useQuery(QUERY_TABLE, {
        variables: {
            id: table.id,
        },
    });

    return (
        <View style={[styles.container, { paddingHorizontal: 16 }]}>
            <SafeAreaView style={styles.container}>
                <Pressable onPress={() => navigation.goBack()} style={{ zIndex: 100 }}>
                    <View style={[styles.logoContainer, { position: 'absolute' }]}>
                        <Icon name="back" size={30} color={colors.background} />
                    </View>
                </Pressable>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        paddingHorizontal: '25%',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 36,
                            color: colors.text,
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        {table.name}
                    </Text>
                </View>
                <View
                    style={{
                        marginTop: 15,
                    }}
                >
                    <FlatList
                        data={data?.table?.hikes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <Hike id={item.id} />}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: 200 }} />}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
