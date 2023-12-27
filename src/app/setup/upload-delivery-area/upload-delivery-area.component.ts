import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-delivery-area',
  templateUrl: './upload-delivery-area.component.html',
  styleUrls: ['./upload-delivery-area.component.scss']
})
export class UploadDeliveryAreaComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<UploadDeliveryAreaComponent>) { }

  ngOnInit(): void {
  }
 close() {
  this.dialogRef.close();
 }
}
