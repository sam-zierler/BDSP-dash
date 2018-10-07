import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  defaultFrom = new Date();
  weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  defaultTo = new Date(this.defaultFrom.getTime() + this.weekInMilliseconds);

  constructor() { }

  ngOnInit() {
  }

  public onDateRangeSelection(range: { from: Date, to: Date }) {
    console.log(`Selected range: ${range.from} - ${range.to}`);
  }

}
