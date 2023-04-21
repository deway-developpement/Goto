import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 24,
            paddingHorizontal: 9,
        },
        header: {
            fontSize: 36,
            fontWeight: '700',
            color: colors.text,
        },
        textContent: {
            fontSize: 22,
            fontWeight: '800',
            color: colors.link,
            marginLeft: 2,
            marginBottom: 14,
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
        modalView: {
            marginHorizontal: 45,
            marginTop: 160,
            marginBottom: 284,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 22,
            backgroundColor: colors.backgroundTextInput,
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
            color: colors.link,
        },
        smallModalText: {
            fontSize: 14,
            fontWeight: '400',
            color: colors.link,
            marginLeft: 13,
        },
        statContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.backgroundTextInput,
            borderRadius: 12,
            padding: 30,
            marginBottom: 46,
        },
        statLabel: {
            fontSize: 12,
            fontWeight: '400',
            color: colors.link,
            marginTop: 4,
        },
        statNumber: {
            fontSize: 24,
            fontWeight: '800',
            color: colors.statstext,
            marginTop: 10,
        },
    });
export default stylesheet;
