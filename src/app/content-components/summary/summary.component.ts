import { Component, OnInit } from '@angular/core';
//import { Observable } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  totalRuns: number;
  totalTons: number;
  totalMiles: number;

  constructor() { 

    this.totalRuns = 0;
    this.totalTons = 0;
    this.totalMiles = 0;

  }

  ngOnInit() {
    this.fromDatePicker();
  }

  toggle() {
    $("#details-extra-button").hide();
    $("#details-extra-div").show();
  }

  showSelectionComponent() {
    $("app-selection").toggle();
  }

  fromDatePicker() {
    //console.log($("#dateRange").val());
  }

  initialize() {
  }

}
