import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import * as $ from 'jquery';
/// <reference types="@types/googlemaps" />

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
})
export class AssignComponent implements OnInit {
  dt: Date;
  truckID;
  field1; field2;
  constructor(private data: DataService) { 

  }

  ngOnInit() {
    this.data.getTableInfo("Poughkeepsie Sanitation");
    this.initialize();
    //google.maps.event.addDomListener(window, 'load', this.initialize);
  }

  initialize() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(41.7004, -73.9210),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    var marker = new google.maps.Marker({ position: map.getCenter() });
    marker.setMap(map);
 
    var infowindow = new google.maps.InfoWindow({
      content: "Hey, We are here"
    });
    infowindow.open(map, marker);

    var layer = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: '1ORV7xrjQo5nNRlMdY5NkxbG7wXKiNtkoRfdWu1wC',
        where: "'" + this.field1 + "' = " + this.truckID + " AND '" + this.field2 + "' LIKE '%" + this.dt + "%'"
      },
      map: map,
      styles: [{
        polylineOptions: {
          strokeColor: "#0000ff"
        }
      }]
    });
  }  
  submit() {
    this.initialize();
  }
}
