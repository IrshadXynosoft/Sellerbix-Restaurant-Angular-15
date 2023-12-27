
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { Router } from '@angular/router';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-edit-surcharge',
  templateUrl: './edit-surcharge.component.html',
  styleUrls: ['./edit-surcharge.component.scss']
})
export class EditSurchargeComponent implements OnInit {
  public surchargeForm!: UntypedFormGroup;
  entitiesArray: any = [];
  surchargeArray: any = [];
  entitySelected: any = new Array();
  isCheckboxErrorMessage: any;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationFloat="^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  branch_id:any;
  ErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditSurchargeComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { id: string,branch_id:string }, private router: Router,private localService:LocalStorage) {
    this.branch_id=this.localService.get('branch_id');
   }

  ngOnInit(): void {
    this.getEntities();
    this.getSurcharges();
    this.onBuildsurchargeForm();
    this.isCheckboxErrorMessage = false;
  }

  onBuildsurchargeForm() {
    this.surchargeForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      type: [''],
      rate: ['', [Validators.required, Validators.pattern(this.validationFloat)]],
      entities: false,
      walkin: false,
      dinein: false,
      callcenter: false,
      takeaway: false,
      eorder: false,
      is_taxable: false
    });
  }
  getSurcharges() {
    this.httpService.get('surcharge/' + this.data.id,false)
      .subscribe(result => {
        if (result.status == 200) {
          this.surchargeArray = result.data;
          this.surchargeForm.patchValue({
            name:this.surchargeArray[0].name,
            type:this.surchargeArray[0].type,
            rate:this.surchargeArray[0].rate,
            is_taxable: this.surchargeArray[0].is_taxable,
            walkin: this.surchargeArray[0].walk_in,
            dinein: this.surchargeArray[0].dine_in,
            callcenter: this.surchargeArray[0].call_center,
            takeaway: this.surchargeArray[0].take_away,
            eorder: this.surchargeArray[0].e_order,
           })
        } else {
          console.log("Error in surcharge");
        }
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
  editSurcharge() {
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
      this.httpService.put('surcharge/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {

            this.snackBService.openSnackBar("Surcharge updated Successfully", "Close");
            this.entitySelected = [];
            this.close();
          } else {
            if(result.data){
              this.ErrorArray=result.data
            }
            this.snackBService.openSnackBar("Some error occured", "Close");
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

