import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from 'clarity-angular';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertsService } from './alerts.service';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild()
    ],
    declarations: [
        AlertsComponent,
    ],
    providers: [
        AlertsService
    ],
    exports: [
        AlertsComponent
    ]
})
export class AlertsModule { }
