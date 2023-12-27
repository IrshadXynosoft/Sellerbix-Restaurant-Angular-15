import { Component,Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-reason',
  templateUrl: './edit-reason.component.html',
  styleUrls: ['./edit-reason.component.scss']
})
export class EditReasonComponent implements OnInit {
  errorMessages:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id:any,reason:any,entity_id:any},private snackBService: SnackBarService, private httpService:HttpServiceService,  public dialog: MatDialog, public dialogRef: MatDialogRef<EditReasonComponent>,public formBuilder:UntypedFormBuilder) { }
  public editReasonForm!: UntypedFormGroup;

  ngOnInit(): void {
    console.log(this.data.entity_id);
    
    this.onBuildForm();
  }
  close() {
    this.dialogRef.close();
  }
  onBuildForm() {
    this.editReasonForm = this.formBuilder.group({
      reason: [this.data.reason, Validators.compose([Validators.required,Validators.maxLength(200)])],
      entity_id:[this.data.entity_id]
    });
  }
  editReason(){
    let post = {
      reason:this.editReasonForm.value['reason'],
      entity_id:this.editReasonForm.value['entity_id']=='online'?5:1
    }
   
    this.httpService.put('cancellation-reason'+ '/' + this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Reason Updated Successfully!!", "Close");
          this.close();
        } else {
          if(result.data){
            this.errorMessages=result.data
          }
        }
      });
  }
}
