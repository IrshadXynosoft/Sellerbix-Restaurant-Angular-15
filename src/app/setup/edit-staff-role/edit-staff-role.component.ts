import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-edit-staff-role',
  templateUrl: './edit-staff-role.component.html',
  styleUrls: ['./edit-staff-role.component.scss']
})
export class EditStaffRoleComponent implements OnInit {
  public staffroleForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  requestErrorArray:any=[]
  menuArray:any=[];
  menuPermissionArray:any=[];
  menuPagesPermissionArray:any=[];
  showrequired:boolean;
  staffRoleArray:any=[];
  selectedPermission: any = [];
  permissionsArray: any = [];
  userPermission: any = [];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditStaffRoleComponent>,public formBuilder:UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,@Inject(MAT_DIALOG_DATA) public data: { id: string }) {
    this.showrequired=false;
  }

 ngOnInit(): void {
   this.onBuildForm();
   this.getPermission();
   
  

 }
 getMenu()
 {
   this.httpService.get('menu',false)
   .subscribe(result => {       
   if (result.status == 200) {
    this.menuArray=result.data;
    this.getStaffRole();
    }
    else{
     this.snackBService.openSnackBar(result.message, "Close");
   }
 }); 
 }
 getStaffRole()
 {
  this.httpService.get('role/' + this.data.id,false)
  .subscribe(result => {       
  if (result.status == 200) {
    this.staffRoleArray=result.data;
    this.userPermission=this.staffRoleArray['permission_id']
    
    this.permissionsArray.forEach((obj: any) => {
      for (let i = 0; i < this.userPermission.length; i++) {
        if (this.userPermission[i] == obj.id) {
          obj.checked = true;
        }
      }
    });
     
    this.staffroleForm.patchValue(
      {
        rolename:this.staffRoleArray['role'].name,
        startpage:this.staffRoleArray['role'].start_page
      }
    )
    this.menuPagesPermissionArray=this.staffRoleArray['page_id']
    this.menuPermissionArray=this.staffRoleArray['menu_id']
    {
     let menu=this.staffRoleArray['menu_id']
     let page=this.staffRoleArray['page_id']
        this.menuArray.forEach((obj:any) => {
          for(let i=0;i<menu.length;i++)
          {
            if(menu[i]==obj.id){
              obj.checked=true;
            }
          }
          for(let i=0;i<page.length;i++)
          {
            obj.menu_page.forEach((objdata:any)=>{
              if(page[i]==objdata.id){
                objdata.checked=true;
              }
            });
          }
        });
    }
   
   }
   else{
    this.snackBService.openSnackBar(result.message, "Close");
  }
}); 
 }
 onBuildForm() {
   this.staffroleForm = this.formBuilder.group({
     rolename: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
     startpage: [''],
   });
 }
 AddNewStaffRole()
 {
  
  this.permissionsArray.forEach((obj: any) => {
   if(obj.checked)
   {
    this.selectedPermission.push(obj.id)
   }
  });
  
   if(this.menuPermissionArray.length==0 && this.menuPagesPermissionArray.length==0)
   {
      this.showrequired=true;
   }
   else{
     let put_params={
       name:this.staffroleForm.value['rolename'],
       start_page:'dashboard',
       menu_id:this.menuPermissionArray,
       page_id:this.menuPagesPermissionArray,
       permissions: this.selectedPermission
    }
    this.httpService.put('role/'+this.data.id, put_params)
    .subscribe(result => {       
    if (result.status == 200) {
     this.showrequired=false;
     this.snackBService.openSnackBar("Staff role updated", "Close");
     this.close();
    }else{
      this.requestErrorArray=result.data;
      this.snackBService.openSnackBar(result.message, "Close");
    }
  }); 
   }
 
 }
close() {
 this.dialogRef.close();
}
PermissionSelected(event:any,pages_id:any)
{
 
  
 if(event.target.checked)
 {
  this.menuPagesPermissionArray.push(pages_id)
 }
 else{
   if(this.menuPagesPermissionArray.length)
   {
     for(let i=0;i<this.menuPagesPermissionArray.length;i++)
     {
      if(this.menuPagesPermissionArray[i]==pages_id)
      {
        this.menuPagesPermissionArray.splice(i,1)
      }
     
     }
   }
 }
}
menuSelected(event:any,menu_id:any)
{
   if(event.target.checked)
    {
     this.menuPermissionArray.push(menu_id)
    }
    else{
      if(this.menuPermissionArray.length)
      {
        for(let i=0;i<this.menuPermissionArray.length;i++)
        {
        if( this.menuPermissionArray[i]==menu_id)
         this.menuPermissionArray.splice(i,1)
        }
      }
    }
   
}
getPermission() {
  this.httpService.get('permissions', false)
    .subscribe(result => {
      if (result.status == 200) {
        this.permissionsArray = result.data;
        this.getMenu();
      } else {
        console.log("Error in Get permission");
      }
    });
}
permissionSelected(e: any, id: any) {
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
