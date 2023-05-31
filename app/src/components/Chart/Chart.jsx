import React from 'react';
import { LineChart } from 'react-native-chart-kit';

export const ChartMode = Object.freeze({
    average: 1,
    individual: 2,
    cumulative: 3,
});

export default function Charts({
    absciissa,
    ordinate,
    xLen = 5,
    yLen = 20,
    colors,
    width,
    xUnit,
    yUnit,
    yMode = ChartMode.average,
    xMode = ChartMode.cumulative,
    xPrecision = 10,
    yPrecision = 10,
    bezier = true,
}) {
    const yIndex = Math.floor(ordinate?.length / yLen);
    const xIndex = Math.ceil(absciissa?.length / xLen);

    if (xMode === ChartMode.average) {
        absciissa = absciissa
            ?.map(
                (value, index) =>
                    absciissa
                        .slice(index, Math.min(index + xIndex, absciissa.length))
                        .reduce((a, b) => a + b, 0) / xIndex
            )
            .filter((value, index) => index % xIndex === 0)
            .map((value) => Math.round(value * xPrecision) / xPrecision);
    } else if (xMode === ChartMode.cumulative) {
        absciissa = absciissa
            ?.map((value, index) => absciissa.slice(0, index || 1).reduce((acc, val) => acc + val))
            .filter((value, index) => index % xIndex === 0)
            .map((value) => Math.round(value * xPrecision) / xPrecision);
    } else {
        absciissa = absciissa
            ?.filter((value, index) => index % xIndex === 0)
            .map((value) => Math.round(value * xPrecision) / xPrecision);
    }

    if (yMode === ChartMode.average) {
        ordinate = ordinate
            ?.map(
                (_, index) =>
                    ordinate
                        .slice(index, Math.min(index + yIndex, ordinate.length))
                        .reduce((a, b) => a + b, 0) / yIndex
            )
            .filter((value, index) => index % yIndex === 0)
            .map((value) => Math.round(value * yPrecision) / yPrecision);
    } else if (yMode === ChartMode.cumulative) {
        ordinate = ordinate
            ?.map((_, index) => ordinate.slice(0, index || 1).reduce((a, b) => a + b, 0))
            .filter((value, index) => index % yIndex === 0)
            .map((value) => Math.round(value * yPrecision) / yPrecision);
    } else {
        ordinate = ordinate
            ?.filter((value, index) => index % yIndex === 0)
            .map((value) => Math.round(value * yPrecision) / yPrecision);
    }

    return (
        <LineChart
            data={{
                // take only 1 value on 10 of stats.elevationDeltas
                labels: absciissa || [0, 0, 0],
                datasets: [
                    {
                        data: ordinate || [0, 0, 0],
                    },
                ],
            }}
            width={width} // from react-native
            height={220}
            yAxisSuffix={yUnit}
            xAxisLabel={xUnit}
            yAxisInterval={2} // optional, defaults to 1
            chartConfig={{
                backgroundGradientFrom: colors.borderLineSecondary,
                backgroundGradientTo: colors.primary,
                decimalPlaces: 1, // optional, defaults to 2dp
                color: () => colors.background,
                labelColor: () => colors.background,
            }}
            bezier={bezier}
            style={{
                marginVertical: 8,
                borderRadius: 12,
            }}
        />
    );
}
