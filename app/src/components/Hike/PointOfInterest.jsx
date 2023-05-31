import React from 'react';
import { Text, Image, View, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { FILES_URL } from '../../providers/AxiosContext';

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
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                        width: windowWidth * 0.9,
                        backgroundColor: '#00000000',
                    },
                ]}
            >
                <Image
                    source={
                        props.photo
                            ? {
                                uri: `${FILES_URL}/photos/${props.photo.filename}`,
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
                        overflow: 'hidden',
                    }}
                >
                    <Text
                        style={[
                            styles.textHeader,
                            {
                                fontSize: 20,
                                marginLeft: 0,
                                paddingLeft: 0,
                                marginBottom: 5,
                                marginTop: 0,
                            },
                        ]}
                    >
                        {props.name}
                    </Text>
                    <Text style={[styles.textDescription]} numberOfLines={2}>
                        {props.description}
                    </Text>
                </View>
            </View>
        </View>
    );
}
