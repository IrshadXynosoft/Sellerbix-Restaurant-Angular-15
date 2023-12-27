import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';

@Component({
  selector: 'app-add-delivery-entities',
  templateUrl: './add-delivery-entities.component.html',
  styleUrls: ['./add-delivery-entities.component.scss']
})
export class AddDeliveryEntitiesComponent implements OnInit {
  public unitsForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  unitsErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddMeasurementUnitComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.unitsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
    });
  }
  addUnits()
  {
    let post_units=this.unitsForm.value;
     this.httpService.post('entities', post_units)
    .subscribe(result => {       
    if (result.status == 200) {
    
     this.snackBService.openSnackBar("Entity Created Successfully", "Close");
      this.close();
    }else{
      this.snackBService.openSnackBar(result.message, "Close");
      if(result.data)
      {
         this.unitsErrorArray=result.data
      }
    }
  });  
  }
  close() {
    this.dialogRef.close();
  }
}
