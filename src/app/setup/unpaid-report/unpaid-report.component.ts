import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import moment from 'moment';

export interface Report {
  id: number;
  order_no: any;
  invoice_no: any;
  customer_name: any;
  customer_number: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}

@Component({
  selector: 'app-unpaid-report',
  templateUrl: './unpaid-report.component.html',
  styleUrls: ['./unpaid-report.component.scss']
})
export class UnpaidReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'order_no', 'date', 'time', 'amount', 'status', 'button'];
  public dataSource = new MatTableDataSource<Report>();
  data: any;
  branch_id = this.localservice.get('branch_id');
  staffRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  totalAmount: any;
  public unpaidIndividualReport!: UntypedFormGroup;
  todayDate: any = moment()
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(
    private printMqtt: PrintMqttService, private localservice: LocalStorage, private localService: LocalStorage, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private dialogService: ConfirmationDialogService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog
  ) {
    this.todayDate = this.todayDate.format('YYYY-MM-DD')
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getStaff();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.unpaidIndividualReport = this.formBuilder.group({
      staff: ['0'],
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      status: ['0'],
      date: [''],
    }, { validator: this.dateLessThan('fromDate', 'toDate') });
  }
  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "From date should be less than To date"
        };
      }
      return {};
    }
  }

  getStaff() {
    this.httpService.get('get-staff-by-location/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.staffRecords = result.data.staffs;
          this.generateReport();
        } else {
          console.log("Error");
        }
      });
  }

  generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.unpaidIndividualReport.value['fromDate'] && this.unpaidIndividualReport.value['toDate']) {
        postParams = {
          // entity_id: this.unpaidIndividualReport.value['entity'],
          branch_id: this.branch_id,
          staff_id: this.unpaidIndividualReport.value['staff'],
          // payment_type_id: this.unpaidIndividualReport.value['payment'],
          date_from: this.unpaidIndividualReport.value['fromDate'],
          date_to: this.unpaidIndividualReport.value['toDate'],
          status_id: this.unpaidIndividualReport.value['status'],
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.unpaidIndividualReport.value['date']) {
        postParams = {
          // entity_id: this.unpaidIndividualReport.value['entity'],
          branch_id: this.branch_id,
          staff_id: this.unpaidIndividualReport.value['staff'],
          // payment_type_id: this.unpaidIndividualReport.value['payment'],
          specify_date: true,
          date: this.unpaidIndividualReport.value['date'],
          status_id: this.unpaidIndividualReport.value['status'],
        }
      }
    }
    else {
      postParams = {
        // entity_id: this.unpaidIndividualReport.value['entity'],
        branch_id: this.branch_id,
        staff_id: this.unpaidIndividualReport.value['staff'],
        // payment_type_id: this.unpaidIndividualReport.value['payment'],
        current_date: true,
        status_id: this.unpaidIndividualReport.value['status'],
      }
    }
    this.dataSource.data = [];
    // this.totalAmount = 0;
    if (postParams) {
      this.httpService.post('unpaid-order-report', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.salesReportArray = result.data;
            this.totalAmount = this.salesReportArray.toal_sum ? this.salesReportArray.toal_sum.toFixed(2) : null;
            const data: any = [];
            this.salesReportArray.orders.forEach((obj: any) => {
              let objData = {
                id: obj.id,
                order_no: obj.order_no,
                // customer_name: obj.customer_name,
                // customer_number: obj.customer_number,
                // entity_name: obj.entity_name,
                date: obj.date,
                time: obj.order_json.current_time,
                amount: obj.amount,
                status: obj.order_status,
                orderDetails: obj.order_json,
              }
              // this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.order_json.Total)).toFixed(2)
              data.push(objData)
            });
            this.dataSource.data = data as Report[];
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
    }
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Unpaid_individual_Report', sheet: 'Unpaid_individual_Report' });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  back() {
    this.router.navigate(['setup/reports'])
  }

  viewDetails(orderDetails: any): void {
    const dialogRef = this.dialog.open(SalesReportItemDetailsComponent, {
      width: '70%',
      data: {
        Orders: orderDetails
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true
      this.searchBySpecificDate = false

    } else if (searchbyId == 0) {

      this.searchByPeriod = false
      this.searchBySpecificDate = false

    }
    else if (searchbyId == 2) {
      this.searchBySpecificDate = true
      this.searchByPeriod = false
    }

  }
}
