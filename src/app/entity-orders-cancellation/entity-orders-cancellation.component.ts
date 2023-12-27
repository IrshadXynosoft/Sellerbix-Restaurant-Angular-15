import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from '../_services/http-service.service';
import { LocalStorage } from '../_services/localstore.service';
import { SnackBarService } from '../_services/snack-bar.service';

@Component({
  selector: 'app-entity-orders-cancellation',
  templateUrl: './entity-orders-cancellation.component.html',
  styleUrls: ['./entity-orders-cancellation.component.scss']
})
export class EntityOrdersCancellationComponent implements OnInit {
  constructor(private localservice: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { order_id: any, payment_status: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<EntityOrdersCancellationComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }
  public cancelForm!: UntypedFormGroup;
  modifierRecords: any = [];
  supervisorPassword: any;
  branch_id = this.localservice.get('branch_id');
  ngOnInit(): void {
    this.cancelForm = this.formBuilder.group({
      reason: ['', Validators.compose([Validators.required])],
      remarks: [''],
      inventory_status: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      refund: ['', Validators.compose([Validators.required])]
    })
    this.getReason()
    this.getPassword()
  }

  getReason() {
    this.httpService.get('cancellation-reason', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.modifierRecords = result.data.cancellation_reasons;
        } else {
          console.log("Error");
        }
      });
  }

  getPassword() {
    this.httpService.get('settings', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.supervisorPassword = result.data.settings?.supervisor_password
        } else {
          console.log("Error");
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  cancelOrder() {
    if (this.data.payment_status != 1) {
      this.cancelForm.patchValue({
        'refund': 0
      })
    }
    if (this.cancelForm.valid) {
      let post = {
        cancellation_reason_id: this.cancelForm.value['reason'],
        order_id: this.data.order_id,
        remarks: this.cancelForm.value['remarks'],
        inventory_status: this.cancelForm.value['inventory_status'],
        branch_id: this.branch_id,
        refund: this.cancelForm.value['refund']
      }
      if (this.cancelForm.value['password'] == this.supervisorPassword) {
        this.httpService.post('order-delete/' + this.data.order_id, post)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Order Cancelled Successfully", "Close");
              this.dialogRef.close(this.data.order_id);
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
      else {
        this.snackBService.openSnackBar("Incorrect password", "Close")
      }
    }

  }
}
