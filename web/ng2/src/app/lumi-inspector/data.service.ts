import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

    static postHeaders = new Headers({'Content-Type': 'application/json'});
    static postOptions = new RequestOptions({ headers: DataService.postHeaders });


    lumiData = [];
    protected storage = {};
    protected lastStorageID = -1;


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
                this.addToStorage(params, data.data);
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

    protected addToStorage(params, data) {
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
    }

    makeLumiDataName(params, data) {
        return [
            params['begin'], params['end'], params['type'],
            (params['byls'] ? 'byLS' : 'byRUN'), params['beamstatus'],
            params['normtag'], params['hltpath'], params['datatag'],
            params['unit'], data['tssec'].length + ' data points'].filter(Boolean).join(', ');
    }

    getLumiDataFromStorage(id) {
        // TODO: better be return clone, not reference
        return this.storage[id];
    }

    removeLumiDataFromStorage(id) {
        for (let i = 0; i < this.lumiData.length; ++i) {
            if (this.lumiData[i][0] === id) {
                this.lumiData.splice(i, 1);
                break;
            }
        }
        delete this.storage[id];
    }

}
