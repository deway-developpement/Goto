import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        textHeader: {
            marginTop: '6%',
            color: colors.text,
            fontSize: 38,
            fontWeight: '700',
            paddingLeft:'3%'
        },
        container: {
            width:'100%',
            height:'100%',
            backgroundColor:colors.background,
            flex:1
        }
    });
export default stylesheet;
