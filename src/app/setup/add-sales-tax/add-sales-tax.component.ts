import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-add-sales-tax',
  templateUrl: './add-sales-tax.component.html',
  styleUrls: ['./add-sales-tax.component.scss']
})
export class AddSalesTaxComponent implements OnInit {
  public taxForm!: UntypedFormGroup;
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationFloat = "^[0-9]{1,5}(?:\.[0-9]{1,3})?$";
  requestErrorArray: any = []
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddSalesTaxComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService
    , @Inject(MAT_DIALOG_DATA) public data: { branch_id: string }) { }

  ngOnInit(): void {
    this.onBuildForm();

  }
  onBuildForm() {
    this.taxForm = this.formBuilder.group({
      tax_name: ['', Validators.compose([Validators.required, Validators.maxLength(75), Validators.pattern(this.validationExpression)])],
      rate: ['', [Validators.required, Validators.pattern(this.validationFloat)]],
      is_default: false,
      type: ['', [Validators.required]],
      subs: this.formBuilder.array([]),
    });
  }

  private addSubs(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      rate: ['', Validators.required]
    });
  }

  get Subs() {
    return this.taxForm.controls["subs"] as FormArray;
  }

  addOneMoreSub(): void {
    this.Subs.push(this.addSubs())
  }

  deleteSub(index: any) {
    this.Subs.removeAt(index)
  }

  addTax() {
    let total: any = 0;
    this.Subs.value?.forEach((obj: any) => {
      total = parseFloat(total) + parseFloat(obj.rate)
    });
    if (this.Subs.value.length > 0 && (parseFloat(total) != parseFloat(this.taxForm.value['rate']))) {
      this.snackBService.openSnackBar("Tax rate should be equal to sum of split tax rates", "Close")
    }
    else {
      let post = {
        tax_name: this.taxForm.value['tax_name'],
        rate: this.taxForm.value['rate'],
        is_default: this.taxForm.value['is_default'],
        branch_id: this.data.branch_id,
        type: this.taxForm.value['type'],
        subs: this.taxForm.value['subs']
      }
      this.httpService.post('tax', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            this.requestErrorArray = result.data;
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
