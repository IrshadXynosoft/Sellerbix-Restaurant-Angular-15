import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-edit-tenant',
  templateUrl: './edit-tenant.component.html',
  styleUrls: ['./edit-tenant.component.scss']
})
export class EditTenantComponent implements OnInit {

  public generaldetailsForm!: UntypedFormGroup;
  cityArray: any = []
  countryArray: any = []
  tenantId: any
  currencyArray: any = []
  errorArray: any = []
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  branchDetails: any = []
  selectedFile:File | null = null;
  ImageBaseData:any | ArrayBuffer=null;
  constructor(private router: Router, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private route: ActivatedRoute, private snackBService: SnackBarService) { }
  
  ngOnInit(): void {
    this.onBuildForm();
    this.getCountry();
  }
  onBuildForm() {
    this.generaldetailsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpression), Validators.maxLength(75)])],
      contactNumber: ['', Validators.compose([Validators.required, Validators.pattern('[- +()0-9]{8,16}')])],
      country: ['', Validators.compose([Validators.required])],
      file: new UntypedFormControl(''),
      fileSource: new UntypedFormControl(''),
      timezone: ['', Validators.compose([Validators.required])],
      website:[''],
    });
  }
  gettenantDetails() {
    this.tenantId = this.route.snapshot.params.id;
    this.httpService.get('tenant')
      .subscribe(result => {
        if (result.status == 200) {
          this.branchDetails = result.data.tenants;
          let countryName:any
          if(this.countryArray.length>0){
            this.countryArray.forEach((element:any) => {
               if(element.id==this.branchDetails.country_id)
               {
                 countryName=element.name
               }
            });
          }
         
          this.generaldetailsForm.patchValue({
            name: this.branchDetails.name,
            contactNumber: this.branchDetails.contact_no,
            country: countryName?countryName:-'-',
            // business: this.branchDetails.business_day_end,
            website:this.branchDetails.website,
            timezone:this.branchDetails.timezone
            })

          this.generaldetailsForm.get('country')!.disable();
          this.generaldetailsForm.get('timezone')!.disable();
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  getCountry() {
    this.httpService.get('country')
      .subscribe(result => {
        if (result.status == 200) {
          this.countryArray = result.data.countries;
          this.gettenantDetails();
        } else {
          console.log("Error in Get country");
        }
      });
  }

  updateLocation() {
    
    let put = {
      'name': this.generaldetailsForm.value['name'],
      'contact_no': parseInt(this.generaldetailsForm.value['contactNumber']),
      // 'business_day_end': this.generaldetailsForm.value['business'],
      'website': this.generaldetailsForm.value['website'],
      'file': this.ImageBaseData,
    }
    this.httpService.put('tenant/' + this.tenantId, put)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Tenant Updated Successfully", "Close");
          this.router.navigate(['setup'])
        } else {
          this.errorArray = result.data;
           console.log("some Error Occured", "close");
        }
      });

  }

handleFileInput(event:any) {
  let me = this;
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
   me.ImageBaseData=reader.result?.toString();
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}
}