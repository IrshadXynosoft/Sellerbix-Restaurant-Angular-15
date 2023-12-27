import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.scss']
})
export class ManageMenuComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ManageMenuComponent>) { }

  ngOnInit(): void {
  }
 close() {
  this.dialogRef.close();
 }
 remove() {
   
 }
}
