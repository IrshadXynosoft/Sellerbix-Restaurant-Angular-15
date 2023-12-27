import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-add-utilities',
  templateUrl: './add-utilities.component.html',
  styleUrls: ['./add-utilities.component.scss']
})
export class AddUtilitiesComponent implements OnInit {
  public unitsForm!: UntypedFormGroup;
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  unitsErrorArray: any = [];
  isEdit:boolean=false;
  constructor(public dialog: MatDialog, 
    public dialogRef: MatDialogRef<AddUtilitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:string},
    private formBuilder: UntypedFormBuilder, 
    private httpService: HttpServiceService,
    private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.onBuildForm();
    
    if(this.data?.id){
      this.isEdit=true;
      this.getUtility();
    }
  }
  onBuildForm() {
    this.unitsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75), Validators.pattern(this.validationExpression)])],
    });
  }
  getUtility(){
    this.httpService.get('utility/'+this.data?.id,false)
      .subscribe(result => {
        if (result.status == 200) {
          let records:any=result.data;
          if(records){
            this.unitsForm.patchValue(
              {
                name:records.name
              }
            )
          }
       
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        
        }
      });
  }
  addUnits() {
    let post_units = this.unitsForm.value;
   if(this.data?.id){
    this.httpService.put('utility/'+this.data?.id, post_units)
    .subscribe(result => {
      if (result.status == 200) {

        this.snackBService.openSnackBar("Utility Updtaed Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
        if (result.data) {
          this.unitsErrorArray = result.data
        }
      }
    });
   }
   else
   {
    this.httpService.post('utility', post_units)
    .subscribe(result => {
      if (result.status == 200) {

        this.snackBService.openSnackBar("Utility Created Successfully", "Close");
        this.close();
      } else {
        this.snackBService.openSnackBar(result.message, "Close");
        if (result.data) {
          this.unitsErrorArray = result.data
        }
      }
    });
   }
  }
  close() {
    this.dialogRef.close();
  }
}

