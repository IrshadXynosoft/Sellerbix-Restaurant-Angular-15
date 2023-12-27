import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-sms-settings',
  templateUrl: './sms-settings.component.html',
  styleUrls: ['./sms-settings.component.scss']
})
export class SmsSettingsComponent implements OnInit {
  public smsSettingsForm!: UntypedFormGroup;
  smsGateway: any = [];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SmsSettingsComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getGateway()
  }
  onBuildForm() {
    this.smsSettingsForm = this.formBuilder.group({
      gateway_name: ['', Validators.compose([Validators.required])],
      auth_token: ['', Validators.compose([Validators.required])],
      sender: ['', Validators.compose([Validators.required])],
      // auth_id:[''],
      api_id: ['', Validators.compose([Validators.required])],
      // status: ['']
    });
  }

  getGateway() {
    this.httpService.get('sms-gateways', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.smsGateway = result.data.gateways;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  save() {
    let body = {
      sms_gateway_id: this.smsSettingsForm.value['gateway_name'],
      sender_id: this.smsSettingsForm.value['sender'],
      key: this.smsSettingsForm.value['api_id'],
      password: this.smsSettingsForm.value['auth_token']
    }
    this.httpService.post('sms-gateway', body, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.dialogRef.close("Done");
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
