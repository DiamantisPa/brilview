export function getChartLayout() {
    return {
        margin: {
            b: 40,
            l: 40,
            r: 0,
            t: 0
        },
        showlegend: true,
        legend: {
            orientation: 'h'
        },
        autosize: true
    };
}

export function getChartConfig() {
    return {
        displaylogo: false,
        showTips: false,
        modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d']
    };
}
