import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-reason',
  templateUrl: './add-reason.component.html',
  styleUrls: ['./add-reason.component.scss']
})
export class AddReasonComponent implements OnInit {
  errorMessages:any=[]
  constructor(private snackBService: SnackBarService, private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddReasonComponent>, public formBuilder: UntypedFormBuilder) { }
  public addReasonForm!: UntypedFormGroup;
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addReasonForm = this.formBuilder.group({
      reason: ['', Validators.compose([Validators.required,Validators.maxLength(100)])],
      entity_id:['normal']
    });
  }
  emailPattern(emailPattern: any): import("@angular/forms").ValidatorFn | null | undefined {
    throw new Error('Method not implemented.');
  }
  close() {
    this.dialogRef.close();
  }
  addReason() {
    let post = {
      reason:this.addReasonForm.value['reason'],
      entity_id:this.addReasonForm.value['entity_id']=='online'?5:1
    }
    this.httpService.post('cancellation-reason', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Reason Added Successfully!!", "Close");
          this.close();
        } else {
          if(result.data){
            this.errorMessages=result.data
          }
        }
      });
  }
}
