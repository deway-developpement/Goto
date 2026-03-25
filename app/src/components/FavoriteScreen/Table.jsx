import React from 'react';
import { View, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import stylesheet from './style';
import HikeMediaPreview from '../Hike/HikeMediaPreview';

function Little({ t, i, colors, left }) {
    return t?.hikes[i] ? (
        <HikeMediaPreview
            photoFilename={t.hikes[i].photos[0]?.filename}
            trackFilename={t.hikes[i].track}
            style={{
                height: '100%',
                width: '50%',
                borderRadius: 15,
                marginBottom: 10,
                marginLeft: left,
            }}
        />
    ) : (
        <View
            style={{
                height: '100%',
                width: '50%',
                backgroundColor: colors.ligthLine,
                borderRadius: 15,
                marginBottom: 10,
                marginLeft: left,
            }}
        />
    );
}

export default function Table({ table }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const height = Dimensions.get('screen').height;

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.navigate('TableFocus', { table: table });
            }}
        >
            <View
                style={{
                    padding: 30,
                    backgroundColor: colors.backgroundSecondary,
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 20,
                    borderRadius: 15,
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    {table?.hikes[0] ? (
                        <HikeMediaPreview
                            photoFilename={table.hikes[0].photos[0]?.filename}
                            trackFilename={table.hikes[0].track}
                            style={{ height: height * 0.25, width: '40%', borderRadius: 15 }}
                        />
                    ) : (
                        <View
                            style={{
                                height: height * 0.25,
                                width: '40%',
                                backgroundColor: colors.ligthLine,
                                borderRadius: 15,
                            }}
                        />
                    )}
                    <View style={{ flexDirection: 'column', flex: 1, marginLeft: 20 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-evenly',
                                marginBottom: 10,
                            }}
                        >
                            <Little t={table} i={1} colors={colors} left={0} />
                            <Little t={table} i={2} colors={colors} left={20} />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <Little t={table} i={3} colors={colors} left={0} />
                            <Little t={table} i={4} colors={colors} left={20} />
                        </View>
                    </View>
                </View>
                <Text style={[styles.textHeader, { paddingTop: 0 }]}>{table.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}
