import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../_services/http-service.service";
import { Router } from '@angular/router';
import { SnackBarService } from '../_services/snack-bar.service';
import { LocalStorage } from '../_services/localstore.service';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: UntypedFormGroup;
  public emailPattern = "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
  constructor(private dataservice: DataService, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, private router: Router, private localService: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
  }

  onBuildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      password: ['', Validators.compose([Validators.required])],
    });
  }
  login() {
    // PRESENT LOADER;
    if (this.loginForm.valid) {
      let post = this.loginForm.value;
      this.httpService.post('login', post)
        .subscribe(result => {
          if (result.status == 200) {
            const token = result.data['token']
            const branchName = result.data['user'].branch.name;
            const branch_id = result.data['user'].branch.id;
            const coordinates = {
              lat: parseFloat(result.data['user'].branch.latitude),
              lng: parseFloat(result.data['user'].branch.longitude)
            }
            const country_id = result.data['user'].branch.country_id
            const user = result.data['user'].name;
            const role_type = result.data['user'].role_id;
            const currency_symbol = result.data['currency'].currency_symbol;
            const menuList = result.data['menu'];
            const mqtt_token = result.data.mqtt_token;
            const tenant_logo = result.data.tenant_logo;
            const tenant_id = result.data['user'].tenant_id;
            const drawer_status = result.data.drawer_status;
            const utensil_status = result.data.utensil_status;
            const busy_mode = result.data.busy_mode;
            const notification_status = result.data.notification_status;
            const order_cancel_permission = result.data.order_cancel_permission;
            const branch_settings = result.data.branch_settings;
            const branch_contact_no = result.data['user']['branch'].contact_no;
            this.localService.store('branch_contact_no', branch_contact_no);
            this.localService.store('drawer_status', drawer_status);
            localStorage.setItem('currency_symbol', currency_symbol)
            this.localService.store('user1', user);
            this.localService.store('tenant_id', tenant_id)
            this.localService.store('user_type', role_type);
            this.localService.store('accessToken', token);
            this.localService.store('branchname', branchName);
            this.localService.store('menuList', menuList);
            this.localService.store('branch_id', branch_id);
            this.localService.store('mqtt_token', mqtt_token);
            this.localService.store('coordinates', coordinates);
            this.localService.store('country_id', country_id);
            this.localService.store('tenant_logo', tenant_logo)
            this.localService.store('utensil_status', utensil_status);
            this.localService.store('busy_mode', busy_mode);
            this.localService.store('branch_settings', branch_settings);
            this.localService.store('notification_status', notification_status);
            this.localService.store('staff', result.data['staff_details']);
            this.localService.store('order_cancel_permission', order_cancel_permission);
            this.localService.store('accept_payment', result.data.accept_payment)
            this.localService.store('loyalty_coupon', result.data.loyalty_coupon);
            this.localService.store('customer_support', result.data.customer_support)
            this.snackBService.openSnackBar("Successfully Logged In!!", "Close");
            if (role_type == 1) {
              this.router.navigate(['dashboard']);
            }
            else {
              this.router.navigate(['home/walkin']);
            }
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
    else {
      this.validateAllFormFields(this.loginForm)
    }
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof UntypedFormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

}
