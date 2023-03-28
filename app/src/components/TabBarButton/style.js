import { StyleSheet } from 'react-native';

const stylesheet = () =>
    StyleSheet.create({
        wrapper: {
            marginVertical: 10,
            marginHorizontal: 40,
            backgroundColor: '#1D343E',
            borderRadius: 12,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabBarButton: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderRadius: 12,
        },
    });
export default stylesheet;
