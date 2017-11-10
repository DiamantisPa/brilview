declare var Plotly: any;

export const seriesStyleName = 'bar';


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
            type: 'linear',
            title: 'Bunch index'
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
    if (styleNameLow === 'bar') {
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
