import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SummaryComponent } from './summary/summary.component';
import { RunsComponent } from './runs/runs.component';
import { AssignComponent } from './assign/assign.component';
import { EmployeesComponent } from './employees/employees.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TableComponent } from './table/table.component';
import { DatepickerPopupComponent } from './datepicker-popup/datepicker-popup.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { TruckDetailsComponent } from './truck-details/truck-details.component';
import { TruckDetailsExtraComponent } from './truck-details-extra/truck-details-extra.component';
import { OpenExtraButtonComponent } from './open-extra-button/open-extra-button.component';

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
    DatepickerPopupComponent,
    LoginModalComponent,
    TruckDetailsComponent,
    TruckDetailsExtraComponent,
    OpenExtraButtonComponent
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
