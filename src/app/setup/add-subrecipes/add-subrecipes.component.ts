import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { AddIngredientCategoryComponent } from '../add-ingredient-category/add-ingredient-category.component';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';

@Component({
  selector: 'app-add-subrecipes',
  templateUrl: './add-subrecipes.component.html',
  styleUrls: ['./add-subrecipes.component.scss']
})
export class AddSubrecipesComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  measurementArray:any=[]
  categoryArray:any=[]
  addSubRecipeForm!: UntypedFormGroup;
  measurementUnit:any='';
  public validationExpression="^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationExpressionForFloating="[+]?([0-9]*[.])?[0-9]+"
  ingredientsData = new UntypedFormControl();
  locationData= new UntypedFormControl();
  utilitiesData=new UntypedFormControl();
  utilities:any=[];
  utility_total:any=0;
  options: any=[];
  filteredOptions:Observable<any[]> | undefined;
  branchName:any;
  branchRecords: any = [];
  costPerUnit:any;
  openingBalance:number;
  subTotalItem:any;
  ingredientValidation:boolean;
  public locationPrices: any = [];
  validationForOpeningBalance:boolean=true;
  ErrorArray:any=[];
  constructor(public dialog: MatDialog,private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService,private formBuilder:UntypedFormBuilder,private localService:LocalStorage) {
   this.branchName=localService.get('branchname')
   this.costPerUnit=0;
   this.openingBalance=0;
   this.ingredientValidation=false;
   }

  ngOnInit(): void {
    this.onBuildForm();
    this.getMeasurementUnits();
    this.geCategories()
    //this.getIngredients();
    this.getUtilities();
    this.getBranch();
    this.filteredOptions = this.ingredientsData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  searchItem(filterText: any) {
    this.options=[];
   if(filterText.length>2){
 
   this.httpService.get('autocomplete_search_for_ingredient/'+filterText)
   .subscribe(result => {
     if (result.status == 200) {
      this.options=result.data;
    } else {
    console.log("Error");
     }
   });
  }
   
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option:any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  getBranch() {
    this.httpService.get('branch')
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
          this.branchRecords.forEach((obj: any) => {
            let priceData: any = {
              location_id: obj.id,
              location_name: obj.name,
              openingBalance: 0,
              reorder_qty:0,
             is_track_inventory:true
            }
            this.locationPrices.push(priceData);
          });
          this.locationPrices.forEach((dataObj: any) => {
            let items = this.addSubRecipeForm.get('locationData') as UntypedFormArray;
            items.push(this.createPriceItem(dataObj));
          });
         } else {
          console.log("Error");
        }
      });
  }
  get locationPricesFormGroups() {
    return this.addSubRecipeForm.get('locationData') as UntypedFormArray;
  }
  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
 }
 branchname(index: any) {
  let form_data = this.addSubRecipeForm.value;
  return form_data.locationData[index].location_name;
}
  onBuildForm() {
    this.addSubRecipeForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(75)])],
      code:[''],
      ingredient_category_id:['', Validators.compose([Validators.required])],
      measurement_unit_id:['', Validators.compose([Validators.required])],
      description:[''],
      ingredientsData:new UntypedFormArray([]),  
      utilitiesData: new UntypedFormArray([]),
      openingBalance:[''],
      reorder_qty:[''],
      stock_type:[''],
      is_track_inventory:false,
      cost_per_unit:[''],
      yield:['', Validators.compose([Validators.required,Validators.pattern(this.validationExpressionForFloating)])],
      totalAmount:0,
      locationData: new UntypedFormArray([]),
      });
     
  }
  ingredientSelected(option: any,input:HTMLInputElement){
  
      let flag = false;
    if (this.addSubRecipeForm.value['ingredientsData'].length > 0) {
      this.addSubRecipeForm.value['ingredientsData'].forEach((element: any) => {
       if (element.id == option.id) {
           flag = true;
        }
      });
    }
    if(!flag){
      let objData = {
        id: option.id,
        name: option.name,
        unit_name:option.unit_name,
        cost_per_unit:option.cost_per_unit,
        qty:'',
        sub_total:0,
        order_type: 'All',
        stock_type: option.stock_type,
        stock_id:option.stock_id
      }
      let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
      items.push(this.createIngredientData(objData));
    }
    else {
      this.snackBService.openSnackBar("Duplicate Entry", "Close")
    }
    
    
    input.value = '';
    input.blur();
    this.options=[];
  }
  
  get ingredientFormGroups() {
    return this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
  }
  isIngredientsAdded(){
    let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
  }
  isutilityAdded(){
    let items = this.addSubRecipeForm.get('utilitiesData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
  }
  errorMessage(i:any){
    let form_data = this.addSubRecipeForm.value;
    if(form_data.ingredientsData[i].qty>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  
  }
  errorMessageOpening(i:any){
    let form_data = this.addSubRecipeForm.value;
    if(form_data.locationData[i].openingBalance>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  
  }
  errorMessageReorder_qty(i:any){
    let form_data = this.addSubRecipeForm.value;
    if(form_data.locationData[i].reorder_qty>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  
  }
  createIngredientData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
 
  IngredientName(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].name;
  }
  unitName(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].unit_name;
  }
  costperUnit(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].cost_per_unit;
  }
  subTotal(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].sub_total;
  }
  clearIngredient(index:any)
  {
    let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
    items.removeAt(index);
    let total:any=0;
    let ingredientList=this.addSubRecipeForm.value['ingredientsData']
    // items.value.forEach((obj: any) => {
    //   total=parseFloat(total)+parseFloat(obj.sub_total)
    // });
     
    // this.addSubRecipeForm.patchValue(
    //   {
    //     totalAmount:total
    //   });
    //   this.findCostPerUnit();
    this.findTotalAmount();
  }
  getMeasurementUnits()
  {
    this.httpService.get('measurement-unit')
    .subscribe(result => {
      if (result.status == 200) {
         this.measurementArray = result.data.measurement_unit;
       } else {
        console.log("Error in unit");
      }
    });
  }
  measurementChanged(event:any)
  {
    let measurementId=event.target.value;
    if(measurementId>0)
    {
      this.measurementArray.forEach((obj: any) => {
       if(obj.id==measurementId)
       {
          this.measurementUnit=obj.name
       }
      });
    }
  }
  
  findTotal(i:any)
  {
   let items = this.addSubRecipeForm.value['ingredientsData']
   let netQuantity=items[i].qty
   let cost=items[i].cost_per_unit
    if(cost>0 && parseFloat(netQuantity))
    {
      this.subTotalItem=(netQuantity*cost).toFixed(4);
      items[i].sub_total= this.subTotalItem;
      // let total:any=0;
      // items.forEach((obj: any) => {
      //   total=parseFloat(total)+parseFloat(obj.sub_total);
      //   total=total.toFixed(4);
      // });
      // let yieldValue=this.addSubRecipeForm.value['yield']
      // if(yieldValue>0){
      //  this.costPerUnit=(total/yieldValue);
      // }
      // else{
      //   this.costPerUnit=0
      // }
      // this.addSubRecipeForm.patchValue(
      //   {
      //     totalAmount:total
      //   }
      // )
    }
   else{
    // let total:any=0;
    // items.forEach((obj: any) => {
    //   total=parseFloat(total)+parseFloat(obj.sub_total);
    // });
    // let yieldValue=this.addSubRecipeForm.value['yield']
    // if(yieldValue>0){
    //  this.costPerUnit=(total/yieldValue)
    // }
    // else{
    //   this.costPerUnit=0
    // }
    // this.addSubRecipeForm.patchValue(toFixed(4)
    //   {
    //     totalAmount:total
    //   }
    // )
   }
   this.findTotalAmount();
  }
  findTotalAmount(){
    let items = this.addSubRecipeForm.value['ingredientsData']
    
    let total:any=0;
    if(items.length>0){
      items.forEach((obj: any) => {
        total=parseFloat(total)+parseFloat(obj.sub_total);
      });
    }

    let utilities = this.addSubRecipeForm.value['utilitiesData']
    this.utility_total=0;
    if(utilities.length>0){
      utilities.forEach((obj: any) => {
        this.utility_total = (parseFloat(this.utility_total) + parseFloat(obj.utility_cost)).toFixed(4);
      });
    }
   
    
    total=(parseFloat(this.utility_total) + parseFloat( total)).toFixed(4);
    this.addSubRecipeForm.patchValue(
      {
        totalAmount:total
      }
    )
    let yieldValue=this.addSubRecipeForm.value['yield']
    if(yieldValue>0){
     this.costPerUnit=(total/yieldValue)
    }
    else{
      this.costPerUnit=0
    }
  }
  findCostPerUnit()
  {
    
    let yieldValue=this.addSubRecipeForm.value['yield']
    let total=this.addSubRecipeForm.value['totalAmount']
    
    if(yieldValue>0){
     this.costPerUnit=(total/yieldValue);
    }
    else{
      this.costPerUnit=0
    }
   
  }

  geCategories()
  {
    this.httpService.get('ingredient-category')
    .subscribe(result => {
      if (result.status == 200) {
       this.categoryArray = result.data.ingredient_category;
  
      } else {
        console.log("Error in category");
      }
    });
  }
  addCategory(){
    const dialogRef = this.dialog.open(AddIngredientCategoryComponent, {
           width: '500px',
         });
     
         dialogRef.afterClosed().subscribe(result => {
          this.geCategories();
         });
   }
  //  addIngredients(){
  //   const dialogRef = this.dialog.open(AddIngredientComponent, {
  //     width: '1000px',height:'750px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //    this.getIngredients();
  //   });
  //  }
   addMeasurementUnit(){
      const dialogRef = this.dialog.open(AddMeasurementUnitComponent, {
               width: '500px',
             });
         
             dialogRef.afterClosed().subscribe(result => {
              this.getMeasurementUnits();
             });
          
   }

 back() {
    this.router.navigate(['setup/inventorySetup/subrecipes'])
  }

  savesubRecipe()
  {
    if(this.addSubRecipeForm.valid){
    let ingredientList:any=[];
    let items = this.addSubRecipeForm.value['ingredientsData']
    items.forEach((obj: any) => {
     if(obj.qty>0)
     {
      let objData = {
        ingredient_id: obj.id,
        qty: obj.qty
      }
      ingredientList.push(objData)
     }
      
    
    });
    
    let opening_balance_array:any=[]
     let data = this.addSubRecipeForm.value['locationData']
     data.forEach((obj: any) => {
      this.validationForOpeningBalance=true;
      if(obj.openingBalance<0)
      {
       this.validationForOpeningBalance=false;
      }
      if(obj.openingBalance>=0 && obj.reorder_qty >= 0){
      let objData = {
      reorder_qty :obj.reorder_qty,
      opening_balance:obj.openingBalance,
      branch_id:obj.location_id,
      is_track_inventory:obj.is_track_inventory
      }
      opening_balance_array.push(objData)
     }
    });
   if(ingredientList.length>0 && ingredientList.length==items.length && this.validationForOpeningBalance && opening_balance_array.length==data.length)
    {
      let post={
        name: this.addSubRecipeForm.value['name'],
        code:this.addSubRecipeForm.value['code'],
        ingredient_category_id:this.addSubRecipeForm.value['ingredient_category_id'],
        measurement_unit_id:this.addSubRecipeForm.value['measurement_unit_id'],
        description:this.addSubRecipeForm.value['description'],
        cost_per_unit:this.costPerUnit,
        opening_balance:this.addSubRecipeForm.value['openingBalance'],
        reorder_qty:this.addSubRecipeForm.value['reorder_qty'],
        stock_type:0,
        sub_recipe_ingredients:ingredientList,
        is_track_inventory:this.addSubRecipeForm.value['is_track_inventory'],
        yield:this.addSubRecipeForm.value['yield'],
        opening_balance_array:opening_balance_array,
        utility:this.addSubRecipeForm.value['utilitiesData']
      }
      this.httpService.post('sub-recipe', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Sub recipe Added ", "Close");
          this.ingredientValidation=false;
          this.back();
        } else {
          if(result.data){
            this.ErrorArray=result.data
          }
          this.snackBService.openSnackBar(this.ErrorArray.name, "Close");
        }
      });
    }
    else{
      this.ingredientValidation=true;
      
    }
  }
  else{
    this.validateAllFormFields(this.addSubRecipeForm)
  }
}
validateAllFormFields(formGroup: UntypedFormGroup) {         //{1}
  Object.keys(formGroup.controls).forEach(field => {  //{2}
    const control = formGroup.get(field);             //{3}
    if (control instanceof UntypedFormControl) {             //{4}
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof UntypedFormGroup) {        //{5}
      this.validateAllFormFields(control);            //{6}
    }
  });
}
utilityCheck(i: any) {
  let form_data = this.addSubRecipeForm.value;
  if (form_data.utilitiesData[i].cost > 0 || form_data.utilitiesData[i].cost == null) {
    return ''
  }
  else {
    return 'invalid quantity'
  }
}
getUtilities(){
  this.httpService.get('utility')
    .subscribe(result => {
      if (result.status == 200) {
        this.utilities = result.data;
      } else {
        console.log("Error in utilities get");
      }
    });
}
utilitiesSelected(id: any, name: any,input:HTMLInputElement){
  let flag = false;
   if (this.addSubRecipeForm.value['utilitiesData'].length > 0) {
    this.addSubRecipeForm.value['utilitiesData'].forEach((element: any) => {
     if (element.utility_id == id) {
        flag = true;
      }
    });
  }
  if(!flag){
    let objData = {
      utility_id: id,
      name: name,
      utility_cost:null
    }
    let items = this.addSubRecipeForm.get('utilitiesData') as UntypedFormArray;
    items.push(this.createUtilitiesData(objData));
  
  }
  else {
    this.snackBService.openSnackBar("Duplicate Entry", "Close")
  }
  input.value = '';
  input.blur();
  
}
createUtilitiesData(dataObj: any): UntypedFormGroup {
  return this.formBuilder.group(dataObj);
}
get utilityFormGroups() {
  return this.addSubRecipeForm.get('utilitiesData') as UntypedFormArray;
}
utilityName(index: any) {
  let form_data = this.addSubRecipeForm.value;
  return form_data.utilitiesData[index].name;
}
clearutility(index: any) {
  let items = this.addSubRecipeForm.get('utilitiesData') as UntypedFormArray;
  items.removeAt(index);
 this.findTotalAmount();
}
}
