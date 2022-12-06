import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useKeyboardVisible } from '../services/keyboard.service';
import React from 'react';

export default function KeyboardDismissView(props) {

    const visible = useKeyboardVisible();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={!visible}>
            {props.children}
        </TouchableWithoutFeedback>
    );
}