import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { AssignComponent } from './content-components/assign/assign.component';
import { StatisticsComponent } from './content-components/statistics/statistics.component';
import { SelectionComponent } from './selection/selection.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'select',
    component: SelectionComponent
  },
  {
    path: 'map',
    component: AssignComponent
  },
  {
    path: 'statistics',
    component: StatisticsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
