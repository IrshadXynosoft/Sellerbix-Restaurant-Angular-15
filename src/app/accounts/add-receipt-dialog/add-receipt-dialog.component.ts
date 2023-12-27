import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import moment from 'moment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-receipt-dialog',
  templateUrl: './add-receipt-dialog.component.html',
  styleUrls: ['./add-receipt-dialog.component.scss']
})
export class AddReceiptDialogComponent implements OnInit {
  public addexpenseForm!: UntypedFormGroup;
  public numericExpression = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$"
  expenseRecords: any = [];
  options: any = [];
  categoryid: any;
  updatedDate: any;
  // categoryArray = new UntypedFormControl();
  date = moment();
  todayDate: Date = new Date();
  category_filteredOptions: Observable<any[]> | undefined;
  checkedOption: any;
  selectedLedger: any;
  dateChoosen = new UntypedFormControl({ value: null, disabled: false });
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddReceiptDialogComponent>, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { operation: any, id: any, categoryname: any }) { }

  ngOnInit(): void {
    // this.category_filteredOptions = this.categoryArray.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
    this.onBuildForm();
    this.dateChoosen.setValue(formatDate(this.todayDate, 'yyyy-MM-dd', 'en'));
    this.getExpenseCategory();
    this.getSingleExpenseCategory();
    this.getViewExpenseCategoryforDaybook();
    this.getViewExpenseCategoryforLedger();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }

  onBuildForm() {
    this.addexpenseForm = this.formBuilder.group({
      reference: [''],
      name: ['', Validators.compose([Validators.required])],
      description: [''],
      amount: [null, Validators.compose([Validators.required, Validators.pattern(this.numericExpression)])],
      expensename: [''],
      option: ['', Validators.compose([Validators.required])],
      ledger: ['', Validators.compose([Validators.required])],
    })
  }
  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    let body = {
      'expense_category_id': this.addexpenseForm.value['ledger'],
      'reference': this.addexpenseForm.value['reference'],
      'amount': this.addexpenseForm.value['amount'],
      'date': moment(this.dateChoosen.value).format('YYYY-MM-DD'),
      'description': this.addexpenseForm.value['description'],
      'name': this.addexpenseForm.value['name'],
      'payment_type_id': this.addexpenseForm.value['option']
    }
    if (this.addexpenseForm.valid && this.dateChoosen.value) {
      this.httpService.post('expense', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close()
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.validateAllFormFields(this.addexpenseForm)
    }
  }

  getSingleExpenseCategory() {
    if (this.data.operation == 'edit') {
      this.httpService.get('expense/' + this.data.id, false)
        .subscribe(result => {
          if (result.status == 200) {
            this.updatedDate = result.data.date;
            this.checkedOption = result.data.payment_type_id;
            this.addexpenseForm.patchValue({
              'name': result.data.name,
              'description': result.data.description,
              'date': result.data.date,
              'amount': result.data.amount,
              'reference': result.data.reference,
              'option': result.data.payment_type_id,
            })
            this.selectedLedger = result.data.expense_category.id
            this.dateChoosen.setValue(result.data.date)
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  getViewExpenseCategoryforDaybook() {
    if (this.data.operation == 'view') {
      this.httpService.get('expense/' + this.data.id, false)
        .subscribe(result => {
          if (result.status == 200) {
            this.updatedDate = result.data.date;
            this.checkedOption = result.data.payment_type_id;
            this.addexpenseForm.patchValue({
              'name': result.data.name,
              'description': result.data.description,
              'date': result.data.date,
              'amount': result.data.amount,
              'reference': result.data.reference,
              'option': result.data.payment_type_id
            })
            this.selectedLedger = result.data.expense_category.id,
              this.dateChoosen.setValue(result.data.date)
            this.dateChoosen.disable()
            this.addexpenseForm.disable()
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }

  getViewExpenseCategoryforLedger() {
    if (this.data.operation == 'viewforledger') {
      this.httpService.get('expense/' + this.data.id, false)
        .subscribe(result => {
          if (result.status == 200) {
            this.updatedDate = result.data.date;
            this.checkedOption = result.data.payment_type_id;
            // let categoryname = result.data.expense_category.name
            this.addexpenseForm.patchValue({
              'name': result.data.name,
              'description': result.data.description,
              'date': result.data.date,
              'amount': result.data.amount,
              'reference': result.data.reference,
              'option': result.data.payment_type_id
            })
            this.selectedLedger = result.data.expense_category.id,
              this.dateChoosen.setValue(result.data.date)
            this.dateChoosen.disable()
            this.addexpenseForm.disable()
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
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

  getExpenseCategory() {
    this.httpService.get('receipt-expense-category', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.expenseRecords = result.data.categories;
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  categorySelected(name: any, id: any) {
    this.categoryid = id;
  }

  onUpdate() {
    let body = {
      'expense_category_id': this.addexpenseForm.value['ledger'],
      'reference': this.addexpenseForm.value['reference'],
      'amount': this.addexpenseForm.value['amount'],
      'date': moment(this.dateChoosen.value).format('YYYY-MM-DD'),
      'description': this.addexpenseForm.value['description'],
      'name': this.addexpenseForm.value['name']
    }
    if (this.addexpenseForm.valid && this.dateChoosen.value) {
      this.httpService.put('expense/' + this.data.id, body)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Receipt updated successfully!!", "Close");
            this.close()
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.validateAllFormFields(this.addexpenseForm)
    }
  }

}
