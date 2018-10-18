import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { global } from '@angular/core/src/util';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { setRootDomAdapter } from '@angular/platform-browser/src/dom/dom_adapter';
import {of,} from 'rxjs';
import {delay} from 'rxjs/operators';

/** Global Variables. */
var columns = new Array();
var rows = new Array();

export interface UserData {
  truckID: string;
  start: string;
  end: string;
  latitude: string;
  longitude: string;
  tons: string;
  distance: string;

}

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-table-overview-example',
  styleUrls: ['table-overview-example.scss'],
  templateUrl: 'table-overview-example.html',
})
export class TableOverviewExample implements OnInit {
  displayedColumns: string[] = ['truckID', 'start', 'end', 'latitude', 'longitude', 'tons', 'distance'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = true
  constructor() {

    populate(); 
            
    const users = Array.from({length: rows.length-1}, (_, k) => createData(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    of(rows).pipe(delay(1000))
     .subscribe(data => {
        this.isLoading = false;
     }, error => this.isLoading = false);
     delay(1000);
    //this.dataSource = new MatTableDataSource(users);
  }
  
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createData(x: number): UserData {
  return {
    truckID: rows[x][0],
    start: rows[x][1],
    end: rows[x][2],
    latitude: rows[x][3],
    longitude: rows[x][4],
    tons: rows[x][5],
    distance: rows[x][6]
  };
}

function populate() {
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
          
          columns = data['columns'];
        
          rows = data['rows'];
          rows = rows.sort((a, b) => {
            return a[0] - b[0];
          });

          console.log(rows);
        }
      });
}
