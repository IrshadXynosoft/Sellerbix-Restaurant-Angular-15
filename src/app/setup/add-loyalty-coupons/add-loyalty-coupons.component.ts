import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-add-loyalty-coupons',
  templateUrl: './add-loyalty-coupons.component.html',
  styleUrls: ['./add-loyalty-coupons.component.scss']
})
export class AddLoyaltyCouponsComponent implements OnInit {
  public couponForm!: UntypedFormGroup;
  public validationFloat = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$";
  couponArray: any;
  loyaltyGroups: any = []
  entityRecords: any = []
  todayDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddLoyaltyCouponsComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService
    , @Inject(MAT_DIALOG_DATA) public data: { id: any, branch_id: string }) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getloyalty();
    this.getEntity()
    if (this.data.id) {
      this.getCoupon();
    }
  }

  getloyalty() {
    this.httpService.get('loyalty-group', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.loyaltyGroups = result.data;
        } else {
          console.log("Error");
        }
      });
  }

  getEntity() {
    this.httpService.get('entities').subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  onBuildForm() {
    this.couponForm = this.formBuilder.group({
      coupon_code: ['', Validators.compose([Validators.required])],
      description: [''],
      minimum_order_value: ['', Validators.compose([Validators.required, Validators.pattern(this.validationFloat)])],
      no_of_coupons_issued: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      discount_type: ['1', Validators.compose([Validators.required])],
      discount_value: ['', Validators.compose([Validators.required, Validators.pattern(this.validationFloat)])],
      valid_from_date: [this.todayDate],
      valid_to_date: [this.todayDate],
      active: [''],
      loyalty_groups: [''],
      entity_id:['',Validators.required]
    });
  }

  addCoupon() {
    let post = this.couponForm.value;
    post['branch_id'] = this.data.branch_id;
    if (this.data.id) {
      this.httpService.put('loyalty-coupon/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Coupon Updated Successfully", "Close");
            this.close();
          } else {

            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.httpService.post('loyalty-coupon', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Coupon added Successfully", "Close");
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  getCoupon() {
    this.httpService.get('loyalty-coupon/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.couponArray = result.data;
          let data: any = [];
          this.couponArray.loyalty_group_coupons?.forEach((element: any) => {
            data.push(element.loyalty_group_id)
          });
          this.couponForm.patchValue({
            coupon_code: this.couponArray.coupon_code,
            description: this.couponArray.description,
            minimum_order_value: this.couponArray.minimum_order_value,
            no_of_coupons_issued: this.couponArray.no_of_coupons_issued,
            discount_type: this.couponArray.discount_type,
            discount_value: this.couponArray.discount_value,
            valid_from_date: this.couponArray.valid_from_date,
            valid_to_date: this.couponArray.valid_to_date,
            active: this.couponArray.status,
            loyalty_groups: data,
            entity_id: this.couponArray.entity_id
          });

        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }
  close() {
    this.dialogRef.close();
  }
}
