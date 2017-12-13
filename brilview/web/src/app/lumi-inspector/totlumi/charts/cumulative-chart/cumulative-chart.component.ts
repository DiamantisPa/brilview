import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import * as utils from '../../../../shared/lumi-utils/lumi-chart-utils';
import { LumiChartComponent } from '../lumi-chart/lumi-chart.component';
import { LumiDataService } from '../../../data.service';

@Component({
    selector: 'li-totlumi-cumulative-chart',
    templateUrl: '../lumi-chart/lumi-chart.component.html',
    styleUrls: ['../../../lumi-inspector.css',
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
        y = utils.scaleLumiValues(y, params['unit'], this.chartUnit);
        this.chart.addSeries(
            name, x, y, this.makeTextLabels(data),
            {runnum: data['runnum'], fillnum: data['fillnum']});
    }
}
