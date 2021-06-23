import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchatComponent } from './components/schat/schat.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: SchatComponent
  },
  {
    path: '*',
    redirectTo: 'new'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
