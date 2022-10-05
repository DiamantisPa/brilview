import { Component, OnInit, Input } from '@angular/core';
import { AlertsService, Alert } from '../alerts.service';

@Component({
    selector: 'bv-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

    @Input('labels') labels: Array<string>;
    alerts: Array<Alert> = [];

    constructor(private alertsService: AlertsService) { }

    ngOnInit() {
        this.alertsService.onAlert(this.labels)
            .subscribe(this.alert.bind(this));
    }

    alert(alert: Alert) {
        this.alerts.push(alert);
        console.log(this.alerts);
    }

    removeAlert(index) {
        this.alerts.splice(index, 1);
    }

}
