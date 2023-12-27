import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { OrderReportDetailComponent } from '../order-report-detail/order-report-detail.component';
import moment from 'moment';
// import { ViewOrderDetailComponent } from '../view-order-detail/view-order-detail.component';

export interface branch {
  id: any;
  order_no: any;
  date: any;
  time: any;
  amount: any;
  status: any;
}

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss']
})
export class OrderReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  public orderReportForm!: UntypedFormGroup;
  public displayedColumns: string[] = ['index', 'order_no', 'date', 'time', 'supplier', 'amount', 'status', 'button'];
  public dataSource = new MatTableDataSource<branch>();
  BranchRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  supplierRecords: any = [];
  reportData: any = [];
  totalAmount: any = 0.00;
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = "";
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private snackBService: SnackBarService, private dialogService: ConfirmationDialogService, private httpService: HttpServiceService, private router: Router, public dialog: MatDialog, private localService: LocalStorage) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getSuppliers();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.orderReportForm = this.formBuilder.group({
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      supply_company_id: ["", Validators.compose([Validators.required])],
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
  getSuppliers() {
    this.httpService.driver_pool_get('all-supply-companies', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.supplierRecords = result.data;
          this.generateReport();
        }
      })
  }

  reset() {
    this.reportData = [];
    this.current_page = 1;
    this.last_page = 2;
  }

  async generateReport() {
    this.reset();
    let postParams: any;
    if (this.searchByPeriod) {
      if (
        this.orderReportForm.value['fromDate'] &&
        this.orderReportForm.value['toDate']
      ) {
        postParams = {
          date_from: this.orderReportForm.value['fromDate'],
          date_to: this.orderReportForm.value['toDate'],
          supply_company_id: this.orderReportForm.value['supply_company_id'],
          key: this.localService.get('driverPoolKey')
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.orderReportForm.value['date']) {
        postParams = {
          supply_company_id: this.orderReportForm.value['supply_company_id'],
          specify_date: true,
          date: this.orderReportForm.value['date'],
          key: this.localService.get('driverPoolKey')
        };
      }
    } else {
      postParams = {
        supply_company_id: this.orderReportForm.value['supply_company_id'],
        current_date: true,
        key: this.localService.get('driverPoolKey')
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.httpService
        .driver_pool_post(
          'report-to-unidiner?page=' + this.current_page,
          postParams,

        )
        .subscribe(async (result) => {
          if (result.status == 200) {
            this.current_page = result.data.current_page;
            this.last_page = result.data.last_page;
            if (result.data.data.length > 0) {
              await this.pushToSalesArray(result.data.data);
              if (this.current_page < this.last_page) {
                await this.getIteratedData(postParams, false);
              }
            }
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close")
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
      this.reportData.push(obj);
      await this.setDataTable();
    });
  }

  async setDataTable() {
    const data: any = [];
    this.totalAmount = 0.00;
    this.reportData.forEach((obj: any) => {
      let objData = {
        id: obj.id,
        order_no: obj.order_no,
        date: obj.date,
        time: obj.time,
        amount: (obj.amount).toFixed(2),
        status: obj.driver_status,
        supplier: obj.supply_company ? obj.supply_company.name : '--',
        orderDetails: obj
      }
      this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.amount)).toFixed(2);
      data.push(objData)
    });
    this.dataSource.data = data as branch[];
  }

  async getIteratedData(postParams: any, initializeCurrentPage = true) {
    this.processingResponseStr = "Processing " + this.current_page + " / " + this.last_page + " please wait";
    if (initializeCurrentPage) {
      this.current_page = 2;
    }
    this.httpService
      .driver_pool_post('report-to-unidiner?page=' + this.current_page, postParams, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.data.length > 0) {
            await this.pushToSalesArray(result.data.data);
          }
        }
        if (this.current_page < this.last_page) {
          this.current_page++;
          this.getIteratedData(postParams, false);
        } else {
          this.processingResponseStr = "";
        }
      });
  }

  doFilter(value: any) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  viewDetails(orderDetails: any) {
    const dialogRef = this.dialog.open(OrderReportDetailComponent, {
      width: '80%',
      data: {
        Orders: orderDetails,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
}