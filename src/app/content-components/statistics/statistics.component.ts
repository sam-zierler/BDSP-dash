import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  columns;
  rows;
  dates;
  chartData1;
  chartData2;
  temp;
  graphData;
  x = "Select X Value"; y = "Select Y Value"; z;
  boolx = false; booly = false;
  todaydate;
  addTable = false;
  lineChart;
  barChart;
  pieChart;
  colors = [];
  highlight = [];

  constructor(private data: DataService) { }

  ngOnInit() {
    this.todaydate = this.data.showTodayDate(); 
    //this.changeTable("Poughkeepsie Sanitation");

    this.lineChart = new Chart('line', {
      type:'line',
      data: {
        labels: [],
        datasets: [
          {
            label:"Poughkeepsie Sanitation",
            data: [],
            fill:false,
            borderColor:"rgb(75, 192, 192)",
            lineTension:0.1
          },
          {
            label:"Poughkeepsie Sanitation",
            data: [],
            fill:false,
            borderColor:"rgba(255, 99, 132, 0.2)",
            lineTension:0.1
          }
        ]
      },       
      options:{}     
    });

    this.barChart = new Chart('bar', {
      type:'bar',
      data: {
        labels: [],
        datasets: [
          {
            label:"Poughkeepsie Sanitation",
            data: [],
            fill:false,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)"
            ],
            borderColor:[
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)"],
              borderWidth:1
          }
        ]
      },
      options:{
        scales:{
          yAxes:[
            {
              ticks:{
                beginAtZero:true
              }
            }
          ]
        }
      }
    });
    this.pieChart = new Chart('pie', {
      type:'pie',
      data:{
        labels:[],
        datasets:[
          {
            label:"Poughkeepsie Sanitation",
            data:[],
            backgroundColor:[
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)"
            ]
          }
        ]
      }
    });
  }
  changeTable(id) { 
    this.data.getTableInfo(id);
  }
  getData() {
    this.rows = this.data.rows;
    this.columns = this.z = this.data.columns;
    this.addTable = true;
  }
  clearPage() {
    this.addTable = false;
    this.ngOnInit();
  }
  setX(i) {
    this.x = i;
    this.boolx = true;
    if(this.boolx && this.booly == true) {
      this.data.fetchXYData(this.x, this.y);
      this.data.fetchDates();
      this.data.fetchTons();
      this.data.fetchDistance();
    }
  }
  setY(i) {
    this.y = i;
    this.booly = true;
    if(this.boolx && this.booly == true) {
      this.data.fetchXYData(this.x, this.y);
      this.data.fetchDates();
      this.data.fetchTons();
      this.data.fetchDistance();
    }
  }
  getXYTable() {
    if(this.boolx && this.booly == true) {
      //this.dates = this.data.endDate;
      this.dates = this.data.endDate
      this.chartData1 = this.data.tons;
      this.chartData2 = this.data.distance;
      console.log(this.chartData1);
      console.log(this.chartData2);
      this.createColors();
      console.log(this.colors);
      this.graphData = this.data.rows.map(Number);
      this.rows = this.data.rows;
      this.columns = this.data.columns;
      this.addTable = true;
      this.boolx = false;
      this.booly = false;
      this.data.fetchData();
      this.x = "Select X Value"; this.y = "Select Y Value";
      
    }else alert("Choose X and Y values!")
  }


  addLineData(chart, label, data1, data2) {
    chart.data.labels = label;
    chart.data.datasets[0].data = data1;
    chart.data.datasets[1].data = data2;
    chart.update();
  }
  addBarData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = this.colors;
    chart.data.datasets[0].borderColor = this.highlight;
    chart.update();
  }
  addPieData(chart, label, data) {
    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = this.colors;
    chart.data.datasets[0].borderColor = this.highlight;
    chart.update();
  }
  createColors() {
    for (var i = 0; i < this.chartData1.length; i++) {
      var r = Math.floor(Math.random() * 200);
      var g = Math.floor(Math.random() * 200);
      var b = Math.floor(Math.random() * 200);
      var v = Math.floor(Math.random() * 500);
      this.colors[i] = 'rgb('+ r + ', ' + g + ', ' + b + ')';
      this.highlight[i] = 'rgb(' + (r+20) + ', ' + (g+20) + ', ' + (b+20) + ')';
  };
  }
}
