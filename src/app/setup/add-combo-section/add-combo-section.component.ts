import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-add-combo-section',
  templateUrl: './add-combo-section.component.html',
  styleUrls: ['./add-combo-section.component.scss']
})
export class AddComboSectionComponent implements OnInit {
  constructor(private httpService:HttpServiceService,private snackBService:SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddComboSectionComponent>,public formBuilder:UntypedFormBuilder) { }
  public addcomboForm!:UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addcomboForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpression),Validators.maxLength(75)])],
      sequence_number: ['', Validators.compose([Validators.required])],
      is_allow_skip: false
     });
  }
 close() { 
  this.dialogRef.close();
 }
 addcombo(){
  let post = this.addcomboForm.value;
  this.httpService.post('combo', post)
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Combo Added Successfully!!", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
      }
    });
 }
}
