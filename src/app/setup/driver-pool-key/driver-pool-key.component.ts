import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-driver-pool-key',
  templateUrl: './driver-pool-key.component.html',
  styleUrls: ['./driver-pool-key.component.scss']
})
export class DriverPoolKeyComponent implements OnInit {
  branch_id = this.localService.get('branch_id');
  public keyForm!: UntypedFormGroup;
  public validEmailExoression = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$";
  keyFlag: boolean = false;
  constructor(public formBuilder: UntypedFormBuilder, private localService: LocalStorage, private httpService: HttpServiceService, private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getKey()
  }

  onBuildForm() {
    this.keyForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.validEmailExoression)])],
      updatingKey: ['', Validators.compose([Validators.required])],
      getKey: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    })
  }

  getKey() {
    this.httpService.get('driverpool-key/' + this.branch_id)
      .subscribe(result => {
        if (result.status == 200) {
          if (result.data != null) {
            this.localService.store('driverPoolKey',result.data)
            this.keyFlag = true;
            this.keyForm.patchValue({
              'getKey': result.data
            })
          }
          else {
            this.keyFlag = false;
          }
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  validate() {
    let data: any = {}
    data.key = this.keyForm.value['updatingKey']
    if (this.keyForm.value['updatingKey']) {
      this.httpService.driver_pool_post('validate-branch-key', data)
        .subscribe(result => {
          if (result.status == 200) {
            this.updateKey(data);
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        })
    }
    else {
      this.snackBService.openSnackBar("Please enter key", "Close")
    }
  }

  updateKey(key:any) {
    this.httpService.post('update-driverpool-key/' + this.branch_id, key)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Branch Key Saved Successfully!", "Close");
          this.getKey();
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      })
  }

  login() {
    let body: any = {}
    body.email = this.keyForm.value['email'];
    body.password = this.keyForm.value['password'];
    if (this.keyForm.value['email'] && this.keyForm.value['password']) {
      this.httpService.driver_pool_post('login', body)
        .subscribe(result => {
          if (result.status == 200) {
            if (result.data.user.branch?.key) {
              let data :any ={}
              data.key = result.data.user.branch?.key;
              this.updateKey(data)
            }
            else {
              this.snackBService.openSnackBar("Invalid Credentials", "Close")
            }
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        })
    }
    else {
      this.snackBService.openSnackBar("Please enter email and password", "Close")
    }
  }

}
