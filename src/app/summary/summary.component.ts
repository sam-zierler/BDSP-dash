import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  $table: Object;
  
  constructor() { }

  ngOnInit() {
    this.initialize()
  }

  initialize() {
    var query = "SELECT 'truckID', start, end, latitude, longitude, tons, distance FROM " +
        '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC';
    var encodedQuery = encodeURIComponent(query);

    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY');
    url.push('&callback=?');

    // Send the JSONP request using jQuery
    $.ajax({
      url: url.join(''),
      dataType: 'json',
      success: (data) => {
        console.log(data);
        
        var columns = data['columns'];

        $("#summary-table-head").append("<tr>");
        for (var i in columns) {
          $("#summary-table-head").append("<th scope='col'>" + columns[i] + "</th>");
        }
        $("#summary-table-head").append("</tr>");

        var rows = data['rows'];
        rows = rows.sort((a, b) => {
          return a[0] - b[0];
        });

        console.log(rows);

        for (var i in rows) {
          var truckId = rows[i][0];
          var start = rows[i][1];
          var end = rows[i][2];
          var latitude = rows[i][3];
          var longitude = rows[i][4]
          var tons = rows[i][5];
          var distance = rows[i][6];
          $("#summary-table-body").append("<tr>");
          $("#summary-table-body").append("<td>" + truckId + "</td>");
          $("#summary-table-body").append("<td>" + start + "</td>");
          $("#summary-table-body").append("<td>" + end + "</td>");
          $("#summary-table-body").append("<td>" + latitude + "</td>");
          $("#summary-table-body").append("<td>" + longitude + "</td>");
          $("#summary-table-body").append("<td>" + tons + "</td>");
          $("#summary-table-body").append("<td>" + distance + "</td>");
          $("#summary-table-body").append("</tr>");
        }
      }
    });
  }

}
