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
import { CommonChartControlsComponent } from './charts/common-chart-controls/common-chart-controls.component';
import { StorageComponent } from './storage/storage.component';

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
        CommonChartControlsComponent,
        StorageComponent,
    ],
    providers: [
        DataService
    ]
})
export class LumiInspectorModule { }
