import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';
import { formatDate } from '@angular/common';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-request-driver-pool-orders',
  templateUrl: './request-driver-pool-orders.component.html',
  styleUrls: ['./request-driver-pool-orders.component.scss']
})
export class RequestDriverPoolOrdersComponent implements OnInit {
  public orderForm!: UntypedFormGroup;
  public emailPattern = "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
  public phoneNumberpattern = "^([0-9]{6,13})$";
  public numericExpression = '^[+]?[0-9]\\d*(\\.\\d{1,2})?$';
  errorMessages: any = [];
  date = moment();
  todayDate: Date = new Date();
  dateChoosen = new UntypedFormControl({ value: null, disabled: false });
  time = new UntypedFormControl({ value: null, disabled: false });
  advancedFlag: boolean = false;
  branch_contact_no = this.localService.get('branch_contact_no');
  descriptionArray:any=[]
  constructor(private localService: LocalStorage, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<RequestDriverPoolOrdersComponent>, @Inject(MAT_DIALOG_DATA) public data: { details: any ,operation:any}) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.dateChoosen.setValue(formatDate(this.todayDate, 'yyyy-MM-dd', 'en'));
    this.time.setValue(moment().format('HH:mm'))
    this.getSingleEdit()
    console.log(this.data.details);
    
  }

  close() {
    this.dialogRef.close();
  }

  getSingleEdit() {
    this.data.details.order.items.forEach((obj:any) => {
      let item = obj.name + ' * ' +obj.qty
      this.descriptionArray.push(item)
    });
    this.orderForm.patchValue({
      'ref_no': this.data.details.order_number,
      'amount': this.data.details.order.Total,
      'building_no': this.data.details.order.address ? this.data.details.order.address.building_or_villa : null,
      'zone': this.data.details.order.address?.zone ? this.data.details.order.address.zone : null,
      'street': this.data.details.order.address ? this.data.details.order.address.street : null,
      'contact_no': this.branch_contact_no,
      'description':this.descriptionArray.toString()
    })
    if (this.data.details.address) {
      this.showAdvanced()
    }
    // this.dateChoosen.setValue(formatDate(this.data.details.date, 'yyyy-MM-dd', 'en'));
    // this.time.setValue(this.data.details.time);
  }

  onBuildForm() {
    this.orderForm = this.formBuilder.group({
      ref_no: ['', Validators.compose([Validators.required])],
      contact_no: ['', Validators.compose([Validators.required, Validators.pattern(this.phoneNumberpattern)])],
      amount: ['', Validators.compose([Validators.required])],
      // time:[''],
      vehicle_type: ['0', Validators.compose([Validators.required])],
      type: ['0', Validators.compose([Validators.required])],
      payment_status: ['0', Validators.compose([Validators.required])],
      building_no: [''],
      zone: [''],
      street: [''],
      notes: [''],
      description: ['', Validators.compose([Validators.required])],
      address: [''],
    })
  }

  showAdvanced() {
    this.advancedFlag = !this.advancedFlag
  }

  addOrder() {
    let body = this.orderForm.value;
    body.date = this.dateChoosen.value;
    body.time = this.time.value;
    body.order_json = null;
    body.key = this.localService.get('driverPoolKey');
    if (this.orderForm.valid) {
      this.httpService.driver_pool_post('create-order', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.httpService.get('request-status-change/' + this.data.details.order_id)
              .subscribe(result => {
                if (result.status == 200) {
                  this.dialogRef.close("done");
                }
                else {
                  this.snackBService.openSnackBar(result.message, "Close");
                }
              })
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        })
    }
  }

}
