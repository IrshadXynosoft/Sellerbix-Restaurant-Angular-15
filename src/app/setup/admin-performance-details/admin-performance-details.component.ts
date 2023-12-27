import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

export interface performaceDetails {
  id: number;
  order_no: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}

export interface history {
  id: number;
  order_no: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}
@Component({
  selector: 'app-admin-performance-details',
  templateUrl: './admin-performance-details.component.html',
  styleUrls: ['./admin-performance-details.component.scss']
})
export class AdminPerformanceDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild("orderTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild("historyTable", { read: MatPaginator, static: false })
  set pagination1(value: MatPaginator) {
    this.dataSourceHistory.paginator = value;
  }
  @ViewChild("orderTable", { read: MatSort, static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild("historyTable", { read: MatSort, static: false })
  set sort1(value: MatSort) {
    this.dataSourceHistory.sort = value;
  }
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  dateChoosen = new UntypedFormControl({ value: null, disabled: false });
  public displayedColumns: string[] = ['order_no', 'date', 'payment_status', 'payment_type', 'paid_by', 'amount'];
  public displayedColumnHistory: string[] = ['index', 'date', 'point', 'amount'];

  public dataSource = new MatTableDataSource<performaceDetails>();
  public dataSourceHistory = new MatTableDataSource<history>();
  currency_symbol = localStorage.getItem('currency_symbol');
  user = this.localService.get('user1');
  role = this.localService.get('user_type');
  staffOrders: any = [];
  staffAllrecords: any = [];
  selectedBusinessday: any = 0;
  selectedStaffId: any = 0;
  businessdayRecords: any = [];
  graphData: any = [];
  detailShownFlag: boolean = false;
  constructor(
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService
  ) {

  }

  ngOnInit(): void {
    if (this.role == 1) {
      this.getStaff()
    }
    else {
      this.getDetails()
    }
    this.getBuisnessday()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getStaff() {
    this.httpService.get('staff')
      .subscribe(result => {
        if (result.status == 200) {
          this.staffAllrecords = result.data.staffs;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getDetails() {
    this.httpService.get('staff-insights/' + this.selectedStaffId + '/' + this.selectedBusinessday)
      .subscribe(result => {
        if (result.status == 200) {
          this.staffOrders = result.data;
          const data: any = []
          this.staffOrders.orders.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              order_no: obj.order_number,
              time: obj.time,
              date: obj.date,
              payment_status: obj.payment_status,
              staff: obj.staff_name,
              invoice: obj.invoice,
              paid_by: obj.invoice_taken_by,
              amount: obj.amount
            }
            data.push(objData)
          });
          this.detailShownFlag = true;
          data.reverse()
          this.dataSource.data = data as performaceDetails[];
          this.chartOptions = {
            series: [
              {
                name: "Amount",
                data: this.staffOrders.daily_sales.data
              }
            ],
            chart: {
              type: "area",
              height: 350,
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
              text: "Sale Analysis",
              align: "left"
            },
            // subtitle: {
            //   text: "Price Movements",
            //   align: "left"
            // },
            labels: this.staffOrders.dates,
            xaxis: {
              type: "datetime"
            },
            yaxis: {
              opposite: true
            },
            legend: {
              horizontalAlign: "left"
            }
          };
          const history: any = [];
          this.staffOrders.settelment_history?.forEach((obj: any) => {
            let historyObj = {
              id: obj.id,
              point: obj.point,
              time: obj.time,
              date: obj.date,
              amount: obj.amount
            }
            history.push(historyObj)
          });
          this.dataSourceHistory.data = history as history[];
        } else {
          this.snackBService.openSnackBar("Error!", "Close");
        }
      });
  }

  onChangeStaff(e: any) {
    console.log(e.target.value);
    
    this.selectedStaffId = e.target.value;
    this.getDetails()
  }

  getBuisnessday() {
    this.httpService.get('businessdays')
      .subscribe(result => {
        if (result.status == 200) {
          this.businessdayRecords = result.data;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  filterReport() {
    if (this.selectedStaffId) {
      this.getDetails()
    }
    else {
      this.selectedBusinessday = "0";
      this.snackBService.openSnackBar("Please select staff", "Close")
    }
  }

  settle() {
    const options = {
      title: 'Settle',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('staff-settelment/' + this.selectedStaffId)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.getDetails()
            }
            else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          })
      }
    });
  }
}
