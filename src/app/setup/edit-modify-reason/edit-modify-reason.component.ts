import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-edit-modify-reason',
  templateUrl: './edit-modify-reason.component.html',
  styleUrls: ['./edit-modify-reason.component.scss']
})
export class EditModifyReasonComponent implements OnInit {
  ErrorArray:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id:any,reason:any},private snackBService: SnackBarService, private httpService:HttpServiceService,  public dialog: MatDialog, public dialogRef: MatDialogRef<EditModifyReasonComponent>,public formBuilder:UntypedFormBuilder) { }
  public editmodifyReasonForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.editmodifyReasonForm = this.formBuilder.group({
      reason: [this.data.reason, Validators.compose([Validators.required,Validators.maxLength(100)])],
    });
  }
  close() {
    this.dialogRef.close();
  }
  editmodifyReason(){
    let post = this.editmodifyReasonForm.value;
    this.httpService.put('modify-reason'+ '/' + this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Reason Updated Successfully!!", "Close");
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
