import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-item-note-seggestion',
  templateUrl: './edit-item-note-seggestion.component.html',
  styleUrls: ['./edit-item-note-seggestion.component.scss']
})
export class EditItemNoteSeggestionComponent implements OnInit {

  constructor(private httpService: HttpServiceService, private snackBService: SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<EditItemNoteSeggestionComponent>, public formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: { note: any, id: any }) { }

  public addNoteForm!: UntypedFormGroup
  // public validationExpression = "^(?! )[A-Za-z0-9 &-_]*(?<! )$"
  errorMessages: any = [];
  ngOnInit(): void {
    this.onBuildForm();
    this.addNoteForm.patchValue({
      'name': this.data.note
    })
  }
  onBuildForm() {
    this.addNoteForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
    });
  }
  close() {
    this.dialogRef.close();
  }
  updateNote() {
    if (this.addNoteForm.valid) {
      let post = this.addNoteForm.value;
      this.httpService.put('item-suggestion/' + this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Note Updated Successfully!!", "Close");
            this.close();
          } else {
            if (result.data) {
              this.errorMessages = result.data;
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }
}
