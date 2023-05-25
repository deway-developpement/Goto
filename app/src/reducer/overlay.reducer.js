const CHANGE_WIDTH = 'CHANGE_WIDTH';
const CHANGE_HEIGHT = 'CHANGE_HEIGHT';
const CHANGE_ANGLE = 'CHANGE_ANGLE';
const CHANGE_POSITION = 'CHANGE_POSITION';

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

const initialState = {
    width: 0.01,
    height: 0.01,
    angle: 0,
    position: { x: 0, y: 0 },
};

export default function overlayReducer(state = initialState, action) {
    switch (action.type) {
    case CHANGE_WIDTH:
        return {
            ...state,
            width: action.payload,
        };
    case CHANGE_HEIGHT:
        return {
            ...state,
            height: action.payload,
        };
    case CHANGE_ANGLE:
        return {
            ...state,
            angle: action.payload,
        };
    case CHANGE_POSITION:
        return {
            ...state,
            position: action.payload,
        };
    default:
        return state;
    }
}
