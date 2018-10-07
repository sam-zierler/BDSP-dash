import { Component, OnInit } from '@angular/core';
import { RunsTableService } from '../runs-table.service';
import { RunsTable } from '../runs-table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  runstable = new RunsTable();

  constructor(private rtservice: RunsTableService) { }

  ngOnInit() {
    this.rtservice.getRunsTable().subscribe(data => { 
      this.runstable.kind = data.kind
      this.runstable.columns = data.columns,
      this.runstable.rows = data.rows
    });
    console.log(this.runstable);
  }
  
}
