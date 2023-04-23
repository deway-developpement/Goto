import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {IconComp} from '../Icon/Icon';
import Categorie from '../Categorie/Categorie';
import stylesheet from './style';
import { gql, useQuery } from '@apollo/client';


export default function Search() {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const [search, setSearch] = React.useState('');

    const GET_CATEGORIES = gql `query categories($field: CategorySortFields!, $direction: SortDirection!){
        categories(sorting:{field: $field, direction: $direction}){
            id
            name
            createdAt
        }
    }`;

    const {
        data: categorie,
        loading,
        refetch,
    } = useQuery(
        GET_CATEGORIES
        ,
        {   
            variables:{
                field:'id',
                direction:'ASC',
            }
        },
    );

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
                        style={[styles.textInput]}
                        onSubmitEditing={() => console.log('submit', search)}
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                    />
                    <IconComp color={colors.border} name={'search'} size={24}/>
                </View>
                {!loading && categorie.categories.map((item) => (<Categorie key={item.id} styles={styles} horizontal={false} {...item} />))}

            </ScrollView>
        </SafeAreaView>
    );
}