import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-add-surcharge',
  templateUrl: './add-surcharge.component.html',
  styleUrls: ['./add-surcharge.component.scss']
})
export class AddSurchargeComponent implements OnInit {
  public surchargeForm!: UntypedFormGroup;
  entitiesArray: any = [];
  entitySelected: any = new Array();
  isCheckboxErrorMessage: any;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
 // public validationFloat="[+-]?([0-9]*[.])?[0-9]+"
 public validationFloat="^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  
  branch_id:any;
  ErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddSurchargeComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,@Inject(MAT_DIALOG_DATA) public data: {branch_id:string}) { 
    this.branch_id=this.localService.get('branch_id')
  }
  ngOnInit(): void {
    this.getEntities();
    this.onBuildsurchargeForm();
    this.isCheckboxErrorMessage = false;
  }
  onBuildsurchargeForm() {
    this.surchargeForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      type: ['Percentage'],
      rate: ['', [Validators.required, Validators.pattern(this.validationFloat)]],
      entities: false,
      walkin: false,
      dinein: false,
      callcenter: false,
      takeaway: false,
      eorder: false,
      is_taxable: false,
    });
  }
  getEntities() {
    this.httpService.get('entity',false)
      .subscribe(result => {

        if (result.status == 200) {
          this.entitiesArray = result.data.entities;
        } else {
          console.log("Error in entity");
        }
      });
  }
  onChangewalkin(event: any) {
    if (this.surchargeForm.value['walkin']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangedinein(event: any) {
    if (this.surchargeForm.value['dinein']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangecallcenter(event: any) {
    if (this.surchargeForm.value['callcenter']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangetakeaway(event: any) {
    if (this.surchargeForm.value['takeaway']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangeeorder(event: any) {
    if (this.surchargeForm.value['eorder']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  addSurcharge() {
    let EntitiesChecked: any = false;
    if (this.surchargeForm.value['walkin']) {
      this.entitySelected.push(1)
      EntitiesChecked = true
    }
    if (this.surchargeForm.value['dinein']) {
      this.entitySelected.push(2)
      EntitiesChecked = true
    }
    if (this.surchargeForm.value['callcenter']) {
      this.entitySelected.push(3)
      EntitiesChecked = true
    }

    if (this.surchargeForm.value['takeaway']) {
      this.entitySelected.push(4)
      EntitiesChecked = true
    }

    if (this.surchargeForm.value['eorder']) {
      this.entitySelected.push(5)
      EntitiesChecked = true
    }
     if (EntitiesChecked) {
      this.isCheckboxErrorMessage = false;
      let post = {
        'name': this.surchargeForm.value['name'],
        'type': this.surchargeForm.value['type'],
        'rate': this.surchargeForm.value['rate'],
        'entities': this.entitySelected,
        'is_taxable': this.surchargeForm.value['is_taxable'],
        'branch_id':this.data.branch_id
      }
      this.httpService.post('surcharge', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Surcharge added Successfully", "Close");
            this.entitySelected = [];
            this.close();
          } else {
            
            if(result.data){
              this.ErrorArray=result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.isCheckboxErrorMessage = true;
    }
  }
  close() {
    this.dialogRef.close();
  }
}
