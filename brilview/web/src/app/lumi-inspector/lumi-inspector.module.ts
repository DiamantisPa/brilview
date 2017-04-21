import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { Ng2CompleterModule } from "ng2-completer";
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AlertsModule } from '../alerts/alerts.module';
import { LumiInspectorRouting } from './lumi-inspector.routing';
import { LumiDataService } from './data.service';
import { NormtagService } from './normtag.service';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartsComponent } from './charts/charts.component';
import { StorageComponent } from './storage/storage.component';
import { ChartComponent } from './chart/chart.component';
import { LumiChartComponent } from './charts/lumi-chart/lumi-chart.component';
import { CumulativeChartComponent } from './charts/cumulative-chart/cumulative-chart.component';
import { RatioChartComponent } from './charts/ratio-chart/ratio-chart.component';
import { StatsComponent } from './stats/stats.component';
import { CompleterPatchDirective } from '../utils/completer-patch.directive';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        LumiInspectorRouting,
        AlertsModule,
        ClarityModule.forChild(),
        NguiDatetimePickerModule,
        Ng2CompleterModule
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
        RatioChartComponent,
        StatsComponent,
        CompleterPatchDirective
    ],
    providers: [
        LumiDataService,
        NormtagService
    ]
})
export class LumiInspectorModule { }
