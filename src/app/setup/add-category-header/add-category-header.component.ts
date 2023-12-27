import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common' 

@Component({
  selector: 'app-add-category-header',
  templateUrl: './add-category-header.component.html',
  styleUrls: ['./add-category-header.component.scss']
})
export class AddCategoryHeaderComponent implements OnInit {
  public categoryForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  
  branch_id:any;
  ErrorArray:any=[];
  id:any
  todayDate:any=formatDate(new Date(),'yyyy-MM-dd','en');
  constructor(public dialog: MatDialog, public route:ActivatedRoute,public dialogRef: MatDialogRef<AddCategoryHeaderComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,@Inject(MAT_DIALOG_DATA) public data: {branch_id:string}) {
   
   }

  ngOnInit(): void {

    this.onBuildForm();
    
  }
  onBuildForm() {

    this.categoryForm = this.formBuilder.group({
      name: ['left banner', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      description: [''],
      dateTo: [this.todayDate, Validators.required],
      dateFrom: [this.todayDate, Validators.required],
      // timeFrom: ['', Validators.required],
      // timeTo: ['', Validators.required],
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') }); /* calling fn for date checking */

    //this.categoryForm.controls['timeTo'].disable();
  }

  // To check from date and to date

  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Invalid Date Entry"
        };
      }
      return {};
    }
  }
 
  close() {
    this.dialogRef.close();
  }
  addCategories() {
 
      let post = {
        'name': this.categoryForm.value['name'],
        'description': this.categoryForm.value['description'],
        'from_date': this.categoryForm.value['dateFrom'],
        'to_date': this.categoryForm.value['dateTo'],
        'branch_id':this.data.branch_id,
     }
       this.httpService.post('online/category-header', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("category headers created successfully", "Close");
            this.close();
          } else {
            if(result.data){
              this.ErrorArray=result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }

 
}

