import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';

@Injectable()
export class LiveLumiDataService {

    static postHeaders = new Headers({'Content-Type': 'application/json'});
    static postOptions = new RequestOptions({ headers: LiveLumiDataService.postHeaders });


    constructor(private http: Http) {}

    query(params) {
        let _params = Object.assign({}, params, {
            'query_type': 'livebestlumi',
        });
        const request = this.http.post('/api/query', _params, LiveLumiDataService.postOptions)
            .map((data) => {
                return data.json();
            })
            .do(data => {
                if (!data) {
                    throw data;
                }
                if (!data.hasOwnProperty('status') || data['status'] !== 'OK') {
                    if (data.hasOwnProperty('message')) {
                        throw data.message;
                    }
                    throw data;
                }
            }).share();
        return request;
    }

}
