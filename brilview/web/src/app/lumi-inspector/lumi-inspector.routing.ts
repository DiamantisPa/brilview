import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LumiInspectorComponent } from './lumi-inspector.component';
import { LiveBestlumiComponent } from './live-bestlumi/live-bestlumi.component';

const lumiInspectorRoutes: Routes = [
    { path: '', component: LumiInspectorComponent},
    { path: 'live-bestlumi', component: LiveBestlumiComponent},
];

export const LumiInspectorRouting: ModuleWithProviders = RouterModule.forChild(lumiInspectorRoutes);
