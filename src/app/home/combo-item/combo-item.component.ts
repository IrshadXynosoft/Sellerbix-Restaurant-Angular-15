import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-combo-item',
  templateUrl: './combo-item.component.html',
  styleUrls: ['./combo-item.component.scss']
})
export class ComboItemComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { comboItems: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<ComboItemComponent>) { }
  groupeditemsarray: any = []
  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
 
  comboSelect(Comboitem: any) {
    this.dialogRef.close(Comboitem);
  }
}