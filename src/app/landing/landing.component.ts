import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
/// <reference types="@types/gapi" />
/// <reference types="@types/gapi.auth2" />

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  GoogleAuth;   // Google Auth Object

  apikey = "AIzaSyAPtyWPhurnjmBL9B8XRZUCbeMJbDhfnXY";
  clientid = "1034355473168-8eummsv5q3ja69r5b01cgr64kqo5fvi8.apps.googleusercontent.com"
  scope = "https://www.googleapis.com/auth/fusiontables";
  discoveryDoc = "https://www.googleapis.com/discovery/v1/apis/fusiontables/v2/rest";

  constructor() { }

  ngOnInit() {
  }

  oauthSignIn = () => {
    var oauth2EndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2EndPoint);

    var params = {
          'client_id': '1034355473168-8eummsv5q3ja69r5b01cgr64kqo5fvi8.apps.googleusercontent.com',
          'redirect_uri': 'https://localhost:4200/',
          'response_type': 'token',
          'scope': 'https://www.googleapis.com/auth/fusiontables',
          'include_granted_scopes': 'true',
          'state': 'pass-through value',
          'prompt': 'consent'
    };

    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    document.getElementById("landing-middle-col").appendChild(form);
    form.submit();
  }

  mockAuthorization = () => {
    alert("replace this with actual authorization and authentication ... ");

    $("#landing-content-div").hide();
    $("#main-content-div").show();
  }

}
