import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { SharedModule } from '../shared/shared.module';
import { AlertsModule } from '../alerts/alerts.module';
import { BXLumiDataService } from './data.service';
import { BXLumiInspectorComponent } from './bxlumi-inspector.component';
import { ChartComponent } from './chart/chart.component';
import { ChartsComponent } from './charts/charts.component';
import { BXLumiChartComponent } from './charts/bxlumi-chart/bxlumi-chart.component';
import { RatioChartComponent } from './charts/ratio-chart/ratio-chart.component';
import { FormComponent } from './form/form.component';
import { BXLumiInspectorRouting } from './bxlumi-inspector.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule.forChild(),
        BXLumiInspectorRouting,
        SharedModule,
        AlertsModule
    ],
    declarations: [
        BXLumiInspectorComponent,
        ChartComponent,
        ChartsComponent,
        BXLumiChartComponent,
        RatioChartComponent,
        FormComponent,
    ],
    providers: [
        BXLumiDataService
    ]
})
export class BXLumiInspectorModule { }
