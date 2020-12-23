import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LightComponent } from './light/light.component';

const routes: Routes = [{
  path: '**',
  component: LightComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
