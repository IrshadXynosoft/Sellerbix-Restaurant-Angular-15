import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-add-modifier-group',
  templateUrl: './add-modifier-group.component.html',
  styleUrls: ['./add-modifier-group.component.scss']
})
export class AddModifierGroupComponent implements OnInit {
  constructor(private httpService:HttpServiceService,private snackBService:SnackBarService,public dialog: MatDialog, public dialogRef: MatDialogRef<AddModifierGroupComponent>,public formBuilder:UntypedFormBuilder) { }

  public addModifierGroupForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  modifierErrors:any=[];
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addModifierGroupForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      secondary_name:[''],
      priority: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      type:['']
    });
  }
 close() {
  this.dialogRef.close();
 }
 addModifierGroup(){
   if(this.addModifierGroupForm.valid){
  let post = this.addModifierGroupForm.value;
  post.type = this.addModifierGroupForm.value['type'] ? 1 : 0;
  this.httpService.post('modifier-group', post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Modifier Group Added Successfully!!", "Close");
        this.close();
      } else {
        if(result.data){
          this.modifierErrors=result.data;
        }
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
 }
}
}
