import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartComponent } from 'ng-apexcharts';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { performaceDetails } from '../admin-performance-details/admin-performance-details.component';
import { ChartOptions } from '../delivery-settings/delivery-settings.component';

@Component({
  selector: 'app-driver-settlement',
  templateUrl: './driver-settlement.component.html',
  styleUrls: ['./driver-settlement.component.scss']
})
export class DriverSettlementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  // todayDate: Date = new Date();
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  dateChoosen = new UntypedFormControl({ value: null, disabled: false });
  public displayedColumns: string[] = ['order_no', 'date', 'payment_status', 'payment_type', 'paid_by', 'amount'];
  public dataSource = new MatTableDataSource<performaceDetails>();
  currency_symbol = localStorage.getItem('currency_symbol');
  user = this.localService.get('user1');
  role = this.localService.get('user_type');
  staffOrders: any = [];
  staffAllrecords: any = [];
  selectedBusinessday: any = 0;
  selectedStaffId:any =0;
  businessdayRecords: any = [];
  graphData: any = [];
  detailShownFlag: boolean = false;
  constructor(
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage
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
              text: "Performance Analysis",
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
          // this.chartOptions.series = this.staffOrders.daily_sales;
          console.log(this.chartOptions);
          // this.chartOptions.labels = this.staffOrders.dates;

        } else {
          this.snackBService.openSnackBar("Error!", "Close");
        }
      });
  }

  onChangeStaff(id: any) {
    this.selectedStaffId = id;
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

  filterReport(event: any) {
    this.selectedBusinessday = event.target.value ? event.target.value : 0;
    this.getDetails()
  }

  settle(){
    this.httpService.get('staff-settelment/' + this.selectedStaffId)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }
}
