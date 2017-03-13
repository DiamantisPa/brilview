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
    _chartType = ChartDefaults.seriesStyleName;
    set chartType(value: string) {
        this._chartType = value;
        this.onChartTypeChange();
    }
    get chartType(): string {
        return this._chartType;
    }
    seriesStyle = ChartDefaults.getSeriesStyle(this.chartType);
    chartTypeOptions = ChartDefaults.seriesStyleNames;
    _logarithmicY: boolean = false;
    set logarithmicY(value: boolean) {
        this._logarithmicY = value;
        this.onLogarithmicYChange();
    }
    get logarithmicY(): boolean {
        return this._logarithmicY;
    }
    chartHeightOptions = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400];
    _chartHeight = 400;
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

    getYAxisTitle() {
        return this.chart.nativeElement.layout.yaxis.title;
    }

    setXAxisTitle(newTitle) {
        Plotly.relayout(this.chart.nativeElement, {
            'xaxis.title': newTitle,
            'xaxis.autorange': true
        });
    }

    getXAxisTitle() {
        return this.chart.nativeElement.layout.xaxis.title;
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
        this.seriesStyle = ChartDefaults.getSeriesStyle(this.chartType);
        const layout = ChartDefaults.getLayoutSettings(this.chartType);
        for (const series of this.chartData) {
            Object.assign(series, this.seriesStyle);
        }
        Plotly.redraw(this.chart.nativeElement);
        if (layout) {
            Plotly.relayout(this.chart.nativeElement, layout);
        }
    }

    getChartData() {
        return this.chartData;
    }

    getNativeChartElement() {
        console.log(this.chart.nativeElement);
        return this.chart.nativeElement;
    }

}
