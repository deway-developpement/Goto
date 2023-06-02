export interface Point {
    latitude: number;
    longitude: number;
    timestamp?: Date;
    elevation?: number;
}

export interface TrackStats {
    distance: number;
    time: number;
    elevation: number;
    meanSpeed: number;
    maxSpeed: number;
    minSpeed: number;
    latitude: number;
    longitude: number;
    speedDeltas: number[];
    distanceDeltas: number[];
    timeDeltas: number[];
    elevationDeltas: number[];
}
