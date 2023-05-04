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
        textLink: {
            color: colors.link,
            fontSize: 20,
            fontWeight: '400',
            textDecorationLine:'underline'
        },
        logo: {
            width: 150,
            height: 150,
        },
        container: {
            width:'100%',
            height:'100%',
            backgroundColor:colors.backgroundTextInput,
            flex:1,
            flexDirection:'column',
            alignItems:'center',
        },
        textDescription:{
            fontSize:20,
            fontWeight:'400',
            color:colors.description,
        }
    });
export default stylesheet;
