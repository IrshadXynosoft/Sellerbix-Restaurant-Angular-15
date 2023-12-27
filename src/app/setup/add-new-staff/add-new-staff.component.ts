import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-add-new-staff',
  templateUrl: './add-new-staff.component.html',
  styleUrls: ['./add-new-staff.component.scss']
})
export class AddNewStaffComponent implements OnInit {
  roleRecords: any = [];
  branchRecords: any = [];
  public addstaffForm!: UntypedFormGroup;
  errorMessages:any = [];
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  // public passwordval = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$";
  public cardval = "^[0-9]{12,14}$";
  public phoneval ='[- +()0-9]{8,16}';
  public imagepattern = ""
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddNewStaffComponent>, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService) { }
  ngOnInit(): void {
    this.onBuildForm();
    this.getRole();
    this.getBranch();
  
  }
  close() {
    this.dialogRef.close();
  }
  onBuildForm() {
    this.addstaffForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      contact_no: ['', Validators.compose([Validators.required, Validators.pattern(this.phoneval)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required])],
      swipe_card_no: ['', Validators.pattern(this.cardval)],
      branch_id: ['', Validators.compose([Validators.required])],
      role_id: ['', Validators.compose([Validators.required])],
      image: [''],
    })
  }
  addstaff() {
    let post = {
      'name':this.addstaffForm.value['name'],
      'contact_no':this.addstaffForm.value['contact_no'],
      'email':this.addstaffForm.value['email'],
      'password':this.addstaffForm.value['password'],
      'swipe_card_no':this.addstaffForm.value['swipe_card_no'],
      'branch_id':this.addstaffForm.value['branch_id'],
      'role_id':this.addstaffForm.value['role_id'],
      'image':this.addstaffForm.value['image'],
     
    }
    this.httpService.post('staff', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Staff Added Successfully!!", "Close");
          this.close();
        } else {
          if(result.data){
            this.errorMessages=result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  getRole() {
    this.httpService.get('role',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.roleRecords = result.data.roles;
        } else {
          console.log("Error in Get role");
        }
      });
  }



  getBranch() {
    this.httpService.get('branch',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

 

}

