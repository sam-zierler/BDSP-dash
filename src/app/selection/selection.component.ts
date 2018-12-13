import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
import * as JustGage from 'justgage';

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

  signInButton = document.getElementById('sign-in-button');
  signOutButton = document.getElementById('sign-out-button');

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

  linechart;

  tonsFetched: boolean;
  distanceFetched: boolean;

  averageTonsPerDay
  averageDistancePerDay
  tonsPerDistance

  constructor() {
    this.tableNames = new Array<string>();
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

    this.tonsFetched = false;
    this.distanceFetched = false;
  }

  ngOnInit() {
  }

  fetchFields = () => {
    this.tableId = $("#table-id-input").val();
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
      //this.onChange(event);
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
        for (let i = 0; i < this.numFieldsSelected; i++) {
          var datatype = $("#fields-datatype" + i).val();
          var $element = $("#fields-datatype" + i);
          var $label = $("label[for='"+$element.attr('id')+"']");
          if ($label.text() === this.uniqueIdField) {
            console.log("skipping unique id");
          } else {
              this.selectedFields[i] = $label.text();
              this.selectedFieldTypes[i] = $element.val();
              if (datatype === 'date') {
                this.datetypefields[counter] = $label.text();
                counter = counter + 1;
              }
            }
        }

        for (let j = 0; j < this.selectedFields.length; j++) {
          if (this.selectedFields[j] === undefined) {
            this.selectedFields.splice(j, 1);
            this.selectedFieldTypes.splice(j, 1);
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

  onChange(event) {
    console.log("onChange running");
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

    for (let a = 0; a < this.selectedFields.length; a++) {
      console.log(this.selectedFields[a]);
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
    console.log(this.rows);
    
    for (let i = 0; i < data.columns.length; i++) {
      this.columns[i] = data.columns[i];
    }
    for (let i = 0; i < data.rows.length; i++) {
      // if (typeof(data.rows[i]) === 'number') {
      //   this.rows[i] = this.round(data.rows[i], 2);
      // }
      this.rows[i] = data.rows[i]
    }

    // formatting the data based on `selectedFieldTypes[]`
    // dataTypes = ["number", "string/text", "date", "boolean", "array"]
      for (let i = 0; i < this.columns.length; i++) {
        if (this.selectedFieldTypes[i] === "number") {
          for (let j = 0; j < this.rows.length; j++) {
            this.rows[j][i] = +(this.rows[j][i]);
          }
        } else if (this.selectedFieldTypes[i] === "string/text") {
          for (let j = 0; j < this.rows.length; j++) {
            this.rows[j][i] = "" + this.rows[j][i];
          }
        } else if (this.selectedFieldTypes[i] === "date") {
          for (let j = 0; j < this.rows.length; j++) {
            var temp;
            if (typeof(this.rows[j][i]) === 'number') {
              temp = this.rows[j][i].toString().substring(0, 10);
            } else if (typeof(this.rows[j][i]) === 'string') {
              temp = this.rows[j][i].substring(0, 10);
            }
            if (temp) {
              this.rows[j][i] = temp;
            }
          }
        } else if (this.selectedFieldTypes[i] === "boolean") {
          for (let j = 0; j < this.rows.length; j++) {
            var temp = this.rows[j][i].toLowerCase();
            if (temp === "true") {
              this.rows[j][i] = true;
            } else if (temp === "false") {
              this.rows[j][i] = false;
            }
          }
        }
      }

  for (let i = 0; i < this.rows.length; i++) {
    for (let j = 0; j < this.columns.length; j++) {
      
      
      if (typeof(this.rows[i][j]) === 'number') {
        this.rows[i][j] = Math.round(this.rows[i][j] * 100) / 100;
      }
    }
  }
    this.dataFetched = true;
    console.log(data);
  }

  newSelection = () => {
    this.dataFetched = false;
    $("#table-select-row").show();
    $("#table-select-col").show();

    // reset variables
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

    this.averageDistancePerDay = 0;
    this.averageTonsPerDay = 0;
    this.tonsPerDistance = 0;

    this.tonsFetched = false;
    this.distanceFetched = false;
  }
  
  showTable = () => {
    $("#charts-content-div").hide();
    $("#data-table-inside-div").show();
  }

  showCharts = () => {
    $("#data-table-inside-div").hide();
    $("#charts-content-div").show();
    this.getWidgetData();
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
      xData[i] = (this.rows[i][xFieldIndex]);
      yData[i] = Number(this.rows[i][yFieldIndex]);
    }

    console.log(xData);
    console.log(yData);

    var canvas = <HTMLCanvasElement> document.getElementById("chart-canvas");
    var context = canvas.getContext('2d');

    if (chartType === "linegraph") {
      this.linechart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: xData,
          datasets: [{
            label: yField,
            data: yData,
            fill: false,
            borderColor: "blue",
            lineTension: 0.1
          }]
        },
        options: {}
      });
      this.linechart.update();
    } else if (chartType === "bargraph") {

    } else if (chartType === "piegraph") {

    } else {
      alert("...something wrong");
    }
  }

  getWidgetData() {

    var timeField, timeFieldIndex, daystring = "", daycount = 0;
    var xAxisValues = [];

    if (this.datetypefields) {
      timeField = this.datetypefields[0];
      timeFieldIndex = this.columns.indexOf(timeField);
    } else {
      alert("error");
    }

    for (let i = 0; i < this.rows.length; i++) {
      xAxisValues[i] = this.rows[i][timeFieldIndex];      // day/time strings
    }

    if (this.selectedFields.includes("tons")) {
      // average tons per day
      var colIndex = this.columns.indexOf("tons");
      var totaltons = 0;

      for (let i = 0; i < this.rows.length; i++) {
        totaltons += this.rows[i][colIndex];
        if (daystring !== this.rows[i][timeFieldIndex]) {
          daycount += 1;
          daystring = this.rows[i][timeFieldIndex];
        }
      }
      console.log("day count " + daycount);
      this.averageTonsPerDay = (totaltons / daycount);
      this.averageTonsPerDay = Math.round(this.averageTonsPerDay * 100) / 100;
      this.tonsFetched = true;
    }

    if (this.selectedFields.includes("distance")) {
      var colIndex = this.columns.indexOf("distance");
      daystring = "";
      var totaldistance = 0;

      for (let i = 0; i < this.rows.length; i++) {
        totaldistance += this.rows[i][colIndex];
        if (daystring !== this.rows[i][timeFieldIndex]) {
          daycount += 1;
          daystring = this.rows[i][timeFieldIndex];
        }
      }
      this.averageDistancePerDay = (totaldistance / daycount);
      this.averageDistancePerDay = Math.round(this.averageDistancePerDay * 100) / 100;
      this.distanceFetched = true;
    }
  }
    
    

}
