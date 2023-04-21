import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 0.7,
            backgroundColor: colors.background,
            paddingTop: 27,
            paddingHorizontal: 20,
        },
        header: {
            fontSize: 36,
            fontWeight: '700',
            color: colors.text,
        },
        textSettings: {
            marginTop: 7.5,
            fontSize: 14,
            fontWeight: '500',
            color: colors.link,
        },
        avatarContainer: {
            backgroundColor: colors.backgroundTextInput,
            borderRadius: 50,
            width: 66,
            height: 66,
            alignSelf: 'center',
            padding: 1,
        },
        avatar: {
            width: 64,
            height: 64,
            borderRadius: 50,
            alignSelf: 'center',
            backgroundColor: colors.border,
        },
        pseudo: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.link,
            alignSelf: 'center',
            marginTop: 12,
            marginBottom: 12,
        },
        btnContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn: {
            backgroundColor: colors.label,
            color: colors.link,
            borderRadius: 6,
        },
        centeredView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 45,
            marginTop: 160,
            marginBottom: 284,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 19,
            backgroundColor: colors.backgroundTextInput,
        },
        modalText: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 12,
            marginLeft: 3,
        },
        closeIcon: {
            marginTop: 11,
            color: colors.link,
        },
    });
export default stylesheet;
