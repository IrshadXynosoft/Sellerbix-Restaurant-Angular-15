import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-combo-section',
  templateUrl: './edit-combo-section.component.html',
  styleUrls: ['./edit-combo-section.component.scss']
})
export class EditComboSectionComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: any,combo_name:any,seq_number:any,allow_skip:any},private httpService:HttpServiceService,private snackBService:SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<EditComboSectionComponent>,public formBuilder:UntypedFormBuilder) { }
  public editcomboForm!:UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.editcomboForm = this.formBuilder.group({
      name: [this.data.combo_name, Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      sequence_number: [this.data.seq_number, Validators.compose([Validators.required])],
      is_allow_skip: this.data.allow_skip
    });
  }
  close() {
    this.dialogRef.close();
   }
   editCombo(){
    let post = this.editcomboForm.value;
    this.httpService.put('combo'+ '/' + this.data.id, post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Combo Edited Successfully!!", "Close");
          this.close();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
   }
}
