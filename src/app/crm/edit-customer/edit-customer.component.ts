import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
import { NgStyle } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddDeliveryAreaComponent } from 'src/app/setup/add-delivery-area/add-delivery-area.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  addCustomerForm!:UntypedFormGroup
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$";
  public validContactNumberExpression="^[0-9]{8,10}$";
  public validEmailExoression= "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  branchRecords:any=[];
  countryRecords:any=[];
  customerGroupArray:any=[];
  customer_id:any;
  customerData:any=[];
  branch_id:any;
  country_id:any;
  deliveryAreaRecords:any=[];
  customerErrorArray:any=[];
  constructor(public dialog: MatDialog,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,private router: Router,private route:ActivatedRoute, public dialogRef: MatDialogRef<EditCustomerComponent>,@Inject(MAT_DIALOG_DATA) public data: {addres_id:string},private localService:LocalStorage) {
    this.branch_id=this.localService.get('branch_id')
    this.country_id=this.localService.get('country_id')

   }

  

  ngOnInit(): void {
    this.onBuildForm();
    this.getCustomerData();
    this.getBranch();
    this.getCountry();
    this.getCustomerGroup();
    this.getDeliveryArea();
  }
  getCustomerData()
  {
    this.httpService.get('customer-delivery-location/'+this.data.addres_id,false)
    .subscribe(result => {
      if (result.status == 200) {
       this.customerData=result.data;
       this.customer_id=this.customerData[0].customer_id;
       this.addCustomerForm.patchValue(
         {
           name:this.customerData[0].customer.name,
           alternate_contact_no:this.customerData[0].customer.alternate_contact_no,
           contact_no:this.customerData[0].customer.contact_no,
           email:this.customerData[0].customer.email,
           delivery_area_id:this.customerData[0].delivery_area_id,
           building_or_villa:this.customerData[0].building_or_villa,
           street:this.customerData[0].street,
           flat_number:this.customerData[0].flat_number,
           nearest_landmark:this.customerData[0].nearest_landmark,
           city:this.customerData[0].city,
           branch_id:this.customerData[0].branch_id,
           country_id:this.customerData[0].country_id,
           customer_group_id:this.customerData[0].customer.customer_group_id,
           gender:this.customerData[0].customer.gender,
           dob:this.customerData[0].customer.dob
         }
       )
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  onBuildForm()
  {
    this.addCustomerForm = this.formBuilder.group({
      name: [''],
      alternate_contact_no:[''],
      contact_no:['',Validators.compose([Validators.required,Validators.pattern(this.validContactNumberExpression)])],
      email:['',Validators.compose([Validators.pattern(this.validEmailExoression)])],
      delivery_area_id:['',Validators.compose([Validators.required])],
      building_or_villa:[''],
      street:[''],
      flat_number:[''],
      nearest_landmark:[''],
      city:[''],
      branch_id:['',Validators.compose([Validators.required])],
      country_id:[this.country_id],
      customer_group_id:[''],
      gender:[''],
      dob:['']
    });
    this.addCustomerForm.controls['country_id'].disable();
  }
  getBranch()
  {
    this.httpService.get('branch',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
         
        } else {
          console.log("Error");
        }
      });
  }
  getCountry()
  {
    this.httpService.get('country',false)
    .subscribe(result => {
      if (result.status == 200) {
        this.countryRecords = result.data.countries;
       
      } else {
        console.log("Error");
      }
    });
  }
  getCustomerGroup()
  {
    this.httpService.get('customer-group',false)
    .subscribe(result => {
      if (result.status == 200) {
        this.customerGroupArray = result.data.customer_groups;
       
      } else {
        console.log("Error");
      }
    });
  }
  getDeliveryArea(){
    this.httpService.get('list-delivery-areas/'+this.branch_id,false)
    .subscribe(result => {
      if (result.status == 200) {
        
        this.deliveryAreaRecords=result.data;
      } else {
        console.log("Error in get delivery area");
      }
    });
  }
  addDeliveryArea(){
    const dialogRef = this.dialog.open(AddDeliveryAreaComponent, {
      
      width: '1500px',data:{branch_id:this.localService.get('branch_id')}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryArea();
    });
  }
  saveCustomer()
  {
    let post_add_customer_param={
           name: this.addCustomerForm.value.name,
           alternate_contact_no: this.addCustomerForm.value['alternate_contact_no'],
           contact_no: this.addCustomerForm.value['contact_no'],
           email: this.addCustomerForm.value['email'],
           delivery_area_id: this.addCustomerForm.value['delivery_area_id'],
           building_or_villa: this.addCustomerForm.value['building_or_villa'],
           street: this.addCustomerForm.value['street'],
           flat_number: this.addCustomerForm.value['flat_number'],
           nearest_landmark: this.addCustomerForm.value['nearest_landmark'],
           city: this.addCustomerForm.value['city'],
           branch_id: this.addCustomerForm.value['branch_id'],
           country_id: this.country_id,
           customer_group_id: this.addCustomerForm.value['customer_group_id'],
           gender: this.addCustomerForm.value['gender'],
           dob: this.addCustomerForm.value['dob'],
           customer_id:this.customer_id
    }
    
    
   
    this.httpService.put('customer-delivery-location/'+this.data.addres_id, post_add_customer_param)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Customer updated Successfully", "Close");
        this.cancel();
      } else {
        if(result.data){
          this.customerErrorArray=result.data
        }
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  cancel()
  {
    this.dialogRef.close();
  }
}

