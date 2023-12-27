import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public addLoyaltyForm!: UntypedFormGroup;
  branch_id: any;
  loyaltyArray: any = [];
  point_to_price: any = 0;
  price_to_point: any = 0;
  constructor(private httpService: HttpServiceService, public dialog: MatDialog, public formBuilder: UntypedFormBuilder, public snackBService: SnackBarService, private localService: LocalStorage) {
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.getLoyaltyValues();
    this.onBuildForm();
  }

  onBuildForm() {
    this.addLoyaltyForm = this.formBuilder.group({
      point_to_price: ['', Validators.compose([Validators.required])],
      price_to_point: [1, Validators.compose([Validators.required])],
      loyaltyValue: ['']
    })
    this.addLoyaltyForm.get('loyaltyValue')?.disable();
  }
  getLoyaltyValues() {
    this.httpService.get('loyalty')
      .subscribe(result => {
        if (result.status == 200) {
          this.loyaltyArray = result.data;
          this.point_to_price = this.loyaltyArray['point_to_price'];
          this.price_to_point = this.loyaltyArray['price_to_point'];
          this.addLoyaltyForm.patchValue({
            point_to_price: this.loyaltyArray['point_to_price'],
            price_to_point: this.loyaltyArray['price_to_point']
          })
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  submit() {
    let postparams = {
      point_to_price: this.addLoyaltyForm.value['point_to_price'],
      price_to_point: this.addLoyaltyForm.value['price_to_point'],
      branch_id: this.branch_id
    }
    this.httpService.post('loyalty', postparams)
      .subscribe(result => {
        if (result.status == 200) {
         
          this.snackBService.openSnackBar("Loyalty Added Successfully", "Close");

        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  onChangePriceTopoint(price:any){
    this.price_to_point=price
  }
  onChangePointToprice(price:any){
    this.point_to_price=price
  }
}
