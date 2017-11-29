import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Injectable()
export class NormtagService {

    static postHeaders = new Headers({'Content-Type': 'application/json'});
    static postOptions = new RequestOptions({ headers: NormtagService.postHeaders });

    constructor(private http: Http) {}

    getIOVTags() {
        return this.http.post(
            '/api/query',
            {'query_type': 'iovtags'},
            NormtagService.postOptions)
            .map((data) => {
                return data.json()['data'];
            });
    }

    getNormtags() {
        return this.http.post(
            '/api/query',
            {'query_type': 'normtags'},
            NormtagService.postOptions)
            .map((data) => {
                return data.json()['data'];
            });
    }

    getAllTags() {
        let iovtags = this.getIOVTags();
        let normtags = this.getNormtags();
        return Observable.zip(iovtags, normtags)
            .map((tags) => {
                return tags[0].concat(tags[1]);
            });
    }
}
