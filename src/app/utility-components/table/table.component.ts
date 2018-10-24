import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {

  tableId = "1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC";
  apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";
  rows: Array<Object>
  columns: Array<string> 

  columnsFetched: boolean;

  constructor() {
    this.rows = new Array<Object>();
    this.columns = new Array<string>();
    this.columnsFetched = false;
   }

  ngOnInit() {
    this.fetchColumns();
  }

  fetchColumns() {
    let url = "https://www.googleapis.com/fusiontables/v2/tables/" + 
      this.tableId + "/columns?key=" + this.apikey;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: this.onColumnsFetched
    });
  }

  onColumnsFetched = (data) => {
    
    for (let i = 0; i < data.items.length; i++) {
      this.columns[i] = data.items[i].name;
    }

    this.columnsFetched = true;

    console.log(this.columns);
    
  }

}
