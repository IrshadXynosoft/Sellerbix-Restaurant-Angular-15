import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

interface modifierGroup {
  modifier_group_name: string;
  limit_minimum: any;
  limit_maximum: any;
  can_add_multiple: any;
}
@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
  public addgroupForm!: UntypedFormGroup;
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  constructor(@Inject(MAT_DIALOG_DATA) public data: { header: any, modifier_group_name: any, limit_minimum: any, limit_maximum: any, modifier_group_id: any, flagset: any, can_add_multiple: any }, private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddGroupComponent>, public formBuilder: UntypedFormBuilder, private snackBService: SnackBarService) {
    this.dialogRef.disableClose = true;
  }
  arraydata: modifierGroup[] = [];
  sample: any = [];
  modifierlistRecords: any = [];
  public numericExpression = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$"
  ngOnInit(): void {
    this.onBuildForm();
    this.getModifierList();
  }

  getModifierList() {
    this.httpService.get('modifier-group', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.modifierlistRecords = result.data.modifier_groups;
          if(this.data.flagset==false){
            this.addgroupForm.patchValue({
              modifier_group_id:this.data.modifier_group_id,
              modifier_group_name:this.data.modifier_group_name,
              limit_minimum:this.data.limit_minimum,
              limit_maximum:this.data.limit_maximum,
              can_add_multiple:this.data.can_add_multiple
            })
          }
        } else {
          console.log("Error");
        }
      });
  }

  submit() {
    if(this.addgroupForm.valid && this.addgroupForm.value['limit_maximum'] !=0 ){
    this.arraydata = [this.addgroupForm.value];
    this.close();
    }
    else {
      this.snackBService.openSnackBar("Max quantity cannot be zero","Close")
      this.validateAllFormFields(this.addgroupForm)
    }
  }

  Update(){
    if(this.addgroupForm.valid && this.addgroupForm.value['limit_maximum'] !=0 ){
      this.arraydata = [this.addgroupForm.value];
      this.close();
    }
    else {
      this.snackBService.openSnackBar("Max quantity cannot be zero","Close")
      this.validateAllFormFields(this.addgroupForm)
    }
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof UntypedFormControl) {            
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {        
        this.validateAllFormFields(control);           
      }
    });
  }

  onBuildForm() {
    this.addgroupForm = this.formBuilder.group({
      modifier_group_name: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpression)])],
      can_add_multiple: false,
      limit_minimum:  ['', Validators.compose([Validators.required, Validators.pattern(this.numericExpression)])],
      limit_maximum:  ['', Validators.compose([Validators.required, Validators.pattern(this.numericExpression)])],
    }, { validator: this.maxLessThan('limit_maximum', 'limit_minimum') }); /* calling fn for comparing max and min value */
  }

  maxLessThan(limit_maximum: string, limit_minimum: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[limit_maximum];
      let t = group.controls[limit_minimum];
      if (f.value < t.value) {
        return {
          data: "Maximum value should be greater than minimum value"
        };
      }
      return {};
    }
  }

  close() {
    this.dialogRef.close(this.arraydata);
  }
}
