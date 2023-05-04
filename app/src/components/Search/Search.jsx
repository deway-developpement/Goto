import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
    Text
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {IconComp} from '../Icon/Icon';
import Categorie from '../Categorie/Categorie';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';
import Hike from '../Hike/Hike';


export default function Search(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    
    const [hikes, setHikes] = React.useState(props?.route?.params?.hikes?.hikes);
    const [search, setSearch] = React.useState('');

    const GET_CATEGORIES = gql `query categories($field: CategorySortFields!, $direction: SortDirection!){
        categories(sorting:{field: $field, direction: $direction}){
            id
            name
            createdAt
        }
    }`;

    const GET_CATEGORY = gql `query categories($name: StringFieldComparison){
        categories(filter:{name: $name}){
            id
            name
            createdAt
        }
    }`;

    const {
        data: categorie,
        loading,
    } =  !search || search=='' ? useQuery(
        GET_CATEGORIES
        ,
        {   
            variables:{
                field:'id',
                direction:'ASC',
            }
        },
    ) : useQuery(
        GET_CATEGORY
        ,
        {   
            variables:{
                name:{like:`${search}%`},
            }
        },
    );

    function handleTextInput(){
        console.log('search : ', search);
        setHikes(null);
    }

    React.useEffect(() => {
        setSearch(props?.route?.params?.category);
        setHikes(props?.route?.params?.hikes?.hikes);
    }, [props?.route?.params]);

    React.useEffect(() => {
        if (search==''){
            setHikes(null);
        }
    }, [search]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={[styles.container,{paddingHorizontal:'7%'}]}
                keyboardShouldPersistTaps={'handled'}
            >
                <View style={[styles.textInputContainer, {marginTop:48}]}>
                    <TextInput
                        placeholder="search"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholderTextColor={colors.border}
                        style={[styles.textInput, {width:'90%'}]}
                        onSubmitEditing={() => handleTextInput()}
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                    />
                    <IconComp color={colors.border} name={'search'} size={24}/>
                </View>
                {hikes && hikes.length!==0 && props?.route?.params?.category && <Text style={[styles.textHeader, {marginBottom:50}]}>{props?.route?.params?.category}</Text>}
                {(!hikes || search=='') && !loading && categorie && categorie.categories.map((item) => (<Categorie key={item.id} id={item.id} horizontal={false} {...item} />))}
                {hikes && hikes.length!==0 && hikes.map((item) => (<Hike key={item.id} id={item.id} category={props?.route?.params?.category}{...item} />))}
                <View style={{height:200}}/>
            </ScrollView>
        </SafeAreaView>
    );
}