export const seriesStyleName = 'line';

export const seriesStyle: any = {
    type: 'scatter',
    mode: 'lines',
    line: {
        width: 1
    }
};

export function getChartLayout() {
    return {
        margin: {
            b: 0,
            l: 60,
            r: 10,
            t: 10
        },
        showlegend: true,
        legend: {
            orientation: 'h',
        },
        autosize: true,
        xaxis: {
            type: 'date',
            title: 'Date (UTC)'
        }
    };
}

export function getChartConfig() {
    return {
        displaylogo: false,
        showTips: false,
        modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d']
    };
}
