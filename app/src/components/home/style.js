import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        imageMap:{
            backgroundColor:'',
        },
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        inner: {
            flex: 1,
            justifyContent: 'space-around',
        },
        header: {
            fontSize: 36,
            marginBottom: 48,
            color: colors.text,
        },
        textInput: {
            height: 40,
            borderColor: colors.borders,
            borderRadius: 4,
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 15,
        },
        btnContainer: {
            backgroundColor: 'white',
            marginTop: 12,
        },
        textBtn: {
            display: 'none',
        },
        textBtn_text: {
            color: colors.link,
            alignSelf: 'center',
        },
        logo: {
            width: 36,
            height: 36,
        },
        tabBar: {
            backgroundColor: colors.link,
            borderTopEndRadius: 12,
            borderTopStartRadius: 12,
            flex: 1,
            height: 'auto',
            position: 'absolute',
        },
        btn: {
            backgroundColor: colors.link,
            borderRadius: 6,
            padding: 10,
        },
        btnText: {
            fontWeight: '600',
            fontSize: 18,
        },
    });
export default stylesheet;
