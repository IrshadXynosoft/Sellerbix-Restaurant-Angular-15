import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';


@Component({
  selector: 'app-sales-report-item-details',
  templateUrl: './sales-report-item-details.component.html',
  styleUrls: ['./sales-report-item-details.component.scss']
})
export class SalesReportItemDetailsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  staff = this.localservice.get('user1');
  constructor(private snackBService: SnackBarService, private httpService: HttpServiceService, private localservice: LocalStorage, private dataservice: DataService, private router: Router, @Inject(MAT_DIALOG_DATA) public data: { Orders: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<SalesReportItemDetailsComponent>) { }

  ngOnInit(): void {
    // this.getOrderDetails()
  }

  // getOrderDetails() {
  //   this.httpService.get('orders/'+ this.data.Orders.id, false).subscribe((result) => {
  //     if (result.status == 200) {
  //       this.data.Orders = JSON.parse(result.data.order_json);
  //       console.log(this.data.Orders)
  //     } else {
  //       console.log('Error');
  //     }
  //   });
  // }

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

}
