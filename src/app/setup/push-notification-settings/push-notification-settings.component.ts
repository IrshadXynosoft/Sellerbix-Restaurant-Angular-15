import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-push-notification-settings',
  templateUrl: './push-notification-settings.component.html',
  styleUrls: ['./push-notification-settings.component.scss']
})
export class PushNotificationSettingsComponent implements OnInit {
  id = this.route.snapshot.params.id;
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: FormBuilder, private snackBService: SnackBarService,
    private localservice: LocalStorage, private route: ActivatedRoute) { }
  public notificationForm!: UntypedFormGroup;
  notificationSettings: any;
  ngOnInit(): void {
    this.onBuildNotificationForm();
    this.getBranchSettings();
  }
  onBuildNotificationForm() {

    this.notificationForm = this.formBuilder.group({
      on_order_accepted: [''],
      on_order_rejected: [''],
      on_order_assigned_to_driver: [''],
      on_driver_order_accepted: [''],
      on_driver_order_delivered: ['']
    });

  }
  getBranchSettings() {
    this.httpService.get('branch-settings/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.notificationSettings = result.data ? result.data : {}
          this.notificationForm.patchValue({
            on_order_accepted: this.notificationSettings.on_order_accepted,
            on_order_rejected: this.notificationSettings.on_order_rejected,
            on_order_assigned_to_driver: this.notificationSettings.on_order_assigned_to_driver,
            on_driver_order_accepted: this.notificationSettings.on_driver_order_accepted,
            on_driver_order_delivered: this.notificationSettings.on_driver_order_delivered
          })
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  back() {
    this.router.navigate(['setup/location/' + this.id + '/settings'])
  }
  saveSettings() {
    let params: any = {
      'on_order_accepted': this.notificationForm.value['on_order_accepted'],
      'on_order_rejected': this.notificationForm.value['on_order_rejected'],
      'on_order_assigned_to_driver': this.notificationForm.value['on_order_assigned_to_driver'],
      'on_driver_order_accepted': this.notificationForm.value['on_driver_order_accepted'],
      'on_driver_order_delivered': this.notificationForm.value['on_driver_order_delivered'],
      'show_utensils': this.notificationSettings.show_utensils ? this.notificationSettings.show_utensils : 0,
      'store_pickup': this.notificationSettings.store_pickup ? this.notificationSettings.store_pickup : 0,
      'delivery': this.notificationSettings.delivery ? this.notificationSettings.delivery : 0,
      'dine_in': this.notificationSettings.dine_in ? this.notificationSettings.dine_in : 0,
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
}

