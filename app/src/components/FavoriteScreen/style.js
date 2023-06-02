import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        textHeader: {
            marginTop: '4%',
            color: colors.text,
            fontSize: 36,
            fontWeight: '700',
        },
        textSubHeader: {
            marginTop: '4%',
            color: colors.primary,
            fontSize: 24,
            fontWeight: '700',
        },
        modalView: {
            marginHorizontal: '10%',
            top: '20%',
            borderRadius: 12,
            paddingHorizontal: 22,
            paddingTop: 16,
            paddingBottom: 30,
            backgroundColor: colors.backgroundSecondary,
            width: '80%',
            position: 'absolute',
        },
        modalText: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 19,
            marginLeft: 3,
        },
        textInput: {
            height: 40,
            borderColor: colors.border,
            borderRadius: 6,
            borderWidth: 1,
            marginBottom: '4%',
            paddingLeft: 15,
            color: colors.text,
            backgroundColor: colors.backgroundSecondary,
            alignSelf: 'stretch',
            fontSize: 16,
        },
        textLoginMiddle: {
            fontWeight: '600',
            fontSize: 20,
            paddingBottom: 10,
            paddingTop: 10,
            color: colors.text,
        },
        btnContainer: {
            flex: 1,
            alignItems: 'center',
            width: '100%',
            marginTop: '5%',
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
        textBtn: {
            display: 'none',
        },
        textBtn_text: {
            color: colors.primary,
        },
        container: {
            flex: 1,
            paddingTop: 10,
            paddingHorizontal: 9,
        },
        logoContainer: {
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingRight: 2,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
    });
export default stylesheet;
