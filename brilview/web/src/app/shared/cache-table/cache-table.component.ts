import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DataCache } from '../data-cache/data-cache';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'bv-cache-table',
    templateUrl: './cache-table.component.html',
    styleUrls: ['./cache-table.component.css']
})
export class CacheTableComponent implements OnInit, OnDestroy {

    private ngUnsubscribe$: Subject<void> = new Subject<void>();
    @Input() cache: DataCache;
    sortedKeys = [];
    names = {};

    constructor() {}

    ngOnInit() {
        this.cache.onChange$.takeUntil(this.ngUnsubscribe$).subscribe(key => {
            console.log('change', key);
            this.sortedKeys = this.cache.getKeys();
            this.names = {};
            this.sortedKeys.forEach(key => {
                this.names[key] = key + '_name';
            });
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }

    remove(key) {
        this.cache.removeData(key);
    }

    clear() {
        this.cache.clear();
    }

}
