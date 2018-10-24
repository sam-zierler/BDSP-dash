import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tableId = "1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC";
  apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";
  urlString: string;

  columns = new Array();
  rows = new Array();
  startDate: Date;
  endDate: Date;

  constructor() { }

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

  // getWithHttp();

  onDataFetched(data) {

    return data;
    // uncomment to confirm `data`
    // var rows = JSON.stringify(data);
    // console.log(rows);

    this.rows = data['rows'];
    
    for (var i in this.rows) {
      // copy data into variables
      // content = '<...>' + variables
    }

  }
}
