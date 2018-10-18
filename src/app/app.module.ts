import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SummaryComponent } from './content-components/summary/summary.component';
import { RunsComponent } from './content-components/runs/runs.component';
import { AssignComponent } from './content-components/assign/assign.component';
import { EmployeesComponent } from './content-components/employees/employees.component';
import { StatisticsComponent } from './content-components/statistics/statistics.component';
import { TableComponent } from './utility-components/table/table.component';
import { LoginModalComponent } from './utility-components/login-modal/login-modal.component';
import { TruckDetailsComponent } from './truck-details/truck-details.component';
import { TruckDetailsExtraComponent } from './truck-details-extra/truck-details-extra.component';
import { SelectionComponent } from './selection/selection.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SummaryComponent,
    RunsComponent,
    AssignComponent,
    EmployeesComponent,
    StatisticsComponent,
    TableComponent,
    LoginModalComponent,
    TruckDetailsComponent,
    TruckDetailsExtraComponent,
    SelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
