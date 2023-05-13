import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import stylesheet from './style';
import { useNavigation } from '@react-navigation/native';

export default function Category(props) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);
    const navigation = useNavigation();

    const windowWidth = Dimensions.get('window').width;

    function handleClickCategory(category, categoryName) {
        navigation.navigate('Search', {
            category: categoryName,
        });
    }
    return (
        <TouchableWithoutFeedback
            onPress={() => handleClickCategory(props.id, props.name)}
        >
            <View
                style={[
                    styles.container,
                    {
                        flexDirection: 'row',
                        marginTop: 20,
                        marginRight: 40,
                        paddingRight: 40,
                        backgroundColor: colors.backgroundTextInput,
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                    },
                    props.horizontal ? { width: windowWidth * 0.7 } : {},
                ]}
            >
                <Image
                    source={
                        props.defaultPhoto
                            ? {
                                uri: `https://deway.fr/goto-api/files/photos/${props.defaultPhoto.filename}`,
                            }
                            : require('../../../assets/images/Dalle_background.png')
                    }
                    style={[
                        {
                            height: windowWidth * 0.2,
                            width: windowWidth * 0.2,
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                            marginRight: 17,
                        },
                    ]}
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        width: windowWidth * 0.5,
                        height: windowWidth * 0.2,
                    }}
                >
                    <Text
                        style={[
                            styles.textHeader,
                            { marginLeft: 0, fontSize: 20 },
                        ]}
                    >
                        {props.name}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
