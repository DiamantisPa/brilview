import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RouteNotFoundComponent } from './route-not-found/route-not-found.component';

const appRoutes: Routes = [{
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
}, {
    path: 'home',
    component: HomeComponent
}, {
    path: 'avglumi',
    redirectTo: 'totlumi',
    pathMatch: 'full'
}, {
    path: 'totlumi',
    loadChildren: 'app/lumi-inspector/lumi-inspector.module#LumiInspectorModule'
}, {
    path: 'bxlumi',
    loadChildren: 'app/bxlumi-inspector/bxlumi-inspector.module#BXLumiInspectorModule'
}, {
    path: 'live',
    loadChildren: 'app/live-lumi/live-lumi.module#LiveLumiModule'
}, {
    path: '**', component: RouteNotFoundComponent
}];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
