import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators  } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Router } from '@angular/router';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AnyTxtRecord } from 'dns';
import { AddDeliveryAreaComponent } from 'src/app/setup/add-delivery-area/add-delivery-area.component';
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  addCustomerAddressForm!:UntypedFormGroup
  countryRecords:any=[];
  branchRecords:any=[];
  branch_id:any;
  country_id:any;
  deliveryAreaRecords:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddAddressComponent>,private formBuilder:UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,private router: Router,@Inject(MAT_DIALOG_DATA) public data: {id: string},private localService:LocalStorage) {
    this.branch_id=this.localService.get('branch_id')
    this.country_id=this.localService.get('country_id')
   }

  ngOnInit(): void {
    this.onBuildForm();
    this.getCountry();
    this.getBranch();
    this.getDeliveryArea();
  }
  close() {
    this.dialogRef.close();
   }
   onBuildForm()
   {
    this.addCustomerAddressForm = this.formBuilder.group({
      delivery_area_id:['',Validators.compose([Validators.required])],
      building_or_villa:[''],
      street:[''],
      flat_number:[''],
      nearest_landmark:[''],
      city:[''],
      country_id:[this.country_id],
      branch_id:['',Validators.compose([Validators.required])]
    }); 
    this.addCustomerAddressForm.controls['country_id'].disable();
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
   saveAddress()
   {
    let post_add_address_param={
      customer_id:this.data.id,
      delivery_area_id:this.addCustomerAddressForm.value['delivery_area_id'],
      building_or_villa:this.addCustomerAddressForm.value['building_or_villa'],
      street:this.addCustomerAddressForm.value['street'],
      flat_number:this.addCustomerAddressForm.value['flat_number'],
      nearest_landmark:this.addCustomerAddressForm.value['nearest_landmark'],
      city:this.addCustomerAddressForm.value['city'],
      country_id:this.country_id,
      branch_id:this.addCustomerAddressForm.value['branch_id']
    }
    this.httpService.post('customer-delivery-location', post_add_address_param)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Customer address added Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
   }
   getCustomerAddress()
   {
    this.httpService.get('customer-delivery-location/'+this.data.id,false)
    .subscribe(result => {
      if (result.status == 200) {
       
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
   }
}
