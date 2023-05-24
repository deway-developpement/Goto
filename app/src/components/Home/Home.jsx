import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from '../Map/Map';
import DiscoverScreen from '../DiscoverScreen/DiscoverScreen';
import { useFonts } from 'expo-font';
import { Icon, IconComp } from '../Icon/Icon';
import ProfileScreen from '../Profile/Profile';
import SearchScreen from '../SearchScreen/SearchScreen';
import FocusHikeScreen from '../Hike/FocusHikeScreen';
import { Slider, Icon as IconThemed, CheckBox } from '@rneui/themed';

function MapScreen({ route }) {
    const [isCamera, setIsCamera] = useState(false);

    const [leftImage, setLeftImage] = useState(0);
    const [topImage, setTopImage] = useState(0);
    const [widthImage, setWidthImage] = useState(0);
    const [heightImage, setHeightImage] = useState(0);
    const [angleImage, setAngleImage] = useState(0);

    const stepWidth = 0.01;
    const [minWidth, setMinWidth] = useState(0.001);
    const [maxWidth, setMaxWidth] = useState(minWidth + stepWidth);
    const [minHeight, setMinHeight] = useState(0.001);
    const [maxHeight, setMaxHeight] = useState(minWidth + stepWidth);
    const [lastClickPlus, setLastClickPlus] = useState(0);
    const [lastClickMinus, setLastClickMinus] = useState(0);
    const [minTop, setMinTop] = useState(-0.0005);
    const [maxTop, setMaxTop] = useState(minTop + stepWidth);
    const [minLeft, setMinLeft] = useState(-0.0005);
    const [maxLeft, setMaxLeft] = useState(minLeft + stepWidth);
    const minAngle = 0;
    const maxAngle = 180;

    function handlePlus() {
        if (checkWidth) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickPlus < 500) {
                step *= 3;
            }
            setWidthImage((prev) => prev + step);
            setMinWidth((prev) => prev + step);
            setMaxWidth((prev) => prev + step);
            setLastClickPlus(new Date().getTime());
        } else if (checkHeight) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickPlus < 500) {
                step *= 3;
            }
            setHeightImage((prev) => prev + step);
            setMinHeight((prev) => prev + step);
            setMaxHeight((prev) => prev + step);
            setLastClickPlus(new Date().getTime());
        } else if (checkTop) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickPlus < 500) {
                step *= 3;
            }
            setTopImage((prev) => prev + step);
            setMinTop((prev) => prev + step);
            setMaxTop((prev) => prev + step);
            setLastClickPlus(new Date().getTime());
        } else if (checkLeft) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickPlus < 500) {
                step *= 3;
            }
            setLeftImage((prev) => prev + step);
            setMinLeft((prev) => prev + step);
            setMaxLeft((prev) => prev + step);
            setLastClickPlus(new Date().getTime());
        }
    }
    function handleMinus() {
        if (checkWidth) {
            if (minWidth > stepWidth) {
                let step = stepWidth;
                if (new Date().getTime() - lastClickMinus < 500 && minWidth > stepWidth * 3) {
                    step *= 3;
                }
                setWidthImage((prev) => prev - step);
                setMinWidth((prev) => prev - step);
                setMaxWidth((prev) => prev - step);
                setLastClickMinus(new Date().getTime());
            }
        } else if (checkHeight) {
            if (minHeight > stepWidth) {
                let step = stepWidth;
                if (new Date().getTime() - lastClickMinus < 500 && minHeight > stepWidth * 3) {
                    step *= 3;
                }
                setHeightImage((prev) => prev - step);
                setMinHeight((prev) => prev - step);
                setMaxHeight((prev) => prev - step);
                setLastClickMinus(new Date().getTime());
            }
        } else if (checkTop) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickMinus < 500 && minTop > stepWidth * 3) {
                step *= 3;
            }
            setTopImage((prev) => prev - step);
            setMinTop((prev) => prev - step);
            setMaxTop((prev) => prev - step);
            setLastClickMinus(new Date().getTime());
        } else if (checkLeft) {
            let step = stepWidth;
            if (new Date().getTime() - lastClickMinus < 500 && minLeft > stepWidth * 3) {
                step *= 3;
            }
            setLeftImage((prev) => prev - step);
            setMinLeft((prev) => prev - step);
            setMaxLeft((prev) => prev - step);
            setLastClickMinus(new Date().getTime());
        }
    }

    const [checkWidth, setCheckWidth] = useState(false);
    const [checkHeight, setCheckHeight] = useState(false);
    const [checkTop, setCheckTop] = useState(false);
    const [checkLeft, setCheckLeft] = useState(false);
    const [checkAngle, setCheckAngle] = useState(false);

    function handleCheck(set, value) {
        if (value) {
            set(false);
        } else {
            setCheckWidth(false);
            setCheckHeight(false);
            setCheckTop(false);
            setCheckLeft(false);
            setCheckAngle(false);
            set(true);
        }
        setLastClickPlus(0);
        setLastClickMinus(0);
    }

    function getMaxValue() {
        if (checkWidth) {
            return maxWidth;
        } else if (checkHeight) {
            return maxHeight;
        } else if (checkTop) {
            return maxTop;
        } else if (checkLeft) {
            return maxLeft;
        } else if (checkAngle) {
            return maxAngle;
        }
    }

    function getMinValue() {
        if (checkWidth) {
            return minWidth;
        } else if (checkHeight) {
            return minHeight;
        } else if (checkTop) {
            return minTop;
        } else if (checkLeft) {
            return minLeft;
        } else if (checkAngle) {
            return minAngle;
        }
    }

    function getValue() {
        if (checkWidth) {
            return widthImage;
        } else if (checkHeight) {
            return heightImage;
        } else if (checkTop) {
            return topImage;
        } else if (checkLeft) {
            return leftImage;
        } else if (checkAngle) {
            return angleImage;
        }
    }

    function getOnChangeValue() {
        if (checkWidth) {
            return setWidthImage;
        } else if (checkHeight) {
            return setHeightImage;
        } else if (checkTop) {
            return setTopImage;
        } else if (checkLeft) {
            return setLeftImage;
        } else if (checkAngle) {
            return setAngleImage;
        }
    }

    function getStep() {
        if (checkWidth || checkHeight || checkTop || checkLeft) {
            return 0.0002;
        }
        return 1;
    }

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);

    if (route.params?.dataImg && (image == null || image.paraUri != route.params.dataImg.uri)) {
        setImage({
            paraUri: route.params?.dataImg.uri,
            uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
            heigth: route.params.dataImg.height,
            width: route.params.dataImg.width,
        });
    }

    console.log(angleImage);
    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            {(() => {
                if (isCamera) {
                    return <CameraScreen setIsCamera={setIsCamera} />;
                } else {
                    return (
                        <View style={{ flex: 1 }}>
                            <Map
                                setIsCamera={setIsCamera}
                                image={image}
                                styles={styles}
                                leftImage={leftImage}
                                topImage={topImage}
                                widthImage={widthImage}
                                setWidthImage={setWidthImage}
                                heightImage={heightImage}
                                setHeightImage={setHeightImage}
                                angleImage={angleImage}
                            />
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
                                    buttonStyle={[styles.btn, { width: 200 }]}
                                    titleStyle={styles.btnText}
                                    title={'Open your camera'}
                                    onPress={() => {
                                        setIsCamera(true);
                                    }}
                                />
                                <CheckBox
                                    wrapperStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    containerStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    title="Width"
                                    checked={checkWidth}
                                    onPress={() => handleCheck(setCheckWidth, checkWidth)}
                                />
                                <CheckBox
                                    wrapperStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    containerStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    title="Height"
                                    checked={checkHeight}
                                    onPress={() => handleCheck(setCheckHeight, checkHeight)}
                                />
                                <CheckBox
                                    wrapperStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    containerStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    title="Top"
                                    checked={checkTop}
                                    onPress={() => handleCheck(setCheckTop, checkTop)}
                                />
                                <CheckBox
                                    wrapperStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    containerStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    title="Left"
                                    checked={checkLeft}
                                    onPress={() => handleCheck(setCheckLeft, checkLeft)}
                                />
                                <CheckBox
                                    wrapperStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    containerStyle={{ padding: 0, margin: 0, backgroundColor: '' }}
                                    title="Angle"
                                    checked={checkAngle}
                                    onPress={() => handleCheck(setCheckAngle, checkAngle)}
                                />
                                {(checkHeight ||
                                    checkWidth ||
                                    checkTop ||
                                    checkLeft ||
                                    checkAngle) &&
                                    image != null && (
                                    <Slider
                                        value={getValue()}
                                        onValueChange={getOnChangeValue()}
                                        maximumValue={getMaxValue()}
                                        minimumValue={getMinValue()}
                                        step={getStep()}
                                        allowTouchTrack
                                        trackStyle={{
                                            height: 10,
                                            backgroundColor: 'transparent',
                                        }}
                                        thumbStyle={{
                                            height: 20,
                                            width: 20,
                                            backgroundColor: 'transparent',
                                        }}
                                        thumbProps={{
                                            children: (
                                                <IconThemed
                                                    type="font-awesome"
                                                    size={10}
                                                    reverse
                                                    containerStyle={{ bottom: 10, right: 10 }}
                                                    color={colors.logo}
                                                />
                                            ),
                                        }}
                                    />
                                )}
                                {(checkHeight || checkWidth || checkTop || checkLeft) &&
                                    image != null && (
                                    <>
                                        <TouchableWithoutFeedback onPress={() => handlePlus()}>
                                            <View style={[styles.logoContainer]}>
                                                <IconComp
                                                    color={colors.logo}
                                                    name={'plus'}
                                                    pos={0}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => handleMinus()}>
                                            <View style={[styles.logoContainer]}>
                                                <IconComp
                                                    color={colors.logo}
                                                    name={'back'}
                                                    pos={0}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </>
                                )}
                            </View>
                            <SafeAreaView />
                        </View>
                    );
                }
            })()}
        </View>
    );
}

function FavoritesScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '' }}>
            <SafeAreaView />
            <Text>Favorites</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const authContext = useContext(AuthContext);

    // return to login if not logged in
    useEffect(() => {
        if (!authContext.authState.connected) {
            navigation.navigate('Login');
        }
    }, [authContext.authState.connected]);

    if (!fontsLoaded) {
        return <View />;
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <KeyboardDismissView>
                <View style={styles.inner}>
                    <Tab.Navigator
                        initialRouteName={'Discover'}
                        backBehavior="history"
                        screenOptions={{
                            tabBarStyle: styles.tabBar,
                            headerShown: false,
                            tabBarIconStyle: styles.tabBarIcon,
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarActiveTintColor: colors.active,
                            tabBarInactiveTintColor: colors.backgroundSecondary,
                            tabBarHideOnKeyboard: true,
                        }}
                    >
                        <Tab.Screen
                            name="Discover"
                            component={DiscoverScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="list" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="search" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Directions"
                            component={MapScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="position" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Favorites"
                            component={FavoritesScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="hiker" size={30} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profile"
                            component={ProfileScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon name="user" size={props.size} color={props.color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="FocusHike"
                            component={FocusHikeScreen}
                            options={{
                                headerShown: false,
                                tabBarButton: () => null,
                            }}
                        />
                    </Tab.Navigator>
                </View>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
