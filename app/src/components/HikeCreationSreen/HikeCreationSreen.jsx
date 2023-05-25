import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Image,
    StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import stylesheet from './style';
import { useTheme } from '@react-navigation/native';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { IconComp } from '../Icon/Icon';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';
import { ReactNativeFile } from 'apollo-upload-client';
import { FlatList } from 'react-native-gesture-handler';
import { readAsStringAsync } from 'expo-file-system';
import { DOMParser } from 'xmldom';
import * as ImagePicker from 'expo-image-picker';

export default function HikeCreationScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const [name, setName] = useState('');
    const [distance, setDistance] = useState('');
    const distanceRef = useRef(null);
    const [elevation, setElevation] = useState('');
    const elevationRef = useRef(null);
    const [description, setDescription] = useState('');
    const descriptionRef = useRef(null);
    const [categoryId, setCategoryId] = useState('');
    const [difficulty, setDifficulty] = useState('EASY');

    const [tagList, setTagList] = useState([]);

    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    const [error, setError] = useState(null);

    const GET_CATEGORIES = gql`
        query {
            categories {
                id
                name
            }
        }
    `;

    const { data: categories } = useQuery(GET_CATEGORIES);

    const GET_TAGS = gql`
        query {
            tags {
                id
                name
            }
        }
    `;

    const { data: tags } = useQuery(GET_TAGS);

    function toggleTag(tagId) {
        if (tagList.includes(tagId)) {
            setTagList(tagList.filter((id) => id !== tagId));
        } else {
            setTagList([...tagList, tagId]);
        }
    }

    const pickDocument = async () => {
        const file = await DocumentPicker.getDocumentAsync({});
        if (file.type !== 'success') return;
        setFile(file);
    };

    const pickImage = async () => {
        if (status !== 'granted') {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }
        const file = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        setImage(file);
    };

    function getFirstPointOfGPX(content) {
        const doc = new DOMParser().parseFromString(content, 'text/xml');
        const trkpts = doc.getElementsByTagName('trkpt');
        const trkptsArray = Array.from(trkpts);
        const trkptsArrayLat = trkptsArray.map((trkpt) => trkpt.getAttribute('lat'));
        const trkptsArrayLon = trkptsArray.map((trkpt) => trkpt.getAttribute('lon'));
        return [parseFloat(trkptsArrayLat[0]), parseFloat(trkptsArrayLon[0])];
    }

    const submit = async () => {
        if (
            name !== '' &&
            !isNaN(parseFloat(distance)) &&
            !isNaN(parseInt(elevation)) &&
            description.length > 0 &&
            categoryId !== null &&
            file !== null &&
            file.name.slice(-4) === '.gpx'
        ) {
            const reactFile = new ReactNativeFile({
                uri: file.uri,
                type: 'application/gpx+xml',
                name: 'file.gpx',
            });

            // read content of file
            const fileData = await readAsStringAsync(file.uri);
            const coordinates = getFirstPointOfGPX(fileData);

            const MUTATION = gql`
                mutation (
                    $file: Upload!
                    $categoryId: String!
                    $name: String!
                    $description: String!
                    $distance: Float!
                    $elevation: Float!
                    $difficulty: Difficulty!
                    $latitude: Float!
                    $longitude: Float!
                    $tagsId: [String!]!
                ) {
                    createHike(
                        input: {
                            name: $name
                            description: $description
                            distance: $distance
                            elevation: $elevation
                            difficulty: $difficulty
                            track: $file
                            categoryId: $categoryId
                            latitude: $latitude
                            longitude: $longitude
                            tagsId: $tagsId
                        }
                    ) {
                        id
                    }
                }
            `;
            const res = await client.mutate({
                mutation: MUTATION,
                variables: {
                    file: reactFile,
                    categoryId,
                    name,
                    description,
                    distance: parseFloat(distance),
                    elevation: parseFloat(elevation),
                    difficulty,
                    latitude: coordinates[0],
                    longitude: coordinates[1],
                    tagsId: tagList,
                },
                errorPolicy: 'all',
            });
            if (res.errors) {
                console.log(res.errors);
                return;
            }

            const hikeId = res.data?.createHike.id;
            if (hikeId) {
                if (image !== null && !image.canceled) {
                    const reactImage = new ReactNativeFile({
                        uri: image.assets[0].uri,
                        type: 'image/jpeg',
                        name: 'file.jpg',
                    });
                    const MUTATION = gql`
                        mutation ($file: Upload!, $hikeId: String!) {
                            createPhoto(input: { file: $file, objId: $hikeId, objType: HIKE }) {
                                id
                            }
                        }
                    `;
                    const res = await client.mutate({
                        mutation: MUTATION,
                        variables: {
                            file: reactImage,
                            hikeId,
                        },
                        errorPolicy: 'all',
                    });
                    if (res.errors) {
                        console.log(res.errors);
                        return;
                    }
                }
                navigation.navigate('FocusHike', { hikeId });
            }
        } else {
            if (name === '') {
                setError('Le nom ne peut pas être vide');
            }
            if (isNaN(parseFloat(distance))) {
                setError('La distance doit être un nombre');
            }
            if (isNaN(parseInt(elevation))) {
                setError('Le dénivelé doit être un nombre');
            }
            if (description.length === 0) {
                setError('La description ne peut pas être vide');
            }
            if (categoryId === null) {
                setError('La catégorie ne peut pas être vide');
            }
            if (file === null) {
                setError('Le fichier ne peut pas être vide');
            }
            if (file !== null && file.name.slice(-4) !== '.gpx') {
                setError('Le fichier doit être un fichier GPX');
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={require('../../../assets/images/Dalle_background.png')}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
            />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps={'handled'}
                showsHorizontalScrollIndicator={false}
            >
                <BlurView style={styles.containerLogin} intensity={100} tint="light">
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                        <View
                            style={[
                                styles.logoContainer,
                                {
                                    position: 'absolute',
                                    top: '2%',
                                    left: '5%',
                                    zIndex: 1000,
                                },
                            ]}
                        >
                            <IconComp color={colors.background} name={'back'} pos={0} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.header, { marginBottom: 15 }]}>
                        <Image
                            source={require('../../../assets/images/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.textHeader}>Create a Hike !</Text>
                    </View>
                    <Text style={styles.textLoginMiddle}>Name</Text>
                    <TextInput
                        autoCorrect={false}
                        autoCapitalize="sentences"
                        placeholder="name"
                        placeholderTextColor={colors.border}
                        style={[styles.textInput]}
                        onSubmitEditing={() => distanceRef.current.focus()}
                        onChangeText={(text) => setName(text)}
                        value={name}
                    />
                    <Text style={styles.textLoginMiddle}>Distance</Text>
                    <TextInput
                        ref={distanceRef}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="distance (km)"
                        keyboardType="decimal-pad"
                        maxLength={4}
                        placeholderTextColor={colors.border}
                        style={[styles.textInput]}
                        onChangeText={(text) => setDistance(text)}
                        value={distance}
                        onSubmitEditing={() => elevationRef.current.focus()}
                    />
                    <Text style={styles.textLoginMiddle}>Elevation</Text>
                    <TextInput
                        ref={elevationRef}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="elevation (m)"
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholderTextColor={colors.border}
                        style={[styles.textInput]}
                        onChangeText={(text) => setElevation(text)}
                        value={elevation}
                        onSubmitEditing={() => descriptionRef.current.focus()}
                    />
                    <Text style={styles.textLoginMiddle}>Description</Text>
                    <TextInput
                        ref={descriptionRef}
                        autoCorrect={false}
                        autoCapitalize="sentences"
                        placeholder="description"
                        placeholderTextColor={colors.border}
                        style={[styles.textInput]}
                        onChangeText={(text) => setDescription(text)}
                        value={description}
                    />
                    <View
                        style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderRadius: 15,
                            marginTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>
                            Difficulty
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => setDifficulty('EASY')}>
                                <View>
                                    <Text
                                        style={[
                                            styles.textLoginMiddle,
                                            difficulty !== 'EASY' ? { color: colors.border } : {},
                                        ]}
                                    >
                                        EASY
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setDifficulty('MEDIUM')}>
                                <View>
                                    <Text
                                        style={[
                                            styles.textLoginMiddle,
                                            difficulty !== 'MEDIUM' ? { color: colors.border } : {},
                                        ]}
                                    >
                                        MEDIUM
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setDifficulty('HARD')}>
                                <View>
                                    <Text
                                        style={[
                                            styles.textLoginMiddle,
                                            difficulty !== 'HARD' ? { color: colors.border } : {},
                                        ]}
                                    >
                                        HARD
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderRadius: 15,
                            marginTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>
                            Category
                        </Text>
                        <FlatList
                            data={categories?.categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback onPress={() => setCategoryId(item.id)}>
                                    <View>
                                        <Text
                                            style={[
                                                styles.textLoginMiddle,
                                                {
                                                    marginRight: 30,
                                                    paddingVertical: 15,
                                                },
                                                categoryId !== item.id
                                                    ? { color: colors.border }
                                                    : {},
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <View
                        style={{
                            backgroundColor: colors.backgroundSecondary,
                            borderRadius: 15,
                            marginTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>Tags</Text>
                        <FlatList
                            data={tags?.tags}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback onPress={() => toggleTag(item.id)}>
                                    <View>
                                        <Text
                                            style={[
                                                styles.textLoginMiddle,
                                                {
                                                    marginRight: 30,
                                                    paddingVertical: 15,
                                                },
                                                tagList.includes(item.id)
                                                    ? {}
                                                    : { color: colors.border },
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <Text style={[styles.textLoginMiddle, { marginBottom: 30 }]}>
                        GPX File :{' '}
                        {file !== null &&
                            (file?.name?.slice(-4) === '.gpx' ? file.name : 'Wrong file type')}
                    </Text>
                    <Button
                        title="Select Document"
                        onPress={() => pickDocument()}
                        buttonStyle={[styles.btn, { marginBottom: 30, width: 200 }]}
                        titleStyle={styles.btnText}
                    />

                    <Text style={[styles.textLoginMiddle, { marginBottom: 30 }]}>
                        Photo :{' '}
                        {file !== null &&
                            (file?.name?.split('.')[1] in ['jpeg', 'jpg', 'png']
                                ? file.name
                                : 'Wrong file type')}
                    </Text>
                    <Button
                        title="Select Image"
                        onPress={() => pickImage()}
                        buttonStyle={[styles.btn, { marginBottom: 30, width: 200 }]}
                        titleStyle={styles.btnText}
                    />
                    {error !== '' && (
                        <Text style={[styles.textLoginMiddle, { color: 'red' }]}>{error}</Text>
                    )}
                    <Button
                        title="Submit"
                        onPress={() => submit()}
                        buttonStyle={[styles.btn, { width: 200, marginTop: 30 }]}
                        titleStyle={styles.btnText}
                    />
                    <View style={{ height: 100 }} />
                </BlurView>
            </ScrollView>
        </View>
    );
}
