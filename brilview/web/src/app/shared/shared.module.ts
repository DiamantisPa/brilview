import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from 'clarity-angular';
import { ProgressComponent } from './progress/progress.component';
import { StatusComponent } from './status/status.component';
import { CacheTableComponent } from './cache-table/cache-table.component';
import { ChartStatsComponent } from './chart-stats/chart-stats.component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild()
    ],
    declarations: [
        ProgressComponent,
        StatusComponent,
        CacheTableComponent,
        ChartStatsComponent
    ],
    exports: [
        ProgressComponent,
        StatusComponent,
        CacheTableComponent,
        ChartStatsComponent
    ]
})
export class SharedModule { }
