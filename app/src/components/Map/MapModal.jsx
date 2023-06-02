import React from 'react';
import stylesheet from './style';
import { View, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { connect } from 'react-redux';
import { MapState } from './enum';
import { changeIsRecording, changeMapState, mapStateToProps } from '../../reducer/map.reducer';
import { Button } from 'react-native-elements';
import { Icon } from '../Icon/Icon';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { ReactNativeFile } from 'apollo-upload-client';
import { Buffer } from 'buffer';

const MUTATION_CREATE_PERFORMANCE = gql`
    mutation createPerformance(
        $file: Upload!
        $hikeId: String!
        $date: DateTime!
        $duration: Float!
        $distance: Float!
        $elevation: Float!
    ) {
        createPerformance(
            input: {
                file: $file
                hikeId: $hikeId
                date: $date
                duration: $duration
                distance: $distance
                elevation: $elevation
            }
        ) {
            id
        }
    }
`;

const GET_MY_ID = gql`
    query {
        whoami {
            id
        }
    }
`;

function MapModal({ dispatch, performance, hikeId }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();
    const navigation = useNavigation();

    const { data } = useQuery(GET_MY_ID);

    async function savePerformance() {
        const fileData = performance.path;
        const base64 = new Buffer(fileData, 'ascii').toString('base64');
        const file = new ReactNativeFile({
            uri: 'data:application/gpx+xml;base64,' + base64,
            name: 'performance.gpx',
            type: 'application/gpx+xml',
        });
        const res = await client.mutate({
            mutation: MUTATION_CREATE_PERFORMANCE,
            variables: {
                file,
                hikeId,
                date: new Date(),
                duration: performance.elaspedTime / 1000 / 3600 || 0,
                distance: performance.distance,
                elevation: performance.elevation,
            },
        });
        dispatch(changeMapState(MapState.NONE));
        dispatch(changeIsRecording(false));
        if (data.whoami.id === undefined) {
            alert('You need to be logged in to save a performance');
            return;
        }
        if (res.data.createPerformance.id === undefined) {
            alert('An error occured while saving the performance');
            return;
        }
        navigation.navigate('Profile', {
            screen: 'Performance',
            params: { performanceId: res.data.createPerformance.id, MyID: data.whoami.id },
        });
    }

    return (
        <View style={styles.modalView}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text style={styles.modalText}>Save the performance</Text>
                <Icon
                    name="cross"
                    size={17}
                    style={styles.closeIcon}
                    onPress={() => {
                        dispatch(changeIsRecording(hikeId !== null));
                        dispatch(changeMapState(MapState.NONE));
                    }}
                />
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                }}
            >
                <Button
                    title="Save"
                    buttonStyle={[styles.btn, { marginBottom: 10 }]}
                    titleStyle={styles.btnText}
                    onPress={savePerformance}
                />
                <Button
                    title="Discard"
                    buttonStyle={[styles.btn, { backgroundColor: colors.accent }]}
                    titleStyle={styles.btnText}
                    onPress={() => {
                        dispatch(changeIsRecording(false));
                        dispatch(changeMapState(MapState.NONE));
                        navigation.navigate('Directions', { fileData: null });
                    }}
                />
            </View>
        </View>
    );
}

export default connect(mapStateToProps)(MapModal);
