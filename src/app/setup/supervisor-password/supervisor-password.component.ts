import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-supervisor-password',
  templateUrl: './supervisor-password.component.html',
  styleUrls: ['./supervisor-password.component.scss']
})
export class SupervisorPasswordComponent implements OnInit {
  public supervisorForm!: UntypedFormGroup;
  constructor(private router: Router,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService, private snackBService: SnackBarService ) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm()
  {
    this.supervisorForm = this.formBuilder.group({
      supervisor_password: ['', Validators.compose([Validators.required])],
    });
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  save()
  {
    let post = this.supervisorForm.value;
    this.httpService.post('settings', post)
      .subscribe(result => {       
      if (result.status == 200) {
        this.snackBService.openSnackBar("Password saved Successfully", "Close");
        
      }else{
        this.snackBService.openSnackBar(result.message, "Close");
      }
    }); 
  }
}
