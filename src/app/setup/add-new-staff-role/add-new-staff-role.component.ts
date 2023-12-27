import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-add-new-staff-role',
  templateUrl: './add-new-staff-role.component.html',
  styleUrls: ['./add-new-staff-role.component.scss']
})
export class AddNewStaffRoleComponent implements OnInit {
  public staffroleForm!: UntypedFormGroup;
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  requestErrorArray: any = []
  menuArray: any = [];
  menuPermissionArray: any = [];
  menuPagesPermissionArray: any = [];
  showrequired: boolean;
  permissionsArray:any=[];
  selectedPermission:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddNewStaffRoleComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) {
    this.showrequired = false;
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getPermission();
    this.getMenu();
  
  }
  getMenu() {
    this.httpService.get('menu',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuArray = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  onBuildForm() {
    this.staffroleForm = this.formBuilder.group({
      rolename: ['', Validators.compose([Validators.required, Validators.maxLength(75), Validators.pattern(this.validationExpression)])],
      startpage: [''],
    });
  }
  getPermission() {
    this.httpService.get('permissions',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.permissionsArray= result.data;
        } else {
          console.log("Error in Get permission");
        }
      });
  }
  AddNewStaffRole() {
    this.permissionsArray.forEach((obj: any) => {
      if(obj.checked)
      {
       this.selectedPermission.push(obj.id)
      }
     });
    if (this.menuPermissionArray.length == 0 && this.menuPagesPermissionArray.length == 0) {
      this.showrequired = true;
    }
    else {
      let post = {
        name: this.staffroleForm.value['rolename'],
        start_page: 'dashboard',
        menu_id: this.menuPermissionArray,
        page_id: this.menuPagesPermissionArray,
        permissions: this.selectedPermission
      }
      this.httpService.post('role', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.showrequired = false;
            this.snackBService.openSnackBar("Staff role added", "Close");
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
  PermissionSelected(event: any, pages_id: any) {

    if (event.target.checked) {
      this.menuPagesPermissionArray.push(pages_id)
    }
    else {
      if (this.menuPagesPermissionArray.length) {
        for (let i = 0; i < this.menuPagesPermissionArray.length; i++) {
          if (this.menuPagesPermissionArray[i] == pages_id)
            this.menuPagesPermissionArray.slice(i, 1)
        }
      }
    }

  }
  menuSelected(event: any, menu_id: any) {
    if (event.target.checked) {
      this.menuPermissionArray.push(menu_id)
    }
    else {
      if (this.menuPermissionArray.length) {
        for (let i = 0; i < this.menuPermissionArray.length; i++) {
          if (this.menuPermissionArray[i] == menu_id)
            this.menuPermissionArray.slice(i, 1)
        }
      }
    }

  }
  permissionSelected(e:any,id:any){
    var found = this.permissionsArray.find(function (obj: any) {
      return obj.id == id;
    });
   if (found && e.target.checked) {
     found.checked=true;
    }
    else {
      found.checked=false;
    }
   
  }
}
