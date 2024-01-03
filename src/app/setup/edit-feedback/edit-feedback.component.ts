import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-feedback',
  templateUrl: './edit-feedback.component.html',
  styleUrls: ['./edit-feedback.component.scss']
})
export class EditFeedbackComponent {
  questionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditFeedbackComponent>,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: { editData: any }
  ) {}

  ngOnInit() {    
    this.questionForm = this.fb.group({
      question: [this.data.editData.question,Validators.required],
      status:[this.data.editData.status]
    });
  }

  close() {
    this.dialogRef.close();
  }

  addFeedback() {
    if (this.questionForm.valid) {
      this.httpService
        .put('branch-feedback-form/' +this.data.editData.id, this.questionForm.value)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, 'Close');
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      this.snackBService.openSnackBar('Please add question', 'Close');
    }
  }
}
