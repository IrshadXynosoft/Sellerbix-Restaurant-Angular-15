import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-invoice-kot-print',
  templateUrl: './invoice-kot-print.component.html',
  styleUrls: ['./invoice-kot-print.component.scss']
})
export class InvoiceKotPrintComponent implements OnInit {
  today_date = moment().format('MMM Do YYYY, h:mm:ss a');
  staff = this.localservice.get('user1');
  printFlag: any = this.data.printData.printObj.flags;
  printItems: any = this.data.printData.printObj.lineItems;
  printHeader: any = this.data.printData.printObj.header;
  printLabels: any = this.data.printData.printObj.labels;
  printPaymentSummary: any = this.data.printData.printObj.paymentSummary;
  printBillSummary: any = this.data.printData.printObj.billSummary;
  printSettings: any = this.data.printData.printObj.settings;
  constructor(private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<InvoiceKotPrintComponent>, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { printData: any }) { }

  ngOnInit(): void {
    console.log(this.data.printData);
  }

  close() {
    this.dialogRef.close();
  }
}