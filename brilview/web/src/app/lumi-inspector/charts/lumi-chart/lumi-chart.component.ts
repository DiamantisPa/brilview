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
        this.chart.afterRemoveData = this.rescaleChartValues.bind(this);
    }

    onNewData(event) {
        this.addSeriesFromMemory(event.data, 'recorded');
    }

    addSeriesFromMemory(dataid, yfield) {
        const newLumiData = this.dataService.getLumiDataFromStorage(dataid);
        const newData = newLumiData.data;
        const params = newLumiData.params;

        if (this.chart.chartData.length <= 0) {
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
            (params['type'] === '-normtag-' ? null : params['type']),
            yfield, params['normtag'], params['beamstatus'],
            params['hltpath'], params['datatag'],
            (params['byls'] ? 'byLS' : 'byRUN')
        ].filter(Boolean); // filter out null, undefined, 0, false, empty string

        this._addSeries(newData, yfield, name.join('_'), params);
        this.rescaleChartValues();
    }

    protected _addSeries(data, yfield, name, params) {
        const x = [];
        for (const xval of data['tssec']) {
            // Conversion to string needed for Plotly to not use local timezone
            x.push(new Date(xval * 1000).toISOString());
        }
        this.chart.addSeries(
            name,
            x,
            this.scaleValues(data[yfield], params['unit'], this.chartUnit),
            this.makeTextLabels(data),
            {runnum: data['runnum'], fillnum: data['fillnum']}
        );
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

    recalculateUnit() {
        if (!this.chartUnit) {
            return null;
        }
        const currentChartMax = this.getMaxValue(this.chart.chartData);
        return LumiUnits.unitForData(currentChartMax, this.chartUnit);
    }

    scaleValues(values: Array<number>, currentUnit, newUnit) {
        if (currentUnit === newUnit) {
            console.log('not scaling', values, currentUnit, newUnit);
            return values;
        }
        const scale = LumiUnits.scaleUnit(currentUnit, newUnit);
        console.log('scaling', values, currentUnit, newUnit, scale);
        return values.map((val) => val * scale);
    }

    rescaleChartValues() {
        const newUnit = this.recalculateUnit();
        if (newUnit !== this.chartUnit) {
            for (const series of this.chart.chartData) {
                series.y = this.scaleValues(series.y, this.chartUnit, newUnit);
            }
            this.chart.redraw();
            this.chartUnit = newUnit;
        }
        this.updateYAxisTitle();
    }

    getMaxValue(data) {
        let max = -Infinity;
        for (const series of data) {
            for (const val of series.y) {
                if (val > max) {
                    max = val;
                }
            }
        }
        return max;
    }
}
