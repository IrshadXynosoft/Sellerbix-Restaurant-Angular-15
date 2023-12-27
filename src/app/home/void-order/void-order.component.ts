import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-void-order',
  templateUrl: './void-order.component.html',
  styleUrls: ['./void-order.component.scss']
})
export class VoidOrderComponent implements OnInit {
  modifierRecords: any = [];
  public voidReasonForm!: UntypedFormGroup;
  supervisorPassword: any;
  branch_id = this.localservice.get('branch_id');
  Records: any = [];
  constructor(private localservice: LocalStorage, private router: Router, private snackBService: SnackBarService, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<VoidOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: { index:any ,orderid: any, item: any, action: any }) { }

  ngOnInit(): void {
    this.getModifyReason();
    this.onBuildForm();
    this.getPassword();
    this.getReason()
  }
  onBuildForm() {
    this.voidReasonForm = this.formBuilder.group({
      reason: ['', this.data.action != 'removeitem' ? Validators.compose([Validators.required]) : null],
      modifyreason: ['', this.data.action == 'removeitem' ? Validators.compose([Validators.required]) : null],
      inventory_status: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })
  }

  getReason() {
    this.httpService.get('modify-reason', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.Records = result.data.modifier_reasons;
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

  getModifyReason() {
    this.httpService.get('cancellation-reason-by-entity-id/1', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.modifierRecords = result.data.cancellation_reasons;
        } else {
          console.log("Error");
        }
      });
  }

  voidOrder() {
    if (this.voidReasonForm.valid) {
      if (this.data.action == 'removeitem') {
        if (this.voidReasonForm.value['password'] == this.supervisorPassword) {
          let body = {
            "index" : this.data.index,
            "item_id": this.data.item.id,
            "qty": this.data.item.qty,
            "modify_reason_id": this.voidReasonForm.value['modifyreason'],
            "inventory_status": this.voidReasonForm.value['inventory_status'],
            "branch_id": this.branch_id,
            "order_id": this.data.orderid
          }
          this.httpService.post('delete-order-item', body)
            .subscribe(result => {
              if (result.status == 200) {
                this.dialogRef.close("deleted")
              } else {
                console.log("Error");
              }
            });
        }
        else {
          this.snackBService.openSnackBar("Incorrect password", "Close")
        }
      }
      else {
        if (this.voidReasonForm.value['password'] == this.supervisorPassword) {
          let body = {
            "cancellation_reason_id": this.voidReasonForm.value['reason'],
            "inventory_status": this.voidReasonForm.value['inventory_status'],
            "branch_id": this.branch_id
          }
          this.httpService.post('order-delete/' + this.data.orderid, body)
            .subscribe(result => {
              if (result.status == 200) {
                this.snackBService.openSnackBar("Order Deleted Successfully!!", "Close");
                this.router.navigate(['home/walkin']);
                this.close();
              } else {
                console.log("Error");
              }
            });
        }
        else {
          this.snackBService.openSnackBar("Incorrect password", "Close")
        }
      }

    }
  }

  close() {
    this.dialogRef.close();
  }

}
