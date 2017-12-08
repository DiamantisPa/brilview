import {
    Component, OnInit, ViewChild, AfterViewInit, OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/observable/timer';
import 'rxjs/add/operator/takeUntil';

import { AtlaslumiDataService } from '../atlaslumi-data.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
    selector: 'li-atlaslumi',
    templateUrl: './atlaslumi.component.html',
    styleUrls: ['./atlaslumi.component.css']
})
export class AtlaslumiComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('chart') chart: ChartComponent;
    @ViewChild('alerts') alerts;
    $ngUnsubscribe = new Subject<void>();
    success = true;
    isNowLoading = false;

    constructor(protected atlasDataService: AtlaslumiDataService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.queryInitialData();
    }

    ngOnDestroy() {
        this.$ngUnsubscribe.next();
        this.$ngUnsubscribe.complete();
    }

    queryInitialData() {
        this.isNowLoading = true;
        const obs = this.atlasDataService.query({fillnum: 5020})
            .finally(() => this.isNowLoading = false);
        obs.subscribe(resp => {
            const d = resp.data;
            const x = d['timestamp'].map(this.tsToISOString.bind(this));
            this.chart.addSeries('atlaslumi', x, d['lumi_totinst'], [], {});
            this.success = true;
        }, this.onQueryError.bind(this));
        return obs;
    }

    protected onQueryError(err) {
        console.error(err);
    }


    protected tsToISOString(timestamp) {
        // timestamp conversion to string needed for Plotly to not use local timezone
        return new Date(timestamp).toISOString();
    }

    protected tsFromLocalISOString(str) {
        const d = new Date(str.substring(0, 23));
        const offset = d.getTimezoneOffset() * 60 * 1000;
        return d.getTime() - offset;
    }

}
