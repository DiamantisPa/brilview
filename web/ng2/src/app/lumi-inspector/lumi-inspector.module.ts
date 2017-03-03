import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { DataService } from './data.service';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule
    ],
    exports: [
        LumiInspectorComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        FormComponent,
        LumiInspectorComponent,
        ChartComponent
    ],
    providers: [
        DataService
    ]
})
export class LumiInspectorModule { }
