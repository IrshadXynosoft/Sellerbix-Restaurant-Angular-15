import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-online-other-settings',
  templateUrl: './online-other-settings.component.html',
  styleUrls: ['./online-other-settings.component.scss']
})
export class OnlineOtherSettingsComponent implements OnInit {
  id = this.route.snapshot.params.id;
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: FormBuilder, private snackBService: SnackBarService,
    private localservice: LocalStorage, private route: ActivatedRoute) { }
  settingsData: any;
  public posForm!: UntypedFormGroup;
  paymentMethods: any = [];
  paymentSettings: any = [];
  ngOnInit(): void {
    this.onBuildForm();
    this.getBranchSettings();
    this.getPaymentMethod();
  }
  getBranchSettings() {
    this.httpService.get('branch-settings/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.settingsData = result.data ? result.data : {}
          this.posForm.patchValue({
            store_pickup: this.settingsData.store_pickup,
            dine_in: this.settingsData.dine_in,
            delivery: this.settingsData.delivery
          })
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  onBuildForm() {

    this.posForm = this.formBuilder.group({
      store_pickup: [false],
      dine_in: [false],
      delivery: [false]
    });

  }
  getPaymentMethod() {
    this.httpService.get('payment-type', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.paymentMethods = result.data.payment_types;
          this.getPaymentSettings();
        } else {
          console.log("Error");
        }
      });
  }
  getPaymentSettings() {
    this.httpService.get('branch-payment-type', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.paymentSettings = result.data

        } else {
          console.log("Error");
        }
      });
  }
  isCheckedPaymentType(id: any) {
    let found = this.paymentSettings?.find(function (obj: any) {
      return obj.payment_type_id == id && obj.status==1;
    });
    if (found)
      return true;
    else
      return false;
  }
  back() {
    this.router.navigate(['/setup/location/' + this.id + '/online'])
  }


  saveSettings() {
    let params: any = {
      'on_order_accepted': this.settingsData.on_order_accepted ? this.settingsData.on_order_accepted : 0,
      'on_order_rejected': this.settingsData.on_order_rejected ? this.settingsData.on_order_rejected : 0,
      'on_order_assigned_to_driver': this.settingsData.on_order_assigned_to_driver ? this.settingsData.on_order_assigned_to_driver : 0,
      'on_driver_order_accepted': this.settingsData.on_driver_order_accepted ? this.settingsData.on_driver_order_accepted : 0,
      'on_driver_order_delivered': this.settingsData.on_driver_order_delivered ? this.settingsData.on_driver_order_delivered : 0,
      'show_utensils': this.settingsData.show_utensils ? this.settingsData.show_utensils : 0,
      'store_pickup': this.posForm.value['store_pickup'],
      'delivery': this.posForm.value['delivery'],
      'dine_in': this.posForm.value['dine_in'],
      'branch_id': this.id
    }
    this.httpService.post('branch-status-settings', params)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  savePaymentSettings(event: any, payment_type_id: any) {
    let status: any
    if (event.checked) {
      status = true
    }
    else {
      status = false
    }
    let params: any = {
      'payment_type_id': payment_type_id,
      'status': status,
      'branch_id': this.id
    }
    this.httpService.post('branch-payment-type', params)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}