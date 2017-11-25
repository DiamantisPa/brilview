import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveLumiRouting } from './live-lumi.routing';
import { HttpModule } from '@angular/http';
import { ClarityModule } from 'clarity-angular';
import { AlertsModule } from '../alerts/alerts.module';
import { LiveLumiDataService } from './data.service';
import { SharedModule } from '../shared/shared.module';
import { LiveBestlumiComponent } from './live-bestlumi/live-bestlumi.component';

@NgModule({
    imports: [
        CommonModule,
        LiveLumiRouting,
        HttpModule,
        FormsModule,
        ClarityModule.forChild(),
        AlertsModule,
        SharedModule
    ],
    declarations: [
        LiveBestlumiComponent
    ]
})
export class LiveLumiModule { }
