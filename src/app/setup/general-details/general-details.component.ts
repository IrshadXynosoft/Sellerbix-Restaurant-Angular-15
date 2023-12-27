import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpServiceService } from '../../_services/http-service.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Constants } from 'src/constants';
import { MatChipInputEvent } from '@angular/material/chips';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
declare const google: any;
export interface emails {
  email: string;
}
@Component({
  selector: 'app-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
})
export class GeneralDetailsComponent implements OnInit, AfterViewInit {
  public generaldetailsForm!: UntypedFormGroup;
  cityArray: any = [];
  countryArray: any = [];
  branchId: any;
  currencyArray: any = [];
  defaultLat: any = 25.2854;
  defaultLng: any = 51.531;
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  public validEmailExoression = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$';
  map: any;
  @ViewChild('mapElement') mapElement: any;
  id = this.route.snapshot.params.id;
  latitude: any;
  longitude: any;
  outletBanner: any | ArrayBuffer = null;
  outletBannerNew: any | ArrayBuffer = null;
  emails: any = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  constructor(
    private constant: Constants,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private httpService: HttpServiceService,
    private route: ActivatedRoute,
    private snackBService: SnackBarService
  ) {}
  branchDetails: any = [];
  ngOnInit(): void {
    this.onBuildForm();
    this.getCity();
    this.getCountry();
    this.getBranchDetails();
    this.getCurrency();
  }

  ngAfterViewInit(): void {
    // this.initMap();
  }

  initMap() {
    let defaultPosition = {
      lat: parseFloat(this.defaultLat),
      lng: parseFloat(this.defaultLng),
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 14,
      center: defaultPosition,
    });

    //let infoWindow = new google.maps.InfoWindow();
    let pos = {
      lat: this.defaultLat,
      lng: this.defaultLng,
    };
    let marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
    });

    marker.addListener(
      'dragend',
      (event: any) => {
        this.patchCoordinates(event.latLng.lat(), event.latLng.lng());
      },
      false
    );

    // if (navigator.geolocation) {

    //   navigator.geolocation.getCurrentPosition(
    //     (position: GeolocationPosition) => {
    //       let pos = {
    //         lat: this.defaultLat? this.defaultLat : position.coords.latitude,
    //         lng: this.defaultLng ? this.defaultLng : position.coords.longitude,
    //       };
    //       this.patchCoordinates(this.defaultLat? this.defaultLat : position.coords.latitude, this.defaultLng ? this.defaultLng : position.coords.longitude);
    //       //infoWindow.setPosition(pos);
    //       infoWindow.setContent("Your current location");
    //       // infoWindow.open(this.map);

    //      this.map.setCenter(pos);

    //       // Add marker
    //       let marker = new google.maps.Marker({
    //         position: pos,
    //         map: this.map,
    //         draggable:true,
    //       });

    //       marker.addListener('dragend', (event:any) => {
    //         this.patchCoordinates(event.latLng.lat(), event.latLng.lng());
    //       }, false);

    //     },() => {
    //       this.handleLocationError();
    //     }
    //   );
    // } else {
    //   // Browser doesn't support Geolocation
    //   this.handleLocationError();
    // }
  }

  patchCoordinates(latitude: any, longitude: any) {
    this.generaldetailsForm.patchValue({
      latitude: latitude,
      longitude: longitude,
    });
  }

  handleLocationError() {
    this.snackBService.openSnackBar(
      'The Geolocation service failed. Always allow to access your location.',
      'Close'
    );
  }

  onBuildForm() {
    this.generaldetailsForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpression),
          Validators.maxLength(75),
        ]),
      ],
      address: ['', Validators.compose([Validators.required])],
      contactNumber: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      latitude: ['', Validators.compose([Validators.required])],
      longitude: ['', Validators.compose([Validators.required])],
      country: [''],
      currency: [''],
      licence_no: [''],
      delivery_charge: ['', [Validators.pattern('[+]?([0-9]*[.])?[0-9]+')]],
      isPrimary: [false],
      // email_id: ['', Validators.compose([Validators.required, Validators.pattern(this.validEmailExoression)])],
      type: ['0'],
    });
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Adding emails
    if (value) {
      this.emails.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: emails): void {
    const index = this.emails.indexOf(tag);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
  editLocation() {
    this.router.navigate(['setup/' + this.id + '/editLocation']);
  }
  getBranchDetails() {
    this.branchId = this.route.snapshot.params.id;
    this.httpService.get('branch/' + this.branchId).subscribe((result) => {
      if (result.status == 200) {
        this.branchDetails = result.data;
        this.defaultLat = 25.2854;
        this.defaultLng = 51.531;
        this.generaldetailsForm.patchValue({
          name: this.branchDetails.name,
          address: this.branchDetails.address,
          contactNumber: this.branchDetails.contact_no,
          city: this.branchDetails.city,
          latitude: this.branchDetails.latitude,
          longitude: this.branchDetails.longitude,
          country: this.branchDetails.country_id,
          currency: this.branchDetails.currency_id,
          licence_no: this.branchDetails.licence_no,
          delivery_charge: this.branchDetails.delivery_charge?.toFixed(2),
          email_id: this.branchDetails.email_id,
          isPrimary: this.branchDetails.is_primary,
          type: this.branchDetails.type,
        });
        this.emails = this.branchDetails.email_id
          ? this.branchDetails.email_id.split(',')
          : [];
          console.log(this.emails);
          
        this.outletBanner = this.branchDetails.image_url
          ? this.constant.imageBasePath + this.branchDetails.image_url
          : 'assets/images/outlet-banner.png';
        this.initMap();
      } else {
        console.log('Error in Get Branch');
      }
    });
  }
  getCountry() {
    this.httpService.get('country').subscribe((result) => {
      if (result.status == 200) {
        this.countryArray = result.data.countries;
      } else {
        console.log('Error in Get country');
      }
    });
  }

  handleFileInput(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.outletBannerNew = reader.result?.toString();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  getCity() {
    this.httpService.get('city').subscribe((result) => {
      if (result.status == 200) {
        this.cityArray = result.data.cities;
      } else {
        console.log('Error in city');
      }
    });
  }

  getCurrency() {
    this.httpService.get('currency').subscribe((result) => {
      if (result.status == 200) {
        this.currencyArray = result.data.currencies;
      } else {
        console.log('Error in currency');
      }
    });
  }

  updateLocation() {
    let put = {
      name: this.generaldetailsForm.value['name'],
      contact_no: this.generaldetailsForm.value['contactNumber'],
      currency_id: this.generaldetailsForm.value['currency'],
      country_id: this.generaldetailsForm.value['country'],
      city: this.generaldetailsForm.value['city'],
      latitude: this.generaldetailsForm.value['latitude'],
      longitude: this.generaldetailsForm.value['longitude'],
      address: this.generaldetailsForm.value['address'],
      licence_no: this.generaldetailsForm.value['licence_no'],
      delivery_charge: this.generaldetailsForm.value['delivery_charge'],
      is_primary: this.generaldetailsForm.value['isPrimary'],
      type: this.generaldetailsForm.value['type'],
      file: this.outletBannerNew ? this.outletBannerNew : null,
      send_to_emails: this.emails,
    };
    this.httpService.put('branch/' + this.branchId, put).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar(
          'Location Edited Successfully',
          'Close'
        );
      } else {
        Validators.pattern(this.validationExpression), Validators.maxLength(75);
      }
    });
  }
}
