import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import {IconComp} from '../Icon/Icon';
import HikeInfos from './HikeInfos';

export default function FocusHike(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const GET_HIKES = gql `query hike($id: ID!){
        hike(id: $id){
            id
            name
            description
            duration
            distance
            photos {
                id
                filename
            }    
            category {
                name
            }
        }
    }`;

    const {
        data: hike,
        loading,
    } = useQuery(
        GET_HIKES
        ,
        {   
            variables:{
                id:props.id
            }
        },
    );

    return (
        <View style={{flex:1}}>
            <Image
                source={!loading && hike.hike.photos && hike.hike.photos.length>0 ? {uri:( `https://deway.fr/goto-api/files/photos/${hike.hike.photos[0].filename}`)} : require('../../../assets/images/Dalle_background.png')}
                style={[
                    StyleSheet.absoluteFill,
                    { width: '100%', height: '100%' },
                ]}
            />
            <View style={[{flex:1,marginHorizontal:14, marginTop:48, flexDirection:'column', alignItems:'flex-start'}]}>
                <TouchableWithoutFeedback onPress={()=>navigation.navigate('Search')}>
                    <View style={[styles.logoContainer, {marginBottom:36}]}>
                        <IconComp color={colors.background} name={'back'} pos={0}/>
                    </View>
                </TouchableWithoutFeedback>
                { !loading && <HikeInfos {...hike.hike} category={hike.hike.category.name} {...props} borderRadius={12}/>}
                { !loading && 
                    <View style={styles.containerFocus}> 
                        <Text style={[styles.textDescription]}>Principals caracteristics</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={[styles.textHeader, {marginTop:10}]}>{hike.hike.duration}h</Text>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>of walking</Text>
                            </View>
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={[styles.textHeader, {marginTop:10}]}>{hike.hike.distance}km</Text>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>to gotò</Text>
                            </View>
                            <View style={{backgroundColor:colors.styleBar, height:'100%', width:2}} />
                            <View style={{flex:1, justifyContent:'center'}}>
                                <Text style={[styles.textHeader, {marginTop:10}]}>{hike.hike.distance}km</Text>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>to gotò</Text>
                            </View>
                        </View>
                    </View>}
                <View style={{height:1500}}/>
            </View>
        </View>
    );

}