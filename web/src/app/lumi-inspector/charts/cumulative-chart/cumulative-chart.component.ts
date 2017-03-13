import { Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../../data.service';
import * as LumiUnits from '../../lumi-units';

@Component({
  selector: 'app-cumulative-chart',
  templateUrl: './cumulative-chart.component.html',
  styleUrls: ['./cumulative-chart.component.css']
})
export class CumulativeChartComponent implements OnInit {

    @ViewChild('alerts') alerts;
    @ViewChild('chart') chart;
    lumiData: Array<Array<any>>;
    chartUnit = null;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.lumiData = this.dataService.lumiData;
    }

    ngAfterViewInit() {
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
        const x = [], y = [];
        let lastY = 0;
        for (const xval of data['tssec']) {
            // Conversion to string needed for Plotly to not use local timezone
            x.push(new Date(xval * 1000).toISOString());
        }
        for (const yval of data[yfield]) {
            y.push(lastY + yval);
            lastY += yval;
        }
        this.chart.addSeries(name, x, y);
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
