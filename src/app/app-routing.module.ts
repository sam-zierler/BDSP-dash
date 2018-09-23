import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryComponent } from './summary/summary.component';
import { RunsComponent } from './runs/runs.component';
import { AssignComponent } from './assign/assign.component';
import { EmployeesComponent } from './employees/employees.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryComponent
  },
  {
    path: 'runs',
    component: RunsComponent
  },
  {
    path: 'assign',
    component: AssignComponent
  },
  {
    path: 'employees',
    component: EmployeesComponent
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
