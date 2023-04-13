import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
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
    return (
        <View style={[props.styles.container, {height:80, marginTop:marginTop, flexDirection:'row', backgroundColor:'#FFFFFF', borderRadius:12}]}>
            <Image source={require('../../../assets/images/Dalle_background.png')} 
                style={[
                    {height:80,width:80, borderTopLeftRadius: 12, borderBottomLeftRadius:12 },
                ]}/>
            <Text style={[props.styles.textHeader, {fontSize:24}]}>Categorie Name</Text>
        </View>
    );
}

export default function Discover(){
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const windowHeight = Dimensions.get('window').height;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={[styles.container,{paddingHorizontal:'7%'}]}
                keyboardShouldPersistTaps={'handled'}
            >
                <Text style={styles.textHeader}>Discover</Text>
                <View style={[styles.container, {flexDirection:'row', marginLeft:'4%', marginVertical:windowHeight*0.02}]}>
                    <Bidule color={colors.logo} />
                    <Text style={[styles.textLink, {textDecorationLine:'', marginLeft:'5%', marginTop:'1.3%'}]}>Add a hike</Text>
                </View>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {width: '100%',height:windowHeight*0.5, borderTopLeftRadius: 12, borderTopRightRadius:12 },
                    ]}/>
                <View style={[styles.container,{ backgroundColor:'#FFFFFF', paddingBottom:'5%', borderBottomRightRadius:12, borderBottomLeftRadius:12}]}>
                    <Text style={[styles.textHeader, {alignSelf:'center'}]}>The better noted</Text>    
                    <Text style={[styles.textLink, {alignSelf:'center'}]}>Discover</Text>
                </View>
                <Text style={[styles.textHeader, {marginTop:windowHeight*0.04, marginBottom:windowHeight*0.01}]}>Unique places</Text>
                <Categorie styles={styles} windowHeight={windowHeight}/>
                <Categorie styles={styles} windowHeight={windowHeight}/>
                <Categorie styles={styles} windowHeight={windowHeight}/>
                <Categorie styles={styles} windowHeight={windowHeight}/>
                <Categorie styles={styles} windowHeight={windowHeight}/>
                <View style={{height:windowHeight*0.20}}/>
            </ScrollView>
        </SafeAreaView>
    );
}