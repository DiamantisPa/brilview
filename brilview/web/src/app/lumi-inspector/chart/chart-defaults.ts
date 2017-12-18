import * as utils from '../../shared/lumi-utils/lumi-chart-utils';
declare var Plotly: any;

export const seriesStyleName = 'line';
export const seriesStyleNames = [
    'line', 'stepline', 'scatter', 'bar', 'barstack', 'area', 'steparea'
];

export function getChartLayout() {
    return {
        titlefont: {
            size: 18,
            family: 'Metropolis, sans-serif'
        },
        margin: {
            b: 48,
            l: 48,
            r: 6,
            t: 32
        },
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0,
            y: -0.17,
            xanchor: 'left',
            yanchor: 'top',
            bgcolor: '#FFFFFFE0',
            bordercolor: '#C0C0C0',
            borderwidth: 1
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
        editable: true,
        displaylogo: false,
        showTips: false,
        modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'toImage'],
        modeBarButtonsToAdd: [utils.buttonYZoom0to3, utils.buttonDownloadImage]
    };
};

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
