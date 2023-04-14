import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import stylesheet from './style';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createIconSetFromFontello } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const Icon = createIconSetFromFontello(
    require('../../../assets/font/config.json'),
    'goto',
    'goto.ttf'
);

function Bidule(props) {
    const [fontsLoaded] = useFonts({
        goto: require('../../../assets/font/goto.ttf'),
    });
    if (!fontsLoaded) {
        return <View />;
    }
    return (
        <Icon
            name="plus"
            size={30}
            color={props.color}
        />
    );
}

function Categorie(props) {
    const marginTop=props.windowHeight*0.025;
    const height=0.08;
    return (
        <View onPress={() => console.log('press')} style={[props.styles.container, {height:props.windowHeight*height, marginTop:marginTop, flexDirection:'row', backgroundColor:'#FFFFFF', borderRadius:12}, props.horizontal ? {width:'70%', marginRight:props.windowWidth*0.05} : {}]}>
            <Image source={require('../../../assets/images/Dalle_background.png')} 
                style={[
                    {height:props.windowHeight*height,width:props.windowHeight*height, borderTopLeftRadius: 12, borderBottomLeftRadius:12, marginRight:props.windowHeight*height*0.2 },
                ]}/>
            <TouchableWithoutFeedback onPress={() => console.log('press')} style={[props.styles.container, {height:props.windowHeight*height}]}>
                <Text style={[props.styles.textHeader, {marginLeft:0,fontSize:24, marginTop:0, alignSelf:'center'}, props.horizontal ? { paddingRight:props.windowWidth*(3*height), paddingVertical:props.windowWidth*(height*0.5)} : {paddingRight:props.windowWidth*(0.5-height), paddingVertical:props.windowWidth*(height*0.5)}]}>Categorie Name</Text>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default function Discover(){
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={[styles.container,{paddingHorizontal:windowWidth*0.07}]}
                keyboardShouldPersistTaps={'handled'}
            >

                <Text style={styles.textHeader}>Discover</Text>
                <View style={[styles.container, {flexDirection:'row', marginLeft:'4%', marginTop:windowHeight*0.02}]}>
                    <Bidule color={colors.logo} />
                    <Text style={[styles.textLink, {textDecorationLine:'', marginLeft:'5%',alignSelf:'center'}]}>Add a hike</Text>
                </View>
                <ScrollView
                    style={[styles.container, {marginBottom:windowHeight*0.05}]}
                    keyboardShouldPersistTaps={'handled'}
                    horizontal={true}
                >
                    <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={true}/>
                    <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={true}/>
                    <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={true}/>
                    <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={true}/>

                </ScrollView>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {width: '100%',height:windowHeight*0.5, borderTopLeftRadius: 12, borderTopRightRadius:12 },
                    ]}/>
                <View style={[styles.container,{ backgroundColor:'#FFFFFF', paddingBottom:'5%', borderBottomRightRadius:12, borderBottomLeftRadius:12}]}>
                    <Text style={[styles.textHeader, {alignSelf:'center'}]}>The better noted</Text>    
                    <Text style={[styles.textLink, {alignSelf:'center'}]}>Discover</Text>
                </View>
                <Text style={[styles.textHeader, {marginTop:windowHeight*0.04, marginBottom:windowHeight*0.01}]}>Unique places</Text>
                <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={false}/>
                <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={false}/>
                <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={false}/>
                <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={false}/>
                <Categorie styles={styles} windowHeight={windowHeight} windowWidth={windowWidth} horizontal={false}/>
                <View style={{height:windowHeight*0.20}}/>
            </ScrollView>
        </SafeAreaView>
    );
}