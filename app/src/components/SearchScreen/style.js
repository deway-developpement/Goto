import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        textInput: {
            height: 40,
            paddingLeft: 16,
            color: colors.text,
            fontSize: 18,
        },
        textHeader: {
            color: colors.text,
            fontSize: 38,
            fontWeight: '700',
            flex: 1,
        },
        header: {
            marginTop:20,
            marginLeft: 20,
            marginBottom: 29,
            fontWeight: '700',
            fontSize: 32,
        },
        textBtn: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 8,
        },
        textInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: colors.border,
            borderRadius: 6,
            borderWidth: 1,
            backgroundColor: colors.backgroundSecondary,
            paddingHorizontal: 16,
            height: 48,
            marginHorizontal: 20,
        },
        logoContainer: {
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 12,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalContainer: {
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
        subHeader: {
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 16,
            color: colors.primary,
        },
        categoryContainer: {
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 6,
            backgroundColor: colors.empty,
            borderRadius: 24,
        },
        category: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
        },
    });
export default stylesheet;
