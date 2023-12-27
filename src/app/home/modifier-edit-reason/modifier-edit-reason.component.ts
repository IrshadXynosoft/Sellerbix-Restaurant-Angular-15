import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-modifier-edit-reason',
  templateUrl: './modifier-edit-reason.component.html',
  styleUrls: ['./modifier-edit-reason.component.scss']
})
export class ModifierEditReasonComponent implements OnInit {
  public modifyReasonForm!: UntypedFormGroup;
  modifierRecords: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: any }, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<ModifierEditReasonComponent>, private snackBservice: SnackBarService) { }

  ngOnInit(): void {
    this.getModifyReason();
    this.onBuildForm();
  }

  onBuildForm() {
    this.modifyReasonForm = this.formBuilder.group({
      reason: ['', Validators.compose([Validators.required])],
    })
  }

  getModifyReason() {
    this.httpService.get('modify-reason', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.modifierRecords = result.data.modifier_reasons;
        } else {
          console.log("Error");
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  modifyItem() {
    if (this.modifyReasonForm.valid) {
      this.dialogRef.close(this.modifyReasonForm.value);
    }
    else {
      this.snackBservice.openSnackBar("Please select reason", "Close")
    }
  }

}
