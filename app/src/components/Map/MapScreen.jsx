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
import OverlayModification from './Menu/OverlayModification';
import GpxPathLine from './GpxPathLine';
import CameraOverlay from '../Camera/menu/CameraOverlay';
import TrackFocusOverlay from './Menu/TrackFocusOverlay';
import { MapState } from './enum';
import { changeMapState, mapStateToProps } from '../../reducer/map.reducer';

function MapScreen({ route, mapState, dispatch }) {
    const isCamera = () => mapState === MapState.CAMERA;

    const { colors } = useTheme();
    const styles = stylesheet(colors);

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
            dispatch(changeMapState(MapState.NONE));
        } else if (image !== null && route.params?.dataImg === null) {
            setImage(null);
        }

        if (route.params?.fileData && (file == null || file.paraUri != route.params.fileData.uri)) {
            setFile(route.params.fileData);
            route.params.dataImg = null;
            dispatch(changeMapState(MapState.FOCUS_HIKE));
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
                            <Map>
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

export default function MapWrapper({ route }) {
    return (
        <Provider store={store}>
            <MapScreenToProps route={route} />
        </Provider>
    );
}
