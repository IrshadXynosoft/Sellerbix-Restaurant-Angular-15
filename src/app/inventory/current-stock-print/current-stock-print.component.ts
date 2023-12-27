import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import moment from 'moment';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-current-stock-print',
  templateUrl: './current-stock-print.component.html',
  styleUrls: ['./current-stock-print.component.scss']
})
export class CurrentStockPrintComponent implements OnInit {
  today_date = moment().format('MMM Do YYYY, h:mm:ss a');
  staff = this.localservice.get('user1');
  branch_id = this.localservice.get('branch_id');
  finishedGoods: any = [];
  ingredients: any = [];
  batchProcessed: any = [];
  branch_name: any = this.localservice.get('branchname');
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private localservice: LocalStorage, public dialog: MatDialog,private snackBService:SnackBarService,
    public dialogRef: MatDialogRef<CurrentStockPrintComponent>, private httpService: HttpServiceService,
    @Inject(MAT_DIALOG_DATA) public data: {business_day_id:any,business_day:any}

  ) { }

  ngOnInit(): void {
    this.getData()
  }

  close() {
    this.dialogRef.close();
  }

  getData() {

   if(this.data.business_day_id){
    this.httpService.get('daybook-stock-details/' + this.data.business_day_id, true)
      .subscribe(result => {
        if (result.status == 200) {
          this.finishedGoods =result.data.finished_good;
          this.ingredients = result.data.ingredient_sub_recipe;
          this.batchProcessed=result.data.recipe;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
    }
    //business_day_id
    //daybook-stock-details/{business_day_id}
    //  this.httpService.get('get-inventory-stock/1/' + this.branch_id, false)
    //   .subscribe(result => {
    //     if (result.status == 200) {
    //       this.finishedGoods = result.data;
    //     } else {
    //       this.snackBService.openSnackBar(result.message, "Close")
    //     }
    //   });
    // this.httpService.get('get-inventory-stock/2/' + this.branch_id, false)
    //   .subscribe(result => {
    //     if (result.status == 200) {
    //       this.ingredients = result.data;
    //     } else {
    //       this.snackBService.openSnackBar(result.message, "Close")
    //     }
    //   });
    // this.httpService.get('batch-production-recipe-stock-on-hand/' + this.branch_id, false)
    //   .subscribe(result => {
    //     if (result.status == 200) {
    //       this.batchProcessed = result.data;
    //     } else {
    //       this.snackBService.openSnackBar(result.message, "Close")
    //     }
    //   });
  }

  qtyCheck(qty: any) {
    if (parseFloat(qty) >= 0) {
      return true
    }
    else {
      return false
    }
  }
}
