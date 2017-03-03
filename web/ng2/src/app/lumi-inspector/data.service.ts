import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

    static postHeaders = new Headers({'Content-Type': 'application/json'});
    static postOptions = new RequestOptions({ headers: DataService.postHeaders });

    constructor(private http: Http) { }

    query(params) {
        params['query_type'] = 'timelumi';
        return this.http.post(
            '/api/query',
            params,
            DataService.postOptions)
            .map((data) => {
                return data.json().data;
            });
    }

}
