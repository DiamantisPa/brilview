import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataService } from '../data.service';

declare var Plotly: any;

@Component({
    selector: 'li-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit {

    @ViewChild('alerts') alerts;
    @ViewChild('mainChart') mainChart;
    // @ViewChild('secondaryChart') secondChart;
    lumiData: Array<Array<any>>;
    chartData: any = [];
    chartUnit = null;
    _twoCharts = false;
    set twoCharts(newVal: boolean) {
        this._twoCharts = newVal;
    }
    get twoCharts(): boolean {
        return this._twoCharts;
    }

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.onNewLumiData.subscribe(this.onNewData.bind(this));
        this.lumiData = this.dataService.lumiData;
    }

    ngAfterViewInit() {
    }

    onNewData(event) {
        this.addSeriesFromMemory(this.mainChart, event.data, 'recorded');
    }

    addSeriesFromMemory(chart, dataid, yfield) {
        const newLumiData = this.dataService.getLumiDataFromStorage(dataid);
        this.addSeries(chart, newLumiData, yfield);
    }

    addSeries(chart, lumiData, yfield) {
        const newData = lumiData.data;
        const params = lumiData.params;

        if (this.chartData.length > 0) {
            if (this.chartUnit !== params['unit']) {
                this.alerts.alert({
                    label: '',
                    message: 'Cannot add series to chart. Conflicting Y axis ' +
                        'units from data: "' + lumiData.name + '"'});
                return;
            }
        } else {
            this.chartUnit = params['unit'];
        }

        const name = [
            params['type'], yfield, params['normtag'], params['beamstatus'],
            params['hltpath'], params['datatag'],
            (params['byls'] ? 'byLS' : 'byRUN')
        ].filter(Boolean); // filter out null, undefined, 0, false, empty string
        name.push('(' + params['unit'] + ')');

        this._addSeries(this.mainChart, newData, yfield, name.join('_'));
        this.updateYAxisTitle(this.mainChart);
    }

    protected _addSeries(chart, data, yfield, name) {
        const x = [];
        for (const xval of data['tssec']) {
            // Conversion to string needed for Plotly to not use local timezone
            x.push(new Date(xval * 1000).toISOString());
        }
        chart.addSeries(name, x, data[yfield]);
    }

    updateYAxisTitle(chart) {
        // const newTitle = 'Luminosity (' + this.chartUnit + ')';
        // if (chart.getNativeChartElement().layout.yaxis.title !== newTitle) {
        //     Plotly.relayout(this.mainChart.nativeElement, {
        //         'yaxis.title': newTitle,
        //         'yaxis.autorange': true
        //     });
        // }
    }

}
