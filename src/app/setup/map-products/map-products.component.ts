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
  selector: 'app-map-products',
  templateUrl: './map-products.component.html',
  styleUrls: ['./map-products.component.scss']
})
export class MapProductsComponent implements OnInit {
public mapProductsForm!:UntypedFormGroup
itemsData = new UntypedFormControl();
readonly separatorKeysCodes = [ENTER, COMMA] as const;
addOnBlur = true;
itemsRecords:any=[];
itemSelected:any=[];
postRecords:any=[];
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
    public dialogRef: MatDialogRef<MapProductsComponent>,
    public formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.onBuildForm();
    this.getItems();
    
    this.filteredOptions = this.itemsData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  onBuildForm() {
    this.mapProductsForm = this.formBuilder.group({
     itemsData: new UntypedFormArray([]),
    });
  
  }
  close() {
    this.dialogRef.close();
   }
   getItems(){
    this.httpService.get('item',false)
    .subscribe(result => {
      if (result.status == 200) {
        this.itemsRecords = result.data.items;
        this.itemsRecords .forEach( (obj:any)=> {
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
  itemsSelected(option: any, input: HTMLInputElement) {
   if(this.postRecords.includes(option.id)){
    this.snackBService.openSnackBar('Duplicate Delivery area entry', "Close");
   }
   else{
    this.errorMessage=" "
    this.itemSelected.push(option);
    this.postRecords.push(option.id)
   }
  
    input.value = '';
    input.blur();
    
  }
  remove(area: any): void {
    const index = this.itemSelected.indexOf(area);
    if (index >= 0) {
      this.itemSelected.splice(index, 1);
      this.postRecords.splice(index, 1);
    }
  }

  mapProducts(){
    if(this.postRecords.length>0){
      this.errorMessage=" "
      
     
        let Params = ({
          })
      
     
        this.httpService.put('', Params)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Driver Updated Successfully!!", "Close");
              this.close();
            } else {
             this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      } 
    
    else{
      this.errorMessage="Required"
    }
   }
   
}

