import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-edit-customer-group',
  templateUrl: './edit-customer-group.component.html',
  styleUrls: ['./edit-customer-group.component.scss']
})
export class EditCustomerGroupComponent implements OnInit {
  ErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditCustomerGroupComponent>,public formBuilder:UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,@Inject(MAT_DIALOG_DATA) public data: {id: any}) { }

  public addCustomerGroupForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.onBuildForm();
    this.getCustomerGroup();
  }
  onBuildForm() {
    this.addCustomerGroupForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
    });
  }
 close() {
  this.dialogRef.close();
 }
 submit()
 {
    
  let post=this.addCustomerGroupForm.value;
  this.httpService.put('customer-group/'+this.data.id, post)
  .subscribe(result => {       
  if (result.status == 200) {
  
   this.snackBService.openSnackBar("Customer group Updated", "Close");
    this.close();
  }else{
    if(result.data){
      this.ErrorArray=result.data
    }
    this.snackBService.openSnackBar(result.message, "Close");
  }
}); 
 }
 getCustomerGroup()
 {
  this.httpService.get('customer-group/'+this.data.id)
  .subscribe(result => {       
  if (result.status == 200) {
    if(result.data.name){
      this.addCustomerGroupForm.patchValue(
        {
          name:result.data.name
        }
      )
    }
  }else{
    this.snackBService.openSnackBar(result.message, "Close");
  }
}); 
 }
}
