import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            fontSize: 36,
            marginBottom: 48,
            color: colors.text,
        },
        logo: {
            width: 36,
            height: 36,
        },
    });
export default stylesheet;
