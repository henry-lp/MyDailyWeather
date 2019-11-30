import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalViewComponent } from './personal-view/personal-view.component';
import { HomeviewComponent } from './homeview/homeview.component';
const routes: Routes = [ 
  {path:"",component:HomeviewComponent},
  {path:"profile",component:PersonalViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
