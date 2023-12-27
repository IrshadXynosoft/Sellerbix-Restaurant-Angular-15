import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { formatDate } from '@angular/common' 

@Component({
  selector: 'app-edit-category-header',
  templateUrl: './edit-category-header.component.html',
  styleUrls: ['./edit-category-header.component.scss']
})
export class EditCategoryHeaderComponent implements OnInit {
  public categoryForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  branch_id:any;
  ErrorArray:any=[];
  categoryData:any=[];
  todayDate:any=formatDate(new Date(),'yyyy-MM-dd','en');
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditCategoryHeaderComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,@Inject(MAT_DIALOG_DATA) public data: {branch_id:string,id:string}) {
    this.branch_id=this.localService.get('branch_id');
   }

  ngOnInit(): void {
    this.onBuildForm();
    this.getCategoryHeader();
   
    
  }
  getCategoryHeader(){
    this.httpService.get('online/category-header/'+this.data.id,false)
    .subscribe(result => {
      if (result.status == 200) {
        this.categoryData=result.data
        this.categoryForm.patchValue({
          name: this.categoryData.name,
          description:this.categoryData.description,
          dateTo: this.categoryData.to_date,
          dateFrom: this.categoryData.from_date
        })
      } else {
        console.log("Error in category");
      }
    });
  }
  onBuildForm() {

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75)])],
      description: [''],
      dateTo: [this.todayDate, Validators.required],
      dateFrom: [this.todayDate, Validators.required],
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') }); /* calling fn for date checking */

   
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
  updateCategories() {
 
      let post = {
        'name': this.categoryForm.value['name'],
        'description': this.categoryForm.value['description'],
        'from_date': this.categoryForm.value['dateFrom'],
        'to_date': this.categoryForm.value['dateTo'],
        'branch_id':this.data.branch_id,
     }
      
      this.httpService.put('online/category-header/'+this.data.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("category headers updated successfully.", "Close");
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

