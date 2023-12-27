import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {
  supplierForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  public phoneval = '[- +()0-9]{8,16}';
  supplierErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddSupplierComponent>,private formBuilder:UntypedFormBuilder,private httpService: HttpServiceService, private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
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
  close() {
    this.dialogRef.close();
  }
  supplierSubmit()
  {
    
    let post = this.supplierForm.value;
    this.httpService.post('supplier', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Supplier Added Successfully!!", "Close");
          this.close();
        } else {
          if(result.data){
            this.supplierErrorArray=result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}
