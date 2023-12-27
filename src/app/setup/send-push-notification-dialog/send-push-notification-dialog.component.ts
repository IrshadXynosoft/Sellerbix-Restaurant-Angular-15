import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-send-push-notification-dialog',
  templateUrl: './send-push-notification-dialog.component.html',
  styleUrls: ['./send-push-notification-dialog.component.scss']
})
export class SendPushNotificationDialogComponent implements OnInit {
  public notificationForm!: UntypedFormGroup;
  ErrorArray: any = [];
  selectedType:any ;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: any ,flag :any},public dialog: MatDialog, public dialogRef: MatDialogRef<SendPushNotificationDialogComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getEditData();
  }

  onBuildForm() {
    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(75)])],
      message: ['', Validators.compose([Validators.required,])],
      type: ['', Validators.compose([Validators.required,])]
    });
  }

  close() {
    this.dialogRef.close();
  }

  getEditData() {
    if(this.data.flag == 'edit' ){
      this.httpService.get('customer-push-notification/' + this.data.id,false)
      .subscribe(result => {
        if (result.status == 200) {
          this.notificationForm.patchValue({
            'title': result.data.notifications.title ,
            'message':  result.data.notifications.message,
            'type' : result.data.notifications.type
          })
          this.selectedType = result.data.notifications.type;
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
    }
  }

  sendNotification() {
      if(this.data.flag == 'edit'){
        this.httpService.put('customer-push-notification/' + this.data.id, this.notificationForm.value)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Push notification sent successfully.", "Close");
              this.close();
            } else {
              if (result.data) {
                this.ErrorArray = result.data
              }
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
      else{
        this.httpService.post('customer-push-notification', this.notificationForm.value)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Push notification sent successfully.", "Close");
              this.close();
            } else {
              if (result.data) {
                this.ErrorArray = result.data
              }
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
        }
  }
}
