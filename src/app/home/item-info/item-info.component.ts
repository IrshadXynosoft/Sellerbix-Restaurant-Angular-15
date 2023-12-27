import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { item:any },public dialog: MatDialog, public dialogRef: MatDialogRef<ItemInfoComponent>) { }

  ngOnInit(): void {
    this.getItemInfo();
  }
  close() {
    this.dialogRef.close();
  }
  getItemInfo(){
    // console.log(this.data.item);
    
  }
}
