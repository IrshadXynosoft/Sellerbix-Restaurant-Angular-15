import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend
} from "ng-apexcharts";
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { comparisonGraphFirst } from 'src/app/performance-report/performance-report.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
@Component({
  selector: 'app-supplier-performance-graph',
  templateUrl: './supplier-performance-graph.component.html',
  styleUrls: ['./supplier-performance-graph.component.scss']
})
export class SupplierPerformanceGraphComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  reportData:any;
  graphData: any = [];
  dateArray: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(public dialog: MatDialog, 
    public dialogRef: MatDialogRef<SupplierPerformanceGraphComponent>,@Inject(MAT_DIALOG_DATA) public data: { supplier_id: any,stock_id:any ,name:any},private dataservice: DataService, private route: ActivatedRoute, private httpService: HttpServiceService, private snackBService: SnackBarService, private router: Router,) { 
      this.chartOptions = {
        series: [],
        chart: {
          type: "line",
          height: 350
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: false,
        //     columnWidth: "55%",
        //     endingShape: "rounded"
        //   }
        // },
        xaxis: {},
        grid: {
          row: {
            colors: ['#ffc107', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        yaxis: {
          title: {
            text: "Cost Per Unit"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val  + " Cost Per Unit";
            }
          }
        }
      };
  }

  ngOnInit(): void {

    this.generateGraph();

  }
  generateGraph()
  {
    let postParams={
      supplier_id:this.data.supplier_id,
      stock_id:this.data.stock_id
    }
    this.httpService.post('reports/supplier-perfomance',postParams,false)
    .subscribe(result => {
      if (result.status == 200) {
         this.reportData=result.data;
         this.graphData=this.reportData.purchase_orders;
         this.dateArray=this.reportData.dates;
       this.chartOptions.series = this.graphData;
    this.chartOptions.xaxis = this.dateArray;
      } else {
        console.log("Error");
      }
    });
  }

  back(){
    this.dialogRef.close();
  }
}
