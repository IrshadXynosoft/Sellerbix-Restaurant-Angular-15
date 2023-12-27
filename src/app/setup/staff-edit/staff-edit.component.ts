import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MapUserPrinterComponent } from '../map-user-printer/map-user-printer.component';


@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})
export class StaffEditComponent implements OnInit {
  roleRecords: any = [];
  branchRecords: any = [];
  public editForm!: UntypedFormGroup;
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  // public passwordval ="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$";
  public cardval = "^[0-9]{10,14}$";
  public imagepattern = "";
  public phoneval = '[- +()0-9]{8,16}';
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$";
  errorMessages: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: any,user_id:any, swipe_card_no: any, email: any, tenant_id: any, role_id: any, name: any, number: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<StaffEditComponent>, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private httpService: HttpServiceService, private dialogService: ConfirmationDialogService) { }

  staffArray: any = [];
  ngOnInit(): void {
    this.onBuildForm();
    this.getStaff();
    this.getRole();
    this.getBranch();

  }
  onBuildForm() {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpression), Validators.maxLength(75)])],
      contact_no: ['', Validators.compose([Validators.required, Validators.pattern(this.phoneval)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      //  password:['',Validators.compose([Validators.required])],
      swipe_card_no: [''],
      branch_id: ['', Validators.compose([Validators.required])],
      role_id: ['', Validators.compose([Validators.required])],
      image: ['', Validators.compose([Validators.required])],

    })
  }
  close() {
    this.dialogRef.close();
  }
  getStaff() {
    this.httpService.get('staff/' + this.data.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.staffArray = result.data;
          this.editForm.patchValue({
            name: this.staffArray.user.name,
            contact_no: this.staffArray.user.contact_no,
            email: this.staffArray.user.email,
            swipe_card_no: this.staffArray.swipe_card_no,
            branch_id: this.staffArray.user.branch_id,
            role_id: this.staffArray.user.role_id,
          })
        } else {
          console.log("Error in staff");
        }
      });
  }
  getRole() {
    this.httpService.get('role', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.roleRecords = result.data.roles;
        } else {
          console.log("Error in Get role");
        }
      });
  }
  getBranch() {
    this.httpService.get('branch', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  staffActivateStatus() {
    const changingStatus = this.staffArray.status == 1 ? 0 : 1;
    const options = {
      title: this.staffArray.status == 1 ? 'Deactivate' : 'Activate',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('staff-status/' + changingStatus + '/' + this.data.id, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.close()
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    })
  }

  resetPassword() {
    const options = {
      title: 'Reset Password',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('reset-staff-password/' + this.data.id, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.close()
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }

  editStaff() {
    let post = {
      'name': this.editForm.value['name'],
      'contact_no': this.editForm.value['contact_no'],
      'email': this.editForm.value['email'],
      'swipe_card_no': this.editForm.value['swipe_card_no'],
      'branch_id': this.editForm.value['branch_id'],
      'role_id': this.editForm.value['role_id'],
      'image': this.editForm.value['image'],

    }
    this.httpService.put('staff' + '/' + this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Staff Updated Successfully!!", "Close");
          this.close();
        } else {
          if (result.data) {
            this.errorMessages = result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  assignPrinters() {
    this.close()
    const dialogRef = this.dialog.open(MapUserPrinterComponent, {
      width: '800px',
      data: {
        user_id: this.data.user_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
