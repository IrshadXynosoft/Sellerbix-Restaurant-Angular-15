import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  recipe_id: any;
  recipe_name: any;

  recipeArray: any = [];
  ingredientsData = new UntypedFormControl();
  options: any = [];
  ingredientArray: any = []
  filteredOptions: Observable<any[]> | undefined;
  addRecipeForm!: UntypedFormGroup;
  subTotalItem: any;
  cost_price: any;
  cost_price_plus_wastage: any;
  food_cost_percentage: any;
  sugg_sale_price: any;
  actual_sale_price: any;
  gross_profit_amount: any;
  gross_profit_percentage: any;
  ingredientVlidation: any;
  edit_type: any = this.route.snapshot.params.type;
  utilitiesData=new UntypedFormControl();
  utilities:any=[];
  taxValidationExpression: any = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$";
  utility_total:any=0;
  measurementUnit: any;
  public locationPrices: any = [];
  branchRecords: any = [];
  measurementArray: any = []
  validationForOpeningBalance: boolean = true;
  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, private localService: LocalStorage) {
    this.recipe_name = this.route.snapshot.params.item;
    this.ingredientVlidation = false
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getUtilities();
    //this.getIngredients();
    this.getRecipe();
    this.getMeasurementUnits();
    //this.getBranch();
    this.filteredOptions = this.ingredientsData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  onBuildForm() {
    this.addRecipeForm = this.formBuilder.group({
      ingredientsData: new UntypedFormArray([]),
      utilitiesData: new UntypedFormArray([]),
      tax_rate: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      targeted_food_cost_percentage: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      waste_percentage: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      recipe_preparation_method: [''],
      measurement_unit_id: ['', Validators.compose([Validators.required])],
      locationData: new UntypedFormArray([])
      //critical_control:[''],
      //is_track_consumption: false
    });

  }
  searchItem(filterText: any) {
    this.options=[];
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
  if(filterText.length>2){
   
   this.httpService.get('autocomplete_search_for_recipe/'+filterText)
   .subscribe(result => {
     if (result.status == 200) {
       if (result.data.length > 0) {
       result.data.forEach(async (obj: any) => {
       let objData = {
          id: obj.id,
          name: obj.name,
          unit_name: obj.unit_name,
          cost_per_unit: obj.cost_per_unit,
          qty: null,
          sub_total: null,
          order_type: 'All',
          stock_type: obj.stock_type
        }
        this.options.push(objData)
       });
       
      }
      else{
        this.snackBService.openSnackBar('No Items Found',"Close");
       }
    } else {
    console.log("Error");
     }
   });
  }
   
  }
  getMeasurementUnits() {
    this.httpService.get('measurement-unit')
      .subscribe(result => {
        if (result.status == 200) {
          this.measurementArray = result.data.measurement_unit;
        } else {
          console.log("Error in unit");
        }
      });
  }
  measurementChanged(event: any) {
    let measurementId = event.target.value;
    if (measurementId > 0) {
      this.measurementArray.forEach((obj: any) => {
        if (obj.id == measurementId) {
          this.measurementUnit = obj.name
        }
      });
    }
  }
  addMeasurementUnit() {
    const dialogRef = this.dialog.open(AddMeasurementUnitComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMeasurementUnits();
    });

  }
  getBranch() {
    this.httpService.get('branch')
      .subscribe(result => {
        if (result.status == 200) {
          let locationList = [];
          this.branchRecords = result.data.tenant_branches;
      
        } else {
          console.log("Error");
        }
      });
  }
  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  get locationPricesFormGroups() {
    return this.addRecipeForm.get('locationData') as UntypedFormArray;
  }

  branchname(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.locationData[index].location_name;
  }
  errorMessageOpening(i: any) {
    let form_data = this.addRecipeForm.value;
    if (form_data.locationData[i].openingBalance >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }

  }
  errorMessageReorder_qty(i: any) {
    let form_data = this.addRecipeForm.value;
    if (form_data.locationData[i].reorder_qty >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }

  }
  getIngredients() {
    this.httpService.get('ingredient')
      .subscribe(result => {
        if (result.status == 200) {
          this.ingredientArray = result.data;
          this.ingredientArray.forEach((obj: any) => {
            let objData: any;
            if (obj.stock_type == 2 && obj.ingredient) {
              objData = {
                id: obj.ingredient[0].ingredient_id,
                name: obj.ingredient[0].ingredient_name,
                unit_name: obj.purchase_detail ? obj.purchase_detail.measurement_unit_name : '-',
                cost_per_unit: obj.cost_per_unit,
                qty: null,
                sub_total: null,
                order_type: 'All',
                stock_type: obj.stock_type
              }
              this.options.push(objData)
            }
            else if (obj.stock_type == 3 && obj.sub_recipe) {
              objData = {
                id: obj.sub_recipe.id,
                name: obj.sub_recipe.name,
                unit_name: obj.sub_recipe.measurement_unit_name,
                cost_per_unit: obj.cost_per_unit,
                qty: null,
                sub_total: null,
                order_type: 'All',
                stock_type: obj.stock_type
              }
              this.options.push(objData)
            }
          });
          this.getRecipe();
        } else {
          console.log("Error in Ingredients");
        }
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  ingredientSelected(options: any, name: any, input: HTMLInputElement) {
    let flag = false;
    if (this.addRecipeForm.value['ingredientsData'].length > 0) {
      this.addRecipeForm.value['ingredientsData'].forEach((element: any) => {
        if (element.id==options.id) {
          flag = true;
        }
      });
    }

      if (!flag) {
        let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
        items.push(this.createIngredientData(options));
        this.options=[];
      }
      else {
        this.snackBService.openSnackBar("Duplicate Entry", "Close")
      }
  
    input.value = '';
    input.blur();
    this.options=[];
  }
  createIngredientData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  get ingredientFormGroups() {
    return this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
  }



  IngredientName(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.ingredientsData[index].name;
  }
  unitName(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.ingredientsData[index].unit_name;
  }
  costperUnit(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.ingredientsData[index].cost_per_unit;
  }
  subTotal(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.ingredientsData[index].sub_total;
  }
  clearIngredient(index: any) {
    let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
    items.removeAt(index);
    let total: any = 0;
    this.cost_price = 0;
    let ingredientList = this.addRecipeForm.value['ingredientsData']
    items.value.forEach((obj: any) => {
      total = parseFloat(total + obj.sub_total)
      this.cost_price = (parseFloat(this.cost_price) + parseFloat(obj.sub_total)).toFixed(4)
    });
    this.findRecipeCostValues()

    this.addRecipeForm.patchValue(
      {
        totalAmount: total
      });
  }
  findTotal(i: any) {
    let items = this.addRecipeForm.value['ingredientsData']
    let netQuantity:any = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0 && parseFloat(netQuantity)) {
      this.subTotalItem = (netQuantity * cost).toFixed(4)
      items[i].sub_total = this.subTotalItem;
      this.cost_price = 0;
      // items.forEach((obj: any) => {
      //   this.cost_price = parseFloat(this.cost_price) + parseFloat(obj.sub_total)
      // });
      this.findRecipeCostValues()

    }
    else {
      this.subTotalItem = 0
      items[i].sub_total = this.subTotalItem;
      this.cost_price = 0;
      // items.forEach((obj: any) => {
      //   this.cost_price = parseFloat(this.cost_price) + parseFloat(obj.sub_total)
      // });
      this.findRecipeCostValues()
    }
  }
  isIngredientsAdded(){
    let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
  }
  isutilityAdded(){
    let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
  }
  qtyCheck(i: any) {
    let form_data = this.addRecipeForm.value;
    if (form_data.ingredientsData[i].qty > 0 || form_data.ingredientsData[i].qty == null) {
      return ''
    }
    else {
      return 'invalid quantity'
    }
  }
  utilityCheck(i: any) {
    let form_data = this.addRecipeForm.value;
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
     if (this.addRecipeForm.value['utilitiesData'].length > 0) {
      this.addRecipeForm.value['utilitiesData'].forEach((element: any) => {
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
      let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
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
    return this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
  }
  utilityName(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.utilitiesData[index].name;
  }
  findRecipeCostValues() {
    this.cost_price = 0;
    let items = this.addRecipeForm.value['ingredientsData']
    items.forEach((obj: any) => {
      this.cost_price = (parseFloat(this.cost_price) + parseFloat(obj.sub_total)).toFixed(4);
    });
   
    let utilities = this.addRecipeForm.value['utilitiesData']
    this.utility_total=0;
    utilities.forEach((obj: any) => {
      this.utility_total = (parseFloat(this.utility_total) + parseFloat(obj.utility_cost)).toFixed(4);
    });
    this.cost_price=(parseFloat(this.utility_total) + parseFloat( this.cost_price)).toFixed(4);
    let wastage_percetage_cost: any = 0;
    wastage_percetage_cost = this.cost_price * (this.addRecipeForm.value['waste_percentage'] / 100)
    this.cost_price_plus_wastage = (parseFloat(this.cost_price) + parseFloat(wastage_percetage_cost)).toFixed(4)
    let food_cost: any = 0;
    food_cost = this.cost_price_plus_wastage * (this.addRecipeForm.value['targeted_food_cost_percentage'] / 100)
    this.food_cost_percentage = (parseFloat(this.cost_price_plus_wastage) + parseFloat(food_cost)).toFixed(4)
    let suggested: any = 0;
    suggested = this.edit_type == 'modifier' ? 0 : this.food_cost_percentage * (this.addRecipeForm.value['tax_rate'] / 100)
    this.sugg_sale_price = this.edit_type == 'modifier' ? 0 : (parseFloat(this.food_cost_percentage) + parseFloat(suggested)).toFixed(4)
    this.gross_profit_amount = this.sugg_sale_price == 0 ? 0 : (this.actual_sale_price - this.sugg_sale_price).toFixed(4)
    this.gross_profit_percentage = this.sugg_sale_price == 0 ? 0 : ((this.gross_profit_amount * 100) / this.sugg_sale_price).toFixed(4);
  }
  saveRecipe() {
    let ingredientList: any = [];
    let items = this.addRecipeForm.value['ingredientsData']
    items.forEach((obj: any) => {
      if (obj.qty > 0) {
        if (obj.stock_type == 2) {
          let objData = {
            ingredient_id: obj.id,
            qty: obj.qty,
            stock_type: obj.stock_type
          }
          ingredientList.push(objData)
        }
        else if (obj.stock_type == 3) {
          let objData = {
            sub_recipe_id: obj.id,
            qty: obj.qty,
            stock_type: obj.stock_type
          }
          ingredientList.push(objData)
        }
      }
    });
    let utilities:any=this.addRecipeForm.value['utilitiesData']
    let opening_balance_array:any=[]
    let data = this.addRecipeForm.value['locationData']
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
   
    if (ingredientList.length == items.length && opening_balance_array.length==data.length) {
      let post_save_data: any;
      if (this.edit_type == 'recipe') {
        post_save_data = {
          item_id: this.recipeArray.item.id,
          type: this.edit_type,
          recipe_ingredient: ingredientList,
          cost_price: this.cost_price,
          cost_price_plus_wastage: this.cost_price_plus_wastage,
          food_cost_percentage: this.food_cost_percentage,
          sugg_sale_price: this.sugg_sale_price,
          actual_sale_price: this.actual_sale_price,
          gross_profit_amount: this.gross_profit_amount,
          gross_profit_percentage: this.gross_profit_percentage ? this.gross_profit_percentage : 0,
          tax_rate: this.addRecipeForm.value['tax_rate'],
          targeted_food_cost_percentage: this.addRecipeForm.value['targeted_food_cost_percentage'],
          waste_percentage: this.addRecipeForm.value['waste_percentage'],
          is_track_consumption: this.addRecipeForm.value['is_track_consumption'],
          recipe_preparation_method: this.addRecipeForm.value['recipe_preparation_method'],
          critical_control: null,
          utility:utilities,
          opening_balance_array:opening_balance_array,
          opening_balance:this.addRecipeForm.value['openingBalance'],
          measurement_unit_id:this.addRecipeForm.value['measurement_unit_id'],
        }
        this.httpService.put('recipe/' + this.route.snapshot.params.id, post_save_data)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Recipe Updated ", "Close");
              this.back();
            } else {
              this.snackBService.openSnackBar("Invalid Data", "Close");
            }
          });
      }
      else {
        post_save_data = {
          modifier_id: this.recipeArray.modifier_id,
          name: this.recipeArray.name,
          type: this.edit_type,
          modifier_ingredient: ingredientList,
          cost_price: this.cost_price,
          cost_price_plus_wastage: this.cost_price_plus_wastage,
          food_cost_percentage: this.food_cost_percentage,
          sugg_sale_price: this.sugg_sale_price,
          actual_sale_price: this.actual_sale_price,
          gross_profit_amount: this.gross_profit_amount,
          gross_profit_percentage: this.gross_profit_percentage ? this.gross_profit_percentage : 0,
          tax_rate: this.addRecipeForm.value['tax_rate'],
          targeted_food_cost_percentage: this.addRecipeForm.value['targeted_food_cost_percentage'],
          waste_percentage: this.addRecipeForm.value['waste_percentage'],
          is_track_consumption: this.addRecipeForm.value['is_track_consumption'],
          modifier_preparation_method: this.addRecipeForm.value['recipe_preparation_method'],
          critical_control: null,
          utility:utilities,
          opening_balance_array:opening_balance_array,
          opening_balance:this.addRecipeForm.value['openingBalance'],
          measurement_unit_id:this.addRecipeForm.value['measurement_unit_id'],
        }
        this.httpService.put('modifier/' + this.route.snapshot.params.id, post_save_data)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Recipe Updated ", "Close");
              this.back();
            } else {
              this.snackBService.openSnackBar("Invalid Data", "Close");
            }
          });
      }

    }
    else {
      this.ingredientVlidation = true;
    }
  }

  getRecipe() {
    // this.httpService.get('recipe/' + this.route.snapshot.params.id)
    this.httpService.get('recipe-modifier-get-by-id/' + this.route.snapshot.params.id + '/' + this.edit_type)
      .subscribe(result => {
        if (result.status == 200) {

          this.recipeArray = result.data[0]
          let total: any = 0
          let ingredientsForAllArray: any = [];
          ingredientsForAllArray = this.recipeArray.recipe_ingredient.length>0 ? this.recipeArray.recipe_ingredient : this.recipeArray.modifier_ingredient

          let subRecipesForAllArray: any = [];
          subRecipesForAllArray = this.recipeArray.recipe_sub_recipe.length>0 ? this.recipeArray.recipe_sub_recipe : this.recipeArray.modifier_sub_recipe
      
      
          if (ingredientsForAllArray) {
            ingredientsForAllArray.forEach((objdata: any) => {
            let objData = {
                id: objdata.ingredient_id,
                name: objdata.ingredient_name,
                unit_name: objdata.measurement_unit_name?objdata.measurement_unit_name : '-',
                cost_per_unit: objdata.cost_per_unit,
                qty: objdata.qty,
                sub_total: (objdata.cost_per_unit * objdata.qty).toFixed(4),
                stock_type: 2,
                
              }
              total = parseFloat(total) + (objdata.cost_per_unit * objdata.qty)
              let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
              items.push(this.createIngredientData(objData));
            });
          }
          if (subRecipesForAllArray) {
            subRecipesForAllArray.forEach((objdata: any) => {
              let objData = {
                id: objdata.sub_recipe_id,
                name: objdata.ingredient_name,
                unit_name: objdata.measurement_unit_name?objdata.measurement_unit_name : '-',
                cost_per_unit: objdata.cost_per_unit,
                qty: objdata.qty,
                sub_total: (objdata.cost_per_unit * objdata.qty).toFixed(4),
                stock_type: 3
              }
              total = parseFloat(total) + (objdata.cost_per_unit * objdata.qty)
              let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
              items.push(this.createIngredientData(objData));
            });
          }
          let utilityArray:any=[];
          if(this.recipeArray.recipe_utility){
            utilityArray=this.recipeArray.recipe_utility
          }
          else if(this.recipeArray.modifier_utility){
            utilityArray=this.recipeArray.modifier_utility
          }
         
          if( utilityArray.length){
            utilityArray.forEach((element:any) => {
              let objData = {
                utility_id: element.utility_id,
                name: element.utility_name,
                utility_cost:element.cost
              }
              let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
              items.push(this.createUtilitiesData(objData));
            });
          }
          this.recipe_id = this.recipeArray.recipe_id
          this.cost_price = this.recipeArray.cost_price
          this.cost_price_plus_wastage = this.recipeArray.cost_price_plus_wastage
          this.food_cost_percentage = this.recipeArray.food_cost_percentage
          this.sugg_sale_price = this.recipeArray.sugg_sale_price
          this.actual_sale_price = this.recipeArray.item?this.recipeArray.item.default_price:this.recipeArray.actual_sale_price,
          this.gross_profit_amount = this.recipeArray.gross_profit_amount
          this.gross_profit_percentage = this.recipeArray.gross_profit_percentage
         this.measurementUnit=this.recipeArray.measurement_unit_name;
          let itemPreferenceArray: any
          itemPreferenceArray = this.recipeArray.recipe_item_preference ? this.recipeArray.recipe_item_preference : this.recipeArray.modifier_item_preference
          this.addRecipeForm.patchValue({
            tax_rate: itemPreferenceArray ? itemPreferenceArray.tax_rate : 0,
            targeted_food_cost_percentage: itemPreferenceArray ? itemPreferenceArray.targeted_food_cost_percentage : 0,
            waste_percentage: itemPreferenceArray ? itemPreferenceArray.waste_percentage : 0,
           // is_track_consumption: this.recipeArray.is_track_consumption,
            recipe_preparation_method: itemPreferenceArray ? itemPreferenceArray.recipe_preparation_method : '-',
            measurement_unit_id: this.recipeArray.measurement_unit_id,
          })
          if (this.recipeArray.stock_opening_balance) {
            this.recipeArray.stock_opening_balance.forEach((obj: any) => {
            
                let priceData: any = {
                  location_id: obj.branch_id,
                  location_name: obj.branch_name? obj.branch_name:'-',
                  openingBalance: obj.on_hand_qty,
                  reorder_qty: obj.reorder_qty,
                  is_track_inventory: obj.is_track_inventory
                }
                let items = this.addRecipeForm.get('locationData') as UntypedFormArray;
                items.push(this.createPriceItem(priceData));
            });
          
          }
        }
        else {
          console.log("Error in recipe");
        }
      });
  }
  back() {
    this.router.navigate(['setup/inventorySetup/recipes'])
  }
  clearutility(index: any) {
    let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
    items.removeAt(index);
    
    this.findRecipeCostValues();
 }
  findutilityTotal(i: any){
    let items = this.addRecipeForm.value['utilitiesData']
    let cost = items[i].utility_cost;
    this.utility_total = (parseFloat(cost) + parseFloat(this.utility_total)).toFixed(4);
    
    this.findRecipeCostValues();
  }
}
