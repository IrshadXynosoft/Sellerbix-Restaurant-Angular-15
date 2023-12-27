import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-delivery-entities',
  templateUrl: './edit-delivery-entities.component.html',
  styleUrls: ['./edit-delivery-entities.component.scss']
})
export class EditDeliveryEntitiesComponent implements OnInit {
  public unitsForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  unitsErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditDeliveryEntitiesComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,@Inject(MAT_DIALOG_DATA) public data: {id: string,name:string},private router:Router) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.unitsForm = this.formBuilder.group({
      name: [this.data.name, Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
    });
  }
  editUnits()
  {
    let putUnits=this.unitsForm.value;
    this.httpService.put('entities/'+ this.data.id, putUnits)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Entity updated successfully", "Close");
        this.close();
     } else {
      this.snackBService.openSnackBar(result.message, "Close");
      if(result.data)
      {
         this.unitsErrorArray=result.data
      }
      }
    });
  }
  close()
  {
    this.dialogRef.close();
  }
}
