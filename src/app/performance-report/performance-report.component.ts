import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
  ApexResponsive
} from "ng-apexcharts";
import { Constants } from "src/constants";
import { HttpServiceService } from "../_services/http-service.service";
import { SnackBarService } from "../_services/snack-bar.service";

export type comparisonGraphFirst = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type comparisonGraphSecond = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};


export type CustomerChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

export type donutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PerformanceReportComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  // @ViewChild("chart2") chart2!: ChartComponent;
  public comparisonGraphFirst!: Partial<comparisonGraphFirst> | any;
  public comparisonGraphSecond!: Partial<comparisonGraphSecond> | any;
  public donutchartOptions!: Partial<donutChartOptions> | any;
  public CustomerchartOptions!: Partial<CustomerChartOptions> | any;
  topSellingArray: any = [];
  imageBasePath = this.constant.imageBasePath;
  priorityCustomersArray: any = [];
  array: any;
  newCustomers: any;
  totalCustomers: any;
  dateFirst = new FormControl();
  dateSecond = new FormControl();
  defaultMonthYear: any;
  constructor(private httpService: HttpServiceService, private snackBService: SnackBarService, private constant: Constants) {
    this.dateFirst.setValue(moment())
    this.comparisonGraphFirst = {
      series: [
        {
          name: "Sales",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Orders",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
    this.comparisonGraphSecond = {
      series: [
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Orders",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
      }
    };
    this.CustomerchartOptions = {
      series: [
        {
          name: "Inflation",
          data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function (val: any) {
            return val + "%";
          }
        }
      },
      title: {
        text: "Monthly Inflation in Argentina, 2002",
        floating: 0,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
    this.donutchartOptions = {
      series: [
        "3",
        "2",
        "1",
        "0",
      ],
      chart: {
        type: 'polarArea',
      },
      stroke: {
        colors: ["var(--white)"]
      },
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
      ],
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
    this.defaultMonthYear = {
      'month': moment().month() + 1,
      'year': moment().year()
    }
  }

  ngOnInit(): void {
    this.areawiseOrderStatistics();
    this.defaultShownGraph(this.defaultMonthYear);
    this.topSellingItem()
    this.priorityCustomers()
    this.getCustomerAnalysis()
  }

  defaultShownGraph(params: any) {
    this.httpService.post('monthly-data', params)
      .subscribe(result => {
        if (result.status == 200) {
          this.comparisonGraphFirst.series = result.data.branch_sales;
          this.comparisonGraphFirst.xaxis = result.data.dates
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, flag: any) {
    let date = normalizedMonthAndYear.toDate();
    let body = {
      'month': moment(date).month() + 1,
      'year': moment(date).year()
    }
    datepicker.close();
    this.httpService.post('monthly-data', body)
      .subscribe(result => {
        if (result.status == 200) {
          if (flag == 1) {
            this.dateFirst.setValue(date)
            this.comparisonGraphFirst.series = result.data.branch_sales;
            this.comparisonGraphFirst.xaxis = result.data.dates;
            this.defaultMonthYear = body;
          }
          else {
            this.dateSecond.setValue(date)
            this.comparisonGraphSecond.series = result.data.branch_sales;
            this.comparisonGraphSecond.xaxis = result.data.dates;
            this.defaultShownGraph(this.defaultMonthYear)
          }
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  topSellingItem() {
    this.httpService.get('top-selling-item')
      .subscribe(result => {
        if (result.status == 200) {
          this.topSellingArray = result.data.top_selling_item;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  priorityCustomers() {
    this.httpService.get('priority-customers')
      .subscribe(result => {
        if (result.status == 200) {
          this.priorityCustomersArray = result.data.customer_orders;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  areawiseOrderStatistics() {
    this.httpService.get('delivery-area-report')
      .subscribe(result => {
        if (result.status == 200) {
          this.array = result.data;
          this.donutchartOptions.series = this.array.orders ? this.array.orders : [];
          this.donutchartOptions.labels = this.array.delivery_areas ? this.array.delivery_areas : [];
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getCustomerAnalysis() {
    this.httpService.get('customer-analysis')
      .subscribe(result => {
        if (result.status == 200) {
          this.totalCustomers = result.data.total_customers;
          this.newCustomers = result.data.new_customers
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }
}
