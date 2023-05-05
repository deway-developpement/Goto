import React from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';
import {IconComp} from '../Icon/Icon';


export default function HikeInfos(props) {
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
    let avList=[-5,-4,-3,-2,-1];
    if (!loading && reviews.reviews.length>0){
        for (let i=0; i<reviews.reviews.length; i++){
            av+=reviews.reviews[i].rating;
        }
        let cpt=1;
        av/=reviews.reviews.length;
        av=Math.round(av); 
        for (let i=0; i<av; i++){
            avList[i]=cpt;
            cpt++;
        }
    }

    return (
        <View style={[styles.containerFocus,{marginTop:0}, props.borderRadius ? {borderRadius:12} : {}]}>
            <View style={{flex:1, flexDirection:'row',justifyContent:'space-between', width:'100%'}}>
                <Text style={[styles.textDescription, {marginLeft:0}]}>{props.category}</Text>
                <TouchableWithoutFeedback onPress={()=>console.log('LIKE HIKE', props.name)}>
                    <View>
                        <IconComp color={colors.logo} name={'heart'} pos={0}/>
                        <IconComp color={colors.backgroundTextInput} name={'heart'} size={22} pos={4.7}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <Text style={[styles.textHeader, {alignSelf:'flex-start', paddingLeft:0, marginTop:0, paddingTop:0}]}>{props.name}</Text>
            <Text style={[styles.textDescription, {alignSelf:'flex-start', marginTop:8, paddingBottom:8}]}>{props.description}</Text>
            <View style={{flex:1,flexDirection:'row', alignSelf:'flex-start', marginTop:8}}>
                {avList.map((item) => (<IconComp color={item>0 ? colors.starFill : colors.starEmpty} key={item} name={'star'} marginRight={7} size={22}/>))}
                <Text style={[styles.textDescription, {color:styles.text, paddingTop:2, marginLeft:10}]}>See reviews</Text>
            </View>
        </View>
    );
}