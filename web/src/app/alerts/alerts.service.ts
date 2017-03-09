import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface Alert {
    label: string;
    message: string;
    data?: any;
};

@Injectable()
export class AlertsService {

    protected alertSubject: Subject<Alert>;
    constructor() {
        this.alertSubject = new Subject();
    }

    alert(label, message, data) {
        this.alertSubject.next({
            label, message, data
        });
    }

    onAlert(labels: Array<string>) {
        return this.alertSubject.filter(
            alert => labels.indexOf(alert.label) >= 0
        );
    }

}
