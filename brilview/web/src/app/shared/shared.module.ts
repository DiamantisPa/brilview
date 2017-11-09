import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from 'clarity-angular';
import { ProgressComponent } from './progress/progress.component';
import { StatusComponent } from './status/status.component';
import { CacheTableComponent } from './cache-table/cache-table.component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild()
    ],
    declarations: [
        ProgressComponent,
        StatusComponent,
        CacheTableComponent
    ],
    exports: [
        ProgressComponent,
        StatusComponent,
        CacheTableComponent
    ]
})
export class SharedModule { }
