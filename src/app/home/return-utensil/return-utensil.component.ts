import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-return-utensil',
  templateUrl: './return-utensil.component.html',
  styleUrls: ['./return-utensil.component.scss']
})
export class ReturnUtensilComponent implements OnInit {
  public utensilsForm!: UntypedFormGroup;
  public validationFloat = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$";
  utensilArray: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ReturnUtensilComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService
    , @Inject(MAT_DIALOG_DATA) public data: { order_id: any, utensil_id: any, max_qty: any, crm_flag: any }) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.utensilsForm = this.formBuilder.group({
      total_qty: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      selling_price: [''],
      damaged_qty: ['0', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    });
  }

  addUtensils() {
    let body = {
      order_id: this.data.order_id,
      utensil_id: this.data.utensil_id,
      qty: this.utensilsForm.value['total_qty'],
      crm_flag: this.data.crm_flag,
      amount_received: this.utensilsForm.value['selling_price'] ? this.utensilsForm.value['selling_price'] : 0,
      damaged_qty: this.utensilsForm.value['damaged_qty']
    }
    if (this.utensilsForm.valid) {
      if (this.utensilsForm.value['total_qty'] <= this.data.max_qty && (parseFloat(this.utensilsForm.value['total_qty']) + parseFloat(this.utensilsForm.value['damaged_qty'])) <= this.data.max_qty) {
        this.httpService.post('update-utensil', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar('Item returned successfully', 'Close');
              this.dialogRef.close(result.data[0])
            } else {
              this.snackBService.openSnackBar("Error!", "Close");
            }
          });
      }
    }
    else {
      this.snackBService.openSnackBar("Invalid Entry", "Close")
    }

  }

  compareQuantity() {
    if (this.utensilsForm.value['damaged_qty'] != 0) {
      if (parseFloat(this.utensilsForm.value['total_qty']) + parseFloat(this.utensilsForm.value['damaged_qty']) <= this.data.max_qty) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  close() {
    this.dialogRef.close();
  }
}
