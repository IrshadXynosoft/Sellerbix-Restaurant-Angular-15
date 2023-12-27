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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import moment from 'moment';
export interface Report {
  id: number;
  order_no: any;
  date: any;
  customer_id: any;
  customer_name: any;
  customer_contact: any;
  customer_wallet: any;
  amount: any;
  amount_to_pay: any;
  amount_received: any;
}

@Component({
  selector: 'app-unpaid-customer-report',
  templateUrl: './unpaid-customer-report.component.html',
  styleUrls: ['./unpaid-customer-report.component.scss']
})
export class UnpaidCustomerReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'order_no', 'date', 'amount', 'amount_to_pay', 'amount_received'];
  public dataSource = new MatTableDataSource<Report>();
  public unpaidReportForm!: UntypedFormGroup;
  data: any;
  branch_id = this.localservice.get('branch_id');
  totalAmount: any = 0;
  totalPaidAmount: any = 0.00;
  reportArray: any = [];
  customerList: any = [];
  unPaidCustomerList: any = [];
  reportsList: any = [];
  totalUnpaidAmount: any = 0.00;
  list_options: any = [];
  customersData = new UntypedFormControl();
  filteredOptions: Observable<any[]> | undefined;
  customer_name: any;
  customer_contact: any;
  // wallet: any;
  customer_id: any;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private printMqtt: PrintMqttService, private dialogService: ConfirmationDialogService, private localService: LocalStorage, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage
  ) { }

  ngOnInit(): void {
    //this.onBuildForm();
    // this.getUnPaidCustomers();
    this.filteredOptions = this.customersData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    let cus_id = this.localService.get('customer_id');
    this.customerSelected(cus_id)
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.list_options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // getUnPaidCustomers() {
  //   this.httpService.get('unpaid-customers', false).subscribe((result) => {
  //     if (result.status == 200) {
  //       this.unPaidCustomerList = result.data;
  //       this.unPaidCustomerList.forEach((obj: any) => {
  //         let objData = {
  //           id: obj.id,
  //           name: obj.name + '-' + obj.contact_no,
  //         };
  //         this.list_options.push(objData);
  //       });
  //     } else {
  //       console.log('Error');
  //     }
  //   });
  // }
  customerSelected(customerid: any) {
    this.customer_name = '';
    this.customer_contact = '';
    // this.wallet = 0.00;
    this.customer_id = customerid;
    this.httpService.get('unpaid-customer-reports/' + customerid, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.reportArray = result.data.orders;
          this.totalUnpaidAmount = (parseFloat(result.data.unpaid_amount)).toFixed(2);
          this.customer_name = this.reportArray[0].customer_name
          this.customer_contact = this.reportArray[0].customer_number
          // this.wallet = (parseFloat(this.reportArray[0].customer_wallet)).toFixed(2)
          this.reportArray.forEach((obj: any) => {

            let objData = {
              id: obj.id,
              order_no: obj.order_no,
              date: obj.date,
              customer_id: obj.customer_id,
              customer_name: obj.customer_name,
              customer_contact: obj.customer_number,
              // customer_wallet: (parseFloat(obj.customer_wallet)).toFixed(2),
              amount: (parseFloat(obj.amount)).toFixed(2),
              amount_to_pay: (parseFloat(obj.amount_to_pay)).toFixed(2),
              amount_received: (parseFloat(obj.amount_received)).toFixed(2)
            }
            this.reportsList.push(objData)
            this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.amount)).toFixed(2)
            this.totalPaidAmount = (parseFloat(this.totalPaidAmount) + parseFloat(obj.amount_received)).toFixed(2);
          });
          this.dataSource.data = this.reportsList as Report[];
          // input.value = '';
          // input.blur();
        } else {
          console.log("Error");
        }
      });

  }




  onBuildForm() {
    this.unpaidReportForm = this.formBuilder.group({
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
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

  // generateReport() {
  //   this.totalAmount = 0;
  //   this.dataSource.data = [];
  //   this.httpService.get('unpaid-reports')
  //     .subscribe(result => {
  //       if (result.status == 200) {
  //         this.reportArray = result.data.orders;
  //         this.totalUnpaidAmount = (parseFloat(result.data.unpaid_amount)).toFixed(2);
  //         this.totalAmount = this.totalUnpaidAmount;
  //         this.reportArray.forEach((obj: any) => {
  //           let objData = {
  //             id: obj.id,
  //             order_no: obj.order_no,
  //             date: obj.date,
  //             customer_id: obj.customer_id,
  //             customer_name: obj.customer_name,
  //             customer_contact: obj.customer_number,
  //             customer_wallet: (parseFloat(obj.customer_wallet)).toFixed(2),
  //             amount: (parseFloat(obj.amount)).toFixed(2),
  //             amount_to_pay: (parseFloat(obj.amount_to_pay)).toFixed(2),
  //             amount_received: (parseFloat(obj.amount_received)).toFixed(2)
  //           }
  //           this.reportsList.push(objData)
  //         });
  //         this.dataSource.data = this.reportsList as Report[];
  //       } else {
  //         console.log("Error");
  //       }
  //     });
  // }

  // viewDetails(orderDetails: any): void {
  //   const dialogRef = this.dialog.open(SalesReportItemDetailsComponent, {
  //     width: '70%',
  //     data: {
  //       Orders: orderDetails
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Unpaid_Report', sheet: 'unpaid_report' });
  }
  commercialInvoice() {
    this.router.navigate(['callcenter/commercial/' + this.customer_id + '/' + this.branch_id])

  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  back() {
    this.router.navigate(['setup/reports/unPaidCustomerReport'])
  }

  printInvoice() {
    const options = {
      title: 'Print',
      message: 'Are You Sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('customer-receipt/' + this.branch_id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Print Generated Successfully!", "Close");
              result.data.forEach((obj: any) => {
                let print = this.printMqtt.checkPrinterAvailablity(obj)
                if (print.status) {
                  this.printMqtt.publish('print', print.printObj)
                    .subscribe((data: any) => {
                    });
                }
                else {
                  this.snackBService.openSnackBar(print.message, "Close")
                }
              });
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }
}

