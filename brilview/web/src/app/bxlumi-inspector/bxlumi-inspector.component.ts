import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { BXLumiDataService } from './data.service';
import { DataCache } from '../shared/data-cache/data-cache';


@Component({
    selector: 'app-bxlumi-inspector',
    templateUrl: './bxlumi-inspector.component.html',
    styleUrls: ['./bxlumi-inspector.component.css']
})
export class BXLumiInspectorComponent implements OnInit, OnDestroy {

    private ngUnsubscribe$ = new Subject<void>();
    cache: DataCache;

    constructor(protected dataService: BXLumiDataService) {
        this.cache = new DataCache();
        this.dataService.onNewLumiData$
            .takeUntil(this.ngUnsubscribe$)
            .subscribe(newData => {
                this.cache.setData(Date.now().toString(), newData);
                if (this.cache.getSize() > 10) {
                    const timestamps = this.cache.getKeys()
                        .map(key => {return parseInt(key, 10);})
                        .sort((a: number, b: number) => (a - b));
                    this.cache.removeData(timestamps[0].toString());
                }
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }

}
