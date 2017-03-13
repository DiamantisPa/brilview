import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { AlertsModule } from '../alerts/alerts.module';

import { DataService } from './data.service';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartsComponent } from './charts/charts.component';
import { StorageComponent } from './storage/storage.component';
import { ChartComponent } from './chart/chart.component';
import { LumiChartComponent } from './charts/lumi-chart/lumi-chart.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ClarityModule.forChild(),
        AlertsModule
    ],
    exports: [
        LumiInspectorComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        FormComponent,
        LumiInspectorComponent,
        ChartsComponent,
        StorageComponent,
        ChartComponent,
        ChartComponent,
        LumiChartComponent,
    ],
    providers: [
        DataService
    ]
})
export class LumiInspectorModule { }
