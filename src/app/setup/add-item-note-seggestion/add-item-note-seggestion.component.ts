import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-item-note-seggestion',
  templateUrl: './add-item-note-seggestion.component.html',
  styleUrls: ['./add-item-note-seggestion.component.scss']
})
export class AddItemNoteSeggestionComponent implements OnInit {

  constructor(private httpService: HttpServiceService, private snackBService: SnackBarService, public dialog: MatDialog, public dialogRef: MatDialogRef<AddItemNoteSeggestionComponent>, public formBuilder: UntypedFormBuilder) { }

  public addNoteForm!: UntypedFormGroup
  errorMessages: any = [];
  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addNoteForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
    });
  }
  close() {
    this.dialogRef.close();
  }
  addNote() {
    if (this.addNoteForm.valid) {
      let post = this.addNoteForm.value;
      this.httpService.post('item-suggestion', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Note Added Successfully!!", "Close");
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
