import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {
  profileForm!:UntypedFormGroup
  profileImage: any | ArrayBuffer = null;
   public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
   public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
   public phoneval = '[- +()0-9]{8,16}';
   supplierErrorArray:any=[];
   staffDetails:any=this.localStorage.get('staff')
  constructor(public localStorage:LocalStorage,public dialog: MatDialog, public dialogRef: MatDialogRef<ProfileUpdateComponent>,private formBuilder:UntypedFormBuilder,private httpService: HttpServiceService, private snackBService: SnackBarService) {
     this.dialogRef.disableClose=true;
  }
  ngOnInit(): void {
    
     this.onBuildForm();
     this.patchValues();
   }
   onBuildForm()
   {
    this.profileForm=this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      file: [''],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      contact_no:['', Validators.compose([Validators.required, Validators.pattern(this.phoneval)])],
      old_password:[''],
      new_password:[''],
    })
    
   }
   patchValues(){
    this.profileForm.patchValue({
      name:this.staffDetails.name,
      email:this.staffDetails.email,
      contact_no:this.staffDetails.contact_no
    })
   }

   close() {
     this.dialogRef.close();
   }

   supplierSubmit()
   {
     if(this.profileForm.value['old_password'] && !this.profileForm.value['new_password']){

      this.snackBService.openSnackBar("Please enter both old and new password to change passsword", "Close");
     }
     else if(this.profileForm.value['new_password'] && !this.profileForm.value['old_password']){
     
      this.snackBService.openSnackBar("Please enter both old and new password to change passsword", "Close");
     }
    else{
      let post:any = {
        'name': this.profileForm.value['name'],
        'contact_no': this.profileForm.value['contact_no'],
        'email': this.profileForm.value['email'],
        'image':this.profileImage,
        'branch_id':this.localStorage.get('branch_id')
        }
        if(this.profileForm.value['old_password'] && this.profileForm.value['new_password'])
        {
          post['old_password']= this.profileForm.value['old_password']
          post['new_password']= this.profileForm.value['new_password']
        }
      this.httpService.put('staff' + '/' + this.staffDetails.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Staff Updated Successfully!!", "Close");
            this.close();
          } else {
            
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
      
      

   }
   handleFileInputRegular(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.profileImage = reader.result?.toString();
     
     };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
   
    
  }
  }