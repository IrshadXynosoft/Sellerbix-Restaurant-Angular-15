import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(private dialogService: ConfirmationDialogService, private localservice: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { id: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<DeleteConfirmationComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }
  public deleteForm!: UntypedFormGroup;
  supervisorPassword: any;

  ngOnInit(): void {
    this.deleteForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
    })
    this.getPassword()
  }

  getPassword() {
    this.httpService.get('settings', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.supervisorPassword = result.data.settings?.supervisor_password
        } else {
          console.log("Error");
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  deleteConfirm() {
    if (this.deleteForm.valid) {
      if (this.deleteForm.value['password'] == this.supervisorPassword) {
        this.dialogRef.close('close')
      }
      else {
        this.snackBService.openSnackBar("Incorrect password", "Close")
      }
    }

  }
}
