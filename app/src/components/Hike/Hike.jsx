import React from 'react';
import { Image, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import HikeInfos from './HikeInfos';

export default function Hike({ id }) {
    const GET_HIKE = gql`
        query hike($id: ID!) {
            hike(id: $id) {
                id
                name
                description
                category {
                    id
                    name
                }
                photos {
                    id
                    filename
                }
            }
        }
    `;

    const { data, loading } = useQuery(GET_HIKE, {
        variables: {
            id: id,
        },
    });

    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    function handleClickHike(hikeId) {
        navigation.navigate('FocusHike', { hikeId });
    }

    const windowHeight = Dimensions.get('window').height;

    if (loading) return <View style={{ height: windowHeight * 0.5 }} />;
    else {
        return (
            <TouchableWithoutFeedback onPress={() => handleClickHike(id)}>
                <View style={[styles.container, { marginTop: 30, borderRadius: 12 }]}>
                    <Image
                        source={
                            data?.hike.photos.length > 0
                                ? {
                                    uri: `https://deway.fr/goto-api/files/photos/${data.hike.photos[0].filename}`,
                                }
                                : require('../../../assets/images/Dalle_background.png')
                        }
                        style={[
                            {
                                height: windowHeight * 0.5,
                                width: '100%',
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                            },
                        ]}
                    />
                    <HikeInfos hike={data.hike} inSearch={true}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
