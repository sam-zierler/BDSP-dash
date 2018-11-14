import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bdsp-dash';

  authorized: boolean;

  constructor(private dataservice : DataService) {
    this.authorized = false;
  }

  ngOnInit() {
  }
}
