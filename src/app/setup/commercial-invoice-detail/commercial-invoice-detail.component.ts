import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-commercial-invoice-detail',
  templateUrl: './commercial-invoice-detail.component.html',
  styleUrls: ['./commercial-invoice-detail.component.scss']
})
export class CommercialInvoiceDetailComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  totalAmount: any = 0.00;
  invoices: any = [];
  balance_amount: any = 0.00;
  constructor(private dialogService: ConfirmationDialogService,private snackBService: SnackBarService, private httpService: HttpServiceService, private localservice: LocalStorage, private dataservice: DataService, private router: Router, @Inject(MAT_DIALOG_DATA) public data: { Orders: any, flag: any, commercial_invoice_id: any, customer_id: any,amount_received:any }, public dialog: MatDialog, public dialogRef: MatDialogRef<CommercialInvoiceDetailComponent>) { }

  ngOnInit(): void {
    if (this.data.Orders != undefined) {
      this.data.Orders.forEach((element: any) => {
        this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(element.amount ? element.amount : 0)).toFixed(2)
        this.invoices.push({ order_id: element.order_id })
      });
      this.balance_amount = (parseFloat(this.totalAmount) - parseFloat(this.data.amount_received)).toFixed(2)
    }
  }
  close() {
    this.dialogRef.close();
  }

  selectedInvoice(e: any, item: any) {
    if (e.checked) {
      this.invoices.push({ order_id: item.order_id })
      this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(item.amount)).toFixed(2)
      this.balance_amount = (parseFloat(this.totalAmount) - parseFloat(this.data.amount_received)).toFixed(2)
    }
    else {
      this.invoices.forEach((obj: any, index: any) => {
        if (obj.order_id == item.order_id) {
          this.invoices.splice(index, 1);
        }
      })
      this.totalAmount = (parseFloat(this.totalAmount) - parseFloat(item.amount)).toFixed(2)
      this.balance_amount = (parseFloat(this.totalAmount) - parseFloat(this.data.amount_received)).toFixed(2)
    }
  }

  removeInvoices() {
    if (this.invoices.length >= 2) {
      let postData = {
        customer_id: this.data.customer_id,
        amount: this.totalAmount,
        commercial_invoice_id: this.data.commercial_invoice_id,
        invoices: this.invoices
      }
      this.httpService.post('update-commercial-invoice', postData)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Invoice updated sucessfully", "Close");
            this.dialogRef.close("updated")
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.snackBService.openSnackBar("There should be atleast minimum of 2 orders", "Close")
    }
  }

  deleteInvoice() {
    const options = {
      title: 'Delete',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('delete-commercial-invoice/' + this.data.commercial_invoice_id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Invoice deleted sucessfully", "Close");
              this.dialogRef.close("updated")
            }
            else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    })
  }
}
