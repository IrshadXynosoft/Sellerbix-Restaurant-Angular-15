import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  public paymentForm!: UntypedFormGroup;
  invalidFlag: boolean = false;
  constructor(private snackBService:SnackBarService,private formBuilder:UntypedFormBuilder,public dialog: MatDialog, public dialogRef: MatDialogRef<CustomerDetailsComponent>) { }

  ngOnInit(): void {
    this.onBuildPaymentForm()
  }

  onBuildPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      name: null,
      phone_number: [null,Validators.compose([Validators.required, Validators.pattern('^([0-9]{6,13})$')])],
    });
  }

  phonenumberValidCheck(input: any) {
    if (input.match('^([0-9]{6,13})$')) {
      this.invalidFlag = false
    }
    else {
      this.invalidFlag = true;
    }
  }

  close() {
    this.dialogRef.close();
   }

   addCustomer(){
    if(this.paymentForm.valid){
      this.dialogRef.close(this.paymentForm.value)
    }
    else {
      this.snackBService.openSnackBar("Please enter phone number","Close")
    }
   }
}
