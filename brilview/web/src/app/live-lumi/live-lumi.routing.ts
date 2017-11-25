import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LiveBestlumiComponent } from './live-bestlumi/live-bestlumi.component';

const liveLumiRoutes: Routes = [
    { path: '', component: LiveBestlumiComponent},
];

export const LiveLumiRouting: ModuleWithProviders = RouterModule.forChild(liveLumiRoutes);
