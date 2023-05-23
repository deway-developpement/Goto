import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        blur: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        containerLogin : {
            flex:1,
            marginTop:'28%',
            marginHorizontal:'7%',
            justifyContent:'center',
            paddingHorizontal:'5%',
            paddingVertical:'5%',
            borderRadius:12
        },
        loginMiddle : {
            marginTop:'6%',
            flex:2.5,
            height:'46%',
            justifyContent:'flex-start'
        },
        textLoginMiddle : {
            fontWeight:'600',
            fontSize: 20,
            paddingBottom:10,
            paddingTop:10,
            color: colors.text,
        },
        header: {
            flex:1,
            paddingTop:'3%',
            paddingHorizontal:'5.8%',
            height:'24%',
            alignItems:'center'
        },
        textHeader : {
            marginTop:'5%',
            color: colors.text,
            fontSize: 36,
            fontWeight: '800',
            
        },
        textInput: {
            height: 40,
            borderColor: colors.border,
            borderRadius: 6,
            borderWidth: 1,
            marginBottom: '4%',
            paddingLeft: 15,
            color: colors.text,
            backgroundColor:'#FFFFFF',
            alignSelf:'stretch',
            fontSize:16
        },
        textInputInvalid: {
            borderColor: 'red',
        },
        btnContainer: {
            flex:1,
            alignItems:'center',
            width:'100%',
            marginTop: '5%',
        },
        btn: {
            backgroundColor: '#264653',
            borderRadius: 6,
            padding: 10,
            
        },
        textBtn: {
            display: 'none',
        },
        textBtn_text: {
            color: colors.primary,
            alignSelf: 'center',
        },
        logo: {
            width: 150,
            height: 150,
        },
    });
export default stylesheet;
