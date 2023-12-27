import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-enter-drawer-balance',
  templateUrl: './enter-drawer-balance.component.html',
  styleUrls: ['./enter-drawer-balance.component.scss']
})
export class EnterDrawerBalanceComponent implements OnInit {
  public voidReasonForm!: UntypedFormGroup;
  constructor(private snackBService: SnackBarService, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<EnterDrawerBalanceComponent>) { }

  ngOnInit(): void {
    this.onBuildForm()
  }
  onBuildForm() {
    this.voidReasonForm = this.formBuilder.group({
      balance: ['', Validators.compose([Validators.required])]
    })
  }


  save() {
    if (this.voidReasonForm.valid) {
      this.dialogRef.close(this.voidReasonForm.value['balance'])
    }
    else {
      this.snackBService.openSnackBar("Invalid input", "Close")
    }
  }

  close() {
    this.dialogRef.close();
  }

}

