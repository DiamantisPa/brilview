import { Component, OnInit, ViewChild } from '@angular/core';

import * as LumiUnits from '../../lumi-units';
import { LumiChartComponent } from '../lumi-chart/lumi-chart.component';

@Component({
    selector: 'li-cumulative-chart',
    templateUrl: '../lumi-chart/lumi-chart.component.html',
    styleUrls: ['../../lumi-inspector.component.css',
                '../lumi-chart/lumi-chart.component.css']
})
export class CumulativeChartComponent extends LumiChartComponent implements OnInit {

    ngOnInit() {
        this.lumiData = this.dataService.lumiData;
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
        this.chart.addSeries(name, x, y, this.makeTextLabels(data));
    }
}
