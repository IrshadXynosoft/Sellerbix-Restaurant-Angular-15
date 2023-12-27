import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';

export interface Report {
  id: number;
  order_no: any;
  entity_order_no: any;
  invoice_no: any;
  staff_name: any;
  branch_name: any;
  entity_name: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any;
}

@Component({
  selector: 'app-payment-type-report',
  templateUrl: './payment-type-report.component.html',
  styleUrls: ['./payment-type-report.component.scss']
})
export class PaymentTypeReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatTableExporterDirective)
  matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = [
    'index',
    'order_no',
    'entity_name',
    'entity_order_no',
    'branch_name',
    'staff_name',
    'date',
    'time',
    'discount',
    'accepted_balance',
    'amount',
    'button',
  ];
  public dataSource = new MatTableDataSource<Report>();
  public reportForm!: UntypedFormGroup;
  data: any;
  id = this.localservice.get('branch_id');
  paymentRecords: any = [
  // {
  //   'name': 'Total',
  //   'amount': 1000,
  // }
  ];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  totalAmount: any = 0;
  entityRecords: any = [];
  paymentSummary: any;
  todayDate: any = moment();
  minDate: any = moment(this.todayDate)
    .subtract(2, 'months')
    .format('YYYY-MM-DD');
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = "";
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private localservice: LocalStorage
  ) {
    this.todayDate = this.todayDate.format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.generateReport();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onBuildForm() {
    this.reportForm = this.formBuilder.group(
      {
        searchBy: ['0'],
        fromDate: ['', Validators.compose([Validators.required])],
        toDate: ['', Validators.compose([Validators.required])],
        date: [''],
      },
      { validator: this.dateLessThan('fromDate', 'toDate') }
    );
  }
  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'From date should be less than To date',
        };
      }
      return {};
    };
  }

  reset() {
    this.salesReportArray = [];
    this.current_page = 1;
    this.last_page = 2;
  }
  async generateReport() {
    this.reset();
    let postParams: any;
    if (this.searchByPeriod) {
      if (
        this.reportForm.value['fromDate'] &&
        this.reportForm.value['toDate']
      ) {
        postParams = {
          branch_id: this.id,
          date_from: this.reportForm.value['fromDate'],
          date_to: this.reportForm.value['toDate'],
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.reportForm.value['date']) {
        postParams = {
          branch_id: this.id,
          specify_date: true,
          date: this.reportForm.value['date'],
        };
      }
    } else {
      postParams = {
        branch_id: this.id,
        current_date: true,
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.httpService
        .post(
          'payment-type-report',
          postParams
        )
        .subscribe(async (result) => {
          if (result.status == 200) {
            this.paymentRecords = result.data.summary;
          } else {
            console.log('Error');
          }
        });
    } else {
      this.snackBService.openSnackBar(
        'Please Select Date to Generate Report',
        'Close'
      );
    }
  }
  async pushToSalesArray(params: any) {
    params.forEach(async (obj: any) => {
      this.salesReportArray.push(obj);
      await this.setDataTable();
    });
  }

  async getIteratedData(postParams: any, initializeCurrentPage = true) {
    this.processingResponseStr = "Processing " + this.current_page + " / " + this.last_page + " please wait";
    if (initializeCurrentPage) {
      this.current_page = 2;
    }
    this.httpService
      .post('sales-report?page=' + this.current_page, postParams, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.report.data.length > 0) {
            await this.pushToSalesArray(result.data.report.data);
          }
        }
        if (this.current_page <= this.last_page) {
          this.current_page++;
          this.getIteratedData(postParams, false);
        } else {
          this.processingResponseStr = "Ready to download.";
        }
      });
  }




  async setDataTable() {
    const data: any = [];
    this.salesReportArray?.forEach((obj: any) => {
      obj.order_json['amount_received'] = obj.amount_received
        ? obj.amount_received
        : 0;
      obj.order_json['balance_amount'] = obj.balance_amount
        ? obj.balance_amount
        : 0;
      let objData = {
        id: obj.id,
        order_no: obj.order_number,
        invoice_no: obj.invoice_id,
        staff_name: obj.staff_name,
        branch_name: obj.branch_name,
        entity_name: obj.entity_name,
        date: obj.date,
        time: obj.time,
        amount: obj.order_json.Total,
        orderDetails: obj.order_json,
        accepted_balance: obj.accepted_balance,
      };
      data.push(objData);
    });
    this.dataSource.data = data as Report[];
  }
  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true;
      this.searchBySpecificDate = false;
    } else if (searchbyId == 0) {
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
    } else if (searchbyId == 2) {
      this.searchBySpecificDate = true;
      this.searchByPeriod = false;
    }
  }
  viewDetails(orderDetails: any): void {
    const dialogRef = this.dialog.open(SalesReportItemDetailsComponent, {
      width: '70%',
      data: {
        Orders: orderDetails,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', {
      fileName: 'Sales_Report',
      sheet: 'sales_report',
    });
  }
}
