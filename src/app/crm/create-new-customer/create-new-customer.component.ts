import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddDeliveryAreaComponent } from 'src/app/setup/add-delivery-area/add-delivery-area.component';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { CustomEntityDialogComponent } from '../custom-entity-dialog/custom-entity-dialog.component';
import { PartyOrdersComponent } from '../party-orders/party-orders.component';
import { TableReservationComponent } from '../table-reservation/table-reservation.component';

@Component({
  selector: 'app-create-new-customer',
  templateUrl: './create-new-customer.component.html',
  styleUrls: ['./create-new-customer.component.scss']
})
export class CreateNewCustomerComponent implements OnInit {
  addCustomerForm!: UntypedFormGroup
  // public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$";
  public validContactNumberExpression = '[- +()0-9]{8,16}';
  public validEmailExoression = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  branchRecords: any = [];
  countryRecords: any = [];
  deliveryAreaRecords: any = [];
  branch_id: any;
  country_id: any;
  searchedContactNumber: any;
  customerErrorArray: any = [];
  customEntities: any = [];
  branch_name: any = this.localService.get('branchname');
  constructor(private formBuilder: UntypedFormBuilder, private localservice: LocalStorage, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private router: Router, private dataservice: DataService, private localService: LocalStorage, private route: ActivatedRoute) {
    this.branch_id = this.localService.get('branch_id');
    this.country_id = this.localService.get('country_id');
    this.searchedContactNumber = this.route.snapshot.params.contactNumber ? this.route.snapshot.params.contactNumber : '';
  }


  ngOnInit(): void {
    this.onBuildForm();
    this.getCustomEntities()
    this.getBranch();
    this.getCountry();
    this.getDeliveryArea();    
  }
  onBuildForm() {
    this.addCustomerForm = this.formBuilder.group({
      name: [''],
      alternate_contact_no: [''],
      contact_no: [this.searchedContactNumber, Validators.compose([Validators.required, Validators.pattern('[- +()0-9]{8,16}')])],
      email: ['', Validators.compose([Validators.pattern(this.validEmailExoression)])],
      delivery_area_id: ['', Validators.compose([Validators.required])],
      building_or_villa: [''],
      street: [''],
      flat_number: [''],
      nearest_landmark: [''],
      city: [''],
      branch_id: [this.branch_id, Validators.compose([Validators.required])],
      country_id: [{ value: this.country_id, disabled: true }],
      dob: ['']
    });
    //this.addCustomerForm.controls['country_id'].disable();

  }

