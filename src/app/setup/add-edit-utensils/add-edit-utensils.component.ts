import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-edit-utensils',
  templateUrl: './add-edit-utensils.component.html',
  styleUrls: ['./add-edit-utensils.component.scss']
})
export class AddEditUtensilsComponent implements OnInit {
  public utensilsForm!: UntypedFormGroup;
  public validationFloat = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$";
  utensilArray:any;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddEditUtensilsComponent>,private formBuilder: UntypedFormBuilder,private httpService: HttpServiceService,private snackBService: SnackBarService
    ,@Inject(MAT_DIALOG_DATA) public data: {id:any,branch_id:string}) { }

  ngOnInit(): void {
    this.onBuildForm();
    if(this.data.id){
      this.getUtensils();
    }
  }
  onBuildForm() {
    this.utensilsForm = this.formBuilder.group({
     name: ['', Validators.compose([Validators.required])],
     total_qty: ['', Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])],
     selling_price:['', Validators.compose([Validators.required,Validators.pattern("^[+]?[0-9]\\d*(\\.\\d{1,2})?$")])]
       });
  }

  addUtensils(){
    let post=this.utensilsForm.value;
    post['branch_id']=this.data.branch_id
    if(this.data.id){
      this.httpService.put('utensil/'+this.data.id, post)
      .subscribe(result => {       
      if (result.status == 200) {
      
       this.snackBService.openSnackBar("utensil Updated Successfully", "Close");
        this.close();
      }else{
       
        this.snackBService.openSnackBar(result.message, "Close");
      }
    }); 
    }
    else{
      this.httpService.post('utensil', post)
      .subscribe(result => {       
      if (result.status == 200) {
      
       this.snackBService.openSnackBar("utensil added Successfully", "Close");
        this.close();
      }else{
       
        this.snackBService.openSnackBar(result.message, "Close");
      }
    }); 
    }
    
  }

  getUtensils()
  {
   
    this.httpService.get('utensil/'+this.data.id,false)
    .subscribe(result => {       
      if (result.status == 200) {
        this.utensilArray = result.data[0];
        this.utensilsForm.controls['selling_price'].disable();
        this.utensilsForm.controls['total_qty'].disable();
        this.utensilsForm.patchValue({
              name:this.utensilArray.name,
              total_qty:this.utensilArray.total_qty,
              selling_price:this.utensilArray.selling_price
             
        })
        } else {
          console.log("Error in tax");
        }
  });  
  }
  close(){
    this.dialogRef.close();
  }
}
