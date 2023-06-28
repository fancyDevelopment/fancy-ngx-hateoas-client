import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { View1Component } from "./view1/view1.component";
import { View2Component } from "./view2/view2.component";

export const APP_ROUTES: Routes = [{
    path: 'home',
    component: HomeComponent
}, {
    path: 'view1/:url',
    component: View1Component
}, {
    path: 'view2/:url',
    component: View2Component
}, {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
}];