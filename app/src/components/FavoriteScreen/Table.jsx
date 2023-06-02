import React from 'react';
import { View, Dimensions,Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';

export default function Table({ t }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const height = Dimensions.get('screen').height;
    console.log(t.hikes);
    return (
        <View style={{padding:30, backgroundColor:colors.backgroundSecondary, flexDirection:'column', alignItems:'center', marginTop:20, borderRadius:15}}>
            <View style={{flexDirection:'row'}}>
                <View style={{height:height*0.25, width:'40%', backgroundColor:colors.lineSecondary, borderRadius:15}}/>
                <View style={{flexDirection:'column', flex:1, marginLeft:20}}>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly', marginBottom:10}}>
                        <View style={{height:'100%', width:'50%', backgroundColor:colors.lineSecondary, borderRadius:15, marginBottom:10}}/>
                        <View style={{height:'100%', width:'50%', backgroundColor:colors.lineSecondary, borderRadius:15, marginBottom:10, marginLeft:20}}/>
                    </View>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-evenly'}}>
                        <View style={{height:'100%', width:'50%', backgroundColor:colors.lineSecondary, borderRadius:15, marginBottom:10}}/>
                        <View style={{height:'100%', width:'50%', backgroundColor:colors.lineSecondary, borderRadius:15, marginBottom:10, marginLeft:20}}/>
                    </View>
                </View>
            </View>
            <Text style={[styles.textHeader, {paddingTop:0}]}>{t.name}</Text>
        </View>
    );
}
