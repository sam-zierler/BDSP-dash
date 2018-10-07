import { Component, OnInit } from '@angular/core';
import { RunsTableService } from '../runs-table.service';
import { RunsTable } from '../runs-table';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss']
})
export class TruckDetailsComponent implements OnInit {

  runstable =  new RunsTable();
  truckdetail = new RunsTable();
  selectedId:  number;
  totaltons = 0;
  totalhours = 0;
  tonsperhour = 0;
  totalleftoverminutes = 0;


  constructor(private rtservice: RunsTableService) { }

  ngOnInit() {
    this.rtservice.getTruckIds().subscribe(data => { 
      this.runstable.rows = data.rows;
    });
  }

  getTotals() {
    this.totaltons = 0;
    this.rtservice.getRunsDataById(this.selectedId).subscribe(data => {
      this.truckdetail.kind = data.kind;
      this.truckdetail.columns = data.columns;
      this.truckdetail.rows = data.rows;

      this.doCalcs(this.truckdetail.rows);
      
      this.rtservice.getStartEndById(this.selectedId).subscribe(data => {
        this.getTimes(data.rows);
      });
  
      if (this.totalhours != 0) {
        this.tonsperhour = this.totaltons / this.totalhours;
        this.tonsperhour = Math.round(this.tonsperhour * 100) / 100;
      }

    });
  }

  //** calc totals/average */
  doCalcs(rows: Object[]) {
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < 1; j++) {
        if (isNaN(rows[i][j])) {
          this.totaltons += 0;
        } else if (typeof rows[i][j] === 'string') {
          var temp = +rows[i][j];
          this.totaltons += temp;
        } else {
          this.totaltons += rows[i][j];
        }
      }
    }
    this.totaltons = Math.round(this.totaltons);
  }

  getTimes(rows: Object[]) {
    this.totalhours = 0;
    this.totalleftoverminutes = 0;

    for (var i = 0; i < rows.length; i++) {
      var year = rows[i][0].substring(0, 4);
      var month = rows[i][0].substring(5, 7);
      var day = rows[i][0].substring(8, 10);
      var starthour = rows[i][0].substring(11, 13);
      var startminute = rows[i][0].substring(14, 16);
      var endhour = rows[i][1].substring(11, 13);
      var endminute = rows[i][1].substring(14, 16);

      var date1 = new Date(year, month, day, starthour, startminute);
      var date2 = new Date(year, month, day, endhour, endminute);
      var diffInMilli = date2.getTime() - date1.getTime();
      var seconds = diffInMilli / 1000;
      var minutes = seconds / 60;
      var hours = Math.floor(minutes / 60);
      var remainminutes = minutes % 60;

      this.totalhours += hours;
      this.totalleftoverminutes += remainminutes;
    }
    this.totalhours += Math.floor(this.totalleftoverminutes / 60);
  }

}
