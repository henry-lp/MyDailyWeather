import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalViewComponent } from './components/personal-view/personal-view.component';
import { HomeviewComponent } from './components/homeview/homeview.component';
import { SearchviewMainComponent } from './components/searchbview/searchview-main/searchview-main.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';

const routes: Routes = [ 
  {path:"",redirectTo:"home",pathMatch:"full"},
  {path:"home",component:HomeviewComponent,data: {animation: 'Home'}},
  {path:"profile",component:PersonalViewComponent,data: {animation: 'Profile'}},
  {path:"search",component:SearchviewMainComponent,data: {animation: 'Search'}},
  {path: '**',component:ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
