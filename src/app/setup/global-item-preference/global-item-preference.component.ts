import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-global-item-preference',
  templateUrl: './global-item-preference.component.html',
  styleUrls: ['./global-item-preference.component.scss']
})
export class GlobalItemPreferenceComponent implements OnInit {
  public globalPrefernceForm!: UntypedFormGroup;
  validationExpression='[+-]?([0-9]*[.])?[0-9]+'
  prefernceArray:any=[];
  constructor(private router: Router,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getPreferences();
  }
  onBuildForm() {
    this.globalPrefernceForm = this.formBuilder.group({
      vat_tax_rate: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression)])],
      food_cost:['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression)])],
      wastage: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression)])],
    });
  }
  savePreferences()
  {
    let postParams={
      vat_tax_rate:this.globalPrefernceForm.value['vat_tax_rate'],
      food_cost:this.globalPrefernceForm.value['food_cost'],
      wastage:this.globalPrefernceForm.value['wastage'],
      critical_control:null
    }
    this.httpService.post('global-item-preference', postParams)
    .subscribe(result => {       
    if (result.status == 200) {
    
     this.snackBService.openSnackBar("Item Preferences Saved Successfully", "Close");
    }else{
      this.snackBService.openSnackBar(result.message, "Close");
    }
  }); 
  }
  getPreferences()
  {
    
    this.httpService.get('global-item-preference')
    .subscribe(result => {
      if (result.status == 200) {
      this.prefernceArray=result.data;
      this.patchValues();
  
      } else {
        console.log("Error in category");
      }
    });
  }
  patchValues()
  {
    if(this.prefernceArray.length)
    {
      this.globalPrefernceForm.patchValue(
      {
        vat_tax_rate: this.prefernceArray[0].vat_tax_rate,
        food_cost:this.prefernceArray[0].food_cost,
        wastage: this.prefernceArray[0].wastage,
      }
    )
    }
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
}
