import { StyleSheet } from 'react-native';

const stylesheet = (colors, bottomInset = 0) =>
    StyleSheet.create({
        imageMap: {
            backgroundColor: '',
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
            borderColor: colors.border,
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
            color: colors.altText,
            alignSelf: 'center',
        },
        logo: {
            width: 36,
            height: 36,
        },
        tabBar: {
            backgroundColor: colors.primary,
            borderTopEndRadius: 12,
            borderTopStartRadius: 12,
            height: 54 + bottomInset,
            paddingTop: 4,
        },
        tabBarIcon: {
            width: 30,
            height: 30,
            marginBottom: 0,
            marginTop: 0,
        },
        tabBarLabel: {
            fontSize: 12,
            fontWeight: '500',
            lineHeight: 20,
            marginBottom: 0,
        },
        btn: {
            backgroundColor: colors.primary,
            borderRadius: 6,
            padding: 10,
        },
        btnText: {
            fontWeight: '600',
            fontSize: 18,
        },
    });
export default stylesheet;
