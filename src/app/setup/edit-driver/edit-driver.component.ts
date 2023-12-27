import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss'],
})

export class EditDriverComponent implements OnInit {
  public editdriverForm!:UntypedFormGroup
  // public validationExpressionForFloating="[+]?([0-9]*[.])?[0-9]+"
  public validationExpressionForFloating = "^[0-9]{1,5}(?:\.[0-9]{1,3})?$";
deliveryAreaData = new UntypedFormControl();
readonly separatorKeysCodes = [ENTER, COMMA] as const;
addOnBlur = true;
deliveryAreaRecords:any=[];
deliveryAreaSelected:any=[];
areaRecords:any=[];
options: any = [];
errorMessage:any;
filteredOptions: Observable<any[]> | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      driverData: any;
      branch_id:any;
   },
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditDriverComponent>,
    public formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.onBuildForm();
    this.getDeliveryArea();
    
    this.filteredOptions = this.deliveryAreaData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  onBuildForm() {
    this.editdriverForm = this.formBuilder.group({
      commission: ['', Validators.compose([Validators.required,Validators.pattern(this.validationExpressionForFloating),Validators.maxLength(75)])],
      commission_type:['Percentage'],
      deliveryAreaData: new UntypedFormArray([]),
    });
     if(this.data.driverData.type=='edit'){
       this.editdriverForm.patchValue({
        commission:this.data.driverData.commission,
        commission_type:this.data.driverData.commission_type
       })
       this.deliveryAreaSelected=this.data.driverData.areaSelected;
       this.areaRecords=this.data.driverData.areaIdList
    }
  }
  close() {
    this.dialogRef.close();
   }
   getDeliveryArea(){
    this.httpService.get('list-delivery-areas/'+this.data.branch_id,false)
    .subscribe(result => {
      if (result.status == 200) {
        this.deliveryAreaRecords = result.data;
        this.deliveryAreaRecords .forEach( (obj:any)=> {
         let objData = {
            id: obj.id,
            name: obj.name,
            }
            this.options.push(objData)
        });
       } else {
        console.log("Error in get Delivery Area");
      }
    });
  }
   areaSelected(option: any, input: HTMLInputElement) {
   if(this.areaRecords.includes(option.id)){
    this.snackBService.openSnackBar('Duplicate Delivery area entry', "Close");
   }
   else{
    this.errorMessage=" "
    this.deliveryAreaSelected.push(option);
    this.areaRecords.push(option.id)
   }
  
    input.value = '';
    input.blur();
    console.log(this.deliveryAreaSelected);
    console.log();
  }
  remove(area: any): void {
    const index = this.deliveryAreaSelected.indexOf(area);
    if (index >= 0) {
      this.deliveryAreaSelected.splice(index, 1);
      this.areaRecords.splice(index, 1);
    }
  }

  editDriver(){
    if(this.areaRecords.length>0){
      this.errorMessage=" "
      
      if(this.data.driverData.type=='new'){
        let editParams = ({
          //driver_id:this.data.driverData.driver_id,
          commision_type:this.editdriverForm.value['commission_type'],
          commision_value:this.editdriverForm.value['commission'],
          delivery_area_ids:this.areaRecords,
          branch_id:this.data.branch_id,
          staff_id:this.data.driverData.staff_id,
          user_id:this.data.driverData.user_id
        })
        this.httpService.post('update-driver-details' + '/' +this.data.branch_id, editParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Driver Updated Successfully!!", "Close");
              this.close();
            } else {
             this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
      else if(this.data.driverData.type=='edit'){
        let editParams = ({
          driver_id:this.data.driverData.driver_id,
          commision_type:this.editdriverForm.value['commission_type'],
          commision_value:this.editdriverForm.value['commission'],
          delivery_area_ids:this.areaRecords,
          branch_id:this.data.branch_id,
          staff_id:this.data.driverData.staff_id,
          user_id:this.data.driverData.user_id
        })
        this.httpService.put('driver' + '/' +this.data.driverData.driver_id, editParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Driver Updated Successfully!!", "Close");
              this.close();
            } else {
             this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      } 
    }
    else{
      this.errorMessage="Required"
    }
   }
   
}
