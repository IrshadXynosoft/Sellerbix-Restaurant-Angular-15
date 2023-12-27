import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-customer-loyalty-coupons',
  templateUrl: './customer-loyalty-coupons.component.html',
  styleUrls: ['./customer-loyalty-coupons.component.scss']
})
export class CustomerLoyaltyCouponsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  couponRecords: any = [];
  selectedCoupon: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { contact_no: any, order_value: any }, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<CustomerLoyaltyCouponsComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.couponsGet();
  }

  close() {
    this.dialogRef.close();
  }
  couponsGet() {
    let body = this.data;
    this.httpService.post('loyalty-customer-coupon', body, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.couponRecords = result.data;
        } else {
          console.log("Error");
        }
      });
  }

  addingSurcharge(surcharge: any) {
    this.selectedCoupon = surcharge;
    this.dialogRef.close(this.selectedCoupon)
  }
}
