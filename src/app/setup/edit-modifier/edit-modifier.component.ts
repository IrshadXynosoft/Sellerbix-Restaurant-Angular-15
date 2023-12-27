import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Router } from '@angular/router';
import { I } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-edit-modifier',
  templateUrl: './edit-modifier.component.html',
  styleUrls: ['./edit-modifier.component.scss']
})
export class EditModifierComponent implements OnInit {
  ErrorArray:any=[];
  public modifierForm!: UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<EditModifierComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,@Inject(MAT_DIALOG_DATA) public data: {id: string},private router:Router) { }
  modifierArray:any=[]
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.getModifier();
    this.onBuildForm();
  }
  onBuildForm() {
    this.modifierForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      secondary_name:['']
    });
  }
  getModifier()
  {
    this.httpService.get('modifier/'+this.data.id)
    .subscribe(result => {       
      if (result.status == 200) {
        this.modifierArray = result.data;
        if(this.modifierArray)
        {
          this.modifierForm.patchValue({
            name:this.modifierArray.name,
            secondary_name:this.modifierArray.secondary_name
          })
        }
        
        } else {
          console.log("Error in modifier");
        }
  });  
  }
  editModifier()
  {
    
    let put=this.modifierForm.value;
    this.httpService.put('modifier/'+this.data.id, put)
    .subscribe(result => {       
    if (result.status == 200) {
    
     this.snackBService.openSnackBar("Modifier updated Successfully", "Close");
     this.close();
    }else{
      if(result.data){
        this.ErrorArray=result.data
      }
      this.snackBService.openSnackBar(result.message, "Close");
    }
  });  
  }
  close()
  {
    this.dialogRef.close();
  }
}
