import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-subscription-status-dialog',
  templateUrl: './subscription-status-dialog.component.html',
  styleUrls: ['./subscription-status-dialog.component.scss']
})
export class SubscriptionStatusDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { result: any }, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<SubscriptionStatusDialogComponent>) { }

  ngOnInit(): void {
  }

  
  close() {
    this.localservice.store('subscriptionStatus',false)
    this.dialogRef.close();
  }

}
