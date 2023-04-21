import React, { useContext, useEffect, useState } from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import stylesheet from './style';
import { AuthContext } from '../../providers/AuthContext';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createIconSetFromFontello } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { gql, useQuery } from '@apollo/client';

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
            name='plus'
            size={30}
            color={props.color}
        />
    );
}

function Categorie(props) {
    return (
        <TouchableWithoutFeedback onPress={() => console.log('press')} style={[props.styles.container, {height:100, flexDirection:'row', borderRadius:12}, props.horizontal ? {width:'70%'} : {}]}>
            <View style={[props.styles.container, {flexDirection:'row', marginTop:40, marginRight:40, paddingRight:40}, props.styles.backGroundCategorie]}>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:100,width:100, borderTopLeftRadius: 12, borderBottomLeftRadius:12, marginRight:30 },
                    ]}/>
                <Text style={[props.styles.textHeader, {marginLeft:0,fontSize:24, marginTop:35}]}>{props.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function Discover(){
    const authContext = useContext(AuthContext);
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const {
        data: categorie,
        loading: loading,
        refetch: refetch,
    } = useQuery(
        gql `query categories($field: CategorySortFields!, $direction: SortDirection!){
            categories(sorting:{field: $field, direction: $direction}){
                id
                name
                createdAt
            }
        }`,
        {   
            variables:{
                field:'id',
                direction:'ASC',
            }
        },
    );

    if (!loading) {
        console.log(categorie);
    }

    const windowHeight = Dimensions.get('window').height;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={[styles.container,{paddingHorizontal:'7%'}]}
                keyboardShouldPersistTaps={'handled'}
            >

                <Text style={styles.textHeader}>Discover</Text>
                <TouchableWithoutFeedback onPress={()=>console.log('DISCORVER')}>
                    <View style={[styles.container, {flexDirection:'row', marginLeft:'4%', marginTop:20}]}>
                        <Bidule color={colors.logo} />
                        <Text style={[styles.textLink, {textDecorationLine:'', marginLeft:'5%',alignSelf:'center'}]}>Add a hike</Text>
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView
                    style={[styles.container, {marginBottom:40}]}
                    keyboardShouldPersistTaps={'handled'}
                    horizontal={true}
                >
                    <Categorie styles={styles} horizontal={true} name={'temp'}/>
                    <Categorie styles={styles} horizontal={true} name={'temp'}/>
                    <Categorie styles={styles} horizontal={true} name={'temp'}/>

                </ScrollView>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {width: '100%',height:windowHeight*0.5, borderTopLeftRadius: 12, borderTopRightRadius:12 },
                    ]}/>
                <View style={[styles.container,styles.backGroundCategorie,{paddingBottom:'5%', borderBottomRightRadius:12, borderBottomLeftRadius:12}]}>
                    <Text style={[styles.textHeader, {alignSelf:'center'}]}>The better noted</Text>    
                    <Text style={[styles.textLink, {alignSelf:'center'}]}>Discover</Text>
                </View>
                <Text style={[styles.textHeader, {marginTop:40}]}>Unique places</Text>
                {!loading && categorie.categories.map((item, index) => (<Categorie key={item.id} styles={styles} horizontal={false} {...item} />))}
                <View style={{height:windowHeight*0.20}}/>
            </ScrollView>
        </SafeAreaView>
    );
}