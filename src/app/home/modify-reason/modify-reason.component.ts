import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-modify-reason',
  templateUrl: './modify-reason.component.html',
  styleUrls: ['./modify-reason.component.scss'],
})
export class ModifyReasonComponent implements OnInit {
  public modifyReasonForm!: UntypedFormGroup;
  @ViewChild('input') inputElement!: ElementRef;
  modifierRecords: any = [];
  public numericExpression = '^[+]?[1-9]\\d?$';
  supervisorPassword: any;
  branch_id = this.localservice.get('branch_id');
  btnName: any = 'Ok';
  constructor(
    private localservice: LocalStorage,
    private snackBService: SnackBarService,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { item: any; action: any; qty: any; orderid: any },
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModifyReasonComponent>
  ) {}

  ngOnInit(): void {
    this.onBuildForm();
    this.getModifyReason();
    this.getPassword();
  }

  onBuildForm() {
    this.modifyReasonForm = this.formBuilder.group({
      quantity: [
        this.data.item?.qty,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.numericExpression),
        ]),
      ],
      reason: [{ value: '', disabled: true }],
      password: [{ value: '', disabled: true }],
      inventory_status: [{ value: '', disabled: true }],
    });
  }

  getModifyReason() {
    this.httpService.get('modify-reason', false).subscribe((result) => {
      if (result.status == 200) {
        this.modifierRecords = result.data.modifier_reasons;
      } else {
        console.log('Error');
      }
    });
  }

  checkValidators() {
    let currentQuantity: any = this.inputElement.nativeElement.value;
    const reason: any = this.modifyReasonForm.get('reason');
    const password: any = this.modifyReasonForm.get('password');
    const inventory: any = this.modifyReasonForm.get('inventory_status');
    if (parseInt(currentQuantity) < parseInt(this.data.item.old_qty)) {
      reason.enable();
      reason.setValidators([Validators.required]);
      reason.updateValueAndValidity();
      password.enable();
      password.setValidators([Validators.required]);
      password.updateValueAndValidity();
      inventory.enable();
      inventory.setValidators([Validators.required]);
      inventory.updateValueAndValidity();
      this.btnName = 'Reduce Quantity';
    } else {
      reason.disable();
      reason.setValidators(null);
      reason.updateValueAndValidity();
      password.disable();
      password.setValidators(null);
      password.updateValueAndValidity();
      inventory.disable();
      inventory.setValidators(null);
      inventory.updateValueAndValidity();
      if (parseInt(currentQuantity) > parseInt(this.data.item.old_qty)) {
        this.btnName = 'Add Quantity';
      }
      else{
        this.btnName = 'Ok';
      }
    }
  }

  qtyMinus() {
    let currentQuantity: any = this.inputElement.nativeElement.value;
    if (parseInt(currentQuantity) > 1) {
      currentQuantity = parseInt(currentQuantity) - 1;
      this.modifyReasonForm.patchValue({
        quantity: currentQuantity,
      });
      this.checkValidators();
    }
  }

  qtyInput() {
    let currentQuantity: any = this.inputElement.nativeElement.value;
    if (
      parseInt(currentQuantity) > 1 &&
      currentQuantity.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$')
    ) {
      this.modifyReasonForm.patchValue({
        quantity: currentQuantity,
      });
      this.checkValidators();
    } else {
      this.inputElement.nativeElement.value = 1;
      this.checkValidators();
      this.snackBService.openSnackBar('Invalid Input', 'Close');
    }
  }

  qtyPlus() {
    let currentQuantity: any = this.inputElement.nativeElement.value;
    currentQuantity = parseInt(currentQuantity) + 1;
    this.modifyReasonForm.patchValue({
      quantity: currentQuantity,
    });
    this.checkValidators();
  }

  getPassword() {
    this.httpService.get('settings', false).subscribe((result) => {
      if (result.status == 200) {
        this.supervisorPassword = result.data.settings?.supervisor_password;
      } else {
        console.log('Error');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  modifyItem() {
    if (
      parseInt(this.modifyReasonForm.value['quantity']) <
      parseInt(this.data.item.old_qty)
    ) {
      if (this.modifyReasonForm.value['password'] == this.supervisorPassword) {
        let result = {
          isModified: true,
          data: this.modifyReasonForm.value,
        };
        this.dialogRef.close(result);
      } else {
        this.snackBService.openSnackBar('Wrong Password', 'Close');
      }
    } else {
      let result = {
        isModified: false,
        data: this.modifyReasonForm.value,
      };
      this.dialogRef.close(result);
    }
  }
}
