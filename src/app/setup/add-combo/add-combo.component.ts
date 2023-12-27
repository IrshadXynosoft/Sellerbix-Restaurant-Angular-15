import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
@Component({
  selector: 'app-add-combo',
  templateUrl: './add-combo.component.html',
  styleUrls: ['./add-combo.component.scss']
})
export class AddComboComponent implements OnInit {
  public addcomboForm!: UntypedFormGroup;
  constructor(private httpService: HttpServiceService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddComboComponent>, public formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.onBuildForm();
  }

  onBuildForm() {
    this.addcomboForm = this.formBuilder.group({
      combo: ['', Validators.compose([Validators.required])],
      product_name: ['', Validators.required],
    })
    }

    close() {
      this.dialogRef.close();
    }

    submit(){
      
    }
}
