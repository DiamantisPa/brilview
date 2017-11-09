import { Component, OnInit, Input } from '@angular/core';
import { DataCache } from '../../../shared/data-cache/data-cache';


@Component({
    selector: 'bxli-ratio-chart',
    templateUrl: './ratio-chart.component.html',
    styleUrls: ['./ratio-chart.component.css']
})
export class RatioChartComponent implements OnInit {

    @Input('cache') cache: DataCache;

    constructor() { }

    ngOnInit() {
    }

}
