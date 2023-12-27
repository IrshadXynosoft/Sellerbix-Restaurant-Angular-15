import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crm-order-confirmation',
  templateUrl: './crm-order-confirmation.component.html',
  styleUrls: ['./crm-order-confirmation.component.scss']
})
export class CrmOrderConfirmationComponent implements OnInit {
  pickupFlag: boolean = false;
  print_flag:boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(@Inject(MAT_DIALOG_DATA) public data: { items: any, total: any, customerDetails: any, url: any, orderno: any, customEntityFlag: any, Cart: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<CrmOrderConfirmationComponent>) { }

  ngOnInit(): void {
    if (this.data.url == "/home/crm/pickup/new_order" || this.data.url == "/home/crm/pickup/edit_order/" + this.data.orderno) {
      this.pickupFlag = true;
    }
    else {
      this.pickupFlag = false;
    }
  }
  close() {
    this.dialogRef.close();
  }
  modifiercheck(modifierList: any) {
    let flag = false;
    for (let list of modifierList) {
      if (list.status) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }
  confirm() {
    this.print_flag = false;
    this.dialogRef.close(this.print_flag)
  }
  confirmWithPrint() {
    this.print_flag = true;
    this.dialogRef.close(this.print_flag)
  }
}
