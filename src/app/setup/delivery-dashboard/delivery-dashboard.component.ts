import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServiceService } from 'src/app/_services/http-service.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorage } from 'src/app/_services/localstore.service';

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
export interface OrderData {
  Order_no: any;
  branch: any;
  order_time: any;
  delivery_area: any;
  assigned_driver: any;
  assigned_time: any;
  delivered_time: any;
  elapsed_time: any;
}
@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.scss']
})
export class DeliveryDashboardComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['index', 'Order_no',
    'branch',
    'order_time',
    'delivery_area',
    'assigned_driver',
    'assigned_time',
    'delivered_time',
    'elapsed_time']
  public dataSource = new MatTableDataSource<OrderData>();
  public chartOptions!: Partial<ChartOptions> | any;
  public donutchartOptions!: Partial<ChartOptions> | any;
  dashboardRecords: any = [];
  totalDrivers: any;
  activeDrivers: any;
  newOrders: any;
  assignedOrders: any;
  acceptedOrders: any;
  completedOrders: any;
  id = this.localservice.get('branch_id');
  imageBasePath = this.constant.imageBasePath;
  currency_symbol = localStorage.getItem('currency_symbol');
  orderRecords: any = [];
  activeDriversPercentage: any;
  assignedOrdersPercentage: any;
  labels: any = [];
  series: any = [];

  constructor(private httpService: HttpServiceService, private route: ActivatedRoute, private constant: Constants, private router: Router, private localservice: LocalStorage) {
    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {},
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
        type: "donut"
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
    this.filterData(this.id)
  }
  back() {
    this.router.navigate(['setup/location/' + this.id + '/delivery'])
  }
  filterData(id: any) {
    this.httpService.get('driver-dashboard/' + id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.dashboardRecords = result.data;
          this.totalDrivers = this.dashboardRecords.totalDriverCount
          this.activeDrivers = this.dashboardRecords.activeDriverCount
          let driverPercentage = ((this.activeDrivers / this.totalDrivers) * 100).toFixed(2)
          this.activeDriversPercentage = driverPercentage + '%';
          this.newOrders = this.dashboardRecords.newOrders
          this.assignedOrders = this.dashboardRecords.driver_assigned_orders
          this.acceptedOrders = this.dashboardRecords.driver_accepted_orders
          this.completedOrders = this.dashboardRecords.driver_completed_orders
          let totalOrders: any = parseInt(this.newOrders) + parseInt(this.assignedOrders) +
            parseInt(this.acceptedOrders) + parseInt(this.completedOrders);
          let ordersPercentage = ((this.assignedOrders / totalOrders) * 100).toFixed(2)
          this.assignedOrdersPercentage = ordersPercentage + '%'
          this.orderRecords = this.dashboardRecords.orders_list;
          if (this.newOrders == 0 && this.assignedOrders == 0 && this.acceptedOrders == 0 && this.completedOrders == 0) {
            this.labels = [];
            this.series = [];
          }
          else {
            this.labels = ['New Orders', 'Assigned Orders', 'Accepted Orders', 'Delivered Orders']
            this.series = [
              (parseFloat(this.newOrders) / parseFloat(totalOrders)).toFixed(2),
              (parseFloat(this.assignedOrders) / parseFloat(totalOrders)).toFixed(2),
              (parseFloat(this.acceptedOrders) / parseFloat(totalOrders)).toFixed(2),
              (parseFloat(this.completedOrders) / parseFloat(totalOrders)).toFixed(2)
            ]
            this.donutchartOptions.series = this.series;
            this.donutchartOptions.labels = this.labels;
          }

          const data: any = [];
          this.orderRecords.forEach((obj: any) => {
            let objData = {
              Order_no: obj.order.order_number,
              branch: obj.driver ? obj.driver.user.branch.name : '--',
              order_time: obj.order.date + ',' + obj.order.time,
              delivery_area: this.getDeliveryArea(obj),
              assigned_driver: obj.driver ? obj.driver.user.name : '--',
              assigned_time: obj.delivery_start_time ? obj.delivery_start_time : '--',
              delivered_time: obj.delivery_end_time ? obj.delivery_end_time : '--',
              elapsed_time: obj.elapsed_time ? obj.elapsed_time : '--'
            }
            data.push(objData)
          });

          this.dataSource.data = data as OrderData[];
          //this.chartOptions.series = this.graphData;
          // this.dateArray = this.dashboardRecords.dates;
          //this.chartOptions.xaxis = this.dateArray;

        }
        else {
          console.log("Error");
        }
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getOrders(orders: any) {
    console.log(JSON.parse(orders.order_json));

    return '--'
  }
  getDeliveryArea(order: any) {
    if (order.customer) {
      return order.customer.customer_delivery_location.length > 0 ? order.customer.customer_delivery_location[0].delivery_area.name : '--'
    }
    else {
      return '--'
    }

  }
}

