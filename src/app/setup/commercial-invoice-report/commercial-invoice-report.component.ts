import { CommercialInvoicePaymentDialogComponent } from './../commercial-invoice-payment-dialog/commercial-invoice-payment-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { CommercialInvoiceDetailComponent } from '../commercial-invoice-detail/commercial-invoice-detail.component';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';

export interface Report {
  id: number;
  invoice_no: any;
  customer_name: any;
  contact_number: any;
  date: any;
  time: any;
  amount: any;
  payment_status: any;
  orderDetails: any
}

@Component({
  selector: 'app-commercial-invoice-report',
  templateUrl: './commercial-invoice-report.component.html',
  styleUrls: ['./commercial-invoice-report.component.scss']
})
export class CommercialInvoiceReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  } @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'invoice_no', 'customer_name', 'contact_number', 'date', 'time', 'amount', 'payment_status', 'button'];
  public dataSource = new MatTableDataSource<Report>();
  data: any;
  id: any;
  salesReportArray: any = [];
  totalAmount: any = 0;
  totalPaidAmount: any = 0.00;
  totalUnpaidAmount: any = 0.00;
  totalPartialyPaidAmount: any = 0.00;
  paymentArray: any = [];
  amount_received: any = 0.00;
  datePeriod: boolean = false;
  specificDate: boolean = false;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  public reportForm!: UntypedFormGroup;
  errorMessage: any;
  minDate: any = moment(this.todayDate)
    .subtract(2, 'months')
    .format('YYYY-MM-DD');
  accept_payment: any = this.localservice.get('accept_payment');
  constructor(private printMqtt: PrintMqttService, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    public dialog: MatDialog, private localservice: LocalStorage, private formBuilder: UntypedFormBuilder,) {
    this.id = this.localservice.get('branch_id');
  }

  ngOnInit(): void {
    this.onBuildForm();
    // this.generateReport();

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


  searchby(event: any) {
    this.searchByPeriod = false;
    this.searchBySpecificDate = false;
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true;
    }
    else if (searchbyId == 2) {
      this.searchBySpecificDate = true
    }
  }
  // generateReport() {
  //     let postParams: any = {};
  //     if (this.searchByPeriod && this.reportForm.value['fromDate'] && this.reportForm.value['toDate']) {
  //       this.errorMessage = '';
  //       postParams = {
  //        date_from: this.reportForm.value['fromDate'],
  //         date_to: this.reportForm.value['toDate']
  //       }
  //     }
  //     else if (this.searchBySpecificDate && this.reportForm.value['date']) {
  //       this.errorMessage = '';
  //       this.reportForm.controls['fromDate'].clearValidators()
  //       this.reportForm.controls['toDate'].clearValidators()
  //       this.reportForm.controls['date'].setValidators([Validators.required])
  //       postParams = {
  //          specify_date: true,
  //         date: this.reportForm.value['date'],
  //       }
  //     }
  //     else if (!this.searchByPeriod && !this.searchBySpecificDate) {
  //       this.errorMessage = '';
  //       postParams = {
  //         current_date: true
  //       }
  //     }
  //     this.dataSource.data = [];
  //     if (postParams) {
  //       const data: any = [];
  //       this.totalAmount = 0;
  //       this.totalPaidAmount = 0.00;
  //       this.totalUnpaidAmount = 0.00;
  //       this.httpService.post('commercial-invoice-data', postParams)
  //       // this.httpService.get('commercial-invoice-data', false)
  //          .subscribe(result => {
  //            if (result.status == 200) {
  //              this.salesReportArray = result.data.data;
  //              this.totalAmount = (result.data.total).toFixed(2)
  //              this.totalPaidAmount = (result.data.paid).toFixed(2);
  //              this.totalUnpaidAmount =(result.data.unpaid).toFixed(2);
  //              this.totalPartialyPaidAmount = (result.data.partial_paid).toFixed(2);
  //             //  this.salesReportArray.forEach((obj: any) => {
  //             //    let objData = {
  //             //      id: obj.id,
  //             //      invoice_no: obj.invoice_no,
  //             //      customer_id: obj.customer_id,
  //             //      customer_name: obj.customer_name,
  //             //      contact_number: obj.customer_no,
  //             //      date: obj.date,
  //             //      time: obj.time,
  //             //      amount: obj.amount,
  //             //      amount_received: obj.amount_received,
  //             //      payment_status: obj.payment_status,
  //             //      orderDetails: obj.commercial_invoice_item,
  //             //      order_id: obj.commercial_invoice_item ? obj.commercial_invoice_item[0].order_id : null
  //             //    }
  //              //    data.push(objData)
  //             //  });
  //              this.dataSource.data = this.salesReportArray as Report[];
  //            } else {
  //              this.snackBService.openSnackBar(result.message, "Close")
  //            }
  //          });
  //     }
  //     else if (!this.searchByPeriod) {
  //       this.errorMessage = "select From & to date"
  //     }
  //     else if (this.searchBySpecificDate) {
  //       this.errorMessage = "select date"
  //     }
  //   }

  async generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (
        this.reportForm.value['fromDate'] &&
        this.reportForm.value['toDate']
      ) {
        postParams = {
          date_from: this.reportForm.value['fromDate'],
          date_to: this.reportForm.value['toDate'],
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.reportForm.value['date']) {
        postParams = {
          specify_date: true,
          date: this.reportForm.value['date'],
        };
      }
    } else {
      postParams = {
        current_date: true,
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.totalAmount = 0;
      this.totalPaidAmount = 0.00;
      this.totalUnpaidAmount = 0.00;
      this.httpService.post('commercial-invoice-data', postParams)
        // this.httpService.get('commercial-invoice-data', false)
        .subscribe(result => {
          if (result.status == 200) {
            this.salesReportArray = result.data.data;
            this.totalAmount = (result.data.total).toFixed(2)
            this.totalPaidAmount = (result.data.paid).toFixed(2);
            this.totalUnpaidAmount = (result.data.unpaid).toFixed(2);
            this.totalPartialyPaidAmount = (result.data.partial_paid).toFixed(2);
            this.dataSource.data = this.salesReportArray as Report[];
          } else {
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
  viewDetails(orderDetails: any, amount_received: any): void {
    const dialogRef = this.dialog.open(CommercialInvoiceDetailComponent, {
      width: '70%',
      data: {
        Orders: orderDetails,
        flag: "view",
        amount_received: amount_received
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  editInvoice(orderDetails: any, id: any, customer_id: any, amount_received: any): void {
    const dialogRef = this.dialog.open(CommercialInvoiceDetailComponent, {
      width: '70%',
      data: {
        Orders: orderDetails,
        flag: "edit",
        commercial_invoice_id: id,
        customer_id: customer_id,
        amount_received: amount_received
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "updated") {
        this.generateReport()
      }
    });
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'CommercialInvoice_Report', sheet: 'commercialinvoice_report' });
  }
  back() {
    this.router.navigate(['setup/reports'])
  }

  pay(element: any) {
    let amount = parseFloat(element.amount) - parseFloat(element.amount_received)
    const dialogRef = this.dialog.open(CommercialInvoicePaymentDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        Cart: {
          amount: amount.toFixed(2)
        },
        orderId: element.order_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result[0]?.amount) {
        this.amount_received = 0.00;
        this.paymentArray = result;
        this.paymentArray.forEach((obj: any) => {
          this.amount_received += parseFloat(obj.amount)
        });
        this.generateInvoice(element);
      }
      else if (result != "close") {
        this.payLater(element)
      }
    });
  }

  payLater(element: any) {
    let amount = parseFloat(element.amount) - parseFloat(element.amount_received)
    let postData = {
      customer_id: element.customer_id,
      amount: amount,
      payment_types: [],
      amount_received: 0.00,
      commercial_invoice_id: element.id
    }
    this.httpService.post('pay-commercial-invoice', postData)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Invoice added as paylater", "Close");
          // this.router.navigate(['callcenter'])
          this.generateReport()
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  generateInvoice(element: any) {
    let amount = parseFloat(element.amount) - parseFloat(element.amount_received)
    let postData = {
      customer_id: element.customer_id,
      amount: amount,
      payment_types: this.paymentArray,
      amount_received: this.amount_received,
      commercial_invoice_id: element.id
    }
    this.httpService.post('pay-commercial-invoice', postData)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Commercial Invoice Generated Successfully", "Close");
          this.generateReport()
          // this.router.navigate(['callcenter'])
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  printInvoice(id: any) {
    this.httpService.get('print-commercial-invoice/' + id)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Invoice printed successfully", 'Close')
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
          })
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

}


