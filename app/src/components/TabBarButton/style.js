import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        wrapper: {
            marginVertical: 10,
            marginHorizontal: 40,
            marginBottom: 10,
            borderRadius: 12,
            minHeight: 50,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabBarButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
        },
        selected: {
            backgroundColor: colors.accentuated,
        },
    });
export default stylesheet;
