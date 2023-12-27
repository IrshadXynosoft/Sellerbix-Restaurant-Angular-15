import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-show-commission-details',
  templateUrl: './show-commission-details.component.html',
  styleUrls: ['./show-commission-details.component.scss']
})
export class ShowCommissionDetailsComponent implements OnInit {
  records: any = [];
  allnotsettleFlag : boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private dialogService: ConfirmationDialogService, private snackBService: SnackBarService, private httpService: HttpServiceService, @Inject(MAT_DIALOG_DATA) public data: { driverId: any }, public dialogRef: MatDialogRef<ShowCommissionDetailsComponent>) { }

  ngOnInit(): void {
    this.getDetails();
  }

  close() {
    this.dialogRef.close();
  }

  getDetails() {
    this.httpService.get('driver-history/'+this.data.driverId, false)
      .subscribe(result => {
        if (result.status == 200) {
          result.data.earnings_history.forEach((obj:any) => {
            if(obj.payment_status == 2){
              this.allnotsettleFlag = true;
              this.records.push(obj)
            }
          });
          this.records.reverse();
        } else {
          console.log("Error");
        }
      });
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  settle(id: any) {
    const options = {
      title: 'Settle',
      message: 'Are you sure to settle this Order ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('commission-settle/'+id, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Commision amount settled successfully", "Close");
              this.close()
            } else {
              console.log("Error");
            }
          });
      }
    });
  }

  settleAll() {
    const options = {
      title: 'Settle',
      message: 'Are you sure to settle all Orders ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('commission-settle-all/'+this.data.driverId, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("All invoices settled successfully", "Close");
              this.close()
            } else {
              console.log("Error");
            }
          });
      }
    });
  }

}