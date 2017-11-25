import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LiveLumiDataService } from '../live-lumi-data.service';

@Component({
    selector: 'li-live-bestlumi',
    templateUrl: './live-bestlumi.component.html',
    styleUrls: ['./live-bestlumi.component.css']
})
export class LiveBestlumiComponent implements OnInit, AfterViewInit {

    @ViewChild('chart') chart;

    constructor(protected dataService: LiveLumiDataService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.dataService.query({latest: 1200000}).subscribe(val => {
            console.log(val);
            this.chart.addSeries('bestlumi', val['timestamp'], val['avg'], null, null);
        });

        setInterval(() => {
            const x = this.chart.chartData[0]['x'];
            const lastx = x[x.length - 1];
            console.log(x, lastx);
            this.dataService.query({since: lastx}).subscribe(val => {
                this.chart.clearChart();
                this.chart.addSeries('bestlumi', val['timestamp'], val['avg'], null, null);
            });
        }, 4000);
    }

}
