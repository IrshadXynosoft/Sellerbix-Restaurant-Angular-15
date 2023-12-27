import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-smtp-settings',
  templateUrl: './smtp-settings.component.html',
  styleUrls: ['./smtp-settings.component.scss']
})
export class SmtpSettingsComponent implements OnInit {
  public smtpForm!: UntypedFormGroup;
  smtpSettings: any = [];
  public validEmailExoression = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  constructor(private httpService: HttpServiceService,
    public dialog: MatDialog,
    public formBuilder: UntypedFormBuilder,
    public snackBService: SnackBarService,
    private localService: LocalStorage) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getSMTPSettings();
  }
  onBuildForm() {
    this.smtpForm = this.formBuilder.group({
      sender_email: ['', Validators.compose([Validators.required, Validators.pattern(this.validEmailExoression)])],
      smtp_host: ['', Validators.compose([Validators.required])],
      smtp_port: ['', Validators.compose([Validators.required])],
      smtp_user: ['', Validators.compose([Validators.required])],
      smtp_password: ['', Validators.compose([Validators.required])],
      test_email: ['', Validators.compose([Validators.required, Validators.pattern(this.validEmailExoression)])],
      default: [false],
      tls: [false],
      ssl: [false]
    })
  }
  getSMTPSettings() {
    this.httpService.get('email-settings')
      .subscribe(result => {

        if (result.status == 200) {
          this.smtpSettings = result.data;
          this.smtpForm.patchValue({
            sender_email: this.smtpSettings.sender_email,
            smtp_host: this.smtpSettings.smtp_host,
            smtp_port: this.smtpSettings.smtp_port,
            smtp_user: this.smtpSettings.smtp_user,
            smtp_password: this.smtpSettings.smtp_password,
            test_email: this.smtpSettings.test_email,

          })
         if( this.smtpSettings.smtp_connection && this.smtpSettings.smtp_connection.length>0)
         {
          this.smtpSettings.smtp_connection.forEach((element:any) => {
              if (element=='default')
              this.smtpForm.controls.default.setValue('true');
              else if (element=='tls')
              this.smtpForm.controls.tls.setValue('true');
               else if (element=='ssl')
               this.smtpForm.controls.ssl.setValue('true');
            });
        }
         else{
          this.smtpForm.controls.default.setValue('true');
         }
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  sendMail() {
    let body={
      'email': this.smtpForm.value['test_email']
    }
    this.httpService.post('send-test-email', body)
    .subscribe(result => {
      if (result.status == 200) {

      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
  saveSettings() {
    let smtp_connection: any = [];
    console.log(this.smtpForm.value['tls']);

    if (this.smtpForm.value['default'])
      smtp_connection.push('default')
    if (this.smtpForm.value['tls'])
      smtp_connection.push('tls')
    if (this.smtpForm.value['ssl'])
      smtp_connection.push('ssl')
    let postparams = {
      sender_email: this.smtpForm.value['sender_email'],
      smtp_host: this.smtpForm.value['smtp_host'],
      smtp_port: this.smtpForm.value['smtp_port'],
      smtp_user: this.smtpForm.value['smtp_user'],
      smtp_password: this.smtpForm.value['smtp_password'],
      test_email: this.smtpForm.value['test_email'],
      smtp_connection: smtp_connection
    }
    this.httpService.post('email-settings', postparams)
      .subscribe(result => {
        if (result.status == 200) {

          this.snackBService.openSnackBar("Settings Added Successfully", "Close");

        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}
