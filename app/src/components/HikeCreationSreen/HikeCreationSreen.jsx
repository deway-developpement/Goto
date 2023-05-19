import React, {useRef} from 'react';
import {
    View,
    TextInput,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Button
} from 'react-native';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { gql, useQuery, useApolloClient } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import * as DocumentPicker from 'expo-document-picker';
import FileSystem from 'expo-file-system';

export default function HikeCreationScreen({setHikeCreation, categories}) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const [name, setName] = React.useState('');
    const [distance, setDistance] = React.useState('');
    const distanceRef = useRef(null);
    const [elevation, setElevation] = React.useState('');
    const elevationRef = useRef(null);
    const [description, setDescription] = React.useState('');
    const descriptionRef = useRef(null);
    const [latitude, setLatitude] = React.useState('');
    const latitudeRef = useRef(null);
    const [longitude, setLongitude] = React.useState('');
    const longitudeRef = useRef(null);
    const [categoryName, setCategoryName] = React.useState('');
    const [tagsID, setTagsID] = React.useState('');
    const tagsIDRef = useRef(null);
    const [difficulty, setDifficulty] = React.useState('EASY');

    const [tagList, setTagList] = React.useState([]);

    const [file, setFile] = React.useState(null);

    function addNewTag(){
        setTagList([...tagList, tagsID]);
        setTagsID('');
    }

    const pickDocument = async () => {
        setFile(await DocumentPicker.getDocumentAsync({}));

        console.log(file.uri);

        // FileSystem.readAsStringAsync(file.uri, {
        //     encoding: FileSystem.EncodingType.Base64
        // }).then(data => {
        //     console.log('getFile -> data', data);
        // }).catch(err => {
        //     console.log('getFile -> err', err);
        // });
    };

    function isInt(n, str){
        return n !== Infinity && String(n) === str && n > 0;
    }


    function isInDesiredForm(str) {
        var n = Math.floor(Number(str));
        return (isInt(n, str)) || (!isNaN(str) && str.toString().indexOf('.') != -1);
    }

    const submit = async () => {
        if(name.length>0 && distance.length>0 && isInDesiredForm(distance) && elevation.length>0 && isInDesiredForm(elevation) && description.length>0 && latitude.length>0  && isInDesiredForm(latitude) && longitude.length>0  && isInDesiredForm(longitude) && categoryName.length>0 && tagList.length>0 && file!==null && file.name.slice(-4, -1)+ file.name.slice(-1)==='.gpx'){
            // const MUTATION = gql`
            //     mutation ($file: Upload!, $objId: String!, $objType: ObjType!) {
            //         createPhoto(
            //             input: { objId: $objId, objType: $objType, file: $file }
            //         ) {
            //             id
            //         }
            //     }
            // `;
            // await client.mutate({
            //     mutation: MUTATION,
            //     variables: {
            //         file,
            //         objId: profil.whoami.id,
            //         objType: 'USER',
            //     },
            //     errorPolicy: 'all',
            // });

            // if int CONVERT INTO FLOAT
            
            console.log('ok');
        } else {
            console.log('not ok');
        }
    };
    console.log(file);
    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => setHikeCreation(false)}
            >
                <View
                    style={[
                        styles.logoContainer,
                        {
                            position: 'absolute',
                            top: '5%',
                            left: '5%',
                            zIndex: 1000,
                        },
                    ]}
                >
                    <IconComp
                        color={colors.background}
                        name={'back'}
                        pos={0}
                    />
                </View>
            </TouchableWithoutFeedback>
            <View style={{height:200}}/>
            <TextInput
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholder="name"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onSubmitEditing={() => distanceRef.current.focus()}
                onChangeText={(text) => setName(text)}
                value={name}
            />
            <TextInput
                ref={distanceRef}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="distance"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onChangeText={(text) => setDistance(text)}
                value={distance}
                onSubmitEditing={() => elevationRef.current.focus()}
            />
            <TextInput
                ref={elevationRef}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="elevation"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onChangeText={(text) => setElevation(text)}
                value={elevation}
                onSubmitEditing={() => descriptionRef.current.focus()}
            />
            <TextInput
                ref={descriptionRef}
                autoCorrect={false}
                autoCapitalize="sentences"
                placeholder="description"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onChangeText={(text) => setDescription(text)}
                onSubmitEditing={() => latitudeRef.current.focus()}
                value={description}
            />
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableWithoutFeedback
                    onPress={() => setDifficulty('EASY')}
                >
                    <View>
                        <Text style={[styles.textLoginMiddle, difficulty!=='EASY' ? {color:colors.border} : {}]}>EASY</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => setDifficulty('MEDIUM')}
                >
                    <View>
                        <Text style={[styles.textLoginMiddle, difficulty!=='MEDIUM' ? {color:colors.border} : {}]}>MEDIUM</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={() => setDifficulty('HARD')}
                >
                    <View>
                        <Text style={[styles.textLoginMiddle, difficulty!=='HARD' ? {color:colors.border} : {}]}>HARD</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <TextInput
                ref={latitudeRef}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="latitude"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onChangeText={(text) => setLatitude(text)}
                onSubmitEditing={() => longitudeRef.current.focus()}
                value={latitude}
            />
            <TextInput
                ref={longitudeRef}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="longitude"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onSubmitEditing={() => tagsIDRef.current.focus()}
                onChangeText={(text) => setLongitude(text)}
                value={longitude}
            />
            <ScrollView
                contentContainerStyle={{flex: 1}}
                keyboardShouldPersistTaps={'handled'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >

                {categories.map((category) => (
                    <TouchableWithoutFeedback
                        onPress={() => setCategoryName(category.name)}
                        key={category.name}
                    >
                        <View>
                            <Text style={[styles.textLoginMiddle,{marginRight:15}, categoryName!==category.name ? {color:colors.border} : {}]}>{category.name}</Text>
                        </View>
                    </TouchableWithoutFeedback>))}
            </ScrollView>
            
            <Text style={styles.textLoginMiddle}>GPX File : {file !== null && (file.name.slice(-4, -1)+ file.name.slice(-1)==='.gpx' ? file.name : 'Wrong file type')}</Text>
            
            <Button
                title="Select Document"
                onPress={() => pickDocument()}
            />

            <TextInput
                ref={tagsIDRef}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="tagsID"
                placeholderTextColor={colors.border}
                style={[
                    styles.textInput
                ]}
                onChangeText={(text) => setTagsID(text)}
                value={tagsID}
                onSubmitEditing={() => addNewTag()}
            />
            {tagList.length>0 && tagList.map((tag) => (<Text key={tag}>{tag}</Text>))}
            <Button
                title="Submit"
                onPress={() => submit()}
            />
        </View>
    );
}