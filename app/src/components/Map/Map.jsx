import React from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';

export default function Map({ location }) {
    return (
        <MapView
            initialRegion={{
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }}
            region={{
                latitude: parseFloat(location?.coords?.latitude),
                longitude: parseFloat(location?.coords?.longitude),
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }}
            showsPointsOfInterest={false}
            style={{ flex: 1, width: '100%' }}
            maxZoomLevel={17}
        >
            <UrlTile
                urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                maximumZ={19}
                // tileCachePath={
                //     Platform.OS === 'android' ? '/assets/maps' : 'assets/maps'
                // }
                // tileMaxCacheSize={100000}
                shouldReplaceMapContent={true}
            />
            <Marker
                coordinate={{
                    latitude: parseFloat(location?.coords?.latitude),
                    longitude: parseFloat(location?.coords?.longitude),
                }}
            />
        </MapView>
    );
}
