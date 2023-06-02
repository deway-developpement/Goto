import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import { SafeAreaView, View } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from './Map';
import { Provider, connect } from 'react-redux';
import store from '../../store/map.store.js';
import OverlayImage from './OverlayImage';
import OverlayModification from './Menu/OverlayModification';
import GpxPathLine from './GpxPathLine';
import CameraOverlay from '../Camera/menu/CameraOverlay';
import TrackFocusOverlay from './Menu/TrackFocusOverlay';
import { MapState } from './enum';
import {
    changeIsFollowing,
    changeIsRecording,
    changeMapState,
    mapStateToProps,
} from '../../reducer/map.reducer';
import { Button } from 'react-native';
import GpxTrackLine from './GpxTrackLine';
import { Modal } from 'react-native';
import MapModal from './MapModal';
import { LocationContext } from '../../providers/LocationProvider';

function MapScreen({ route, mapState, dispatch, isRecording }) {
    const isCamera = () => mapState === MapState.CAMERA;
    const { setMoving } = useContext(LocationContext);

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (route.params?.dataImg && (image == null || image.paraUri != route.params.dataImg.uri)) {
            setImage({
                paraUri: route.params?.dataImg.uri,
                uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
                heigth: route.params.dataImg.height,
                width: route.params.dataImg.width,
            });
            route.params.fileData = null;
            console.log('change map state');
            dispatch(changeMapState(MapState.NONE));
        } else if (image !== null && route.params?.dataImg === null) {
            setImage(null);
        }

        if (route.params?.fileData && (file == null || file.paraUri != route.params.fileData.uri)) {
            setFile(route.params.fileData);
            route.params.dataImg = null;
            dispatch(changeMapState(MapState.FOCUS_HIKE, route.params.hikeId));
        } else if (file !== null && route.params?.fileData === null) {
            setFile(null);
        }
    }, [route.params?.dataImg, route.params?.fileData]);

    useEffect(() => {
        if (isFocused) {
            console.log('focused');
            setMoving(true);
        } else {
            console.log('not focused');
            setMoving(false);
        }
    }, [isFocused]);

    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            {(() => {
                if (isCamera()) {
                    return <CameraScreen />;
                } else {
                    return (
                        <View style={{ flex: 1 }}>
                            <View
                                style={[
                                    {
                                        zIndex: 100,
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        backgroundColor:
                                            mapState === MapState.MODAL_PERFORMANCE
                                                ? colors.backgroundModal
                                                : 'transparent',
                                    },
                                ]}
                                pointerEvents="box-none"
                            >
                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={mapState === MapState.MODAL_PERFORMANCE}
                                    onRequestClose={() => {
                                        dispatch(changeMapState(MapState.FOCUS_HIKE));
                                    }}
                                    onShow={() => {
                                        dispatch(changeIsRecording(false));
                                    }}
                                >
                                    <MapModal />
                                </Modal>
                            </View>
                            <Map>
                                {isRecording && <GpxTrackLine />}
                                <OverlayImage image={image} />
                                {file && <GpxPathLine fileData={file} mapState={mapState} />}
                            </Map>
                            <View
                                style={[
                                    styles.btnContainer,
                                    {
                                        position: 'absolute',
                                        top: 0 + insets.top,
                                        right: 10,
                                        backgroundColor: 'transparent',
                                    },
                                ]}
                            >
                                <Button
                                    title="follow"
                                    onPress={() => {
                                        dispatch(changeIsFollowing(true));
                                    }}
                                />
                                {file === null && image == null && (
                                    <CameraOverlay styles={styles} />
                                )}
                                {image !== null && <OverlayModification mapState={mapState} />}
                                {file !== null && <TrackFocusOverlay styles={styles} />}
                            </View>
                            <SafeAreaView />
                        </View>
                    );
                }
            })()}
        </View>
    );
}

const MapScreenToProps = connect(mapStateToProps)(MapScreen);

export default function MapWrapper({ route, navigation }) {
    return (
        <Provider store={store}>
            <MapScreenToProps route={route} navigation={navigation} />
        </Provider>
    );
}
