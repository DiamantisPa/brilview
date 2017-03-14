import { Component, OnInit, ViewChild } from '@angular/core';

import * as LumiUnits from '../../lumi-units';
import { DataService } from '../../data.service';

@Component({
    selector: 'li-lumi-chart',
    templateUrl: './lumi-chart.component.html',
    styleUrls: ['../../lumi-inspector.component.css',
                './lumi-chart.component.css']
})
export class LumiChartComponent implements OnInit {

    @ViewChild('alerts') alerts;
    @ViewChild('chart') chart;
    lumiData: Array<Array<any>>;
    chartUnit = null;

    constructor(protected dataService: DataService) {}

    ngOnInit() {
        this.dataService.onNewLumiData.subscribe(this.onNewData.bind(this));
        this.lumiData = this.dataService.lumiData;
    }

    ngAfterViewInit() {
    }

    onNewData(event) {
        this.addSeriesFromMemory(event.data, 'recorded');
    }

    addSeriesFromMemory(dataid, yfield) {
        const newLumiData = this.dataService.getLumiDataFromStorage(dataid);
        const newData = newLumiData.data;
        const params = newLumiData.params;

        if (this.chart.getChartData().length <= 0) {
            this.chartUnit = params['unit'];
        } else if (LumiUnits.unitsConflict(this.chartUnit, params['unit'])) {
            this.alerts.alert({
                label: '',
                message: 'Cannot add series from data "' + newLumiData.name +
                    '". Conflicting data units.'
            });
            return;
        }

        const name = [
            params['type'], yfield, params['normtag'], params['beamstatus'],
            params['hltpath'], params['datatag'],
            (params['byls'] ? 'byLS' : 'byRUN')
        ].filter(Boolean); // filter out null, undefined, 0, false, empty string
        name.push('(' + params['unit'] + ')');

        this._addSeries(newData, yfield, name.join('_'));
        this.updateYAxisTitle();
    }

    protected _addSeries(data, yfield, name) {
        const x = [];
        for (const xval of data['tssec']) {
            // Conversion to string needed for Plotly to not use local timezone
            x.push(new Date(xval * 1000).toISOString());
        }
        this.chart.addSeries(
            name, x, data[yfield], this.makeTextLabels(data),
            {runnum: data['runnum'], fillnum: data['fillnum']});
    }

    makeTextLabels(data) {
        const text = [];
        for (let i = 0; i < data['runnum'].length; ++i) {
            text.push(data['fillnum'][i] + ':' + data['runnum'][i] + ':' +
                      data['lsnum'][i]);
        }
        return text;
    }

    updateYAxisTitle() {
        const newTitle = (LumiUnits.isInstantaneousUnit(this.chartUnit) ?
                          'Instantaneous' :
                          'Integrated')
            + ' luminosity (' + this.chartUnit + ')';
        const currentTitle = this.chart.getYAxisTitle();
        if (currentTitle !== newTitle) {
            this.chart.setYAxisTitle(newTitle);
        }
    }
}
