import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup,UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-add-ingredient-category',
  templateUrl: './add-ingredient-category.component.html',
  styleUrls: ['./add-ingredient-category.component.scss']
})
export class AddIngredientCategoryComponent implements OnInit {
  public categoryForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  categoryErrorArray:any=[];
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddIngredientCategoryComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
  }
  onBuildForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
    });
  }
  addCategoryIngredient()
  {
    let post_categoryIngredient=this.categoryForm.value;
     this.httpService.post('ingredient-category', post_categoryIngredient)
    .subscribe(result => {       
    if (result.status == 200) {
    
     this.snackBService.openSnackBar("Category name created", "Close");
      this.close();
    }else{
      this.snackBService.openSnackBar(result.message, "Close");
      if(result.data)
      {
         this.categoryErrorArray=result.data
      }
    }
  });  
  }
  close() {
    this.dialogRef.close();
  }
}
