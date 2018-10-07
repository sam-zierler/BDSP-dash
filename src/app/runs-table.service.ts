import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RunsTable } from './runs-table';

@Injectable()
export class RunsTableService {
  
  urlString: string;
  
  constructor(private http: HttpClient) {}

  createUrl() : string {
    var query = "SELECT 'truckID', 'start', 'end', 'tons', 'distance', 'notes' FROM " +
        '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC';
    var encodedQuery = encodeURIComponent(query);
    
    // Construct the URL
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY');
    //url.push('&callback=?');
    this.urlString = url.join('');

    return this.urlString;
  }

  getTruckIds() {
    var query = "SELECT 'truckID' FROM " + '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC' + 
                " group by 'truckID' ";
    var encodedQuery = encodeURIComponent(query);
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY');

    return this.http.get<RunsTable>(url.join(''));
  }

  getRunsDataById(truck_id: number) {
    var query = "SELECT 'tons' FROM " + '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC' + 
                " WHERE 'truckID' = " + truck_id;
    var encodedQuery = encodeURIComponent(query);
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY');
            
    return this.http.get<RunsTable>(url.join(''));
  }

  getStartEndById(truck_id: number) {
    var query = "SELECT 'start', 'end' FROM " + '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC' + 
                " WHERE 'truckID' = " + truck_id;
    var encodedQuery = encodeURIComponent(query);
    var url = ['https://www.googleapis.com/fusiontables/v2/query'];
    url.push('?sql=' + encodedQuery);
    url.push('&key=AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY');
            
    return this.http.get<RunsTable>(url.join(''));
  }

  getRunsTable(): Observable<RunsTable> {
    var url = this.createUrl();
    return this.http.get<RunsTable>(url);
  }

}
