import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-edit-modifier-group',
  templateUrl: './edit-modifier-group.component.html',
  styleUrls: ['./edit-modifier-group.component.scss']
})
export class EditModifierGroupComponent implements OnInit {
  ErrorArray:any=[];
  public editModifierGroupForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: any,payment_reference:any,name:any,secondary_name:any,type:any,priority:any},private httpService:HttpServiceService,private snackBService:SnackBarService,public dialog: MatDialog, public dialogRef: MatDialogRef<EditModifierGroupComponent>,public formBuilder:UntypedFormBuilder) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.editModifierGroupForm = this.formBuilder.group({
      name: [this.data.name, Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      secondary_name:[this.data.secondary_name],
      priority: [this.data.priority, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      type:[this.data.type]
    });
  }
  close() {
    this.dialogRef.close();
   }
   editModifierGroup(){
    let post = this.editModifierGroupForm.value;
    this.httpService.put('modifier-group' + '/' +this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Modifier Group Updated Successfully!!", "Close");
          this.close();
        } else {
          if(result.data){
            this.ErrorArray=result.data
          }
         this.snackBService.openSnackBar(result.message, "Close");
        }
      });
   }
}
