import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-online-delivery-charge',
  templateUrl: './online-delivery-charge.component.html',
  styleUrls: ['./online-delivery-charge.component.scss']
})

export class OnlineDeliveryChargeComponent implements OnInit {
  deliverychargeform!: UntypedFormGroup
  id = this.route.snapshot.params.id;
  selectedRadio:any=0;
  deliveryAreaRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private formBuilder: UntypedFormBuilder,private router: Router,public route:ActivatedRoute, private httpService: HttpServiceService, private snackBService: SnackBarService, private dataservice: DataService, private localService: LocalStorage, ) { }

  ngOnInit(): void {
    this.onBuildForm();
    //this.getDeliveryArea();
    this.getBranchDetails();
  }
  onBuildForm() {
    this.deliverychargeform = this.formBuilder.group({
      delivery_charge_type: ['fixed', Validators.compose([Validators.required])],
      delivery_charge: [0, Validators.compose([Validators.required,Validators.pattern("[+]?([0-9]*[.])?[0-9]+")])],
      min_cart_value: [0, Validators.compose([Validators.required,Validators.pattern("[+]?([0-9]*[.])?[0-9]+")])],
    });
   

  }
  gotoDeliveryArea(){
    
      this.saveSettings()
      this.router.navigate(['setup/delivery_settings/area'])
   }
   getBranchDetails(){
    this.httpService.get('branch/'+ this.id,false)
      .subscribe(result => {
        if (result.status == 200) {
         
          this.deliverychargeform.patchValue({
          delivery_charge:result.data.delivery_charge ,
          min_cart_value:result.data.minimum_cart_amount,
          delivery_charge_type:result.data.delivery_charge_type==1?'delivery':'fixed',
        })
        
        } else {
          console.log("Error in get delivery area");
        }
      });
   }
  
  // getDeliveryArea() {
  //   this.httpService.get('list-delivery-areas/' + this.id, false)
  //     .subscribe(result => {
  //       if (result.status == 200) {

  //         this.deliveryAreaRecords = result.data;
  //       } else {
  //         console.log("Error in get delivery area");
  //       }
  //     });
  // }
  changeRadio(event:any){
  
   this.deliverychargeform.patchValue({
    delivery_charge_type:event.value
   })
   
   
  }
  saveSettings() 
  {
    
    
    // if(this.deliverychargeform.value['delivery_charge_type']=='fixed' && this.deliverychargeform.value['delivery_charge'] == '' ){
    //   this.snackBService.openSnackBar("Please Enter Delivery Charge ", "Close");
    // }
    // else if(this.deliverychargeform.value['delivery_charge_type']=='fixed' && this.deliverychargeform.value['min_cart_value'] == ''){
    //   this.snackBService.openSnackBar("Please Enter  Minimum Cart Amount ", "Close");
    // }
   
    // else{
      let param = {
        'branch_id':this.id,
              'delivery_charge_type':  this.deliverychargeform.value['delivery_charge_type']=='fixed'?0:1,
              'delivery_charge' :  this.deliverychargeform.value['delivery_charge'],
              'minimum_cart_value': this.deliverychargeform.value['min_cart_value'],
      }
      this.httpService.post('delivery-charge-method', param)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message,"Close");
            
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    // }
   
  }
  back() {
    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
}
