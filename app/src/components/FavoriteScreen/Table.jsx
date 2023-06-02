import React from 'react';
import { View, Dimensions,Text, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { FILES_URL } from '../../providers/AxiosContext';

function Little({t, i, colors, left}){
    return (    
        t?.hikes[i]?.photos[0]?.filename ? <Image
            style={{height:'100%', width:'50%', borderRadius:15, marginBottom:10, marginLeft:left}}
            source={{uri: `${FILES_URL}/photos/${t.hikes[i].photos[0].filename}`}}
        />:<View style={{height:'100%', width:'50%', backgroundColor:colors.lineSecondary, borderRadius:15, marginBottom:10, marginLeft:left}}/>
    );
}

export default function Table({ t }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const height = Dimensions.get('screen').height;

    return (
        <View style={{padding:30, backgroundColor:colors.backgroundSecondary, flexDirection:'column', alignItems:'center', marginTop:20, borderRadius:15}}>
            <View style={{flexDirection:'row'}}>
                {t?.hikes[0]?.photos[0]?.filename ? <Image
                    style={{height:height*0.25, width:'40%', borderRadius:15}}
                    source={{uri: `${FILES_URL}/photos/${t.hikes[0].photos[0].filename}`}}
                />:<View style={{height:height*0.25, width:'40%', backgroundColor:colors.lineSecondary, borderRadius:15}}/>}
                <View style={{flexDirection:'column', flex:1, marginLeft:20}}>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly', marginBottom:10}}>
                        <Little t={t} i={1} colors={colors} left={0}/>
                        <Little t={t} i={2} colors={colors} left={20}/>
                    </View>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly'}}>
                        <Little t={t} i={3} colors={colors} left={0}/>
                        <Little t={t} i={4} colors={colors} left={20}/>
                    </View>
                </View>
            </View>
            <Text style={[styles.textHeader, {paddingTop:0}]}>{t.name}</Text>
        </View>
    );
}
