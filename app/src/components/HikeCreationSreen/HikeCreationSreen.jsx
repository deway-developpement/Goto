import React, { useRef } from 'react';
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

function Tag(props) {
    const { colors } = useTheme();
    console.log('props', props);
    return (
        <View
            style={{
                marginHorizontal: 10,
                marginTop: 10,
                backgroundColor: colors.starFill,
                paddingHorizontal: 20,
                paddingVertical: 4,
                borderRadius: 24,
            }}
        >
            <Text style={{ color: colors.backgroundTextInput }}>{props.name}</Text>
        </View>
    );
}

export default function HikeCreationScreen({ setHikeCreation, navigation }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const client = useApolloClient();

    const [name, setName] = React.useState(null);
    const [distance, setDistance] = React.useState(null);
    const distanceRef = useRef(null);
    const [elevation, setElevation] = React.useState(null);
    const elevationRef = useRef(null);
    const [description, setDescription] = React.useState(null);
    const descriptionRef = useRef(null);
    const [latitude, setLatitude] = React.useState(1.11111);
    const [longitude, setLongitude] = React.useState(1.11111);
    const [categoryId, setCategoryId] = React.useState(null);
    const [tagsID, setTagsID] = React.useState(null);
    const tagsIDRef = useRef(null);
    const [difficulty, setDifficulty] = React.useState('EASY');

    const [tagList, setTagList] = React.useState([]);

    const [fileUri, setFileUri] = React.useState(null);

    const GET_CATEGORIES = gql`
        query categories($field: CategorySortFields!, $direction: SortDirection!) {
            categories(sorting: { field: $field, direction: $direction }) {
                id
                name
            }
        }
    `;

    const { data } = useQuery(GET_CATEGORIES, {
        variables: {
            field: 'id',
            direction: 'ASC',
        },
    });

    function addNewTag() {
        setTagList([...tagList, tagsID]);
        setTagsID('');
    }

    const pickDocument = async () => {
        const file = await DocumentPicker.getDocumentAsync({});
        console.log('file', file);
        setFileUri(file);
    };

    function isInt(n, str) {
        return n !== Infinity && String(n) === str && n > 0;
    }

    function isInDesiredForm(str) {
        var n = Math.floor(Number(str));
        return isInt(n, str) || (!isNaN(str) && str.toString().indexOf('.') != -1);
    }

    const submit = async () => {
        if (
            name.length > 0 &&
            distance.length > 0 &&
            isInDesiredForm(distance) &&
            elevation.length > 0 &&
            isInDesiredForm(elevation) &&
            description.length > 0 &&
            latitude !== null &&
            longitude !== null &&
            categoryId !== null &&
            fileUri !== null &&
            fileUri.name.slice(-4) === '.gpx'
        ) {
            const file = new ReactNativeFile({
                uri: fileUri.uri,
                type: 'application/gpx+xml',
                name: 'file.gpx',
            });

            const MUTATION = gql`
                mutation ($file: Upload!, $categoryId: String!) {
                    createHike(
                        input: {
                            name: "test"
                            description: "super hike"
                            distance: 40
                            elevation: 500
                            difficulty: EASY
                            track: $file
                            tagsId: []
                            categoryId: $categoryId
                            latitude: 47.99511
                            longitude: 0.18544
                        }
                    ) {
                        id
                    }
                }
            `;
            const res = await client.mutate({
                mutation: MUTATION,
                variables: {
                    file,
                    categoryId,
                },
                errorPolicy: 'all',
            });
            if (res.errors) {
                console.log(res.errors);
            }
            const hikeId = res.data.createHike.id;
            navigation.navigate('Hike', { hikeId });
        } else {
            console.log(
                name.length > 0,
                distance.length > 0,
                isInDesiredForm(distance),
                elevation.length > 0,
                isInDesiredForm(elevation),
                description.length > 0,
                latitude !== null,
                longitude !== null,
                categoryId.length > 0,
                fileUri !== null,
                fileUri.name.slice(-4, -1) + fileUri.name.slice(-1) === '.gpx'
            );
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
                    <TouchableWithoutFeedback onPress={() => setHikeCreation(false)}>
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
                        onSubmitEditing={() => tagsIDRef.current.focus()}
                    />
                    <View
                        style={{
                            backgroundColor: colors.backgroundTextInput,
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
                            backgroundColor: colors.backgroundTextInput,
                            borderRadius: 15,
                            marginTop: 15,
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text style={[styles.textLoginMiddle, { alignSelf: 'center' }]}>
                            Category
                        </Text>
                        <FlatList
                            data={data?.categories}
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
                    <Text style={[styles.textLoginMiddle, { marginBottom: 30 }]}>
                        GPX File :{' '}
                        {fileUri !== null &&
                            (fileUri?.name?.slice(-4, -1) + fileUri?.name?.slice(-1) === '.gpx'
                                ? fileUri.name
                                : 'Wrong file type')}
                    </Text>

                    <Button
                        title="Select Document"
                        onPress={() => pickDocument()}
                        buttonStyle={[styles.btn, { marginBottom: 30, width: 200 }]}
                        titleStyle={styles.btnText}
                    />

                    <TextInput
                        ref={tagsIDRef}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="tagsID"
                        placeholderTextColor={colors.border}
                        style={[styles.textInput, { marginBottom: 20 }]}
                        onChangeText={(text) => setTagsID(text)}
                        value={tagsID}
                        onSubmitEditing={() => addNewTag()}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {tagList.length > 0 && tagList.map((tag) => <Tag key={tag} name={tag} />)}
                    </View>
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
