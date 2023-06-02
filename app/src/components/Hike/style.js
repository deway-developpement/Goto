import { StyleSheet } from 'react-native';

const stylesheet = (colors) =>
    StyleSheet.create({
        textHeader: {
            marginTop: '6%',
            color: colors.text,
            fontSize: 32,
            fontWeight: '700',
            paddingLeft: '3%',
        },
        logo: {
            width: 150,
            height: 150,
        },
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.backgroundSecondary,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        },
        containerNoBg: {
            flex: 1,
        },
        containerFocus: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.backgroundSecondary,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderRadius: 12,
            marginTop: 35,
            padding: 20,
        },
        textDescription: {
            fontSize: 16,
            fontWeight: '400',
            color: colors.borderLineSecondary,
        },
        logoContainer: {
            width: 50,
            height: 50,
            backgroundColor: colors.primary,
            borderRadius: 12,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        littleText: {
            fontWeight: '600',
            fontSize: 18,
        },modalView: {
            marginHorizontal: '10%',
            top: '20%',
            borderRadius: 12,
            paddingHorizontal: 22,
            paddingTop: 16,
            paddingBottom: 30,
            backgroundColor: colors.backgroundSecondary,
            width: '80%',
            position: 'absolute',
        },textLoginMiddle: {
            fontWeight: '600',
            fontSize: 20,
            paddingBottom: 10,
            paddingTop: 10,
            color: colors.text,
        },
        modalText: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 19,
            marginLeft: 3,
        }
    });
export default stylesheet;
