import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from '../../../_services/http-service.service';
import { LocalStorage } from '../../../_services/localstore.service';
import { SnackBarService } from '../../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-delete-menu',
  templateUrl: './delete-menu.component.html',
  styleUrls: ['./delete-menu.component.scss']
})
export class DeleteMenuComponent implements OnInit {

  constructor(private dialogService: ConfirmationDialogService, private localservice: LocalStorage, @Inject(MAT_DIALOG_DATA) public data: { id: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<DeleteMenuComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }
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
        this.httpService.delete('item/' + this.data.id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Menu Deleted Successfully", "Close");
              this.dialogRef.close('done');
            } else {
              this.close()
              const options = {
                title: 'Alert',
                message: result.message,
                confirmText: 'Ok'
              };
              this.dialogService.notification(options);
            }
          });
      }
      else {
        this.snackBService.openSnackBar("Incorrect password", "Close")
      }
    }

  }
}
