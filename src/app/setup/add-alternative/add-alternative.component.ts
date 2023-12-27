import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-alternative',
  templateUrl: './add-alternative.component.html',
  styleUrls: ['./add-alternative.component.scss']
})
export class AddAlternativeComponent implements OnInit {
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddAlternativeComponent>,public formBuilder:UntypedFormBuilder) { }

  public addalternatelangForm!:UntypedFormGroup;
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addalternatelangForm = this.formBuilder.group({
      addalternatelang: ['', Validators.compose([Validators.required])]
    });
  }
 close() {
  this.dialogRef.close();
 }
}
