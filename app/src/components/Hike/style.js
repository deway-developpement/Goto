import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        textHeader: {
            marginTop: '6%',
            color: colors.text,
            fontSize: 32,
            fontWeight: '700',
            paddingLeft:'3%'
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
        containerFocus : {
            width:'100%',
            height:'100%',
            backgroundColor:colors.backgroundTextInput,
            flex:1,
            flexDirection:'column',
            alignItems:'flex-start',
            borderRadius:12,
            marginTop:35,
            padding:20
        },
        textDescription:{
            fontSize:16,
            fontWeight:'400',
            color:colors.description,
        },
        logoContainer:{
            width:50,
            height:50,
            backgroundColor:colors.logo,
            borderRadius:12,
            flex:1,
            alignItems:'center',
            justifyContent:'center',
        }
    });
export default stylesheet;
