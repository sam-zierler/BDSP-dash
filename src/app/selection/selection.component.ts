import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
/// <reference types="@types/gapi" />
/// <reference types="@types/gapi.auth2" />

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  tableNames: Array<string>;
  tableId = "1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC";
  apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";

  discoveryDocs = ["https://www.googleapis.com/fusiontables/v2/tables"];
  clientId = "1034355473168-8eummsv5q3ja69r5b01cgr64kqo5fvi8.apps.googleusercontent.com"
  scopes = "https://www.googleapis.com/auth/fusiontables";
  
  GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";

  signInButton = document.getElementById('sign-in-button');
  signOutButton = document.getElementById('sign-out-button');

  GoogleAuth;

  selectedTable: string;

  dataFields: Array<string>;
  numFields: number;
  fetchSuccess: boolean;
  numFieldsSelected: number;
  selectedFields: Array<string>;
  showDetails: boolean;

  dataTypes = ["number", "string/text", "date", "boolean", "array"];

  uniqueId: any;
  uniqueIdField: string;
  selectedDataTypes: Array<string>;

  // datatype panel values
  uniqueIdValue: Array<any>;
  selectedFieldTypes: Array<any>;
  daterangeStart: Date;
  daterangeEnd: Date;

  datetypefields: Array<string>;
  showDateSelection: boolean;

  datefieldsmarkup: string;

  isSingleDate: boolean;
  isDateRange: boolean;

  dataFetched: boolean;

  rows: Array<object>;
  columns: Array<string>;


  constructor() {
    this.tableNames = new Array<string>();
    this.selectedTable = "";
    this.dataFields = new Array<string>();
    this.numFields = 0;
    this.fetchSuccess = false;
    this.numFieldsSelected = 0;
    this.selectedFields = new Array<string>();
    this.showDetails = false;
    this.selectedDataTypes = new Array<string>();
    this.datetypefields = new Array<string>();
    this.showDateSelection = false;

    this.uniqueIdValue = new Array<string>();
    this.uniqueIdField = "";
    this.selectedFieldTypes = new Array<string>();
    this.daterangeStart = new Date;
    this.daterangeEnd = new Date;

    this.datefieldsmarkup = "";
    this.isSingleDate = false;
    this.isDateRange = false;

    this.dataFetched = false;
    this.rows = new Array<object>();
    this.columns = new Array<string>();
   }

  ngOnInit() {
  }

  fetchFields = () => {
    // var tableId = $(selector value)
    let url = "https://www.googleapis.com/fusiontables/v2/tables/" + 
      this.tableId + "/columns?key=" + this.apikey;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: this.onFieldsFetched
    });
  }

  onFieldsFetched = (data) => {
    
    this.numFields = data.items.length;
    this.selectedTable = $("#table-selector option:selected").val();

    for (let i = 0; i < data.items.length; i++) {
        this.dataFields[i] = data.items[i].name;
    }
    
    this.fetchSuccess = true;
    $("#table-select-col").hide();
  }

  dataFieldsBack = () => {

    this.dataFields = [];
    this.fetchSuccess = false;
    $("#table-select-col").show();
  }

  dataFieldsNext = () => {
    
    this.numFieldsSelected = 0;

    $("#data-fields-select option:selected").each(() => {
      this.numFieldsSelected = this.numFieldsSelected + 1;
    });

    if (this.numFieldsSelected <= 0) {
      alert("Invalid. Must select at least one data field.");
    } else {

      var temp_string = "";
      $("#data-fields-select option:selected").each(function() {
        temp_string += $(this).text() + " ";
      });
      temp_string = temp_string.trim();
      this.selectedFields = temp_string.split(" ");

      this.fetchSuccess = false;
      this.showDetails = true;
    }
  }

  fieldsDetailsBack = () => {
    this.fetchSuccess = true;
    this.showDetails = false;
  }

  fieldsDetailsNext = () => { 
      // variables --> uniqueId, selectedDataTypes
      var counter = 0;
      this.selectedFields = [];
      this.uniqueIdField = $("#unique-id-select").val();
      this.uniqueId = $("#unique-id-input").val();
      if (this.uniqueId) {
        this.uniqueIdValue = this.uniqueId; // PARSING ...
        for (let i = 0; i < this.numFieldsSelected - 1; i++) {
          var datatype = $("#fields-datatype" + i).val();
          var $element = $("#fields-datatype" + i);
          var $label = $("label[for='"+$element.attr('id')+"']");
          this.selectedFields[i] = $label.text();
          this.selectedFieldTypes[i] = $element.val();
          if (datatype === 'date') {
            this.datetypefields[counter] = $label.text();
            counter = counter + 1;
          }
        }

        if (this.datetypefields.length > 0) {
          var markup = this.createDateFieldsForm();
          $("#datefields-container").html(markup);

          this.showDetails = false;
          $("#date-fields-row").show();
          //this.showDateSelection = true;
        } else {
          this.showDetails = false;

        }

      } else {
        alert("eh. must provide unique id ... you cheeky"); 
      }  
  }

  createDateFieldsForm = () => {
    console.log("running datefieldsform function");
    var markup = "";
    let heading = '<p style="margin-top: 1rem;">Specify Date Fields</p>';
    markup = markup + heading;
    for (let i = 0; i < this.datetypefields.length; i++) {
      let formrow = '<div class="form-row" style="margin-top: .5rem;">' + 
                      '<div class="col">' +
                        '<label class="input-group-text" for="datetype' + i +
                        '">' + this.datetypefields[i] + '</label>' +
                      '</div>' +
                      '<div class="col">' +
                        '<input type="date" id="datetype' + i + '">' +
                      '</div>' +
                    '</div>';
      markup = markup + formrow;
    }
    return markup;
    //this.datefieldsmarkup = $.parseHTML(markup);
    //$("#datefields-container").html(markup);
  }

  onChange(uniqueId) {
    var temp_array = [];
    var index = 0;
    $("#unique-id-select option:not(:selected)").each(function() {
      temp_array[index++] = $(this).text();
    });

    var markup = "";
    let heading = '<p style="margin-top: 1rem;">Specify Data Types</p>';
    markup = markup + heading;
    for (let i = 0; i < temp_array.length; i++) {
      let formrow = '<div class="form-row" style="margin-top: .5rem;">' + 
                      '<div class="col">' +
                        '<label class="input-group-text" for="fields-datatype' + i + 
                        '">' + temp_array[i] + '</label>' + 
                      '</div>' +
                      '<div class="col">' +
                        '<select class="custom-select" id="fields-datatype' + i + '">' +
                          '<option>' + this.dataTypes[0] + '</option>' +
                          '<option>' + this.dataTypes[1] + '</option>' +
                          '<option>' + this.dataTypes[2] + '</option>' +
                          '<option>' + this.dataTypes[3] + '</option>' +
                          '<option>' + this.dataTypes[4] + '</option>' +
                        '</select>' + 
                      '</div>' +
                    '</div>';
      markup = markup + formrow;
    }
    $(".local-container").html(markup);
  }

  dateFieldsBack = () => {
    this.datetypefields = [];
    $("#date-fields-row").hide();
    //this.showDateSelection = false;
    this.showDetails = true;
  }

  fetchData = () => {
    var datevalues = [];
    for (let i = 0; i < this.datetypefields.length; i++) {
      datevalues[i] = $("#datetype" + i).val();
    }
    if (datevalues.length > 2) {
      console.log("why....");
    } else if (datevalues.length === 1) {     // one date
      this.isSingleDate = true;
      this.daterangeStart = datevalues[0];
    } else {
      this.isDateRange = true;
      if (datevalues[0] < datevalues[1]) {    // date range
        this.daterangeStart = datevalues[0];
        this.daterangeEnd = datevalues[1];
      } else {
        this.daterangeStart = datevalues[1];
        this.daterangeEnd = datevalues[0];
      }
    }

    // SELECT <
    let fieldsString = "";
    for (let i = 0; i < this.selectedFields.length - 1; i++) {
      fieldsString = fieldsString + "'" + this.selectedFields[i] + "',";
    }
    fieldsString = fieldsString + "'" + this.selectedFields[this.selectedFields.length - 1] + "'";
    let query = "SELECT" + fieldsString + " FROM " + this.tableId;

    if (this.uniqueId) {
      query = query + " WHERE '" + this.uniqueIdField + "' = '" + this.uniqueIdValue + "'";

      if (this.isSingleDate) {
        query = query + " AND '" + this.datetypefields[0] + "' >= '" + this.daterangeStart + "'";
      }
      else if (this.isDateRange) {
        query = query + " AND '" + this.datetypefields[0] + "' >= '" + this.daterangeStart + "' AND '" +
                                     this.datetypefields[1] + "' <= '" + this.daterangeEnd + "'";
      }
    } else {

      if (this.isSingleDate) {
        query = query + " WHERE '" + this.datetypefields[0] + "' >= '" + this.daterangeStart + "'";
      }
      else if (this.isDateRange) {
        query = query + " WHERE '" + this.datetypefields[0] + "' >= '" + this.daterangeStart + "' AND '" +
                                     this.datetypefields[1] + "' <= '" + this.daterangeEnd + "'";
      }

    }

    let encodedQuery = encodeURIComponent(query);
    let url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=' + this.apikey);
    url.push('&callback=?');

    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: this.onDataFetched
    });

  }

  onDataFetched = (data) => {
    $("#date-fields-row").hide();

    let startDateIndex, endDateIndex;

    for (let i = 0; i < data.columns.length; i++) {
      this.columns[i] = data.columns[i];
    }
    for (let i = 0; i < data.rows.length; i++) {
      this.rows[i] = data.rows[i]
    }
    this.dataFetched = true;
    console.log(data);
  }

  newSelection = () => {
    this.dataFetched = false;
    $("#table-select-row").show();
    $("#table-select-col").show();

    // reset variables
    this.selectedTable = "";
    this.dataFields = new Array<string>();
    this.numFields = 0;
    this.fetchSuccess = false;
    this.numFieldsSelected = 0;
    this.selectedFields = new Array<string>();
    this.showDetails = false;
    this.selectedDataTypes = new Array<string>();
    this.datetypefields = new Array<string>();
    this.showDateSelection = false;

    this.uniqueIdValue = new Array<string>();
    this.uniqueIdField = "";
    this.selectedFieldTypes = new Array<string>();
    this.daterangeStart = new Date;
    this.daterangeEnd = new Date;

    this.datefieldsmarkup = "";
    this.isSingleDate = false;
    this.isDateRange = false;

    this.dataFetched = false;
    this.rows = new Array<object>();
    this.columns = new Array<string>();
  }
  
  showTable = () => {
    $("#charts-content-div").hide();
    $("#data-table-inside-div").show();
  }

  showCharts = () => {
    $("#data-table-inside-div").hide();
    $("#charts-content-div").show();
  }

  makeChart = () => {
    let chartType = $("#chart-type-select").val();
    let xField = $("#x-field-select").val();
    let yField = $("#y-field-select").val();

    console.log(chartType + ", " + xField + ", " + yField);

    let xData = [];
    let yData = [];
    let xFieldIndex;
    let yFieldIndex;

    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i] === xField) {
        xFieldIndex = i;
      }
      if (this.columns[i] === yField) {
        yFieldIndex = i;
      }
    }

    for (let i = 0; i < this.rows.length; i++) {
      xData[i] = Number(this.rows[i][xFieldIndex]);
      yData[i] = this.rows[i][yFieldIndex];
    }

    console.log(xData);
    console.log(yData);

    var canvas = <HTMLCanvasElement> document.getElementById("chart-canvas");
    var context = canvas.getContext('2d');

    if (chartType === "linegraph") {
      var linechart = new Chart(context, {
        type: 'line',
        data: {
          labels: [yData],
          datasets: [{
            data: [xData],
            fill: false,
            lineTension: 0.1
          }]
        }
      });
      linechart.update();
    } else if (chartType === "bargraph") {

    } else if (chartType === "piegraph") {

    } else {
      alert("...something wrong");
    }
  }

}
