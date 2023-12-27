import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-tax-substitute',
  templateUrl: './tax-substitute.component.html',
  styleUrls: ['./tax-substitute.component.scss']
})
export class TaxSubstituteComponent implements OnInit {
  public substituteForm!: UntypedFormGroup;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<TaxSubstituteComponent>, private formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService, @Inject(MAT_DIALOG_DATA) public data: { id: any }) { }

  ngOnInit(): void {
    this.onBuildForm()
  }

  onBuildForm() {
    this.substituteForm = this.formBuilder.group({
      subs: this.formBuilder.array([this.addSubs()]),
    })
  }

  private addSubs(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      rate: ['']
    });
  }

  get Subs() {
    return this.substituteForm.controls["subs"] as FormArray;
  }

  addOneMoreQuestion(): void {
    this.Subs.push(this.addSubs())
  }

  deleteQuestion(index: any) {
    this.Subs.removeAt(index)
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.substituteForm.value['subs']);

    if (this.substituteForm.value['subs']) {
      let post = {
        subs: this.substituteForm.value['subs']
      }
      this.httpService.put('tax/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, "Close");
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }
}
