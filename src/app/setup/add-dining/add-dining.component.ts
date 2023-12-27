import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpServiceService } from '../../_services/http-service.service';
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-add-dining',
  templateUrl: './add-dining.component.html',
  styleUrls: ['./add-dining.component.scss'],
})
export class AddDiningComponent implements OnInit {
  public addDiningForm!: UntypedFormGroup;
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  public validationExpressionInteger = '^[0-9]{1,5}$';
  requestErrorArray: any = [];
  branch_id: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddDiningComponent>,
    private formBuilder: UntypedFormBuilder,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localStorage: LocalStorage,
    @Inject(MAT_DIALOG_DATA)
    public data: { operation: any; table: any; branch_id: string }
  ) {
    this.branch_id = this.localStorage.get('branch_id');
  }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.addDiningForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpression),
        ]),
      ],
      sequence_no: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpressionInteger),
        ]),
      ],
    });
    if (this.data.operation == 'edit') {
      this.addDiningForm.patchValue({
        name: this.data.table.name,
        sequence_no: this.data.table.sequence_no,
      });
    }
  }
  addDining() {
    let post = {
      name: this.addDiningForm.value['name'],
      sequence_no: this.addDiningForm.value['sequence_no'],
      branch_id: this.data.branch_id,
    };
   if(this.data.operation == 'edit'){
    this.httpService.put('branch-dining/' +this.data.table.id, post).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar('Dining updated Successfully', 'Close');
        this.close();
      } else {
        this.requestErrorArray = result.data;
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
   }
   else {
    this.httpService.post('branch-dining', post).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar('Dining added Successfully', 'Close');
        this.close();
      } else {
        this.requestErrorArray = result.data;
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
   }
  }

  close() {
    this.dialogRef.close();
  }
}
