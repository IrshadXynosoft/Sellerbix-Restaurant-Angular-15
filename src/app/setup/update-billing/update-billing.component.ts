import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-billing',
  templateUrl: './update-billing.component.html',
  styleUrls: ['./update-billing.component.scss']
})
export class UpdateBillingComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateBillingComponent>) { }

  ngOnInit(): void {
  }
 close() {
  this.dialogRef.close();
 }
}
