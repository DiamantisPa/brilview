import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';

const appRoutes: Routes = [
    // { path: '', component: HomeComponent, pathMatch: 'full'},
    { path: '', redirectTo: 'avglumi', pathMatch: 'full'},
    { path: 'home', component: HomeComponent},
    { path: 'avglumi', loadChildren: 'app/lumi-inspector/lumi-inspector.module#LumiInspectorModule'},
    { path: '**', component: RouteNotFoundComponent},
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
