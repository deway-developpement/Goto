import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        inner: {
            padding: 24,
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
        btn: {
            backgroundColor: colors.primary,
            marginBottom: 12,
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
    });
export default stylesheet;
