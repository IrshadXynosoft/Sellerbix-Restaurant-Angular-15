import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from '../_services/http-service.service';
import { LocalStorage } from '../_services/localstore.service';
import { SnackBarService } from '../_services/snack-bar.service';

@Component({
  selector: 'app-online-order-cancellation-reason',
  templateUrl: './online-order-cancellation-reason.component.html',
  styleUrls: ['./online-order-cancellation-reason.component.scss']
})
export class OnlineOrderCancellationReasonComponent implements OnInit {
  constructor(private localservice:LocalStorage ,@Inject(MAT_DIALOG_DATA) public data: { order_id: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<OnlineOrderCancellationReasonComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }
  public cancelForm!: UntypedFormGroup;
  modifierRecords: any = [];
  supervisorPassword: any;
  branch_id = this.localservice.get('branch_id');
  ngOnInit(): void {
    this.cancelForm = this.formBuilder.group({
     remarks: ['']
    })
  
  }

  

  close() {
    this.dialogRef.close();
  }

  cancelOrder() {
    if (this.cancelForm.valid) {
      let post = {
        cancellation_reason_id: 1,
        order_id: this.data.order_id,
        remarks: this.cancelForm.value['remarks'],
        inventory_status: 1,
        branch_id:this.branch_id
      }
      
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

  }
}