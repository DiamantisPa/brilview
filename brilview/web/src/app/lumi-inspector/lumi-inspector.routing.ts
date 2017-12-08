import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LumiInspectorComponent } from './lumi-inspector.component';
import { LiveBestlumiComponent } from './live-bestlumi/live-bestlumi.component';
import { AtlaslumiComponent } from './atlaslumi/atlaslumi.component';

const lumiInspectorRoutes: Routes = [
    { path: '', component: LumiInspectorComponent},
    { path: 'live-bestlumi', component: LiveBestlumiComponent},
    { path: 'atlaslumi', component: AtlaslumiComponent},
];

export const LumiInspectorRouting: ModuleWithProviders = RouterModule.forChild(lumiInspectorRoutes);
