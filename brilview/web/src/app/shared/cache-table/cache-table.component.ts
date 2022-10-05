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
    @Input() nameBuilder: (key, value) => void;
    @Input() actions: {[name: string]: (key, value) => void};
    get actionsKeys() {
        return Object.keys(this.actions);
    }
    @Input() keySortComparator: (key) => number;
    sortedKeys = [];
    names = {};

    constructor() {}

    ngOnInit() {
        this.cache.onChange$.takeUntil(this.ngUnsubscribe$).subscribe(key => {
            this.sortedKeys = this.cache.getKeys().sort(this.keySortComparator);
            const makeName = this.nameBuilder ? this.nameBuilder : (key, val) => key;
            this.names = {};
            this.sortedKeys.forEach(key => {
                this.names[key] = makeName(key, this.cache.getData(key));
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
