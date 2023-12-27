import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-add-customer-group',
  templateUrl: './add-customer-group.component.html',
  styleUrls: ['./add-customer-group.component.scss']
})
export class AddCustomerGroupComponent implements OnInit {
 
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddCustomerGroupComponent>,public formBuilder:UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService) { }

  public addCustomerGroupForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ErrorArray:any=[];
  ngOnInit(): void {
    this.onBuildForm();
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
  this.httpService.post('customer-group', post)
  .subscribe(result => {       
  if (result.status == 200) {
  
   this.snackBService.openSnackBar("Customer group added", "Close");
    this.close();
  }else{
    if(result.data){
      this.ErrorArray=result.data
    }
    this.snackBService.openSnackBar(result.message, "Close");
  }
}); 
 }
}
