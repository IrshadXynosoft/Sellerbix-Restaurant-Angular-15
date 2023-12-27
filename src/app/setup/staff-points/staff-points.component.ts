import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-staff-points',
  templateUrl: './staff-points.component.html',
  styleUrls: ['./staff-points.component.scss']
})
export class StaffPointsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public staffPointForm!: UntypedFormGroup;
  branch_id: any;
  pointArray: any = [];
  constructor(private httpService: HttpServiceService, public dialog: MatDialog, public formBuilder: UntypedFormBuilder, public snackBService: SnackBarService, private localService: LocalStorage) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.getLoyaltyValues();
    this.onBuildForm();
  }

  onBuildForm() {
    this.staffPointForm = this.formBuilder.group({
      point_to_amount: ['', Validators.compose([Validators.required])],
      amount_to_point: ['', Validators.compose([Validators.required])],
      loyaltyValue: ['']
    })
    this.staffPointForm.get('loyaltyValue')?.disable();
  }
  getLoyaltyValues() {
    this.httpService.get('staff-point')
      .subscribe(result => {
        if (result.status == 200) {
          this.pointArray = result.data;
          if(this.pointArray){
            this.staffPointForm.patchValue({
              point_to_amount: this.pointArray['point_to_amount'],
              amount_to_point: this.pointArray['amount_to_point']
            })
          }
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  submit() {
    let postparams = {
      point_to_amount: this.staffPointForm.value['point_to_amount'],
      amount_to_point: this.staffPointForm.value['amount_to_point'],
      branch_id: this.branch_id
    }
    this.httpService.post('staff-point', postparams)
      .subscribe(result => {
        if (result.status == 200) {

          this.snackBService.openSnackBar("Staff Point Added Successfully", "Close");

        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}

