import React from 'react';
import { Text, Image, View, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';

export default function PointsOfInterests(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            <View
                style={{
                    backgroundColor: colors.empty,
                    width: windowWidth * 0.8,
                    height: 2,
                    marginTop: 5,
                }}
            />
            <View
                style={[
                    styles.container,
                    {
                        flexDirection: 'row',
                        marginTop: 20,
                        marginRight: 40,
                        paddingRight: 40,
                        backgroundColor: colors.backgroundSecondary,
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                        width: windowWidth * 0.7,
                    },
                ]}
            >
                <Image
                    source={
                        props.photos
                            ? {
                                uri: `https://deway.fr/goto-api/files/photos/${props.photos.filename}`,
                            }
                            : require('../../../assets/images/Dalle_background.png')
                    }
                    style={[
                        { height: windowWidth * 0.2, width: windowWidth * 0.2, borderRadius: 12 },
                    ]}
                />
                <View
                    style={{
                        flex: 1,
                        width: windowWidth * 0.5,
                        height: windowWidth * 0.2,
                        marginLeft: 15,
                    }}
                >
                    <Text
                        style={[
                            styles.textHeader,
                            { fontSize: 20, marginLeft: 0, paddingLeft: 0, marginBottom: 5 },
                        ]}
                    >
                        {props.name}
                    </Text>
                    <Text style={[styles.textDescription]}>{props.description}</Text>
                </View>
            </View>
        </View>
    );
}
