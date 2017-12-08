import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AlertsModule } from '../alerts/alerts.module';
import { LumiInspectorRouting } from './lumi-inspector.routing';
import { LumiDataService } from './data.service';
import { LiveLumiDataService } from './live-lumi-data.service';
import { AtlaslumiDataService } from './atlaslumi-data.service';
import { SharedModule } from '../shared/shared.module';

import { FormComponent } from './form/form.component';
import { LumiInspectorComponent } from './lumi-inspector.component';
import { ChartsComponent } from './charts/charts.component';
import { StorageComponent } from './storage/storage.component';
import { ChartComponent } from './chart/chart.component';
import { LumiChartComponent } from './charts/lumi-chart/lumi-chart.component';
import { CumulativeChartComponent } from './charts/cumulative-chart/cumulative-chart.component';
import { RatioChartComponent } from './charts/ratio-chart/ratio-chart.component';
import { PileupChartComponent } from './charts/pileup-chart/pileup-chart.component';
import { LiveBestlumiComponent } from './live-bestlumi/live-bestlumi.component';
import { AtlaslumiComponent } from './atlaslumi/atlaslumi.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        LumiInspectorRouting,
        AlertsModule,
        ClarityModule.forChild(),
        NguiDatetimePickerModule,
        SharedModule
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
        PileupChartComponent,
        LiveBestlumiComponent,
        AtlaslumiComponent
    ],
    providers: [
        LumiDataService,
        LiveLumiDataService,
        AtlaslumiDataService
    ]
})
export class LumiInspectorModule { }
