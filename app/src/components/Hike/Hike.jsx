import React from 'react';
import {
    Image,
    View,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import HikeInfos from './HikeInfos';

export default function Hike(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

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

    function handleClickHike(hike){
        if (!loading) {
            navigation.navigate('Search', { focusHike: hike});
        }
    }

    const windowHeight = Dimensions.get('window').height;

    return (    
        <TouchableWithoutFeedback onPress={() => handleClickHike(props.id)}>
            <View style={[styles.container, {marginTop:30, borderRadius: 12}]}>
                <Image source={props.photos.length>0 ? {uri:( `https://deway.fr/goto-api/files/photos/${props.photos[0].filename}`)} : require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:windowHeight*0.5,width:'100%', borderTopLeftRadius: 12, borderTopRightRadius:12},
                    ]}/>
                <HikeInfos {...props}/>
            </View>
        </TouchableWithoutFeedback>
    );
}