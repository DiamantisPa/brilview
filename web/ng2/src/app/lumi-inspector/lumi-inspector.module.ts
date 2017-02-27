import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { InfoComponent } from './info/info.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        LumiInspectorComponent
    ],
    declarations: [
        FormComponent,
        LumiInspectorComponent,
        InfoComponent,
        ChartComponent
    ]
})
export class LumiInspectorModule { }
