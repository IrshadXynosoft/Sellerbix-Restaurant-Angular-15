import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-loyalty-group',
  templateUrl: './add-loyalty-group.component.html',
  styleUrls: ['./add-loyalty-group.component.scss']
})
export class AddLoyaltyGroupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { operation: any, id: any, name: any }, private httpService: HttpServiceService, private snackBService: SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddLoyaltyGroupComponent>, public formBuilder: UntypedFormBuilder) { }
  public addLoyaltyForm!: UntypedFormGroup
  loyaltyErrors: any = [];
  ngOnInit(): void {
    this.onBuildForm();
    if (this.data?.operation == 'edit') {
      this.setData()
    }
  }

  onBuildForm() {
    this.addLoyaltyForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75)])],
    });
  }

  setData() {
    this.addLoyaltyForm.patchValue({
      'name': this.data.name
    })
  }

  close() {
    this.dialogRef.close();
  }

  addLoyaltyGroup() {
    if (this.addLoyaltyForm.valid) {
      let post = this.addLoyaltyForm.value;
      this.httpService.post('loyalty-group', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            if (result.data) {
              this.loyaltyErrors = result.data;
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  updateLoyaltyGroup() {
    if (this.addLoyaltyForm.valid) {
      let post = this.addLoyaltyForm.value;
      this.httpService.put('loyalty-group/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            if (result.data) {
              this.loyaltyErrors = result.data;
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }
}
