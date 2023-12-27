import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-add-modifier',
  templateUrl: './add-modifier.component.html',
  styleUrls: ['./add-modifier.component.scss']
})
export class AddModifierComponent implements OnInit {
  public modifierForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  modifierErrors:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddModifierComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.modifierForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      secondary_name:['']
    });
  }
  addModifier()
  {
    let post=this.modifierForm.value;
    this.httpService.post('modifier', post)
    .subscribe(result => {       
    if (result.status == 200) {
    this.snackBService.openSnackBar("Modifier added Successfully", "Close");
     this.close();
    }else{
      if(result.data){
        this.modifierErrors=result.data;
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
