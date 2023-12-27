import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-ingredient-category',
  templateUrl: './edit-ingredient-category.component.html',
  styleUrls: ['./edit-ingredient-category.component.scss']
})
export class EditIngredientCategoryComponent implements OnInit {
  public categoryForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  categoryErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditIngredientCategoryComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService,@Inject(MAT_DIALOG_DATA) public data: {id: string,name:string},private router:Router) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.categoryForm = this.formBuilder.group({
      name: [this.data.name, Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
    });
  }
  editCategoryIngredient()
  {
    let putCategory=this.categoryForm.value;
    this.httpService.put('ingredient-category/'+ this.data.id, putCategory)
    .subscribe(result => {
       if (result.status == 200) {
        this.snackBService.openSnackBar("Category updated successfully", "Close");
        this.close();
     } else {
      this.snackBService.openSnackBar(result.message, "Close");
      if(result.data)
      {
         this.categoryErrorArray=result.data
      }
      }
    });
  }
  close()
  {
    this.dialogRef.close();
  }
}
