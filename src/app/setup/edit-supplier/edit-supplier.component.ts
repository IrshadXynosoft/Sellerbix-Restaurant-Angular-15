import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss']
})
export class EditSupplierComponent implements OnInit {
  supplierForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  public phoneval = "[- +()0-9]{8,16}";
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditSupplierComponent>,private formBuilder:UntypedFormBuilder,private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { id: string }, private router: Router) { }
  supplierErrorArray:any=[];
  ngOnInit(): void {
    this.onBuildForm();
    this.getSupplier();
  }
  onBuildForm()
  {
   this.supplierForm=this.formBuilder.group({
    name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
     code: ['',Validators.compose([Validators.required])],
     email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
     contact_no:['', Validators.compose([Validators.required, Validators.pattern(this.phoneval)])],
     address1:['', Validators.compose([Validators.required,Validators.maxLength(200),Validators.pattern(this.validationExpression)])],
     address2:[''],
   })
  }
  getSupplier()
  {
    this.httpService.get('supplier/' + this.data.id)
    .subscribe(result => {
      if (result.status == 200) {
       let supplierArray = result.data;
       this.supplierForm.patchValue({
        name:supplierArray.name,
        code:supplierArray.code,
        contact_no:supplierArray.contact_no,
        email:supplierArray.email,
        address1: supplierArray.address1,
        address2:supplierArray.address2,
        })
      } else {
        console.log("Error in supplier");
      }
    });
  }
  EditSupplier()
  {
    let supplierArray = this.supplierForm.value;
    this.httpService.put('supplier/'+this.data.id, supplierArray)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Supplier Uodate Successfully!!", "Close");
          this.close();
        } else {
          this.supplierErrorArray=result.data
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  close() {
    this.dialogRef.close();
  }

}
