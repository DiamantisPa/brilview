import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';

@Injectable()
export class BXLumiDataService {

    static postHeaders = new Headers({'Content-Type': 'application/json'});
    static postOptions = new RequestOptions({ headers: BXLumiDataService.postHeaders });

    onNewLumiData$: Subject<any>;

    constructor(protected http: Http) {
        this.onNewLumiData$ = new Subject<any>();

    }

    query(params) {

        // return Observable.of('resultresult').delay(3000);
        let _params = null;
        try {
            _params = this.parseParameters(params);
        } catch (e) {
            return Observable.throw(e.message);
        }
        const request = this.http.post('/api/query', _params, BXLumiDataService.postOptions)
            .map((data) => {
                return data.json();
            })
            .do(data => {
                if (!data || !data.hasOwnProperty('status') || data['status'] !== 'OK') {
                    if (data.hasOwnProperty('message')) {
                        throw data.message;
                    }
                    throw data;
                }
            }).share();
        request.subscribe(response => {
            this.onNewLumiData$.next({data: response.data, params: Object.assign({}, params)});
        }, error => {});
        return request;
    }

    parseParameters(p) {
        const parsed = Object.assign({}, p);
        parsed['query_type'] = 'bxlumi';
        if (parsed.hasOwnProperty('type')){
            const lumitype = parsed['type'].toLowerCase();
            if (lumitype === 'online' || lumitype === '-normtag-') {
                parsed['type'] = null;
            }
        }
        return parsed;
    }
}
