import { DefaultTheme } from '@react-navigation/native';

export const Classic = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#FDFEFE',
        backgroundTextInput: '#FFFFFF',
        text: '#201F30',
        link: '#264653',
        primary: '#DFE17B',
        secondary: '#80C8D2',
        accent: '#D1406C',
        border: '#A49DAA',
        accentuated: '#1D343E',
        lineprimary: '#00B0FF',
        borderlineprimary: '#1c68d1',
        linesecondary: '#bbbdbf',
        borderlinesecondary: '#8c8f91',
    },
};

export const Dark = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#201F30',
        text: '#FDFEFE',
        link: '#5B774B',
        primary: '#5B774B',
        secondary: '#80C8D2',
        accent: '#D1406C',
        border: '#FDFEFE',
        accentuated: '#1D343E',
        line: '#00B0FF',
    },
};
