import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-add-expense-category',
  templateUrl: './add-expense-category.component.html',
  styleUrls: ['./add-expense-category.component.scss']
})
export class AddExpenseCategoryComponent implements OnInit {
  public expenseForm!: UntypedFormGroup;
  updatedType:any;
  errorMessages:any=[];
  constructor(private dialogService: ConfirmationDialogService,private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<AddExpenseCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data: { operation: any, id: any }) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getSingleExpenseCategory()
  }

  onBuildForm() {
    this.expenseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      type: [{value:'',disabled: this.data.operation=='edit'? true : false}, Validators.compose([Validators.required])],
    })
  }
  close() {
    this.dialogRef.close();
  }
  onSubmit() {
    let body = this.expenseForm.value;
    if(this.expenseForm.valid){
    this.httpService.post('expense-category', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Expense category added successfully!!", "Close");
          this.close()
        } else {
          if(result.data){
            this.errorMessages=result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
    }
    else{
      this.validateAllFormFields(this.expenseForm)
    }
  }

  onUpdate() {
    let body = {
      'name':this.expenseForm.value['name'],
      'description':this.expenseForm.value['description'],
      'type':this.updatedType
    }
    if(this.expenseForm.valid){
    this.httpService.put('expense-category/' +this.data.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Expense category updated successfully!!", "Close");
          this.close()
        } else {
          if(result.data){
            this.errorMessages=result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");        }
      });
    }
    else {
      this.validateAllFormFields(this.expenseForm)
    }
  }

  getSingleExpenseCategory() {
    if (this.data.operation == 'edit') {
      this.httpService.get('expense-category/' + this.data.id , false)
        .subscribe(result => {
          if (result.status == 200) {
            this.updatedType=result.data.type;
            this.expenseForm.patchValue({
              'name':result.data.name,
              'description':result.data.description,
              'type':result.data.type
            })
          }
          else {
            console.log("Error");
          }
        });
    }
  }
  validateAllFormFields(formGroup: UntypedFormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof UntypedFormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
}
