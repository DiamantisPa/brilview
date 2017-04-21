import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import * as LumiUnits from '../../lumi-units';
import { LumiChartComponent } from '../lumi-chart/lumi-chart.component';
import { LumiDataService } from '../../data.service';

@Component({
    selector: 'li-cumulative-chart',
    templateUrl: '../lumi-chart/lumi-chart.component.html',
    styleUrls: ['../../lumi-inspector.component.css',
                '../lumi-chart/lumi-chart.component.css']
})
export class CumulativeChartComponent extends LumiChartComponent
implements OnInit, AfterViewInit {

    constructor(protected dataService: LumiDataService) {
        super(dataService);
    }

    ngOnInit() {
        console.log(this.dataService);
        this.lumiData = this.dataService.lumiData;
    }

    ngAfterViewInit() {
        this.chart.setTitle('Cumulative luminosity');
    }

    protected _addSeries(data, yfield, name, params) {
        const x = [];
        let y = [];
        let lastY = 0;
        for (const xval of data['tssec']) {
            // Conversion to string needed for Plotly to not use local timezone
            x.push(new Date(xval * 1000).toISOString());
        }
        for (const yval of data[yfield]) {
            y.push(lastY + yval);
            lastY += yval;
        }
        y = this.scaleValues(y, params['unit'], this.chartUnit);
        this.chart.addSeries(
            name, x, y, this.makeTextLabels(data),
            {runnum: data['runnum'], fillnum: data['fillnum']});
    }
}
