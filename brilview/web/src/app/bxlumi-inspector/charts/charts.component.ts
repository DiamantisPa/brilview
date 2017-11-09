import { Component, OnInit, Input } from '@angular/core';
import { DataCache } from '../../shared/data-cache/data-cache';


@Component({
    selector: 'bxli-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

    @Input('cache') cache: DataCache;
    lumiChartVisible = true;
    ratioChartVisible = false;

    constructor() {}

    ngOnInit() {
    }

    dispatchResize() {
        window.dispatchEvent(new Event('resize'));
    }

}
