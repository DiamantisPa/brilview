import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import * as ChartDefaults from './chart-defaults';

declare var Plotly: any;

@Component({
    selector: 'li-chart',
    templateUrl: './chart.component.html',
    styleUrls: [
        '../lumi-inspector.component.css',
        './chart.component.css'
    ]
})
export class ChartComponent implements OnInit, AfterViewInit {

    @ViewChild('chart') chart;
    chartData: any = [];
    seriesStyle = ChartDefaults.seriesStyle;
    _chartType = ChartDefaults.seriesStyleName;
    set chartType(value: string) {
        this._chartType = value;
        this.onChartTypeChange();
    }
    get chartType(): string {
        return this._chartType;
    }
    chartTypeOptions = [
        'line', 'stepline', 'scatter', 'bar', 'barstack', 'area', 'steparea'];
    _logarithmicY: boolean = false;
    set logarithmicY(value: boolean) {
        this._logarithmicY = value;
        this.onLogarithmicYChange();
    }
    get logarithmicY(): boolean {
        return this._logarithmicY;
    }
    chartHeightOptions = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400];
    _chartHeight = 500;
    set chartHeight(newValue) {
        this._chartHeight = newValue;
        this.onResize(null);
    };
    get chartHeight() {
        return this._chartHeight;
    }

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        Plotly.plot(this.chart.nativeElement,
                    this.chartData,
                    ChartDefaults.getChartLayout(),
                    ChartDefaults.getChartConfig());

        Observable.fromEvent(window, 'resize')
            .debounceTime(900)
            .subscribe(this.onResize.bind(this));
    }

    onResize(event) {
        const update = {
            autosize: true,
            width: null,
            height: this.chartHeight
        };
        Plotly.relayout(this.chart.nativeElement, update);
    }

    addSeries(name: string, x: Array<number>, y: Array<number>,
              text: Array<string>, other: any) {
        const newSeries = {
            name: name,
            x: x,
            y: y,
            text: text,
            _other: other,
            line: {width: 1}
        };
        Object.assign(newSeries, this.seriesStyle);
        this.chartData.push(newSeries);
        Plotly.redraw(this.chart.nativeElement);
    }

    clearChart() {
        if (this.chartData.length > 0) {
            this.chartData.length = 0;
            Plotly.redraw(this.chart.nativeElement);
        }
    }

    popSeries() {
        if (this.chartData.length > 0) {
            this.chartData.pop();
            Plotly.redraw(this.chart.nativeElement);
        }
    }

    setYAxisTitle(newTitle) {
        Plotly.relayout(this.chart.nativeElement, {
            'yaxis.title': newTitle,
            'yaxis.autorange': true
        });
    }

    setXAxisTitle(newTitle) {
        Plotly.relayout(this.chart.nativeElement, {
            'xaxis.title': newTitle,
            'xaxis.autorange': true
        });
    }

    onLogarithmicYChange() {
        const layout: any = {
            'yaxis.type': 'lin',
            'yaxis.autorange': true
        };
        if (this.logarithmicY) {
            layout['yaxis.type'] = 'log';
        }
        Plotly.relayout(this.chart.nativeElement, layout);
    }

    onChartTypeChange() {
        const chartTypeLow = this.chartType.toLowerCase();
        let layout = null;
        if (chartTypeLow === 'line') {
            this.seriesStyle = {
                'mode': 'lines',
                'type': 'scatter',
                'line': {
                    'width': 1,
                    'shape': 'linear'
                },
                'fill': 'none'
            };
        } else if (chartTypeLow === 'stepline') {
            this.seriesStyle = {
                'mode': 'lines',
                'type': 'scatter',
                'line': {
                    'width': 1,
                    'shape': 'hv'
                },
                'fill': 'none'
            };
        } else if (chartTypeLow === 'scatter') {
            this.seriesStyle = {
                'mode': 'markers',
                'type': 'scatter',
                'marker': {
                    'size': 5
                },
                'fill': 'none'
            };
        } else if (chartTypeLow === 'area') {
            this.seriesStyle = {
                'mode': 'lines',
                'type': 'scatter',
                'line': {
                    'width': 2,
                    'shape': 'linear'
                },
                'fill': 'tozeroy'
            };
        } else if (chartTypeLow === 'steparea') {
            this.seriesStyle = {
                'mode': 'lines',
                'type': 'scatter',
                'line': {
                    'width': 2,
                    'shape': 'hv'
                },
                'fill': 'tozeroy'
            };
        } else if (chartTypeLow === 'bar') {
            this.seriesStyle = {
                'type': 'bar',
            };
            layout = {
                'barmode': 'group',
                'bargap': 0,
                'bargroupgap': 0
            };
        } else if (chartTypeLow === 'barstack') {
            this.seriesStyle = {
                'type': 'bar',
            };
            layout = {
                'barmode': 'stack',
                'bargap': 0,
                'bargroupgap': 0
            };
        }
        for (const series of this.chartData) {
            Object.assign(series, this.seriesStyle);
        }
        Plotly.redraw(this.chart.nativeElement);
        if (layout) {
            Plotly.relayout(this.chart.nativeElement, layout);
        }
    }

    getNativeChartElement() {
        console.log(this.chart.nativeElement);
        return this.chart.nativeElement;
    }

}
