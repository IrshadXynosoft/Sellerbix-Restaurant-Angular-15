import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
//import { MatTableExporterDirective } from 'mat-table-exporter';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommercialInvoicePaymentDialogComponent } from '../commercial-invoice-payment-dialog/commercial-invoice-payment-dialog.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';
export interface Report {
  id: number;
  order_no: any;
  date: any;
  customer_id: any;
  customer_name: any;
  type: any;
  amount: any;
  payment_status: any;
  staff: any;
  chkbox: any;
  time: any;
}

@Component({
  selector: 'app-commercial-invoice',
  templateUrl: './commercial-invoice.component.html',
  styleUrls: ['./commercial-invoice.component.scss']
})
export class CommercialInvoiceComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'order_no', 'date', 'type', 'amount', 'payment_status', 'chkbox'];
  public dataSource = new MatTableDataSource<Report>();
  data: any;
  id = this.localservice.get('branch_id');
  reportArray: any = [];
  customerList: any = [];
  reportsList: any = [];
  isCheckedAll: boolean = false;
  invoices: any = [];
  amount: any = 0.00;
  customer_name: any;
  customer_contact: any;
  customer_id: any;
  paymentArray: any = [];
  amount_received: any = 0.00;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: FormBuilder, public dialog: MatDialog,
    private localservice: LocalStorage
    ) {
    this.customer_id = this.route.snapshot.params.customer_id;
  }

  ngOnInit(): void {
    this.getcommercialInvoice();

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getcommercialInvoice() {
    this.httpService.get('commercial-invoice/' + this.customer_id, false).subscribe((result) => {
      if (result.status == 200) {
        this.reportsList = [];
        this.customerList = result.data;
        this.customer_name = this.customerList[0].order.customer_details.name
        this.customer_contact = this.customerList[0].order.customer_details.phone_number
        this.customerList.forEach((obj: any) => {
          let objData = {
            id: obj.order_id,
            invoice_id: obj.invoice_id,
            order_no: obj.order_number,
            date: obj.date,
            time: obj.time,
            customer_id: obj.order.customer_details.customer_id,
            customer_name: obj.order.customer_details.name,
            type: obj.store_pickup,
            amount: obj.order.Total,
            partial_amount : obj.invoice.amount_received ? obj.invoice.amount_received : null,
            payment_status: obj.payment_status,
            staff: obj.staff_name,
            chkbox: ''
          };
          this.reportsList.push(objData)

        });
        this.dataSource.data = this.reportsList as Report[];
      } else {
        console.log('Error');
      }
    });
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  checkAll(event: any) {
    this.invoices = [];
    this.amount = 0.00;
    if (event.checked) {
      this.reportsList.forEach((element: any) => {
        element.chkbox = true;
        this.invoices.push({ order_id: element.id, invoice_id: element.invoice_id })
        this.amount = this.amount + parseFloat(element.amount)
        this.amount.toFixed(2);
      });
    }
    else {
      this.reportsList.forEach((element: any) => {
        element.chkbox = false;
      });
    }
    this.dataSource.data = this.reportsList as Report[];
  }

  checkInvoice(event: any, element: any) {
    if (event.checked) {
      this.invoices.push({ order_id: element.id, invoice_id: element.invoice_id })
      this.amount = element.payment_status == 1 ? this.amount + (parseFloat(element.amount) - parseFloat(element.partial_amount)) : this.amount + parseFloat(element.amount)
      this.amount.toFixed(2);
    }
    else {
      this.invoices.forEach((obj: any, index: any) => {
        if (obj.order_id == element.id) {
          this.invoices.splice(index, 1);
          this.amount =  element.payment_status == 1 ? this.amount - (parseFloat(element.amount) - parseFloat(element.partial_amount)) : this.amount - parseFloat(element.amount)
          this.amount.toFixed(2);
        }
      });
    }
  }

  payLater() {
    let postData = {
      customer_id: this.customer_id,
      amount: this.amount.toFixed(2),
      invoices: this.invoices,
      payment_types: [],
      amount_received: 0.00
    }
    this.httpService.post('generate-commercial-invoice', postData)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Invoice added as paylater", "Close");
          this.router.navigate(['setup/reports/CommercialInvoiceReport'])
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  generateInvoice() {
    let postData = {
      customer_id: this.customer_id,
      amount: this.amount.toFixed(2),
      invoices: this.invoices,
      payment_types: this.paymentArray,
      amount_received: this.amount_received.toFixed(2)
    }
    this.httpService.post('generate-commercial-invoice', postData)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Commercial Invoice Generated Successfully", "Close");
          this.router.navigate(['setup/reports/CommercialInvoiceReport'])
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  makePayment() {
    if (this.amount != 0 && this.invoices.length>= 2) {
      const dialogRef = this.dialog.open(CommercialInvoicePaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: {
            amount: this.amount.toFixed(2)
          }
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result[0]?.amount) {          
          this.paymentArray = result;
          this.paymentArray.forEach((obj: any) => {
            this.amount_received += parseFloat(obj.amount)
          });
          this.generateInvoice();
        }
        else if(result != "close"){
          this.payLater()
        }
      });
    }
    else {
      this.snackBService.openSnackBar("Please select minimum of 2 orders", "Close")
    }
  }
  back() {
    this.router.navigate(['setup/reports'])
  }
}


