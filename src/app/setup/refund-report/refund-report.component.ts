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
  staff_name: any;
  branch_name: any;
  entity_name: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}

@Component({
  selector: 'app-refund-report',
  templateUrl: './refund-report.component.html',
  styleUrls: ['./refund-report.component.scss']
})
export class RefundReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'order_no', 'reason', 'entity_name', 'branch_name', 'staff_name', 'date', 'time', 'amount', 'button'];
  public dataSource = new MatTableDataSource<Report>();
  data: any;
  id = this.localservice.get('branch_id');
  staffRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  // totalAmount: any = 0;
  entityRecords: any = [];
  todayDate: any = moment()
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  public generateVoidReport!: UntypedFormGroup;
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
    this.getEntities();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  onBuildForm() {
    this.generateVoidReport = this.formBuilder.group({
      staff: ['0'],
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      entity: ['0'],
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
    this.httpService.get('get-staff-by-location/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.staffRecords = result.data.staffs;
          this.generateReport();
        } else {
          console.log("Error");
        }
      });
  }

  getEntities() {
    this.httpService.get('entity', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.entityRecords = result.data.entities;
        } else {
          console.log("Error");
        }
      });
  }

  generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.generateVoidReport.value['fromDate'] && this.generateVoidReport.value['toDate']) {
        postParams = {
          entity_id: this.generateVoidReport.value['entity'],
          branch_id: this.id,
          staff_id: this.generateVoidReport.value['staff'],
          // payment_type_id: this.generateVoidReport.value['payment'],
          date_from: this.generateVoidReport.value['fromDate'],
          date_to: this.generateVoidReport.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.generateVoidReport.value['date']) {
        postParams = {
          entity_id: this.generateVoidReport.value['entity'],
          branch_id: this.id,
          staff_id: this.generateVoidReport.value['staff'],
          // payment_type_id: this.generateVoidReport.value['payment'],
          specify_date: true,
          date: this.generateVoidReport.value['date'],
        }
      }
    }
    else {
      postParams = {
        entity_id: this.generateVoidReport.value['entity'],
        branch_id: this.id,
        staff_id: this.generateVoidReport.value['staff'],
        // payment_type_id: this.generateVoidReport.value['payment'],
        current_date: true
      }
    }
    this.dataSource.data = [];
    // this.totalAmount = 0;
    if (postParams) {
      this.httpService.post('refund-order-reports', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.salesReportArray = result.data;
            const data: any = [];
            this.salesReportArray.report.forEach((obj: any) => {
              let ordersJson:any=obj.order_json;
              ordersJson.amount_received=obj.amount_received;
              ordersJson.balance_amount=obj.balance_amount;
              let objData = {
                id: obj.id,
                order_no: obj.order_number,
                reason: obj.order_cancellation_reason?.cancellation_reason,
                staff_name: obj.staff_name,
                branch_name: obj.branch_name,
                entity_name: obj.entity_name,
                date: obj.date,
                time: obj.time,
                amount: obj.order_json.Total,
                orderDetails: ordersJson,
              }
              // this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.order_json.Total)).toFixed(2)
              data.push(objData)
            });
            this.dataSource.data = data as Report[];
          } else {
            console.log("Error");
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
    }
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Void_Report', sheet: 'void_report' });
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

