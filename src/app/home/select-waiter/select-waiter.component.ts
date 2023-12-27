import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { CustomerLoyaltyCouponsComponent } from '../customer-loyalty-coupons/customer-loyalty-coupons.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-waiter',
  templateUrl: './select-waiter.component.html',
  styleUrls: ['./select-waiter.component.scss']
})
export class SelectWaiterComponent implements OnInit {
  records: any = [];
  selectedWaiter: any;
  branch_id = this.localservice.get('branch_id');
  waiter: any = new FormControl('', [Validators.required]);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: any }, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<CustomerLoyaltyCouponsComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getWaiters();
    // this.selectedWaiter = this.data.id;
  }

  close() {
    this.dialogRef.close();
  }

  getWaiters() {
    this.httpService.get('waiters/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.records = result.data;
        } else {
          console.log("Error");
        }
      });
  }

  save() {
    if (this.waiter.valid) {
      let data = {
        name: this.waiter.value.name,
        id: this.waiter.value.id
      }
      this.dialogRef.close(data)
    }
  }

}
