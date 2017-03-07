import { Component, OnInit, Input } from '@angular/core';

declare var Plotly: any;

@Component({
    selector: 'li-common-chart-controls',
    templateUrl: './common-chart-controls.component.html',
    styleUrls: [
        '../../lumi-inspector.component.css',
        './common-chart-controls.component.css'
    ]
})
export class CommonChartControlsComponent implements OnInit {

    @Input('chart') chart;

    chartTypeOptions = ['line', 'scatter', 'bar'];
    _chartType: string;
    set chartType(value: string) {
        this._chartType = value;
        this.toggleChartType();
    }
    get chartType(): string {
        return this._chartType;
    }

    _logarithmicY: boolean = false;
    set logarithmicY(value: boolean) {
        this._logarithmicY = value;
        this.toggleAxesTypes();
    }
    get logarithmicY(): boolean {
        return this._logarithmicY;
    }

    constructor() { }

    ngOnInit() {
    }

    test() {
        const chartData = this.chart.data;
        chartData.push({x: [1, 2, 3, 4, 5, 6], y: [2, 1, 4, 2, 3, 5]});
        Plotly.redraw(this.chart);
    }

    toggleAxesTypes() {
        // only Y axis is needed
        const layout: any = {
            'yaxis.type': 'lin',
            'yaxis.autorange': true
        };
        if (this.logarithmicY) {
            layout['yaxis.type'] = 'log';
        }
        Plotly.relayout(this.chart, layout);
    }

    toggleChartType() {
        console.log('in toggleChartType', this.chartType);
        const chartData = this.chart.data;
        const chartTypeLow = this.chartType.toLowerCase();
        let modeAndType;
        if (chartTypeLow === 'line') {
            modeAndType = {
                'mode': 'lines',
                'type': 'scatter'
            };
        } else if (chartTypeLow === 'scatter') {
            modeAndType = {
                'mode': 'markers',
                'type': 'scatter'
            };
        } else if (chartTypeLow === 'bar') {
            modeAndType = {
                'type': 'bar'
            };
        }
        for (const series of chartData) {
            Object.assign(series, modeAndType);
        }
        Plotly.redraw(this.chart, chartData);
    }

}
