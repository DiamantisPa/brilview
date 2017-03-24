import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LumiInspectorComponent } from './lumi-inspector.component';

const lumiInspectorRoutes: Routes = [
    { path: '', component: LumiInspectorComponent},
];

export const LumiInspectorRouting: ModuleWithProviders = RouterModule.forChild(lumiInspectorRoutes);
