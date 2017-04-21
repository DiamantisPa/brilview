import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

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
                return data.json();
            });
    }
}
