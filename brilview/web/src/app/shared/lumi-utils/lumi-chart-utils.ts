import * as LumiUnits from './lumi-units';

export function recalculateLumiUnit(chart, chartUnit) {
    if (!chartUnit) {
        return null;
    }
    const currentChartMax = getMaxChartValue(chart.chartData);
    return LumiUnits.unitForData(currentChartMax, chartUnit);
}


export function scaleLumiValues(values: Array<number>, currentUnit, newUnit) {
    if (currentUnit === newUnit) {
        return values;
    }
    const scale = LumiUnits.scaleUnit(currentUnit, newUnit);
    return values.map((val) => val * scale);
}


export function rescaleChartLumiValues(chart, chartUnit) {
    const newUnit = recalculateLumiUnit(chart, chartUnit);
    if (newUnit !== chartUnit) {
        for (const series of chart.chartData) {
            series.y = scaleLumiValues(series.y, chartUnit, newUnit);
        }
        chart.redraw();
    }
    return newUnit;
}


export function getMaxChartValue(data) {
    let max = -Infinity;
    for (const series of data) {
        for (const val of series.y) {
            if (val > max) {
                max = val;
            }
        }
    }
    return max;
}
