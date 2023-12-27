import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.scss']
})
export class AddHistoryComponent implements OnInit {

  historyArray: any = [];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddHistoryComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { stock_id: string, item_name: string, branch_id: any, recipe_id: any }, private router: Router, private localService: LocalStorage) {

  }

  ngOnInit(): void {
    if (this.data.stock_id) {
      this.getHistory();
    }
    else if (this.data.recipe_id) {
      this.getHistoryRecipe();
    }

  }
  close() {
    this.dialogRef.close();
  }
  getHistory() {
    this.httpService.get('inventory-history/' + this.data.stock_id + '/' + this.data.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.historyArray = result.data;
        } else {
          console.log("Error in History");
        }
      });

    //inventory-history/7/1
  }
  getHistoryRecipe() {
    this.httpService.get('batch-production-inventory-history/' + this.data.branch_id + '/' + this.data.recipe_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.historyArray = result.data;
        } else {
          console.log("Error in History");
        }
      });
  }
}
