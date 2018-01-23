import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Injectable()
export class NormtagService {

    static postHeaders = new HttpHeaders({'Content-Type': 'application/json'});
    static postOptions = { headers: NormtagService.postHeaders };

    constructor(private http: HttpClient) {}

    getIOVTags() {
        return this.http.post(
            '/api/query',
            {'query_type': 'iovtags'},
            NormtagService.postOptions)
            .map((data) => {
                if (data['status'] !== 'OK') {
                    return [];
                }
                return data['data'];
            });
    }

    getNormtags() {
        return this.http.post(
            '/api/query',
            {'query_type': 'normtags'},
            NormtagService.postOptions)
            .map((data) => {
                if (data['status'] !== 'OK') {
                    return [];
                }
                return data['data'];
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
