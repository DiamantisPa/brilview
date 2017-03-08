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
        const _params = this.normalizeQueryParams(params);
        return this.http.post(
            '/api/query',
            _params,
            DataService.postOptions)
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
            });
    }

    protected normalizeQueryParams(params) {
        const _params = Object.assign({}, params);
        _params['query_type'] = 'timelumi';
        if (_params['type']) {
            const lumitype = _params['type'].toLowerCase() || null;
            if (lumitype === 'online' || lumitype === 'mixed') {
                _params['type'] = null;
            }
        }
        if (_params['beamstatus']) {
            if (_params['beamstatus'].toLowerCase() === 'any beams') {
                _params['beamstatus'] = null;
            }
        }
        return _params;
    }

}
