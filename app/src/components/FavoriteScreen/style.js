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
        }
    });
export default stylesheet;
