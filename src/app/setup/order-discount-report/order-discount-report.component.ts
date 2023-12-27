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
import { MatTableExporterDirective } from 'mat-table-exporter';
import moment from 'moment';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { DiscountOrderDetailsComponent } from '../discount-order-details/discount-order-details.component';

export interface itemReport {
  id: number;
  name: any;
  discounts: any;
  amount: any;
}

@Component({
  selector: 'app-order-discount-report',
  templateUrl: './order-discount-report.component.html',
  styleUrls: ['./order-discount-report.component.scss'],
})
export class OrderDiscountReportComponent implements OnInit {
  @ViewChild('reportTable', { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective)
  matTableExporter!: MatTableExporterDirective;
  public displayedColumns: string[] = ['name', 'discounts', 'sale', 'amount','actions'];
  public dataSource = new MatTableDataSource<itemReport>();
  public discountsReportForm!: UntypedFormGroup;
  id = this.localservice.get('branch_id');
  orderDiscounts: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  todayDate: any = moment();
  selectedIds: any = [];
  minDate: any = moment(this.todayDate)
    .subtract(2, 'months')
    .format('YYYY-MM-DD');
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  searchByBusinessDay: boolean = false;
  businessdayRecords: any = [];

  constructor(
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
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
  }

  onBuildForm() {
    this.discountsReportForm = this.formBuilder.group(
      {
        fromDate: ['', Validators.compose([Validators.required])],
        toDate: ['', Validators.compose([Validators.required])],
        searchBy: ['0'],
        date: [''],
        business_day_id: [''],
      },
      { validator: this.dateLessThan('fromDate', 'toDate') }
    );
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
    } else if (searchbyId == 3) {
      this.searchByBusinessDay = true;
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
    }
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

  generateReport() {
    this.dataSource.data = [];
    let postParams: any;

    if (this.searchByPeriod) {
      if (
        this.discountsReportForm.value['fromDate'] &&
        this.discountsReportForm.value['toDate']
      ) {
        postParams = {
          date_from: this.discountsReportForm.value['fromDate'],
          date_to: this.discountsReportForm.value['toDate'],
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.discountsReportForm.value['date']) {
        postParams = {
          specify_date: true,
          date: this.discountsReportForm.value['date'],
        };
      }
    } else if (this.searchByBusinessDay) {
      if (this.discountsReportForm.value['business_day_id']) {
        postParams = {
          business_day_id: this.discountsReportForm.value['business_day_id'],
        };
      }
    } else {
      postParams = {
        current_date: true,
      };
    }
    this.dataSource.data = [];
    if (postParams) {
      this.httpService
        .post('order-discount-report', postParams)
        .subscribe((result) => {
          if (result.status == 200) {
            this.orderDiscounts = result.data;
            this.dataSource.data = [];
            const order_data: any = [];
            this.orderDiscounts.forEach((element: any) => {
              if (element.amount != 0) {
                let objData = {
                  name: element.name,
                  discounts: element.count,
                  amount: parseFloat(element.amount).toFixed(2),
                  sale_price: parseFloat(element.sale_price).toFixed(2),
                  orderIds : element.orderIds
                };
                order_data.push(objData);
              }
            });

            this.dataSource.data = order_data as itemReport[];
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

  exportExcel(name: any) {
    this.matTableExporter.exportTable('xlsx', {
      fileName: name,
      sheet: 'discounts',
    });
  }

  // export() {
  //   let datePeriod = '';
  //   if (this.searchByPeriod) {
  //     if (
  //       this.discountsReportForm.value['fromDate'] &&
  //       this.discountsReportForm.value['toDate']
  //     ) {
  //       datePeriod = moment(this.discountsReportForm.value['fromDate']).format('L') + ' - ' + moment(this.discountsReportForm.value['toDate']).format('L')
  //     }
  //   } else if (this.searchBySpecificDate) {
  //     if (this.discountsReportForm.value['date']) {
  //       datePeriod = moment(this.discountsReportForm.value['date']).format('L')
  //     }
  //   } else {
  //     datePeriod = moment().format('L')
  //   }

  //   const dialogRef = this.dialog.open(ExportDiscountComponent, {
  //     width: '80%',
  //     data: {
  //       dataSource: this.discountData,
  //       datePeriod: datePeriod
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => { });
  // }

  details(data:any) {
    const dialogRef = this.dialog.open(DiscountOrderDetailsComponent, {
          width: '80%',
          data: {
            operation: 'order',
            data: data.orderIds
          },
        });
        dialogRef.afterClosed().subscribe((result) => { });
  }
}
