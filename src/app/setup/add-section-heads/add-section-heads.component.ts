import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators ,UntypedFormControl, UntypedFormArray} from '@angular/forms';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ENTER } from '@angular/cdk/keycodes';
import { COMMA } from 'mat-table-exporter';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-add-section-heads',
  templateUrl: './add-section-heads.component.html',
  styleUrls: ['./add-section-heads.component.scss']
})
export class AddSectionHeadsComponent implements OnInit {
  public sectionForm!: UntypedFormGroup;
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationFloat="^[0-9]{1,5}(?:\.[0-9]{1,3})?$"
  ErrorArray:any=[];
  ImageBaseData:any | ArrayBuffer=null;
  categoryRecords:any=[];
  itemsData = new UntypedFormControl();
readonly separatorKeysCodes = [ENTER, COMMA] as const;
addOnBlur = true;
itemsRecords:any=[];
itemSelected:any=[];
postRecords:any=[];
options: any = [];
errorMessage:any;
filteredOptions: Observable<any[]> | undefined;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<AddSectionHeadsComponent>, public formBuilder: UntypedFormBuilder, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,@Inject(MAT_DIALOG_DATA) public data: {branch_id:string}) {
    }

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

    this.sectionForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75),Validators.pattern(this.validationExpression)])],
      itemsData: new UntypedFormArray([]),
      secondary_name:['']
     }); 
   
  }

  close() {
    this.dialogRef.close();
  }
  addSectionHeads() {
 
      let post = {
        'name': this.sectionForm.value['name'],
        'item_ids':this.postRecords,
        'branch_id':this.data.branch_id,
        'secondary_name':this.sectionForm.value['secondary_name']
     }
      
      this.httpService.post('online/sections', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Section Head created successfully.", "Close");
            this.close();
          } else {
            if(result.data){
              this.ErrorArray=result.data
            }
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
   
  
    getItems(){
      this.httpService.get('items-by-eorder',false)
      .subscribe(result => {
        if (result.status == 200) {
          this.itemsRecords = result.data;
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
      this.snackBService.openSnackBar('Duplicate Item entry', "Close");
     }
    //  else if(this.postRecords.length>10){
    //   this.snackBService.openSnackBar('Sorry,Maximum 10 items allowed', "Close");
    //  }
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
  
 
}

