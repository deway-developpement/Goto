import React, { useEffect, useState } from 'react';
import stylesheet from './style';
import { SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from './Map';
import { Provider, connect } from 'react-redux';
import store from '../../store/map.store.js';
import OverlayImage from './OverlayImage';
import OverlayModification, { SliderAngle } from './Menu/OverlayModification';
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
import { Pressable } from 'react-native';
import { Icon } from '../Icon/Icon';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function MapScreen({ route, mapState, dispatch, isRecording, isFollowing }) {
    const isCamera = () => mapState === MapState.CAMERA;

    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const tabBarHeight = useBottomTabBarHeight();

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (route.params?.dataImg && (image == null || image.paraUri != route.params.dataImg.uri)) {
            setImage({
                paraUri: route.params?.dataImg.uri,
                uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
                heigth: route.params.dataImg.height,
                width: route.params.dataImg.width,
            });
            route.params.fileData = null;
            dispatch(changeMapState(MapState.IMAGE_EDIT));
        } else if (image !== null && route.params?.dataImg === null) {
            setImage(null);
            dispatch(changeMapState(MapState.NONE));
        }

        if (route.params?.fileData && (file == null || file.paraUri != route.params.fileData.uri)) {
            setFile(route.params.fileData);
            route.params.dataImg = null;
            dispatch(changeMapState(MapState.FOCUS_HIKE, route.params.hikeId));
        } else if (file !== null && route.params?.fileData === null) {
            setFile(null);
        }
    }, [route.params?.dataImg, route.params?.fileData]);

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
                                        top: 10 + insets.top,
                                        right: 20,
                                        backgroundColor: 'transparent',
                                        flexDirection: 'row',
                                        maxWidth: '100%',
                                        flexWrap: 'wrap',
                                    },
                                ]}
                            >
                                {file === null && image == null && (
                                    <CameraOverlay styles={styles} />
                                )}
                                {image !== null && <OverlayModification mapState={mapState} />}
                                {file !== null && <TrackFocusOverlay styles={styles} />}
                            </View>

                            {mapState === MapState.IMAGE_EDIT && (
                                <View
                                    style={[
                                        styles.btnContainer,
                                        {
                                            position: 'absolute',
                                            bottom: 10 + tabBarHeight,
                                            backgroundColor: 'transparent',
                                            flexDirection: 'column',
                                            paddingLeft: '25%',
                                            paddingRight: '25%',
                                            width: '100%',
                                            flexWrap: 'wrap',
                                        },
                                    ]}
                                >
                                    <SliderAngle />
                                </View>
                            )}
                            {!isFollowing && (
                                <Pressable
                                    onPress={() => {
                                        dispatch(changeIsFollowing(true));
                                    }}
                                    style={[
                                        styles.btnContainer,
                                        {
                                            position: 'absolute',
                                            bottom: tabBarHeight + 30,
                                            right: 20,
                                            backgroundColor: colors.primary,
                                            borderRadius: 10,
                                            padding: 5,
                                            zIndex: 100,
                                        },
                                    ]}
                                >
                                    <Icon name="relocate" size={30} color={colors.background} />
                                </Pressable>
                            )}
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
