import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        logoContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
        closeIcon: {
            marginTop: 11,
            color: colors.altText,
        },
        smallModalText: {
            fontSize: 14,
            fontWeight: '400',
            color: colors.altText,
            marginLeft: 13,
        },
    });

export default stylesheet;
