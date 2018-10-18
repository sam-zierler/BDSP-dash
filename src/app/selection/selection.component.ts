import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  todayClicked() {
    let today = moment().format('YYYY-MM-DD');
    $("#inputStartDate").val(today);
    //let date = today.getFullYear() + '-' + (today.getMonth() + 1) + "-" + today.getDate();
    //(<HTMLInputElement>document.getElementById("inputStartDate")).valueAsDate = date;
  }

  fetchData() {
    $("app-selection").toggle();
  }

  count = 1;
  addTruckRow() {
    $("#selection-by-id-form").append(this.addNewRow(this.count));
    this.count++;
  }

  addNewRow(count) {
    var newrow = '<div class="form-group row" id="truckIDRow'+count+'">' +
      '<label for="inputTruckID'+count+'" class="col-sm-auto col-form-label col-form-label-sm">Truck ID:</label>' +
      '<div class="col-sm-4 d-flex">' +
      '<input type="text" class="form-control form-control-sm" id="inputTruckID'+count+'">' +
      '<button type="button" class="btn btn-sm btn-close" id="row'+count+'close">' +
      '<i class="fas fa-times"></i>' +
      '</button>' +
      '</div>' +
      '</div>'
    return newrow;
  }

  // '<script>' +
      // 'document.getElementById("row'+count+'close").addEventListener("click", removeRow);' +
      // 'function removeRow() {' +
      // 'document.getElementById("truckIDRow'+count+'").remove();' +
      // '</script>'

  // removeRow() {
  //   console.log("removeRow called, count: " + this.count);
  //   this.count = this.count - 1;
  //   console.log("count updated, count: " + this.count);
  //   $("#truckIDRow"+this.count).remove();
  // }

}
