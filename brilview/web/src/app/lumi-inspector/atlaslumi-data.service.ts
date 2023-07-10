import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';

export interface LumiDataEvent {
    type: string;
    data: Object;
}

@Injectable()
export class AtlaslumiDataService {

    static postHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    static postOptions = { headers: AtlaslumiDataService.postHeaders };

    onNewLumiData$: Subject<LumiDataEvent>;
    onRemoveLumiData$: Subject<void>;
    lumiDataLimit = 10;
    lumiData = [];
    protected storage = {};
    protected lastStorageID = -1;

    constructor(private http: HttpClient) {
        this.onNewLumiData$ = new Subject();
        this.onRemoveLumiData$ = new Subject<void>();
    }

    query(params) {
        let _params = Object.assign({}, params, {
            'query_type': 'atlaslumi',
            'unit': 'hz/ub'
        });
        const request = this.http.post('/api/query', _params, AtlaslumiDataService.postOptions)
            .do(data => {
                if (!data) {
                    throw data;
                }
                if (!data.hasOwnProperty('status') || data['status'] !== 'OK') {
                    if (data.hasOwnProperty('message')) {
                        throw data['message'];
                    }
                    throw data;
                }
            }).share();
        request.subscribe(data => {
            const id = this.addToStorage(_params, data['data']);
            this.onNewLumiData$.next({type: 'new', data: id});
        }, error => {});
        return request;
    }

    protected addToStorage(params, data) {
        console.log('atlas add storage', params, data);
        const id = this.lastStorageID = this.lastStorageID + 1;
        const name = this.makeLumiDataName(params, data);
        if (this.storage.hasOwnProperty(id)) {
            throw Error('Cannot insert lumi data. ID already exists.');
        }
        this.storage[id] = {
            name: name,
            params: Object.assign({}, params),
            data: data
        };
        this.lumiData.push([id, name]);
        this.removeLumiDataOverLimit();
        console.log('lumidata ', this.lumiData);
        console.log('storage ', this.storage[id]);
        return id;
    }

    makeLumiDataName(params, data) {
        return [
            params['fillnum'], params['query_type'],
            params['unit'], data['timestamp'].length + ' data points'
        ].filter(Boolean).join(', ');
    }

    removeLumiDataOverLimit() {
        let id;
        while (this.lumiData.length > this.lumiDataLimit) {
            id = this.lumiData[0][0];
            this.removeLumiDataFromStorage(id);
        }
        this.onRemoveLumiData$.next();
    }

    removeLumiDataFromStorage(id) {
        for (let i = 0; i < this.lumiData.length; ++i) {
            if (this.lumiData[i][0] === id) {
                this.lumiData.splice(i, 1);
                break;
            }
        }
        delete this.storage[id];
        this.onRemoveLumiData$.next();
    }

}
