import React, { useContext, useEffect, useState } from 'react';
import stylesheet from './style';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    Text,
    View,
    Platform,
    ActivityIndicator,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import KeyboardDismissView from '../KeyboardDismissView/KeyboardDismissView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../Camera/CameraScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from '../Map/Map';
import DiscoverScreen from '../DiscoverScreen/DiscoverScreen';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import { Icon, IconComp } from '../Icon/Icon';
import Search from '../Search/Search';
import FocusHikeScreen from '../Hike/FocusHikeScreen';
import { Slider, Icon as IconThemed, CheckBox } from '@rneui/themed';
import { check } from 'prettier';

function MapScreen({ route }) {
    const [permission, request] = Location.useForegroundPermissions();
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isCamera, setIsCamera] = useState(false);

    const [leftImage, setLeftImage] = useState(null);
    const [topImage, setTopImage] = useState(null);
    const [widthImage, setWidthImage] = useState(0);
    const [heightImage, setHeightImage] = useState(0);

    const stepWidth=0.01;
    const [minWidth, setMinWidth] = useState(0.001);
    const [maxWidth, setMaxWidth] = useState(minWidth+stepWidth);
    const [minHeight, setMinHeight] = useState(0.001);
    const [maxHeight, setMaxHeight] = useState(minWidth+stepWidth);
    const [lastClickPlus, setLastClickPlus] = useState(0);
    const [lastClickMinus, setLastClickMinus] = useState(0);

    function handlePlus() {
        if(checkWidth){
            let step=stepWidth;
            if (new Date().getTime()-lastClickPlus<500){
                step*=3;
            }
            setWidthImage(prev => prev+step);
            setMinWidth(prev => prev+step);
            setMaxWidth(prev => prev+step);
            setLastClickPlus(new Date().getTime());
        }
        if(checkHeight){
            let step=stepWidth;
            if (new Date().getTime()-lastClickPlus<500){
                step*=3;
            }
            setHeightImage(prev => prev+step);
            setMinHeight(prev => prev+step);
            setMaxHeight(prev => prev+step);
            setLastClickPlus(new Date().getTime());
        }
        
    }
    function handleMinus() {
        if(checkWidth){
            if (minWidth > stepWidth){
                let step=stepWidth;
                if (new Date().getTime()-lastClickMinus<500 && minWidth>stepWidth*3){
                    step*=3;
                }
                setWidthImage(prev => prev-step);
                setMinWidth(prev => prev-step);
                setMaxWidth(prev => prev-step);
                setLastClickMinus(new Date().getTime());
            }
        } else if(checkHeight){
            if (minHeight > stepWidth){
                let step=stepWidth;
                if (new Date().getTime()-lastClickMinus<500 && minHeight>stepWidth*3){
                    step*=3;
                }
                setHeightImage(prev => prev-step);
                setMinHeight(prev => prev-step);
                setMaxHeight(prev => prev-step);
                setLastClickMinus(new Date().getTime());
            }
        }
    }

    const [checkWidth, setCheckWidth] = useState(false);
    const [checkHeight, setCheckHeight] = useState(false);
    const [checkTop, setCheckTop] = useState(false);
    const [checkLeft, setCheckLeft] = useState(false);
    const [checkAngle, setCheckAngle] = useState(false);

    function handleCheck(set, value){
        if (value){
            set(false);
        }
        else{
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

    function getMaxValue(){
        if (checkWidth){
            return maxWidth;
        } else if (checkHeight){
            return maxHeight;
        }
    }

    function getMinValue(){
        if (checkWidth){
            return minWidth;
        } else if (checkHeight){
            return minHeight;
        }
    }

    function getOnChangeValue(){
        if (checkWidth){
            return setWidthImage;
        } else if (checkHeight){
            return setHeightImage;
        }
    }

    function getStep(){
        if (checkWidth || checkHeight){
            return 0.0002;
        }
        return 1;
    }

    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const insets = useSafeAreaInsets();

    const [image, setImage] = useState(null);

    if (
        route.params?.dataImg &&
        (image == null || image.paraUri != route.params.dataImg.uri)
    ) {
        setImage({
            paraUri: route.params?.dataImg.uri,
            uri: 'data:image/jpg;base64,' + route.params.dataImg.base64,
            heigth: route.params.dataImg.height,
            width: route.params.dataImg.width,
        });
    }

    useEffect(() => {
        if (permission === null) {
            request();
        } else if (
            permission.granted === false &&
            permission.canAskAgain === false
        ) {
            setErrorMsg('Permission to access location was denied');
        } else if (
            permission.granted === false &&
            permission.canAskAgain === true
        ) {
            request();
        } else if (permission.granted === true) {
            Location.getLastKnownPositionAsync({}).then((response) => {
                setLocation(response);
            });
            Location.watchPositionAsync({}, (response) => {
                setLocation(response);
            });
        }
    }, [permission]);
    return (
        <View style={{ width: '100%', height: '100%', flex: 1 }}>
            {(() => {
                if (isCamera) {
                    return <CameraScreen setIsCamera={setIsCamera} />;
                } else if (location == null) {
                    if (errorMsg != null) {
                        return (
                            <Text style={{ alignSelf: 'center' }}>
                                {errorMsg}
                            </Text>
                        );
                    } else {
                        return (
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                                style={{ flex: 3, width: '100%' }}
                            />
                        );
                    }
                } else {
                    return (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Map
                                location={location}
                                setIsCamera={setIsCamera}
                                image={image}
                                styles={styles}
                                leftImage={leftImage}
                                setLeftImage={setLeftImage}
                                topImage={topImage}
                                setTopImage={setTopImage}
                                widthImage={widthImage}
                                setWidthImage={setWidthImage}
                                heightImage={heightImage}
                                setHeightImage={setHeightImage}
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
                                    wrapperStyle={{padding:0, margin:0, backgroundColor:''}}
                                    containerStyle={{padding:0, margin:0, backgroundColor:''}}
                                    title="Width"
                                    checked={checkWidth}
                                    onPress={() => handleCheck(setCheckWidth, checkWidth)}
                                />
                                <CheckBox
                                    wrapperStyle={{padding:0, margin:0, backgroundColor:''}}
                                    containerStyle={{padding:0, margin:0, backgroundColor:''}}
                                    title="Height"
                                    checked={checkHeight}
                                    onPress={() => handleCheck(setCheckHeight, checkHeight)}
                                />
                                <CheckBox
                                    wrapperStyle={{padding:0, margin:0, backgroundColor:''}}
                                    containerStyle={{padding:0, margin:0, backgroundColor:''}}
                                    title="Top"
                                    checked={checkTop}
                                    onPress={() => handleCheck(setCheckTop, checkTop)}
                                />
                                <CheckBox
                                    wrapperStyle={{padding:0, margin:0, backgroundColor:''}}
                                    containerStyle={{padding:0, margin:0, backgroundColor:''}}
                                    title="Left"
                                    checked={checkLeft}
                                    onPress={() => handleCheck(setCheckLeft, checkLeft)}
                                />
                                <CheckBox
                                    wrapperStyle={{padding:0, margin:0, backgroundColor:''}}
                                    containerStyle={{padding:0, margin:0, backgroundColor:''}}
                                    title="Angle"
                                    checked={checkAngle}
                                    onPress={() => handleCheck(setCheckAngle, checkAngle)}
                                />
                                { (checkHeight || checkWidth || checkTop || checkLeft || checkAngle) && image!=null && 
                                    <Slider
                                        value={widthImage}
                                        onValueChange={getOnChangeValue()}
                                        maximumValue={getMaxValue()}
                                        minimumValue={getMinValue()}
                                        step={getStep()}
                                        allowTouchTrack
                                        trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
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
                                }
                                { (checkHeight || checkWidth) && image!=null && 
                                    <>
                                        <TouchableWithoutFeedback
                                            onPress={() => handlePlus()}
                                        >
                                            <View
                                                style={[
                                                    styles.logoContainer
                                                ]}
                                            >
                                                <IconComp
                                                    color={colors.logo}
                                                    name={'plus'}
                                                    pos={0}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => handleMinus()}
                                        >
                                            <View
                                                style={[
                                                    styles.logoContainer
                                                ]}
                                            >
                                                <IconComp
                                                    color={colors.logo}
                                                    name={'back'}
                                                    pos={0}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </>
                                }
                            </View>
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

function ProfilScreen() {
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();
    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const {
        data: profil,
        loading,
        refetch,
    } = useQuery(gql`
        query whoami {
            whoami {
                id
                pseudo
                email
                publicKey
                avatar {
                    filename
                }
            }
        }
    `);

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        if (status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert(
                    'Sorry, we need camera roll permissions to make this work!'
                );
                return;
            }
        }
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const file = new ReactNativeFile({
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
            console.log('photo upload', file);

            const MUTATION = gql`
                mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
                    createPhoto(
                        input: { objId: $objId, objType: $objType, file: $file }
                    ) {
                        id
                    }
                }
            `;
            await client.mutate({
                mutation: MUTATION,
                variables: {
                    file,
                    objId: profil.whoami.id,
                    objType: 'USER',
                },
                errorPolicy: 'all',
            });
        }
    };

    useEffect(() => {
        if (profil?.whoami?.avatar?.filename) {
            const url =
                'https://deway.fr/goto-api/files/photos/' +
                profil.whoami.avatar.filename;
            setImage(url);
        } else {
            setImage(null);
        }
    }, [profil]);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <KeyboardDismissView>
                <SafeAreaView style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Image
                            source={require('../../../assets/images/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.header}>Gotò</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text>This is your profil :</Text>
                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                                style={{ flex: 3, width: '100%' }}
                            />
                        ) : (
                            <>
                                <Text>
                                    {profil.whoami.pseudo}#
                                    {profil.whoami.publicKey}
                                </Text>
                                <Text>{profil.whoami.email}</Text>
                            </>
                        )}
                        {image && (
                            <Image
                                source={{
                                    uri: image,
                                }}
                                loadingIndicatorSource={require('../../../assets/images/logo.png')}
                                style={{ width: 200, height: 200 }}
                            />
                        )}
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Logout"
                                    onPress={() => {
                                        authContext.logout();
                                    }}
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="logout"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => {
                                        authContext.logout();
                                    }}
                                    style={{ alignSelf: 'center' }}
                                />
                            </View>
                        </View>
                        <View style={styles.btnContainer}>
                            <View style={styles.btn}>
                                <Button
                                    title="Image"
                                    onPress={() => pickImage()}
                                    buttonStyle={styles.btn}
                                />
                                <MaterialIcon
                                    name="refresh"
                                    size={30}
                                    color={colors.link}
                                    onPress={() => refetch()}
                                    style={{ alignSelf: 'center' }}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardDismissView>
        </KeyboardAvoidingView>
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
                        initialRouteName={'Directions'}
                        screenOptions={{
                            tabBarStyle: styles.tabBar,
                            headerShown: false,
                            tabBarIconStyle: styles.tabBarIcon,
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarActiveTintColor: colors.iconprimary,
                            tabBarInactiveTintColor: colors.label,
                            tabBarHideOnKeyboard: true,
                        }}
                    >
                        <Tab.Screen
                            name="Discover"
                            component={DiscoverScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="list"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={Search}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="search"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Directions"
                            component={MapScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="position"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Favorites"
                            component={FavoritesScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="hiker"
                                        size={30}
                                        color={props.color}
                                    />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profile"
                            component={ProfilScreen}
                            options={{
                                tabBarIcon: (props) => (
                                    <Icon
                                        name="user"
                                        size={props.size}
                                        color={props.color}
                                    />
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
