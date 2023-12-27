import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import * as moment from 'moment';
@Component({
  selector: 'app-driver-order-settlement',
  templateUrl: './driver-order-settlement.component.html',
  styleUrls: ['./driver-order-settlement.component.scss']
})
export class DriverOrderSettlementComponent implements OnInit {

  constructor(private formBuilder: UntypedFormBuilder,
    private dialogService: ConfirmationDialogService,
    private snackBService: SnackBarService,
    private httpService: HttpServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { driverId: any },
    public dialogRef: MatDialogRef<DriverOrderSettlementComponent>,
    private localService: LocalStorage) { }
  public branchForm!: UntypedFormGroup;
  list: any = [];
  history: any = [];
  branchRecords: any = [];
  Total: any = 0.00
  totalOrders: any;
  branch_id = this.localService.get('branch_id');
  branch_name = this.localService.get('branchname');
  businessday: any = '--'
  currency_symbol = localStorage.getItem('currency_symbol');
  ngOnInit(): void {
    this.getOrderData();
  }
  close() {
    this.dialogRef.close();
  }
  getOrderData() {
    this.Total = 0.00;
    let postParams: any = {
      driver_id: this.data.driverId,
      status: 0
    }
    this.httpService.post('mobile/daily-collection-settilement', postParams, false).subscribe((result) => {
      if (result.status == 200) {
        this.list = result.data.receipts
        this.history = result.data.history
        this.totalOrders = this.list[0].total_order;
        this.businessday = this.list[0].business_day_name
        //this.totalOrders=this.list[0]
        this.list.forEach((element: any) => {
          this.Total = (parseFloat(this.Total) + parseFloat(element.amount)).toFixed(2);
        });
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }
  dateCheck(date: any) {
    let newDate = moment(new Date(date)).format("DD-MM-YYYY");
    return newDate
  }
  getPaymentType(item: any) {
    if (item.invoice) {
      let paymentType = item.invoice.invoice_payment && item.invoice.invoice_payment.length > 0 ? item.invoice.invoice_payment[0].payment_type.name : '-'
      return paymentType;
    }
    else {
      return '-'
    }
  }
  settleAll() {
    const options = {
      title: 'Settle',
      message: 'Are you sure to settle all Amount ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.post('mobile/daily-collection-settilement', { driver_id: this.data.driverId, status: 1 }, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close")
              this.getOrderData();
            } else {
              this.snackBService.openSnackBar(result.message, "Close")
            }
          });
      }
    });
  }
}
