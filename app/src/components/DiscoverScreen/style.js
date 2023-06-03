import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        textHeader: {
            marginTop: '4%',
            color: colors.text,
            fontSize: 32,
            fontWeight: '700',
            paddingLeft: '3%',
        },
        textLink: {
            color: colors.altText,
            fontSize: 16,
            fontWeight: '400',
            textDecorationLine: 'underline',
        },
        logo: {
            width: 150,
            height: 150,
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.background,
            flex: 1,
        },
    });
export default stylesheet;
