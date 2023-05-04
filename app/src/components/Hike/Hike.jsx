import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import {IconComp} from '../Icon/Icon';

export default function Hike(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    return (    
        <TouchableWithoutFeedback onPress={() => console.log('hike : ', props.id)}>
            <View style={[styles.container, {marginTop:30, borderTopLeftRadius: 12, borderTopRightRadius:12}]}>
                <Image source={props.photos.length>0 ? {uri:( `https://deway.fr/goto-api/files/photos/${props.photos[0].filename}`)} : require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:500,width:'100%', borderTopLeftRadius: 12, borderTopRightRadius:12},
                    ]}/>
                <View style={[styles.container, {flexDirection:'column',justifyContent:'space-between', paddingVertical:24, paddingHorizontal:24, backgroundColor:colors.backgroundTextInput, height:240}]}>
                    <View style={{flex:1, flexDirection:'row',justifyContent:'space-between', width:'100%'}}>
                        <Text style={[styles.textDescription, {marginLeft:0}]}>{props.category}</Text>
                        <View>
                            <IconComp color={colors.logo} name={'heart'} pos={0}/>
                            <IconComp color={colors.backgroundTextInput} name={'heart'} size={22} pos={4}/>
                        </View>
                    </View>
                    <Text style={[styles.textHeader, {alignSelf:'flex-start', paddingLeft:0, marginTop:0, paddingTop:0}]}>{props.name}</Text>
                    <Text style={[styles.textDescription, {alignSelf:'flex-start', marginTop:12}]}>{props.description}</Text>
                    <View style={{flex:1,flexDirection:'row', alignSelf:'flex-start', marginTop:12}}>
                        <IconComp color={colors.starFill} name={'star'} marginRight={7} size={22}/>
                        <IconComp color={colors.starFill} name={'star'} marginRight={7} size={22}/>
                        <IconComp color={colors.starFill} name={'star'} marginRight={7} size={22}/>
                        <IconComp color={colors.starFill} name={'star'} marginRight={7} size={22}/>
                        <IconComp color={colors.starEmpty} name={'star'} marginRight={7} size={22}/>
                        <Text style={[styles.textDescription, {color:styles.text}]}>See reviews</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}