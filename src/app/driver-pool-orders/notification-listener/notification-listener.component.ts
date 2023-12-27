
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notification-listener',
  templateUrl: './notification-listener.component.html',
  styleUrls: ['./notification-listener.component.scss']
})
export class NotificationListenerComponent implements OnInit {

  messageShown:any;
  constructor(private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<NotificationListenerComponent>, @Inject(MAT_DIALOG_DATA) public data: { order_no: any, status: any ,driver_name:any}) { }

  ngOnInit(): void {
    if(this.data.status == 1){
      this.messageShown = 'Accepted'
    }
    else if(this.data.status == 2){
      this.messageShown = 'Rejected'
    }
    else if(this.data.status == 3){
      this.messageShown = 'Delivered'
    }
    else if(this.data.status == 4) {
      this.messageShown = 'Not delivered'
    }
    else if(this.data.status == 5) {
      this.messageShown = 'Returned'
    }
  }

  close() {
    this.dialogRef.close();
  }

}


