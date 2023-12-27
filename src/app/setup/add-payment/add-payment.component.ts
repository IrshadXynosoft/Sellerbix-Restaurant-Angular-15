import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  ErrorArray:any=[];
  constructor(private httpService:HttpServiceService,private snackBService:SnackBarService,public dialog: MatDialog, public dialogRef: MatDialogRef<AddPaymentComponent>,public formBuilder:UntypedFormBuilder) { }
  public addPaymentMethodForm!:UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addPaymentMethodForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      secondary_name:[''],
      // reference: false,
      is_web:[true]
    });
  }
 close() {
  this.dialogRef.close();
 }
 addPaymenttype(){
  let post = this.addPaymentMethodForm.value;
  this.httpService.post('payment-type', post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Payment Type Added Successfully!!", "Close");
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
