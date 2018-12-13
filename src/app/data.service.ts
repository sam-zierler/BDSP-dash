import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tableId;
  apikey;
  urlString: string;

  columns = new Array();
  rows = new Array();
  startDate: Date;
  endDate: Date;
  tons;
  distance;
  widgetData = new Array();
  sum;
  average = 0;

  constructor() { }

  getTableInfo(id){
    if(id == "Poughkeepsie Sanitation"){
      this.tableId = "1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC";
      this.apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";
      this.fetchData();
    }
  }

  fetchData(): any {

    let query = "SELECT 'truckID', 'start', 'end', 'run', 'latitude', 'longitude', 'tons', 'distance', 'notes' FROM " + this.tableId;
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

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
  

  fetchXYData(x, y): any {

    let query = "SELECT '" + x + "', '" + y + "', " + "'end'" + "FROM " + this.tableId;
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

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

  // getWithHttp();

  onDataFetched = (data) =>  {
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    console.log(data);
    this.columns = data['columns'];
    this.rows = data['rows'];

    this.rows = this.rows.sort((a, b) => {
      return a[0] - b[0];
    });
    
   // console.log(this.columns);

  }
  showTodayDate() {
    let ndate = new Date();
    return ndate;
 }


  fetchDates(): any {

    let query = "SELECT 'end' FROM " + this.tableId;
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

    let url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + this.apikey);
        url.push('&callback=?');
    
    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: this.onDatesFetched
    });
  }

  onDatesFetched = (data) =>  {
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    console.log(data);
    //this.columns = data['columns'];
    this.endDate = data['rows'];

    this.rows = this.rows.sort((a, b) => {
      return a[0] - b[0];
    });
    
  // console.log(this.columns);

  }

  fetchTons(): any {

    let query = "SELECT 'tons' FROM " + this.tableId;
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

    let url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + this.apikey);
        url.push('&callback=?');
    
    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: this.onTonsFetched
    });
  }

  onTonsFetched = (data) =>  {
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    console.log(data);
    //this.columns = data['columns'];
    this.tons = data['rows'];
    
  // console.log(this.columns);

  }
  fetchDistance(): any {

    let query = "SELECT 'truckID' FROM " + this.tableId;
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

    let url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + this.apikey);
        url.push('&callback=?');
    
    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: this.onDistanceFetched
    });
  }

  onDistanceFetched = (data) =>  {
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    console.log(data);
    //this.columns = data['columns'];
    this.distance = data['rows'];
    
  // console.log(this.columns);

  }

  fetchWidgetData(field, date1, date2): any {

    let query = "SELECT '" + field + "' FROM " + this.tableId + " WHERE 'start' >= '" + date1 + " 00:00:00' AND 'end' <= '" + date2 + " 00:00:00'";
    let encodedQuery = encodeURIComponent(query);

    // uncomment to confirm `query`
    // alert(query);

    let url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + this.apikey);
        url.push('&callback=?');
    
    $.ajax({
      url: url.join(''),
      dataType: 'jsonp',
      success: this.onWidgetFetched
    });
  }
  onWidgetFetched = (data) =>  {
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    console.log(data);
    var temp = data['rows'];
    

    for(var i = 0; i < temp.length; i++)
    {
      this.widgetData = this.widgetData.concat(temp[i]);
    }
    console.log(this.widgetData);
   // console.log(this.columns);
    this.sum = this.widgetData.reduce(add, 0);

    function add(a, b) {
      if(a == "NaN") a = 0;
      if(b == "NaN") b = 0;
      return a + b;
    }
    console.log(this.sum);
    this.average = this.sum/this.widgetData.length;
    console.log(this.sum);
  }
}
