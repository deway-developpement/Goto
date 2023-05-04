import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';

export default function Categorie(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const GET_HIKES = gql `query hikes($category: HikeFilterCategoryFilter){
        hikes(filter:{category : $category}){
            id
            name
            description
            photos {
                id
                filename
            }    
        }
    }`;

    const {
        data: hikes,
        loading,
    } = useQuery(
        GET_HIKES
        ,
        {   
            variables:{
                category:{id:{eq:props.id}}
            }
        },
    );
    function handleClickCategory(category, hikes, categoryName){
        if (!loading) {
            navigation.navigate('Search', { hikes: hikes, category: categoryName});
        }
    }
    console.log(hikes)
    return (
        <TouchableWithoutFeedback onPress={() => handleClickCategory(props.id, hikes, props.name)}>
            <View style={[styles.container, {flexDirection:'row', marginTop:40, marginRight:40, paddingRight:40, backgroundColor:colors.backgroundTextInput}, props.horizontal ? {width:400} : {}]}>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:100,width:100, borderTopLeftRadius: 12, borderBottomLeftRadius:12, marginRight:30 },
                    ]}/>
                <Text style={[styles.textHeader, {marginLeft:0,fontSize:24, marginTop:35}]}>{props.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}