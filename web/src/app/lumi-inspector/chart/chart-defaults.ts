export const seriesStyleName = 'line';
export const seriesStyleNames = [
    'line', 'stepline', 'scatter', 'bar', 'barstack', 'area', 'steparea'
];

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

export function getSeriesStyle(styleName): any {
    const styleNameLow = styleName.toLowerCase();
    if (styleNameLow === 'line') {
        return {
            'mode': 'lines',
            'type': 'scatter',
            'line': {
                'width': 1,
                'shape': 'linear'
            },
            'fill': 'none'
        };
    } else if (styleNameLow === 'stepline') {
        return  {
            'mode': 'lines',
            'type': 'scatter',
            'line': {
                'width': 1,
                'shape': 'hv'
            },
            'fill': 'none'
        };
    } else if (styleNameLow === 'scatter') {
        return {
            'mode': 'markers',
            'type': 'scatter',
            'marker': {
                'size': 4
            },
            'fill': 'none'
        };
    } else if (styleNameLow === 'area') {
        return {
            'mode': 'lines',
            'type': 'scatter',
            'line': {
                'width': 1.5,
                'shape': 'linear'
            },
            'fill': 'tozeroy'
        };
    } else if (styleNameLow === 'steparea') {
        return {
            'mode': 'lines',
            'type': 'scatter',
            'line': {
                'width': 1.5,
                'shape': 'hv'
            },
            'fill': 'tozeroy'
        };
    } else if (styleNameLow === 'bar') {
        return {
            'type': 'bar',
        };
    } else if (styleNameLow === 'barstack') {
        return {
            'type': 'bar',
        };
    } else {
        return null;
    }
}

export function getLayoutSettings(styleName) {
    const styleNameLow = styleName.toLowerCase();
    if (styleNameLow === 'bar') {
        return {
            'barmode': 'group',
            'bargap': 0.05,
            'bargroupgap': 0
        };
    } else if (styleNameLow === 'barstack') {
        return {
            'barmode': 'stack',
            'bargap': 0.05,
            'bargroupgap': 0
        };
    } else {
        return null;
    }
}
