import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { DateTimePickerModule } from 'ng2-date-time-picker';
import { AlertsModule } from '../alerts/alerts.module';

import { LumiInspectorRouting } from './lumi-inspector.routing';

import { DataService } from './data.service';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartsComponent } from './charts/charts.component';
import { StorageComponent } from './storage/storage.component';
import { ChartComponent } from './chart/chart.component';
import { LumiChartComponent } from './charts/lumi-chart/lumi-chart.component';
import { CumulativeChartComponent } from './charts/cumulative-chart/cumulative-chart.component';
import { RatioChartComponent } from './charts/ratio-chart/ratio-chart.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        LumiInspectorRouting,
        AlertsModule,
        ClarityModule.forChild(),
        DateTimePickerModule
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
        CumulativeChartComponent,
        RatioChartComponent
    ],
    providers: [
        DataService
    ]
})
export class LumiInspectorModule { }
