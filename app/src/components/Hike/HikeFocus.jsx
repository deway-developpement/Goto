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

function Tag(props){
    const { colors } = useTheme();
    return (
        <View style={{marginLeft:25,marginTop:5,backgroundColor:colors.starFill, flex:1, paddingHorizontal:15, paddingVertical:4, borderRadius:24}}>
            <Text style={{color:colors.backgroundTextInput}}>{props.name}</Text>
        </View>
    );
}

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
            difficulty
            createdAt
            photos {
                id
                filename
            }    
            category {
                name
            }
            tags {
                name
            }
            owner {
                pseudo
                avatar {
                    filename
                }
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

    let tabDiff=[1,-1,-2];
    if (hike?.hike?.difficulty=='MEDIUM'){
        tabDiff[1]=2;
    }
    if (hike?.hike?.difficulty=='HARD'){
        tabDiff[1]=2;
        tabDiff[2]=3;
    }

    console.log(hike?.hike?.tags);

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
                    <View style={[styles.containerFocus, {paddingHorizontal:0}]}> 
                        <Text style={[styles.textDescription, {marginBottom:10, paddingHorizontal:24}]}>Principals caracteristics</Text>
                        <View style={{flexDirection:'row', width:'100%'}}>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center', paddingBottom:10}}>
                                <Text style={[styles.textHeader, {marginTop:10, fontSize:26}]}>{hike.hike.duration}h</Text>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>of walking</Text>
                            </View>
                            <View style={{flex:1, justifyContent:'center', alignItems:'center', marginRight:10, paddingBottom:10}}>
                                <Text style={[styles.textHeader, {marginTop:10, fontSize:26}]}>{hike.hike.distance}km</Text>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>to gotò</Text>
                            </View>
                            <View style={{backgroundColor:colors.styleBar, height:'100%', width:2, marginTop:5}} />
                            <View style={{flex:1, alignItems:'center', paddingBottom:10}}>
                                <View style={{flex:1, flexDirection:'row', marginTop:20}}>
                                    {tabDiff.map(item=><View style={[{width:14, height:14, marginLeft:5, borderRadius:7}, item>0 ? {backgroundColor:colors.starFill}:{backgroundColor:colors.starEmpty}]} key={item}/>)}
                                </View>
                                <Text style={[styles.textDescription, {color:colors.text, marginLeft:8}]}>difficulty</Text>
                            </View>
                        </View>
                        { hike?.hike?.tags.map(item => <Tag key={item.name} name={item.name}/>)}
                    </View>
                }
                {
                    !loading && 
                    <View style={[styles.containerFocus, {flexDirection:'column', alignItems:'center'}]}>
                        <Image source={hike?.hike?.owner?.avatar?.filename ? {uri:( `https://deway.fr/goto-api/files/photos/${hike?.hike?.owner?.avatar?.filename}`)} : require('../../../assets/images/Dalle_background.png')} 
                            style={[
                                {height:30,width:30, borderRadius:15, marginBottom:10},
                            ]}/>
                        <Text style={styles.textDescription}>Hike Created on the {hike?.hike?.createdAt.slice(8,10)}/{hike?.hike?.createdAt.slice(5,7)}/{hike?.hike?.createdAt.slice(0,4)}</Text>
                        <Text style={styles.textDescription}>by <Text style={[styles.textDescription, {color: colors.text}]}>{hike?.hike?.owner?.pseudo}</Text></Text>
                    </View>
                }
                <View style={{height:200}}/>
            </View>
        </View>
    );

}