  getCustomEntities() {
    this.httpService.get('tenant-entities', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.customEntities = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  getBranch() {
    this.httpService.get('branch', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error");
        }
      });
  }
  getCountry() {
    this.httpService.get('country', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.countryRecords = result.data.countries;

        } else {
          console.log("Error");
        }
      });
  }
  getDeliveryArea() {
    this.httpService.get('list-delivery-areas/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {

          this.deliveryAreaRecords = result.data;
          this.addCustomerForm.patchValue({
            delivery_area_id: this.deliveryAreaRecords[0].id
          })
        } else {
          console.log("Error in get delivery area");
        }
      });
  }
  addDeliveryArea() {
    const dialogRef = this.dialog.open(AddDeliveryAreaComponent, {

      width: '1500px', data: { branch_id: this.localService.get('branch_id') }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryArea();
    });
  }
  saveCustomer() {
    let post_add_customer_param = {
      name: this.addCustomerForm.value['name'] ? this.addCustomerForm.value['name'] : 'Unknown',
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
      dob: this.addCustomerForm.value['dob'],
    }
    this.httpService.post('customer', post_add_customer_param)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Customer added Successfully", "Close");
          let response_data = result.data;
          if (result.data) {

            let countryName: any
            if (this.countryRecords.length > 0) {
              this.countryRecords.forEach((element: any) => {
                if (element.id == response_data['country_id']) {
                  countryName = element.name
                }
              });
            }
            let branchName: any
            if (this.branchRecords.length > 0) {
              this.branchRecords.forEach((element: any) => {
                if (element.id == response_data['branch_id']) {
                  branchName = element.name
                }
              });
            }

            let locationdetails = {
              id: response_data['id'],
              country_id: this.country_id,
              building_or_villa: response_data['building_or_villa'],
              country_name: countryName,
              street: response_data['street'],
              delivery_area: response_data['delivery_area'],
              branch_name: branchName,
              branch_id: response_data['branch_id']
            };
            let customerDataForPlaceOrder = {
              locationDetails: locationdetails,
              customer_id: response_data['customer_id'],
              customer_contact_no: response_data['contact_no'],
              customer_name: response_data['name']
            }
            this.dataservice.setData('Crmdetails', customerDataForPlaceOrder);
            this.router.navigate(['home/crm/new_order'])


          }
        }
        else {
          if (result.data) {
            this.customerErrorArray = result.data
          }
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }


  cancel() {
    this.router.navigate(['callcenter'])
  }
  saveWithLocation(location_id: any, name: any) {
    let body = {
      name: this.addCustomerForm.value['name'] ? this.addCustomerForm.value['name'] : 'Unknown',
      alternate_contact_no: this.addCustomerForm.value['alternate_contact_no'],
      contact_no: this.addCustomerForm.value['contact_no'],
      email: this.addCustomerForm.value['email'],
      branch_id: location_id
    }
    if (this.addCustomerForm.value['contact_no']) {
      this.httpService.post('customer', body)
        .subscribe(result => {
          if (result.status == 200) {
            let locationdetails = {
              branch_id: location_id,
              branch_name: name
            }
            let data = {
              locationDetails: locationdetails,
              customer_id: result.data['id'],
              customer_contact_no: result.data['contact_no'],
              customer_name: result.data['name']
            }
            console.log(data);
            this.dataservice.setData('Crmdetails', data);

            this.router.navigate(['home/crm/pickup/new_order'])
          } else {
            if (result.data) {
              this.customerErrorArray = result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Contact Number Required', "Close");
    }
  }

  entityOrder(entity: any) {
    let body = {
      name: this.addCustomerForm.value['name'],
      alternate_contact_no: this.addCustomerForm.value['alternate_contact_no'],
      contact_no: this.addCustomerForm.value['contact_no'],
      email: this.addCustomerForm.value['email'],
      branch_id: this.localservice.get('branch_id')
    }
    if (this.addCustomerForm.value['contact_no']) {
      const dialogRef = this.dialog.open(CustomEntityDialogComponent, {
        width: '450px',
        data: {
          entity: entity.name
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const orderNo = result;
          this.httpService.post('customer', body)
            .subscribe(result => {
              if (result.status == 200) {
                let locationdetails = {
                  branch_id: this.localservice.get('branch_id'),
                  branch_name: this.localservice.get('branchname'),
                }
                let Data = {
                  locationDetails: locationdetails,
                  customer_id: result.id,
                  customer_contact_no: this.addCustomerForm.value['contact_no'],
                  customer_name: this.addCustomerForm.value['name'] ? this.addCustomerForm.value['name'] : 'Unknown'
                }
                this.dataservice.setData('CustomEntityOrderNO', orderNo);
                this.dataservice.setData('Crmdetails', Data);
                this.router.navigate(['home/crm/entity/' + entity.id])
              } else {
                if (result.data) {
                  this.customerErrorArray = result.data
                }
                this.snackBService.openSnackBar(result.message, "Close");
              }
            });
        }
      });
    }
    else {
      this.snackBService.openSnackBar('Please add customer contact number', "Close");
    }
  }

  tableReservation() {
    if (this.addCustomerForm.value['contact_no']) {
      const dialogRef = this.dialog.open(TableReservationComponent, {
        width: '500px', data: {
          customer_id: '',
          customer_contact_no: this.addCustomerForm.value['contact_no'],
          customer_name: this.addCustomerForm.value['name'] ? this.addCustomerForm.value['name'] : 'Unknown'
        }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
    else {
      this.snackBService.openSnackBar('Contact number Required', "Close")
    }
  }
  partyOrders() {
    if (this.addCustomerForm.value['contact_no']) {
      let Data = {
        customer_id: '',
        customer_contact_no: this.addCustomerForm.value['contact_no'],
        customer_name: this.addCustomerForm.value['name'] ? this.addCustomerForm.value['name'] : 'Unknown',
        party_details: []
      }
      const dialogRef = this.dialog.open(PartyOrdersComponent, {
        width: '500px',
        data: {
          arrayData: Data,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    else {
      this.snackBService.openSnackBar('Contact number Required', "Close")
    }
  }
}
