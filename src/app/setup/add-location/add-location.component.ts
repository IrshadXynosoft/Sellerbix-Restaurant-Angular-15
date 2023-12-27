import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  public addressForm!: UntypedFormGroup;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddLocationComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }
  currencyArray:any=[]
  cityArray:any=[]
  countryArray:any=[]
  timeZoneArray:any=[]
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.onBuildForm();
    this.getCity();
    this.getCountry();
    this.getCurrency();
  
  }
  
  close() {
    this.dialogRef.close();
  }
  onBuildForm() {
    this.addressForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      address: ['', Validators.compose([Validators.required,Validators.maxLength(200),Validators.pattern(this.validationExpression)])],
      contact_no: ['', Validators.compose([Validators.required, Validators.pattern('[- +()0-9]{8,16}')])],
      city: ['', Validators.compose([Validators.required])],
      latitude:[''] ,
      longitude:[''],
      currency: [''],
      country: [''],
    });
   }
  addressSubmit() {
  let post = {
      'name': this.addressForm.value['name'],
      'contact_no': parseInt(this.addressForm.value['contact_no']),
      'currency_id': this.addressForm.value['currency'],
      'country_id':this.addressForm.value['country'],
      'city_id': this.addressForm.value['city'],
      'latitude': this.addressForm.value['latitude'],
      'longitude': this.addressForm.value['longitude'],
      'address': this.addressForm.value['address']
     }
    this.httpService.post('branch', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("location added Successfully", "Close");
          this.close();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  getCountry() {
     this.httpService.get('country',false)
        .subscribe(result => {   
          if (result.status == 200) {
          this.countryArray = result.data.countries;
          } else {
            console.log("Error in Get country");
          }
      }); 
  }
  
 
  getCity() {
    this.httpService.get('city',false)
       .subscribe(result => {       
         if (result.status == 200) {
         this.cityArray = result.data.cities;
        } else {
           console.log("Error in city");
        }
     }); 
 }
 getCurrency() {
  this.httpService.get('currency',false)
     .subscribe(result => {       
      if (result.status == 200) {
       this.currencyArray = result.data.currencies;
      } else {
         console.log("Error in currency");
       }
   }); 
}
}
