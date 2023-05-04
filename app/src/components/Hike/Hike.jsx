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
import { gql, useQuery } from '@apollo/client';
import {IconComp} from '../Icon/Icon';

export default function Hike(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const GET_REVIEWS = gql `query reviews($hike:ReviewFilterHikeFilter){
        reviews(filter:{hike: $hike}){
            id
            rating
        }
    }`;

    const {
        data: reviews,
        loading,
    } = useQuery(
        GET_REVIEWS
        ,
        {   
            variables:{
                hike:{name:{eq:props.name}}
            }
        },
    );
    let av=0;
    let avList=[0,0,0,0,0];
    if (!loading && reviews.reviews.length>0){
        for (let i=0; i<reviews.reviews.length; i++){
            av+=reviews.reviews[i].rating;
        }
        av/=reviews.reviews.length;
        av=Math.round(av); 
        for (let i=0; i<av; i++){
            avList[i]=1;
        }
    }
    return (    
        <TouchableWithoutFeedback onPress={() => console.log('hike : ', props.id)}>
            <View style={[styles.container, {marginTop:30, borderTopLeftRadius: 12, borderTopRightRadius:12}]}>
                <Image source={props.photos.length>0 ? {uri:( `https://deway.fr/goto-api/files/photos/${props.photos[0].filename}`)} : require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:500,width:'100%', borderTopLeftRadius: 12, borderTopRightRadius:12},
                    ]}/>
                <View style={[styles.container, {flexDirection:'column',justifyContent:'space-between', paddingVertical:24, paddingHorizontal:24, backgroundColor:colors.backgroundTextInput, height:'100%'}]}>
                    <View style={{flex:1, flexDirection:'row',justifyContent:'space-between', width:'100%'}}>
                        <Text style={[styles.textDescription, {marginLeft:0}]}>{props.category}</Text>
                        <TouchableWithoutFeedback onPress={()=>console.log('LIKE HIKE', props.name)}>
                            <View>
                                <IconComp color={colors.logo} name={'heart'} pos={0}/>
                                <IconComp color={colors.backgroundTextInput} name={'heart'} size={22} pos={4}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <Text style={[styles.textHeader, {alignSelf:'flex-start', paddingLeft:0, marginTop:0, paddingTop:0}]}>{props.name}</Text>
                    <Text style={[styles.textDescription, {alignSelf:'flex-start', marginTop:12, paddingBottom:12}]}>{props.description}</Text>
                    <View style={{flex:1,flexDirection:'row', alignSelf:'flex-start', marginTop:12}}>
                        
                        {avList.map((item) => (<IconComp color={item==1 ? colors.starFill : colors.starEmpty} name={'star'} marginRight={7} size={22}/>))}
                        <Text style={[styles.textDescription, {color:styles.text}]}>See reviews</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}