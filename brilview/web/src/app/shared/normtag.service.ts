import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

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
                return this.cleanNull(data['data'])
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
                return this.cleanNull(data['data'])
            });
    }

    getAllTags() {
        let iovtags = this.getIOVTags();
        let normtags = this.getNormtags();
        return zip(iovtags, normtags).pipe(
            map((tags) => {
               return tags[0].concat(tags[1]);
            })
      );
    }
    cleanNull(data){
        return data.filter(x => x != null)
    }
}
