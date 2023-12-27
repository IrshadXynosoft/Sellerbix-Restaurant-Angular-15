import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-add-order-discount',
  templateUrl: './add-order-discount.component.html',
  styleUrls: ['./add-order-discount.component.scss']
})
export class AddOrderDiscountComponent implements OnInit {
  public orderdiscountForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationFloat="^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  entitiesArray: any = [];
  entitySelected: any = new Array();
  isCheckboxErrorMessage: any;
  branch_id:any;
  ErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddOrderDiscountComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,@Inject(MAT_DIALOG_DATA) public data: {branch_id:string}) {
    this.branch_id=this.localService.get('branch_id');
   }

  ngOnInit(): void {
    this.getEntities();
    this.onBuildForm();
    this.isCheckboxErrorMessage = false;
  }
  onBuildForm() {

    this.orderdiscountForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      discounttype: ['Percentage', Validators.compose([Validators.required])],
      rate: ['', [Validators.required, Validators.pattern(this.validationFloat)]],
      discountOnTotalAmount: 0,
      entities: false,
      walkin: false,
      dinein: false,
      callcenter: false,
      takeaway: false,
      eorder: false,
    
    }); /* calling fn for date checking */

 
  }

  // To check from date and to date

  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Invalid Date Entry"
        };
      }
      return {};
    }
  }
  onChangewalkin(event: any) {
    if (this.orderdiscountForm.value['walkin']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangedinein(event: any) {
    if (this.orderdiscountForm.value['dinein']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangecallcenter(event: any) {
    if (this.orderdiscountForm.value['callcenter']) {
      this.isCheckboxErrorMessage = false;
    }
   }
  onChangetakeaway(event: any) {
    if (this.orderdiscountForm.value['takeaway']) {
      this.isCheckboxErrorMessage = false;
    }
  }
  onChangeeorder(event: any) {
    if (this.orderdiscountForm.value['eorder']) {
      this.isCheckboxErrorMessage = false;
    }
   }
  close() {
    this.dialogRef.close();
  }
  addOrderDiscount() {
    let EntitiesChecked: any = false;
    if (this.orderdiscountForm.value['walkin']) {
      this.entitySelected.push(1)
      EntitiesChecked = true
    }
    if (this.orderdiscountForm.value['dinein']) {
      this.entitySelected.push(2)
      EntitiesChecked = true
    }
    if (this.orderdiscountForm.value['callcenter']) {
      this.entitySelected.push(3)
      EntitiesChecked = true
    }

    if (this.orderdiscountForm.value['takeaway']) {
      this.entitySelected.push(4)
      EntitiesChecked = true
    }

    if (this.orderdiscountForm.value['eorder']) {
      this.entitySelected.push(5)
      EntitiesChecked = true
    }
    if (EntitiesChecked) {
      this.isCheckboxErrorMessage = false;
      let post = {
        'name': this.orderdiscountForm.value['name'],
        'discount_type': this.orderdiscountForm.value['discounttype'],
        'rate': this.orderdiscountForm.value['rate'],
        'enable_for': this.entitySelected,
        'is_discount_on_total_amount': this.orderdiscountForm.value['discountOnTotalAmount']?1:0,
        'branch_id':this.data.branch_id,
        
     }
      
      this.httpService.post('order-discount', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Order Discount added", "Close");
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
  onChange(event: any, index: any, item: any) {

    item.checked = !item.checked;

    if (item.id && item.checked) {
      this.entitySelected.push(item.id)
    }
    else if (item.id && !item.checked) {
      this.entitySelected.pop(item.id)
    }
    
  }
  timeFromChange() {
    this.orderdiscountForm.controls['timeTo'].enable();
  }
}
