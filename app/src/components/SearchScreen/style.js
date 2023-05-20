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
            paddingLeft: '3%',
        },
        textInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderColor: colors.border,
            borderRadius: 6,
            borderWidth: 1,
            backgroundColor: colors.backgroundsecondary,
            paddingHorizontal: 16,
            height: 48,
        },
        logoContainer: {
            width: 50,
            height: 50,
            backgroundColor: colors.link,
            borderRadius: 12,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
export default stylesheet;
