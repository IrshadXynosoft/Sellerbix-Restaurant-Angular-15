import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-update-wallet',
  templateUrl: './update-wallet.component.html',
  styleUrls: ['./update-wallet.component.scss']
})
export class UpdateWalletComponent implements OnInit {
  public amountForm!: UntypedFormGroup;
  public numericExpression = '^[+]?[0-9]\\d*(\\.\\d{1,5})?$';
  errorMessages: any = [];
  // branch_id: any = this.localService.get('branch_id')
  constructor(private localService: LocalStorage, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<UpdateWalletComponent>) { }

  ngOnInit(): void {
    this.onBuildForm();
  }

  onBuildForm() {
    this.amountForm = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.pattern(this.numericExpression)])],
      transaction_id: ['', Validators.compose([Validators.required])],
      remarks:['']
    })
  }

  close() {
    this.dialogRef.close();
  }

  addAmount() {
    if (this.amountForm.valid) {
      let body = this.amountForm.value;
      body.key = this.localService.get('driverPoolKey');
      this.httpService.driver_pool_post('update-branch-wallet', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.dialogRef.close("done")
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
  }
}

