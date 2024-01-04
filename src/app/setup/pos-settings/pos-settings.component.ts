import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-pos-settings',
  templateUrl: './pos-settings.component.html',
  styleUrls: ['./pos-settings.component.scss']
})
export class PosSettingsComponent implements OnInit {
  id: any;
  notificationSettings: any;
  public notificationForm!: UntypedFormGroup;
  public kotForm!: UntypedFormGroup;
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: FormBuilder, private snackBService: SnackBarService,
    private localService: LocalStorage, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
    this.settingsData = this.localService.get('branch_settings');
  }
  settingsData: any;
  public posForm!: UntypedFormGroup;
  ngOnInit(): void {
    this.onBuildForm();
    this.onBuildNotificationForm();
    this.onBuildKotForm();
    this.getBranchSettings();
    this.posForm.patchValue({
      show_utensils: this.settingsData.show_utensils,
      label_print: this.settingsData.label_print,
      order_modify_popup: this.settingsData.order_modify_popup,
      assign_waiter: this.settingsData.assign_waiter
    })
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
            on_driver_order_delivered: this.notificationSettings.on_driver_order_delivered,
          })
          this.kotForm.patchValue({
            new_items_on_kot: this.notificationSettings.new_items_on_kot
          })
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  onBuildForm() {
    this.posForm = this.formBuilder.group({
      show_utensils: [''],
      label_print: [''],
      order_modify_popup: [''],
      assign_waiter: ['']
    });
  }

  onBuildKotForm() {
    this.kotForm = this.formBuilder.group({
      new_items_on_kot: [''],
    });
  }
  back() {
    this.router.navigate(['setup/' + this.id + '/editLocation'])
  }

  changeStatus() {
    // let status = event.checked
    let params: any = {
      'on_order_accepted': this.settingsData.on_order_accepted ? this.settingsData.on_order_accepted : 0,
      'on_order_rejected': this.settingsData.on_order_rejected ? this.settingsData.on_order_rejected : 0,
      'on_order_assigned_to_driver': this.settingsData.on_order_assigned_to_driver ? this.settingsData.on_order_assigned_to_driver : 0,
      'on_driver_order_accepted': this.settingsData.on_driver_order_accepted ? this.settingsData.on_driver_order_accepted : 0,
      'on_driver_order_delivered': this.settingsData.on_driver_order_delivered ? this.settingsData.on_driver_order_delivered : 0,
      'show_utensils': this.posForm.value['show_utensils'],
      'label_print': this.posForm.value['label_print'],
      'order_modify_popup': this.posForm.value['order_modify_popup'],
      'assign_waiter': this.posForm.value['assign_waiter'],
      'store_pickup': this.settingsData.store_pickup ? this.settingsData.store_pickup : 0,
      'delivery': this.settingsData.delivery ? this.settingsData.delivery : 0,
      'dine_in': this.settingsData.dine_in ? this.settingsData.dine_in : 0,
      'branch_id': this.id,
      'new_items_on_kot': this.kotForm.value['new_items_on_kot'],
    }
    this.httpService.post('branch-status-settings', params)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.localService.store('branch_settings', result.data)
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
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
      'new_items_on_kot': this.kotForm.value['new_items_on_kot'],
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


