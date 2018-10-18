import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryComponent } from './content-components/summary/summary.component';
import { RunsComponent } from './content-components/runs/runs.component';
import { AssignComponent } from './content-components/assign/assign.component';
import { EmployeesComponent } from './content-components/employees/employees.component';
import { StatisticsComponent } from './content-components/statistics/statistics.component';

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
