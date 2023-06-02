import { createSelector } from 'reselect';
import { distance2Coordonate, stringify } from '../services/gpx.services';
import { MapState } from '../components/Map/enum';

const CHANGE_WIDTH = 'CHANGE_WIDTH';
const CHANGE_HEIGHT = 'CHANGE_HEIGHT';
const CHANGE_ANGLE = 'CHANGE_ANGLE';
const CHANGE_POSITION = 'CHANGE_POSITION';
const ADD_POINT = 'ADD_POINT';
const RESET = 'RESET';
const INIT = 'INIT';
const CHANGE_MAP_STATE = 'CHANGE_MAP_STATE';
const CHANGE_IS_FOLLOWING = 'CHANGE_IS_FOLLOWING';
const CHANGE_IS_RECORDING = 'CHANGE_IS_RECORDING';

export const changeWidth = (val) => ({
    type: CHANGE_WIDTH,
    payload: val,
});

export const changeHeight = (val) => ({
    type: CHANGE_HEIGHT,
    payload: val,
});

export const changeAngle = (val) => ({
    type: CHANGE_ANGLE,
    payload: val,
});

export const changePosition = ({ x, y }) => ({
    type: CHANGE_POSITION,
    payload: { x, y },
});

export const addPoint = (val) => ({
    type: ADD_POINT,
    payload: val,
});

export const reset = () => ({
    type: RESET,
});

export const init = () => ({
    type: INIT,
});

export const changeMapState = (val, hikeId = null) => ({
    type: CHANGE_MAP_STATE,
    payload: val,
    hikeId,
});

export const changeIsFollowing = (val) => ({
    type: CHANGE_IS_FOLLOWING,
    payload: val,
});

export const changeIsRecording = (val) => ({
    type: CHANGE_IS_RECORDING,
    payload: val,
});

const initialState = {
    image: {
        width: 0.01,
        height: 0.01,
        angle: 0,
        position: { x: 0, y: 0 },
    },
    performance: {
        time: null,
        points: [],
    },
    mapState: MapState.NONE,
    isFollowing: false,
    isRecording: false,
    hikeId: null,
};

export default function mapReducer(state = initialState, action) {
    switch (action.type) {
    case CHANGE_WIDTH:
        return {
            ...state,
            image: {
                ...state.image,
                width: action.payload,
            },
        };
    case CHANGE_HEIGHT:
        return {
            ...state,
            image: {
                ...state.image,
                height: action.payload,
            },
        };
    case CHANGE_ANGLE:
        return {
            ...state,
            image: {
                ...state.image,
                angle: action.payload,
            },
        };
    case CHANGE_POSITION:
        return {
            ...state,
            image: {
                ...state.image,
                position: action.payload,
            },
        };
    case ADD_POINT:
        return {
            ...state,
            performance: {
                ...state?.performance,
                points: [...state.performance.points, action.payload],
            },
        };
    case RESET:
        return {
            ...state,
            performance: {
                time: null,
                points: [],
            },
            mapState: MapState.FOLLOW_POSITION,
        };
    case INIT:
        return {
            ...state,
            performance: {
                time: new Date(),
                points: [],
            },
            isRecording: true,
            isFollowing: true,
        };
    case CHANGE_MAP_STATE:
        return {
            ...state,
            mapState: action.payload,
            hikeId:
                    action.payload === MapState.FOCUS_HIKE
                        ? action.hikeId
                        : action.payload === MapState.MODAL_PERFORMANCE
                            ? state.hikeId
                            : null,
        };
    case CHANGE_IS_FOLLOWING:
        return {
            ...state,
            isFollowing: action.payload,
        };
    case CHANGE_IS_RECORDING:
        return {
            ...state,
            isRecording: action.payload,
        };
    default:
        return state;
    }
}

// selectors
export const getTimeSelector = (state) => {
    if (state?.performance.time === null) {
        return null;
    }
    return new Date().getTime() - state?.performance.time.getTime();
};

export const getPoinstSelector = (state) => {
    if (state?.performance.time === null) {
        return null;
    }
    return state?.performance.points;
};

export const getDistanceSelector = createSelector(getPoinstSelector, (points) => {
    if (points?.length === 0 || !points) {
        return 0;
    }
    return points?.reduce((acc, point, index) => {
        if (index === 0) {
            return 0;
        }
        return acc + distance2Coordonate(point, points[index - 1]);
    }, 0);
});

export const getElevationSelector = createSelector(getPoinstSelector, (points) => {
    if (points?.length === 0 || !points) {
        return 0;
    }
    return points?.reduce((acc, point, index) => {
        if (index === 0) {
            return 0;
        }
        return acc + Math.abs(point.elevation - points[index - 1].elevation);
    }, 0);
});

export const getLastPointSelector = createSelector(getPoinstSelector, (points) => {
    if (points?.length === 0 || !points) {
        return null;
    }
    return points[points.length - 1];
});

export const getSpeedSelector = createSelector(
    (state) => {
        if (state?.performance.time === null) return null;
        if (state?.performance.points.length === 0) {
            return 0;
        }
        return (
            state?.performance.points[state?.performance.points.length - 1].time.getTime() -
            state?.performance.points[0].time.getTime()
        );
    },
    getDistanceSelector,
    (elapsed, distance) => {
        if (elapsed === 0) {
            return 0;
        }
        return distance / (elapsed / 1000 / 3600);
    }
);

export const getPathSelector = createSelector(getPoinstSelector, (points) => {
    if (!points || points.length === 0) {
        return null;
    }
    return stringify(points);
});

export const mapStateToProps = (state) => ({
    performance: {
        elapsedTime: getTimeSelector(state),
        distance: getDistanceSelector(state),
        elevation: getElevationSelector(state),
        speed: getSpeedSelector(state),
        path: getPathSelector(state),
        points: getPoinstSelector(state),
        lastPoint: getLastPointSelector(state),
        time: state?.performance.time,
    },
    overlay: { ...state.image },
    mapState: state.mapState,
    isFollowing: state.isFollowing,
    isRecording: state.isRecording,
    hikeId: state.hikeId,
});
