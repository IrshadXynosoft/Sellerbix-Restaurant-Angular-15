import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-custom-entity-dialog',
  templateUrl: './custom-entity-dialog.component.html',
  styleUrls: ['./custom-entity-dialog.component.scss']
})
export class CustomEntityDialogComponent implements OnInit {
  public orderNumberForm!:UntypedFormGroup;
  // invalidFlag:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {entity : any},private snackBService:SnackBarService ,private httpService: HttpServiceService,private formBuilder: UntypedFormBuilder,public dialog: MatDialog, public dialogRef: MatDialogRef<CustomEntityDialogComponent>) { }
  ngOnInit(): void {
    this.onBuildForm()
  }
  close() {
    this.dialogRef.close();
  }
  onBuildForm() {
    this.orderNumberForm = this.formBuilder.group({
      orderno:['',Validators.compose([Validators.required])],
    });
  }

  confirm() {
    if(this.orderNumberForm.valid){
      this.dialogRef.close(this.orderNumberForm.value['orderno'])
    }
    else{
      this.snackBService.openSnackBar("Please enter Order Number", "Close")
    }
  }
}

