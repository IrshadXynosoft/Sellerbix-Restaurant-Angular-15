import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
@Component({
  selector: 'app-print-daybook-report',
  templateUrl: './print-daybook-report.component.html',
  styleUrls: ['./print-daybook-report.component.scss']
})
export class PrintDaybookReportComponent implements OnInit {
  today_date = moment().format('MMM Do YYYY, h:mm:ss a');
  staff = this.localservice.get('user1');
  branch_id = this.localservice.get('branch_id');
  reportData: any;
  constructor(private dialogService: ConfirmationDialogService, private localservice: LocalStorage, public dialog: MatDialog, public dialogRef: MatDialogRef<PrintDaybookReportComponent>, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { printData: any }) { }

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport() {
    this.httpService.get('generate-report',true)
      .subscribe(result => {
        if (result.status == 200) {
          this.reportData = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }
  close() {
    this.dialogRef.close();
  }

  sendMail() {
    let body = {
      branch_id: this.branch_id
    }
    const options = {
      title: 'Send Mail',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.close()
        this.httpService.post('send-business-day-mail', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }
  
  arrayDataCheck(orders: any) {
    let flag = false;
    if(orders && orders.length>0){
      orders.forEach((obj: any) => {
        if (parseFloat(obj.amount) != 0) {
          flag = true;
        }
      });
    }
    
    return flag;
  }
}
