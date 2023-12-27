import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';

@Component({
  selector: 'app-add-modify-reason',
  templateUrl: './add-modify-reason.component.html',
  styleUrls: ['./add-modify-reason.component.scss']
})
export class AddModifyReasonComponent implements OnInit {
  ErrorArray:any=[];
  constructor(private snackBService:SnackBarService,private httpService:HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddModifyReasonComponent>,public formBuilder:UntypedFormBuilder) { }

  public addModifyReasonForm!:UntypedFormGroup
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addModifyReasonForm = this.formBuilder.group({
      reason: ['', Validators.compose([Validators.required,Validators.maxLength(200)])],
    });
  }
 close() {
  this.dialogRef.close();
 }
 addModifyReason(){
  let post = this.addModifyReasonForm.value;
  this.httpService.post('modify-reason', post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Modify Reason Added Successfully!!", "Close");
        this.close();
      } else {
        if(result.data){
          this.ErrorArray=result.data
        }
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
 }
}
