import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
//import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { Preloader } from 'src/app/shared/preloader/preloader.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-export-discount',
  templateUrl: './export-discount.component.html',
  styleUrls: ['./export-discount.component.scss']
})
export class ExportDiscountComponent implements OnInit {
  // exportAsConfig: ExportAsConfig = {
  //   type: 'pdf', // the type you want to download
  //   elementIdOrContent: 'myTableElementId', // the id of html/table element
  //   // options: { // html-docx-js document options
  //   //   orientation: 'landscape',
  //   //   margins: {
  //   //     top: '20'
  //   //   }
  //   // }
  // }
  branchName = this.localservice.get('branchname');
  currency_symbol = localStorage.getItem('currency_symbol');
  orderDiscounts: any = [];
  itemDiscounts: any = [];
  constructor(private preloader: Preloader,
    private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<ExportDiscountComponent>, @Inject(MAT_DIALOG_DATA) public data: { dataSource: any, datePeriod: any }) { }
  ngOnInit(): void {
    this.orderDiscounts = this.data.dataSource.order_discount;
    this.itemDiscounts = this.data.dataSource.item_discount;

  }

  close() {
    this.dialogRef.close();
  }

  currentTime() {
    return moment().format('LT')
  }

  currentDay() {
    return moment().format('LL')
  }

  // downloadPdf() {
  //   this.preloader.start();
  //   // download the file using old school javascript method
  //   this.exportAsService.save(this.exportAsConfig, 'discountsReport').subscribe(() => {
  //     // save started 
  //   });
  //   this.preloader.stop();
  // }
}
