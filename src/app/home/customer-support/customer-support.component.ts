import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.scss']
})
export class CustomerSupportComponent implements OnInit {
  customer_support: any = this.localService.get('customer_support') ? this.localService.get('customer_support') : null
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<CustomerSupportComponent>, public localService: LocalStorage) { }

  ngOnInit(): void {
  }


  close() {
    this.dialogRef.close();
  }

}
