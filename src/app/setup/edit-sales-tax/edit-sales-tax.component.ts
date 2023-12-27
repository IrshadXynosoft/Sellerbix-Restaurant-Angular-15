import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, FormArray, FormGroup } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-sales-tax',
  templateUrl: './edit-sales-tax.component.html',
  styleUrls: ['./edit-sales-tax.component.scss']
})
export class EditSalesTaxComponent implements OnInit {
  public taxForm!: UntypedFormGroup;
  taxArray: any = []
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationFloat = "^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  requestErrorArray: any = [];
  typeSelected: any = []
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditSalesTaxComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { taxId: string, branch_id: string }, private router: Router) { }
  ngOnInit(): void {

    this.getTax();
    this.onBuildForm();

  }
  onBuildForm() {
    this.taxForm = this.formBuilder.group({
      tax_name: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpression), Validators.maxLength(75)])],
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

  getTax() {
    this.httpService.get('tax/' + this.data.taxId, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.taxArray = result.data;
          this.taxForm.patchValue({
            tax_name: this.taxArray.tax_name,
            rate: this.taxArray.rate,
            is_default: this.taxArray.is_default,
            type: this.taxArray.type
          })
          this.typeSelected = this.taxArray.type;
          if (this.taxArray.tax_split.length > 0) {
            this.deleteSub(0);
          }
          this.taxArray.tax_split?.forEach((obj: any) => {
            let objData = {
              'name': obj.name,
              'rate': obj.rate,
            }
            let items = this.taxForm.get('subs') as FormArray;
            items.push(this.createItem(objData));
          });
        } else {
          console.log("Error in tax");
        }
      });
  }

  createItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  editTax() {
    let total: any = 0;
    this.Subs.value?.forEach((obj: any) => {
      total = parseFloat(total) + parseFloat(obj.rate)
    });
    if (this.Subs.value.length > 0 && (parseFloat(total) != parseFloat(this.taxForm.value['rate']))) {
      this.snackBService.openSnackBar("Tax rate should be equal to sum of split tax rates", "Close")
    }
    else {
      let put = {
        tax_name: this.taxForm.value['tax_name'],
        rate: this.taxForm.value['rate'],
        is_default: this.taxForm.value['is_default'],
        branch_id: this.data.branch_id,
        type: this.taxForm.value['type'],
        subs: this.taxForm.value['subs']
      }
      this.httpService.put('tax/' + this.data.taxId, put)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Tax updated successfully", "Close");
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
