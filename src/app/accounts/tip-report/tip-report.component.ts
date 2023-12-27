import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import moment from 'moment';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { UpdatedSalesReportDetailComponent } from 'src/app/setup/updated-sales-report-detail/updated-sales-report-detail.component';

export interface Report {
  id: number;
  order_number: any;
  entity_order_no: any;
  invoice_no: any;
  staff_name: any;
  branch_name: any;
  entity_name: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any;
  accepted_balance: any;
}

@Component({
  selector: 'app-tip-report',
  templateUrl: './tip-report.component.html',
  styleUrls: ['./tip-report.component.scss'],
})
export class TipReportComponent implements OnInit {
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
    'staff_name',
    'accepted_balance',
    'tip_payment_type_name',
    'balance_amount',
    'amount_received',
    'invoice_amount',
  ];
  public dataSource = new MatTableDataSource<Report>();
  public generateSalesReport!: UntypedFormGroup;
  data: any;
  id = this.localservice.get('branch_id');
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  totalAmount: any = 0;
  paymentSummary: any = [];
  businessdayRecords: any = [];
  todayDate: any = moment();
  minDate: any = moment(this.todayDate)
    .subtract(6, 'months')
    .format('YYYY-MM-DD');
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = '';
  branchName = this.localservice.get('branchname');
  searchByBusinessDay: boolean = false;
  // today: number = Date.now();
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
    this.getBuisnessday();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.generateSalesReport = this.formBuilder.group(
      {
        searchBy: ['0'],
        fromDate: ['', Validators.compose([Validators.required])],
        toDate: ['', Validators.compose([Validators.required])],
        date: [''],
        payment: ['0'],
        business_day_id: [''],
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

  getBuisnessday() {
    this.httpService.get('businessdays').subscribe((result) => {
      if (result.status == 200) {
        this.businessdayRecords = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
  reset() {
    this.salesReportArray = [];
    this.current_page = 1;
    this.last_page = 2;
    this.paymentSummary = [];
  }

  async generateReport() {
    this.reset();
    let postParams: any;
    if (this.searchByPeriod) {
      if (
        this.generateSalesReport.value['fromDate'] &&
        this.generateSalesReport.value['toDate']
      ) {
        postParams = {
          branch_id: this.id,
          tip_payment_type_id: this.generateSalesReport.value['payment'],
          date_from: moment(this.generateSalesReport.value['fromDate']).format(
            'YYYY-MM-DD'
          ),
          date_to: moment(this.generateSalesReport.value['toDate']).format(
            'YYYY-MM-DD'
          ),
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.generateSalesReport.value['date']) {
        postParams = {
          branch_id: this.id,
          tip_payment_type_id: this.generateSalesReport.value['payment'],
          specify_date: true,
          date: moment(this.generateSalesReport.value['date']).format(
            'YYYY-MM-DD'
          ),
        };
      }
    } else if (this.searchByBusinessDay) {
      if (this.generateSalesReport.value['business_day_id']) {
        postParams = {
          branch_id: this.id,
          tip_payment_type_id: this.generateSalesReport.value['payment'],
          business_day_id: this.generateSalesReport.value['business_day_id'],
        };
      }
    } else {
      postParams = {
        branch_id: this.id,
        tip_payment_type_id: this.generateSalesReport.value['payment'],
        current_date: true,
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.httpService
        .post('tips-report', postParams)
        .subscribe(async (result) => {
          if (result.status == 200) {
            const data: any = [];
            result.data.forEach((element: any) => {
              if (element.amount != 0) {
                let objData = {
                  order_number: element.order_number,
                  staff_name: element.staff_name,
                  tip_payment_type_name: element.tip_payment_type_name,
                  balance_amount: element.balance_amount,
                  accepted_balance: element.accepted_balance,
                  amount_received: element.amount_received,
                  invoice_amount: element.invoice_amount,
                };
                data.push(objData);
              }
            });
            this.dataSource.data = data as Report[];
          } else {
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      this.snackBService.openSnackBar(
        'Please Select Date to Generate Report',
        'Close'
      );
    }
  }

  searchby(event: any) {
    let searchbyId = event.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true;
      this.searchBySpecificDate = false;
      this.searchByBusinessDay = false;
    } else if (searchbyId == 0) {
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
      this.searchByBusinessDay = false;
    } else if (searchbyId == 2) {
      this.searchBySpecificDate = true;
      this.searchByPeriod = false;
      this.searchByBusinessDay = false;
    } else if (searchbyId == 3) {
      this.searchByBusinessDay = true;
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
    }
  }

  viewDetails(element: any): void {
    const dialogRef = this.dialog.open(UpdatedSalesReportDetailComponent, {
      width: '70%',
      data: {
        Orders: element.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  // old
  exportExcel() {
    this.matTableExporter.exportTable('xlsx', {
      fileName: 'Tip_Report',
      sheet: 'tip_report',
    });
  }

  //pdf
  // export() {
  //   let datePeriod = '';
  //   if (this.searchByPeriod) {
  //     if (
  //       this.generateSalesReport.value['fromDate'] &&
  //       this.generateSalesReport.value['toDate']
  //     ) {
  //       datePeriod = moment(this.generateSalesReport.value['fromDate']).format('L') + ' - ' + moment(this.generateSalesReport.value['toDate']).format('L')
  //     }
  //   } else if (this.searchBySpecificDate) {
  //     if (this.generateSalesReport.value['date']) {
  //       datePeriod = moment(this.generateSalesReport.value['date']).format('L')
  //     }
  //   } else {
  //     datePeriod = moment().format('L')
  //   }

  //   const dialogRef = this.dialog.open(ExportPdfReportComponent, {
  //     width: '80%',
  //     data: {
  //       dataSource: this.dataSource.data,
  //       datePeriod : datePeriod,
  //       paymentSummary : this.paymentSummary
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => { });
  // }
}
