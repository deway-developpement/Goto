import { DefaultTheme } from '@react-navigation/native';

export const Classic = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#FDFEFE',
        text: '#201F30',
        link: '#5B774B',
        primary: '#DFE17B',
        secondary: '#80C8D2',
        accent: '#D1406C',
        border: '#A49DAA',
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
    },
};
