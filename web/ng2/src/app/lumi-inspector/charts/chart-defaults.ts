export function getChartLayout() {
    return {
        margin: {
            b: 30,
            l: 60,
            r: 10,
            t: 10
        },
        showlegend: true,
        legend: {
            orientation: 'h'
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
