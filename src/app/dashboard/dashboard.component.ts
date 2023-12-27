import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServiceService } from '../_services/http-service.service';
import { Constants } from 'src/constants';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";

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

export type donutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  public donutchartOptions!: Partial<ChartOptions> | any;
  dashboardRecords: any = [];
  totalOrders: any;
  cancelledOrders:any;
  itemsSold:any;
  orderSum: any;
  graphData: any = [];
  imageBasePath = this.constant.imageBasePath;
  currency_symbol = localStorage.getItem('currency_symbol');
  topsellingarray: any = [];
  dateArray: any = [];
  constructor(private httpService: HttpServiceService, private constant: Constants) {
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
          text: "Sales"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + " sales";
          }
        }
      }
    };
    this.donutchartOptions = {
      series: [],
      chart: {
        type: 'pie',
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  ngOnInit(): void {
    this.filterData(0)    
  }

  
  filterData(id:any) {
      this.httpService.get('dashboard/' +id,false)
      .subscribe(result => {
        if (result.status == 200) {
          this.dashboardRecords = result.data;
          this.topsellingarray = this.dashboardRecords.top_selling_item
          this.totalOrders = this.dashboardRecords.order_count;
          this.orderSum = (this.dashboardRecords.order_sum).toFixed(2);
          this.cancelledOrders = this.dashboardRecords.cancelled_orders;
          this.itemsSold = this.dashboardRecords.items_sold;
          this.graphData = this.dashboardRecords?.daily_branch_sales;
          console.log(this.graphData);
         
          this.chartOptions.series = this.graphData;
          this.dateArray = this.dashboardRecords.dates;
          console.log(this.dateArray);
          this.chartOptions.xaxis = this.dateArray;
          this.donutchartOptions.series = this.dashboardRecords.entity_sales.series ? this.dashboardRecords.entity_sales.series : [];
          this.donutchartOptions.labels = this.dashboardRecords.entity_sales.labels ? this.dashboardRecords.entity_sales.labels : [];
        }
        else {
          console.log("Error");
        }
      });
  }
}
