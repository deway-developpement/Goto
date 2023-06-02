import React, { useContext } from 'react';
import { Polyline } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { LocationContext } from '../../providers/LocationProvider';
import { connect } from 'react-redux';
import { mapStateToProps } from '../../reducer/map.reducer';

function GpxTrackLine({ performance }) {
    const { colors } = useTheme();
    const { location } = useContext(LocationContext);

    const points = [
        ...performance.points,
        {
            latitude: parseFloat(location?.coords?.latitude),
            longitude: parseFloat(location?.coords?.longitude),
            elevation: parseFloat(location?.coords?.altitude),
            time: new Date(),
        },
    ];

    return (
        <>
            <Polyline coordinates={points} strokeColor={colors.secondary} strokeWidth={4} />
            <Polyline coordinates={points} strokeColor={colors.primary} strokeWidth={6} />
        </>
    );
}

export default connect(mapStateToProps)(GpxTrackLine);
