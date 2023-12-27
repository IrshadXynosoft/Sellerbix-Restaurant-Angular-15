import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/_services/data.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-bulk-order-details',
  templateUrl: './bulk-order-details.component.html',
  styleUrls: ['./bulk-order-details.component.scss']
})
export class BulkOrderDetailsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(@Inject(MAT_DIALOG_DATA) public data: { Orders: any },public dialog: MatDialog, public dialogRef: MatDialogRef<BulkOrderDetailsComponent>,private localservice:LocalStorage, private dataservice:DataService) { }

  ngOnInit(): void {
    console.log(this.data.Orders);
  }

  close() {
    this.dialogRef.close();
   }

   modifiercheck(modifierList:any) {
    let flag = false;
    for(let list of modifierList){
      if (list.status) {
        flag =  true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }
}
