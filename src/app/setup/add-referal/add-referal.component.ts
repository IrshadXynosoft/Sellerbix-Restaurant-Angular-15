import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-referal',
  templateUrl: './add-referal.component.html',
  styleUrls: ['./add-referal.component.scss']
})
export class AddReferalComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddReferalComponent>,public formBuilder:UntypedFormBuilder) { }
  public addReferalForm!: UntypedFormGroup;
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addReferalForm = this.formBuilder.group({
      addReferal: ['', Validators.compose([Validators.required])],
    });
  }

 close() {
  this.dialogRef.close();
 }
}
