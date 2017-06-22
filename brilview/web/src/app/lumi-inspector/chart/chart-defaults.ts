declare var Plotly: any;

export const seriesStyleName = 'line';
export const seriesStyleNames = [
    'line', 'stepline', 'scatter', 'bar', 'barstack', 'area', 'steparea'
];

export const yZoom0to3Icon = {
    'width': 800,
    'ascent': 850,
    'descent': -150,
    'path': "M0 193.76L400 376.47L800 193.76L546.42 193.76L546.42 0 " +
        "L252.92 0L252.92 193.76L0 193.76Z M800 606.24L400 423.53L0 606.24 " +
        "L253.58 606.24L253.58 800L547.08 800L547.08 606.24L800 606.24Z"
}

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
        modeBarButtonsToAdd: [{
            name: 'y0to3',
            title: 'Zoom Y axis 0;3',
            icon: yZoom0to3Icon,
            click: function(gd) {
                const opts = gd.layout;
                if (!opts.yaxis) {
                    return;
                }
                opts.yaxis.range = [0, 3];
                opts.yaxis.autorange = false;
                Plotly.relayout(gd, opts);
            }
        }, {
            name: 'toImage',
            title: 'Download plot as a png',
            icon: Plotly.Icons.camera,
            click: function(gd) {
                const opts = {
                    format: 'png',
                    width: 1200,
                    height: 700
                };
                Plotly.downloadImage(gd, opts);
            }
        }]
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
