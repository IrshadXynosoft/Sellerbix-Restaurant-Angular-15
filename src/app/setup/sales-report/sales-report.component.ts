import { indexOf } from 'lodash';
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
import { UpdatedSalesReportDetailComponent } from '../updated-sales-report-detail/updated-sales-report-detail.component';
// import { ExportPdfReportComponent } from '../export-pdf-report/export-pdf-report.component';

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
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
})
export class SalesReportComponent implements OnInit {
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
    // 'branch_name',
    'staff_name',
    'status',
    'date & time',
    'discount',
    'accepted_balance',
    'amount',
    'button',
  ];
  public dataSource = new MatTableDataSource<Report>();
  public generateSalesReport!: UntypedFormGroup;
  data: any;
  id = this.localservice.get('branch_id');
  staffRecords: any = [];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  totalAmount: any = 0;
  paymentRecords: any = [];
  entityRecords: any = [];
  paymentSummary: any = [];
  businessdayRecords:any=[];
  todayDate: any = moment();
  minDate: any = moment(this.todayDate)
    .subtract(6, 'months')
    .format('YYYY-MM-DD');
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = "";
  branchName = this.localservice.get('branchname');
  showCallCenterDeliveryType:boolean=false;
  searchByBusinessDay:boolean=false;
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
    this.getStaff();
    this.getPaymentMethods();
    this.getEntities();
    this.getBuisnessday();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  eventChange(event:any){
    if(event.value==3)
      this.showCallCenterDeliveryType=true;
     else
     this.showCallCenterDeliveryType=false;
  }

  onBuildForm() {
    this.generateSalesReport = this.formBuilder.group(
      {
        staff: ['0'],
        searchBy: ['0'],
        fromDate: ['', Validators.compose([Validators.required])],
        toDate: ['', Validators.compose([Validators.required])],
        entity: ['0'],
        date: [''],
        payment: ['0'],
        business_day_id:[''],
        callcenter_type:['2']
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

  getStaff() {
    this.httpService
      .get('get-staff-by-location/' + this.id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.staffRecords = result.data.staffs;
        } else {
          console.log('Error');
        }
      });
  }
  getPaymentMethods() {
    this.httpService.get('payment-type', false).subscribe((result) => {
      if (result.status == 200) {
        this.paymentRecords = result.data.payment_types;
      } else {
        console.log('Error');
      }
    });
  }
  getEntities() {
    this.httpService.get('entity', false).subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data.entities;
      } else {
        console.log('Error');
      }
    });
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
  reset() {
    this.salesReportArray = [];
    this.current_page = 1;
    this.last_page = 2;
    this.paymentSummary = []
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
          entity_id: this.generateSalesReport.value['entity'],
          branch_id: this.id,
          staff_id: this.generateSalesReport.value['staff'],
          payment_type_id: this.generateSalesReport.value['payment'],
          date_from:  moment(this.generateSalesReport.value['fromDate']).format('YYYY-MM-DD'),
          date_to: moment(this.generateSalesReport.value['toDate']).format('YYYY-MM-DD'),
          callcenter_type:this.generateSalesReport.value['callcenter_type']
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.generateSalesReport.value['date']) {
        postParams = {
          entity_id: this.generateSalesReport.value['entity'],
          branch_id: this.id,
          staff_id: this.generateSalesReport.value['staff'],
          payment_type_id: this.generateSalesReport.value['payment'],
          specify_date: true,
          date: moment(this.generateSalesReport.value['date']).format('YYYY-MM-DD'),
          callcenter_type:this.generateSalesReport.value['callcenter_type']
        };
      }
    }else if (this.searchByBusinessDay) {
      if (this.generateSalesReport.value['business_day_id']) {
        postParams = {
          entity_id: this.generateSalesReport.value['entity'],
          branch_id: this.id,
          staff_id: this.generateSalesReport.value['staff'],
          payment_type_id: this.generateSalesReport.value['payment'],
          business_day_id:this.generateSalesReport.value['business_day_id'],
          callcenter_type:this.generateSalesReport.value['callcenter_type']
        };
      }
    } else {
      postParams = {
        entity_id: this.generateSalesReport.value['entity'],
        branch_id: this.id,
        staff_id: this.generateSalesReport.value['staff'],
        payment_type_id: this.generateSalesReport.value['payment'],
        current_date: true,
        callcenter_type:this.generateSalesReport.value['callcenter_type']
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.httpService
        .post(
          'report/sale-report?page=' + this.current_page,
          postParams,
          this.current_page == 1 ? true : false
        )
        .subscribe(async (result) => {
          if (result.status == 200) {
            this.current_page = result.data.report.current_page;
            this.last_page = result.data.report.last_page;

            if (result.data.report.data.length > 0) {
              await this.pushToSalesArray(result.data.report.data);
              if (this.current_page < this.last_page) {
                await this.getIteratedData(postParams);
              }
              this.paymentSummary = result.data.summary;
              this.paymentSummary.forEach(async (obj: any) => {
                 obj.amount =  obj.amount.toFixed(3);
              });
            }
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
      // await this.setDataTable();
    });
    this.dataSource.data = this.salesReportArray as Report[];
  }

  /*async getIteratedData(postParams: any) {
    //console.log(this.current_page, this.last_page + ' - inside start');
    for (this.current_page = 2;this.current_page <= this.last_page; this.current_page++) {
      console.log(this.current_page, this.last_page + ' - inside loop');
      this.httpService
        .post('sales-report?page=' + this.current_page, postParams, false)
        .subscribe(async (result) => {
          if (result.status == 200) {
            if (result.data.report.data.length > 0) {
              await this.pushToSalesArray(result.data.report.data);
            }
          }
        });
    }
  }*/

  async getIteratedData(postParams: any, initializeCurrentPage = true) {
    this.processingResponseStr = "Processing " + this.current_page + " / " + this.last_page + " please wait";
    if (initializeCurrentPage) {
      this.current_page = 2;
    }
    // for (this.current_page = 2;this.current_page <= this.last_page; this.current_page++) {
    this.httpService
      .post('report/sale-report?page=' + this.current_page, postParams, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.report.data.length > 0) {
            await this.pushToSalesArray(result.data.report.data);
            // for (let i in result.data.summary) {
            //   this.paymentSummary[i].amount += parseFloat(result.data.summary[i].amount).toFixed(2)
            // }
            this.paymentSummary.forEach(async (obj: any) => {
              result.data.summary.forEach(async (objData: any) => {
                if (obj.name == objData.name) {
                  let total: any = (parseFloat(obj.amount) + parseFloat(objData.amount))
                  let count: any = (parseFloat(obj.count) + parseFloat(objData.count))
                  obj.amount = total.toFixed(3);
                  obj.count = count
                }
              });
            });
          }
        }
        if (this.current_page < this.last_page) {
          this.current_page++;
          this.getIteratedData(postParams, false);
        } else {
          this.processingResponseStr = "Ready to download.";
        }
      });
    // }
  }




  // async setDataTable() {
  //   const data: any = [];
  //   this.salesReportArray?.forEach((obj: any) => {
  //     // obj.order_json['amount_received'] = obj.invoice.amount_received
  //     // obj.order_json['balance_amount'] = obj.balance_amount
  //     //   ? obj.balance_amount
  //     //   : 0;
  //     let objData = {
  //       id: obj.id,
  //       order_no: obj.order_number,
  //       invoice_no: obj.invoice_id,
  //       staff_name: obj.staff?.user.name ? obj.staff?.user.name : '--',
  //       branch_name: obj.branch.name,
  //       entity_name: obj.entity.name,
  //       date: obj.date,
  //       time: obj.time,
  //       amount: obj.amount,
  //       orderDetails: obj.order_json ? obj.order_json : '--',
  //       accepted_balance: obj.invoice.accepted_balance,
  //       discount: obj.discount
  //     };
  //     data.push(objData);
  //   });
  //   this.dataSource.data = data as Report[];
  // }

  searchby(event: any) {
    let searchbyId = event.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true;
      this.searchBySpecificDate = false;
      this.searchByBusinessDay=false;
    } else if (searchbyId == 0) {
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
      this.searchByBusinessDay=false;
    } else if (searchbyId == 2) {
      this.searchBySpecificDate = true;
      this.searchByPeriod = false;
      this.searchByBusinessDay=false;
    }
    else if (searchbyId == 3) {
      this.searchByBusinessDay=true;
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
    dialogRef.afterClosed().subscribe((result) => { });
  }

  // old
  exportExcel() {
    this.matTableExporter.exportTable('xlsx', {
      fileName: 'Sales_Report',
      sheet: 'sales_report',
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
