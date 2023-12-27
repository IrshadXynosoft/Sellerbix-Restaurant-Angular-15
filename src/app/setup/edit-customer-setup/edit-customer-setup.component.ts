import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-customer-setup',
  templateUrl: './edit-customer-setup.component.html',
  styleUrls: ['./edit-customer-setup.component.scss']
})
export class EditCustomerSetupComponent implements OnInit {
  addCustomerForm!: UntypedFormGroup;
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  public validContactNumberExpression = '^[0-9]{8,10}$';
  public validEmailExoression = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$';
  customer_id: any;
  customerData: any = [];
  branch_id: any;
  deliveryAreaRecords: any = [];
  ErrorArray: any = [];
  loyaltyGroupArray:any=[];
  peicePlansArray:any=[];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialogRef: MatDialogRef<EditCustomerSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private localService: LocalStorage
  ) {
    this.branch_id = this.localService.get('branch_id');
  }
  ngOnInit(): void {
    this.onBuildForm();
    this.getCustomerData();
    this.getDeliveryArea();
    this.getLoyaltyGroup();
    this.getPlan();
  }
  getCustomerData() {
    this.httpService.get('customer/' + this.data.id, false).subscribe((result) => {
      if (result.status == 200) {
        this.customerData = result.data;
        this.customer_id = this.customerData[0].customer_id;
        this.addCustomerForm.patchValue({
          name: this.customerData[0].name,
          contact_no: this.customerData[0].contact_no,
          email: this.customerData[0].email,
          delivery_area_id:
            this.customerData[0].customer_delivery_location ? this.customerData[0].customer_delivery_location[0].delivery_area_id : '',
          wallet: this.customerData[0].wallet,
          loyalty: this.customerData[0].loyalty_point,
          dob: this.customerData[0].dob,
          gender: this.customerData[0].gender,
          loyalty_group_id:this.customerData[0].loyalty_group_id,
          price_plan_id:this.customerData[0].price_plan_id
        });
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
  onBuildForm() {
    this.addCustomerForm = this.formBuilder.group({
      name: [''],
      contact_no: ['', Validators.compose([Validators.required,Validators.pattern(this.validContactNumberExpression)])],
      email: ['',Validators.compose([Validators.pattern(this.validEmailExoression)])],
      delivery_area_id: ['', Validators.compose([Validators.required])],
      loyalty_group_id:[''],
      wallet: [''],
      dob: [''],
      gender: [''],
      price_plan_id:['']
    });
  }

  getDeliveryArea() {
    this.httpService
      .get('list-delivery-areas/' + this.branch_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.deliveryAreaRecords = result.data;
        } else {
          console.log('Error in get delivery area');
        }
      });
  }
  getLoyaltyGroup(){
    this.httpService.get('loyalty-group',false)
    .subscribe(result => {
      if (result.status == 200) {
        this.loyaltyGroupArray = result.data;
       
      } else {
        console.log("Error");
      }
    });
  }
  saveCustomer() {
    let post_add_customer_param = {
      name: this.addCustomerForm.value.name,
      contact_no: this.addCustomerForm.value['contact_no'],
      email: this.addCustomerForm.value['email'],
      delivery_area_id: this.addCustomerForm.value['delivery_area_id'],
      dob: this.addCustomerForm.value['dob'],
      gender: this.addCustomerForm.value['gender'],
      loyalty_group_id:this.addCustomerForm.value['loyalty_group_id'],
      price_plan_id:this.addCustomerForm.value['price_plan_id'],
      branch_id: this.customerData[0].customer_delivery_location
        ? this.customerData[0].customer_delivery_location[0].branch_id
        : this.branch_id

    };

    this.httpService
      .put('customer/' + this.data.id, post_add_customer_param)
      .subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Customer updated Successfully',
            'Close'
          );
          this.cancel();
        } else {
          if (result.data) {
            this.ErrorArray = result.data;
          }
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }
  getPlan() {
    this.httpService.get('price-plan')
      .subscribe(result => {
        if (result.status == 200) {
          this.peicePlansArray=result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }
  cancel() {
    this.dialogRef.close();
  }
}

