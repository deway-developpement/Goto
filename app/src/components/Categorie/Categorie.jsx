import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableWithoutFeedback,
} from 'react-native';

export default function Categorie(props) {
    return (
        <TouchableWithoutFeedback onPress={() => console.log('press')}>
            <View style={[props.styles.container, {flexDirection:'row', marginTop:40, marginRight:40, paddingRight:40}, props.styles.backGroundCategorie, props.horizontal ? {width:400} : {}]}>
                <Image source={require('../../../assets/images/Dalle_background.png')} 
                    style={[
                        {height:100,width:100, borderTopLeftRadius: 12, borderBottomLeftRadius:12, marginRight:30 },
                    ]}/>
                <Text style={[props.styles.textHeader, {marginLeft:0,fontSize:24, marginTop:35}]}>{props.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}