import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { DataService } from './data.service';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartsComponent } from './charts/charts.component';
import { CommonChartControlsComponent } from './charts/common-chart-controls/common-chart-controls.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ClarityModule.forRoot()
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
    ],
    providers: [
        DataService
    ]
})
export class LumiInspectorModule { }
