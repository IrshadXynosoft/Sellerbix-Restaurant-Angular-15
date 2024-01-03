import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss'],
})
export class AddFeedbackComponent {
  questionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddFeedbackComponent>,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService
  ) {}

  ngOnInit() {
    this.questionForm = this.fb.group({
      questions: this.fb.array([this.createQuestion()]),
    });
  }

  get questions() {
    return this.questionForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', Validators.required],
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  close() {
    this.dialogRef.close();
  }

  addFeedback() {
    if (this.questionForm.valid) {
      this.httpService
        .post('branch-feedback-form', this.questionForm.value)
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
