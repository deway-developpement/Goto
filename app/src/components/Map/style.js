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
    });

export default stylesheet;
