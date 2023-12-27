import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {
  ErrorArray:any=[];
  public editPaymentMethodForm!:UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  paymentMethod:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {payment_id: string,payment_reference:any,payment_name:any,secondary_name:any},private route:ActivatedRoute, private httpService:HttpServiceService,private snackBService:SnackBarService,public dialog: MatDialog, public dialogRef: MatDialogRef<EditPaymentComponent>,public formBuilder:UntypedFormBuilder,private router:Router) { }  
  /* inject matdialog is used to passing data from payment method component
  @data=>  is the array of data passed */ 
   
  ngOnInit(): void {
    this.onBuildForm();
    this.getPayment();
  }
  onBuildForm() {
    this.editPaymentMethodForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      secondary_name:[''],
      // reference: this.data.payment_reference,
      is_web:[true]
    });
  }
 
  getPayment(){
    this.httpService.get('payment-type'+ '/' + this.data.payment_id)
    .subscribe(result => {
      if (result.status == 200) {
       this.paymentMethod=result.data
      if(this.paymentMethod){
        this.editPaymentMethodForm.patchValue({
          name:this.paymentMethod.name,
          secondary_name:this.paymentMethod.secondary_name,
          is_web:this.paymentMethod.is_web
        })
      }
      } else {
      this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  close() {
    this.dialogRef.close();
   }
   editPaymenttype(){     
    let post = this.editPaymentMethodForm.value;
    this.httpService.put('payment-type'+ '/' + this.data.payment_id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Payment Type Edited Successfully!!", "Close");
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
