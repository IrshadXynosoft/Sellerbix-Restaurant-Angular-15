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
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  recipe_id: any;
  recipe_name: any;
  ingredientsData = new UntypedFormControl();
  utilitiesData = new UntypedFormControl();
  options: any = [];
  utilities: any = [];
  ingredientArray: any = []
  filteredOptions: Observable<any[]> | undefined;
  utility_total: any = 0;
  addRecipeForm!: UntypedFormGroup;
  subTotalItem: any;
  cost_price: any;
  cost_price_plus_wastage: any;
  food_cost_percentage: any;
  sugg_sale_price: any;
  actual_sale_price: any;
  gross_profit_amount: any;
  gross_profit_percentage: any;
  taxValidationExpression: any = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$";
  ingredientVlidation: any;
  prefernceArray: any = []
  save_type = this.route.snapshot.params.type;
  measurementArray: any = []
  measurementUnit: any;
  public locationPrices: any = [];
  branchRecords: any = [];
  validationForOpeningBalance: boolean = true;
  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, 
    private httpService: HttpServiceService, private snackBService: SnackBarService, 
    private formBuilder: UntypedFormBuilder, private localservice: LocalStorage) {

    this.recipe_id = this.route.snapshot.params.id;
    this.recipe_name = this.route.snapshot.params.name;
    this.actual_sale_price = this.route.snapshot.params.price;
    this.cost_price = 0;
    this.ingredientVlidation = false
  }

  ngOnInit(): void {
    this.onBuildForm();
    //this.getIngredients();
    this.getUtilities();
    this.getItemPreferences();
    this.getMeasurementUnits();
    this.getBranch();
    this.filteredOptions = this.ingredientsData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

  }
  onBuildForm() {
    this.addRecipeForm = this.formBuilder.group({
      ingredientsData: new UntypedFormArray([]),
      utilitiesData: new UntypedFormArray([]),
      measurement_unit_id: ['', Validators.compose([Validators.required])],
      tax_rate: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      targeted_food_cost_percentage: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      waste_percentage: ['', Validators.compose([Validators.required, Validators.pattern(this.taxValidationExpression)])],
      recipe_preparation_method: [''],
     // is_track_consumption: false,
      locationData: new UntypedFormArray([])
    });
  }

  searchItem(filterText: any) {
    this.options=[];
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
  if(filterText.length>2){
    this.options=[];
   this.httpService.get('autocomplete_search_for_recipe/'+filterText)
   .subscribe(result => {
     if (result.status == 200) {
      this.options=[];
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
  getItemPreferences() {

    this.httpService.get('global-item-preference')
      .subscribe(result => {
        if (result.status == 200) {
          this.prefernceArray = result.data;
          this.patchValues();

        } else {
          console.log("Error in category");
        }
      });
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
  patchValues() {
    if (this.prefernceArray.length) {
      this.addRecipeForm.patchValue(
        {
          tax_rate: this.prefernceArray[0].vat_tax_rate,
          targeted_food_cost_percentage: this.prefernceArray[0].food_cost,
          waste_percentage: this.prefernceArray[0].wastage,
        }
      )
    }
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

  getUtilities() {
    this.httpService.get('utility')
      .subscribe(result => {
        if (result.status == 200) {
          this.utilities = result.data;
        } else {
          console.log("Error in utilities get");
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
  utilitiesSelected(id: any, name: any, input: HTMLInputElement) {
    let flag = false;
    if (this.addRecipeForm.value['utilitiesData'].length > 0) {
      this.addRecipeForm.value['utilitiesData'].forEach((element: any) => {
        if (element.utility_id == id) {
          flag = true;
        }
      });
    }
    if (!flag) {
      let objData = {
        utility_id: id,
        name: name,
        utility_cost: null
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
  createIngredientData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  createUtilitiesData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  get ingredientFormGroups() {
    return this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
  }

  get utilityFormGroups() {
    return this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
  }

  IngredientName(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.ingredientsData[index].name;
  }
  utilityName(index: any) {
    let form_data = this.addRecipeForm.value;
    return form_data.utilitiesData[index].name;
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
  clearutility(index: any) {
    let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
    items.removeAt(index);
    this.findRecipeCostValues();

  }
  findTotal(i: any) {
    let items = this.addRecipeForm.value['ingredientsData']
    let netQuantity = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0 && parseFloat(netQuantity)) {
      this.subTotalItem = (netQuantity * cost).toFixed(4)
      items[i].sub_total = this.subTotalItem;
      this.cost_price = 0;
      // items.forEach((obj: any) => {
      //   this.cost_price = (parseFloat(this.cost_price) + parseFloat(obj.sub_total)).toFixed(4);
      // });

      this.findRecipeCostValues();

    }
    else {
      this.subTotalItem = 0
      items[i].sub_total = this.subTotalItem;
      this.cost_price = 0;
      // items.forEach((obj: any) => {
      //   this.cost_price = (parseFloat(this.cost_price) + parseFloat(obj.sub_total)).toFixed(4);
      // });

      this.findRecipeCostValues();
    }

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
              reorder_qty: 0,
              is_track_inventory: true
            }
            this.locationPrices.push(priceData);
          });
          this.locationPrices.forEach((dataObj: any) => {
            let items = this.addRecipeForm.get('locationData') as UntypedFormArray;
            items.push(this.createPriceItem(dataObj));
          });
        } else {
          console.log("Error");
        }
      });
  }
  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  findutilityTotal(i: any) {
    let items = this.addRecipeForm.value['utilitiesData']

    let cost = items[i].utility_cost;
    this.utility_total = (parseFloat(cost) + parseFloat(this.utility_total)).toFixed(4);
    this.findRecipeCostValues();
  }
  isIngredientsAdded() {
    let items = this.addRecipeForm.get('ingredientsData') as UntypedFormArray;
    if (items.length > 0) {
      return false;
    }
    else
      return true;
  }
  isutilityAdded() {
    let items = this.addRecipeForm.get('utilitiesData') as UntypedFormArray;
    if (items.length > 0) {
      return false;
    }
    else
      return true;
  }
  findRecipeCostValues() {
    this.cost_price = 0;
    let items = this.addRecipeForm.value['ingredientsData']
    items.forEach((obj: any) => {
      this.cost_price = (parseFloat(this.cost_price) + parseFloat(obj.sub_total)).toFixed(4);
    });

    let utilities = this.addRecipeForm.value['utilitiesData']
    this.utility_total = 0;
    utilities.forEach((obj: any) => {
      this.utility_total = (parseFloat(this.utility_total) + parseFloat(obj.utility_cost)).toFixed(4);
    });
    this.cost_price = (parseFloat(this.utility_total) + parseFloat(this.cost_price)).toFixed(4);
    let wastage_percetage_cost: any = 0;
    wastage_percetage_cost = this.cost_price * this.addRecipeForm.value['waste_percentage'] / 100
    this.cost_price_plus_wastage = (parseFloat(this.cost_price) + parseFloat(wastage_percetage_cost)).toFixed(4)
    let food_cost: any = 0;
    food_cost = this.cost_price_plus_wastage * this.addRecipeForm.value['targeted_food_cost_percentage'] / 100
    this.food_cost_percentage = (parseFloat(this.cost_price_plus_wastage) + parseFloat(food_cost)).toFixed(4)
    let suggested: any = 0;
    suggested = this.save_type == 'modifier' ? 0 : this.food_cost_percentage * this.addRecipeForm.value['tax_rate'] / 100
    this.sugg_sale_price = this.save_type == 'modifier' ? 0 : (parseFloat(this.food_cost_percentage) + parseFloat(suggested)).toFixed(4)
    this.gross_profit_amount = this.sugg_sale_price == 0 ? 0 : (this.actual_sale_price - this.sugg_sale_price).toFixed(4)
    this.gross_profit_percentage = this.sugg_sale_price == 0 ? 0 : ((this.gross_profit_amount * 100) / this.sugg_sale_price).toFixed(4);
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
  saveRecipe() {
    if (this.addRecipeForm.valid) {
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
      let utilities: any = this.addRecipeForm.value['utilitiesData']

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
        if (this.save_type == 'recipe') {
          post_save_data = {
            item_id: this.recipe_id,
            type: 'recipe',
            name: this.recipe_name,
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
            utility: utilities,
            opening_balance_array:opening_balance_array,
            opening_balance:this.addRecipeForm.value['openingBalance'],
            measurement_unit_id:this.addRecipeForm.value['measurement_unit_id']
          }
        }
        else if (this.save_type == 'modifier') {
          post_save_data = {
            modifier_id: this.recipe_id,
            type: 'modifier',
            name: this.recipe_name,
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
            utility: utilities,
            opening_balance_array:opening_balance_array,
            opening_balance:this.addRecipeForm.value['openingBalance'],
            measurement_unit_id:this.addRecipeForm.value['measurement_unit_id'],
          }
        }
        this.httpService.post('recipe', post_save_data)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Recipe Added ", "Close");
              this.ingredientVlidation = false
              this.back();
            } else {
              this.snackBService.openSnackBar("Invalid Data", "Close");
            }
          });
      }

      else {
        this.ingredientVlidation = true;
      }
    }
    else {
      this.validateAllFormFields(this.addRecipeForm)
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
  back() {
    this.router.navigate(['setup/inventorySetup/recipes'])
  }
}
