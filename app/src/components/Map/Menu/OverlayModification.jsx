import React, { useState } from 'react';
import { Slider, Icon as IconThemed, CheckBox } from '@rneui/themed';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native';
import { View } from 'react-native';
import stylesheet from '../style';
import { IconComp } from '../../Icon/Icon';
import { useTheme } from '@react-navigation/native';
import {
    changeAngle,
    changeHeight,
    changePosition,
    changeWidth,
} from '../../../reducer/overlay.reducer';

function OverlayModification({ overlay, dispatch }) {
    const { colors } = useTheme();
    const styles = stylesheet(colors);

    const SliderModificator = Object.freeze({
        WIDTH: 'width',
        HEIGHT: 'height',
        BOTTOM: 'top',
        LEFT: 'left',
        ANGLE: 'angle',
        NONE: 'none',
    });

    const [activeSlider, setActiveSlider] = useState(SliderModificator.NONE);

    const [widthRange, setWidthRange] = useState([0, 0.02, 0.01]);
    const [heightRange, setHeightRange] = useState([0, 0.02, 0.01]);
    const [topRange, setTopRange] = useState([0, 0.01, 0.005]);
    const [leftRange, setLeftRange] = useState([0, 0.01, 0.005]);
    const [angleRange] = useState([0, 360]);

    function handlePlus() {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            setWidthRange([widthRange[1], widthRange[1] + widthRange[2], widthRange[2]]);
            if (overlay.width < widthRange[1]) dispatch(changeWidth(widthRange[1]));
            break;
        case SliderModificator.HEIGHT:
            setHeightRange([heightRange[1], heightRange[1] + heightRange[2], heightRange[2]]);
            if (overlay.height < heightRange[1]) dispatch(changeHeight(heightRange[1]));
            break;
        case SliderModificator.BOTTOM:
            setTopRange([topRange[1], topRange[1] + topRange[2], topRange[2]]);
            if (overlay.position.y < topRange[1])
                dispatch(changePosition({ x: overlay.position.x, y: topRange[1] }));
            break;
        case SliderModificator.LEFT:
            setLeftRange([leftRange[1], leftRange[1] + leftRange[2], leftRange[2]]);
            if (overlay.position.x < leftRange[1])
                dispatch(changePosition({ x: leftRange[1], y: overlay.position.y }));
            break;
        default:
            break;
        }
    }

    function handleMinus() {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            if (widthRange[0] - widthRange[2] < 0)
                setWidthRange([0, widthRange[2], widthRange[2]]);
            else setWidthRange([widthRange[0] - widthRange[2], widthRange[0], widthRange[2]]);
            if (overlay.width > widthRange[1]) dispatch(changeWidth(widthRange[1]));
            break;
        case SliderModificator.HEIGHT:
            if (heightRange[0] - heightRange[2] < 0)
                setHeightRange([0, widthRange[2], heightRange[2]]);
            else
                setHeightRange([
                    heightRange[0] - heightRange[2],
                    heightRange[0],
                    heightRange[2],
                ]);
            if (overlay.height > heightRange[1]) dispatch(changeHeight(heightRange[1]));
            break;
        case SliderModificator.BOTTOM:
            setTopRange([topRange[0] - topRange[2], topRange[0], topRange[2]]);
            if (overlay.position.y > topRange[1])
                dispatch(changePosition({ x: overlay.position.x, y: topRange[1] }));
            break;
        case SliderModificator.LEFT:
            setLeftRange([leftRange[0] - leftRange[2], leftRange[0], leftRange[2]]);
            if (overlay.position.x > leftRange[1])
                dispatch(changePosition({ x: leftRange[1], y: overlay.position.y }));
            break;
        default:
            break;
        }
    }

    function handleCheck(value) {
        if (value === activeSlider) setActiveSlider(SliderModificator.NONE);
        else setActiveSlider(value);
    }

    function getValue() {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            return overlay.width;
        case SliderModificator.HEIGHT:
            return overlay.height;
        case SliderModificator.BOTTOM:
            return overlay.position.y;
        case SliderModificator.LEFT:
            return overlay.position.x;
        case SliderModificator.ANGLE:
            return overlay.angle;
        default:
            return 0;
        }
    }

    function handleOnValueChange(value) {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            dispatch(changeWidth(value));
            break;
        case SliderModificator.HEIGHT:
            dispatch(changeHeight(value));
            break;
        case SliderModificator.BOTTOM:
            dispatch(changePosition({ x: overlay.position.x, y: value }));
            break;
        case SliderModificator.LEFT:
            dispatch(changePosition({ x: value, y: overlay.position.y }));
            break;
        case SliderModificator.ANGLE:
            dispatch(changeAngle(value));
            break;
        default:
            break;
        }
    }

    function getMaxValue() {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            return widthRange[1];
        case SliderModificator.HEIGHT:
            return heightRange[1];
        case SliderModificator.BOTTOM:
            return topRange[1];
        case SliderModificator.LEFT:
            return leftRange[1];
        case SliderModificator.ANGLE:
            return angleRange[1];
        default:
            return 0;
        }
    }

    function getMinValue() {
        switch (activeSlider) {
        case SliderModificator.WIDTH:
            return widthRange[0];
        case SliderModificator.HEIGHT:
            return heightRange[0];
        case SliderModificator.BOTTOM:
            return topRange[0];
        case SliderModificator.LEFT:
            return leftRange[0];
        case SliderModificator.ANGLE:
            return angleRange[0];
        default:
            return 0;
        }
    }

    return (
        <>
            <CheckBox
                wrapperStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                title="Width"
                checked={activeSlider === SliderModificator.WIDTH}
                onPress={() => handleCheck(SliderModificator.WIDTH)}
            />
            <CheckBox
                wrapperStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                title="Height"
                checked={activeSlider === SliderModificator.HEIGHT}
                onPress={() => handleCheck(SliderModificator.HEIGHT)}
            />
            <CheckBox
                wrapperStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                title="Top"
                checked={activeSlider === SliderModificator.BOTTOM}
                onPress={() => handleCheck(SliderModificator.BOTTOM)}
            />
            <CheckBox
                wrapperStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                title="Left"
                checked={activeSlider === SliderModificator.LEFT}
                onPress={() => handleCheck(SliderModificator.LEFT)}
            />
            <CheckBox
                wrapperStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                containerStyle={{
                    padding: 0,
                    margin: 0,
                    backgroundColor: '',
                }}
                title="Angle"
                checked={activeSlider === SliderModificator.ANGLE}
                onPress={() => handleCheck(SliderModificator.ANGLE)}
            />
            {activeSlider !== SliderModificator.NONE && (
                <Slider
                    value={getValue()}
                    onValueChange={handleOnValueChange}
                    maximumValue={getMaxValue()}
                    minimumValue={getMinValue()}
                    step={(getMaxValue() - getMinValue()) / 100}
                    allowTouchTrack
                    trackStyle={{
                        height: 10,
                        backgroundColor: 'transparent',
                    }}
                    thumbStyle={{
                        height: 20,
                        width: 20,
                        backgroundColor: 'transparent',
                    }}
                    thumbProps={{
                        children: (
                            <IconThemed
                                type="font-awesome"
                                size={10}
                                reverse
                                containerStyle={{
                                    bottom: 10,
                                    right: 10,
                                }}
                                color={colors.primary}
                            />
                        ),
                    }}
                />
            )}
            {activeSlider !== SliderModificator.NONE &&
                activeSlider !== SliderModificator.ANGLE && (
                <>
                    <TouchableWithoutFeedback onPress={() => handlePlus()}>
                        <View style={[styles.logoContainer]}>
                            <IconComp color={colors.primary} name={'plus'} pos={0} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => handleMinus()}>
                        <View style={[styles.logoContainer]}>
                            <IconComp color={colors.primary} name={'back'} pos={0} />
                        </View>
                    </TouchableWithoutFeedback>
                </>
            )}
        </>
    );
}

const mapStateToProps = (state) => {
    return { overlay: state };
};

export default connect(mapStateToProps)(OverlayModification);
