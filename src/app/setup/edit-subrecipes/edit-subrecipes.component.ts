import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
@Component({
  selector: 'app-edit-subrecipes',
  templateUrl: './edit-subrecipes.component.html',
  styleUrls: ['./edit-subrecipes.component.scss']
})
export class EditSubrecipesComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  measurementArray: any = []
  categoryArray: any = []
  ingredientArray: any = []
  addSubRecipeForm!: UntypedFormGroup;
  measurementUnit: any = '';
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  ingredientsData = new UntypedFormControl();
  locationData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  branchName: any;
  branchrecords: any = [];
  costPerUnit: any;
  openingBalance: number;
  subTotalItem: any;
  subrecipeArray: any = []
  ingredientValidation: boolean;
  branchRecords: any = []
  public locationPrices: any = [];
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, private localService: LocalStorage, private route: ActivatedRoute) {
    this.branchName = localService.get('branchname')
    this.costPerUnit = 0;
    this.openingBalance = 0;
    this.ingredientValidation = false;
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getIngredients();
    this.getMeasurementUnits();
    this.geCategories()

    this.filteredOptions = this.ingredientsData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  getsubRecipes() {
    this.httpService.get('sub-recipe/' + this.route.snapshot.params.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.subrecipeArray = result.data[0]
          let total: any = 0
          this.subrecipeArray.sub_recipe.sub_recipe_ingredient.forEach((objdata: any) => {

            if (this.ingredientArray.length > 0) {
              this.ingredientArray.forEach((obj: any) => {

                if (obj.stock_type == 2 && obj.ingredient) {
                  if (obj.ingredient[0].ingredient_id == objdata.ingredient_id) {

                    let objData = {
                      id: objdata.ingredient_id,
                      name: objdata.ingredient_name,
                      unit_name: obj.purchase_detail ? obj.purchase_detail.measurement_unit_name : '-',
                      cost_per_unit: obj.cost_per_unit,
                      qty: objdata.qty,
                      sub_total: obj.cost_per_unit * objdata.qty
                    }
                    total = parseFloat(total) + (obj.cost_per_unit * objdata.qty)
                    let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
                    items.push(this.createIngredientData(objData));

                  }
                }

              });
            }

          });

          this.getBranch();
          this.addSubRecipeForm.patchValue({
            name: this.subrecipeArray.sub_recipe.name,
            code: this.subrecipeArray.sub_recipe.code,
            ingredient_category_id: this.subrecipeArray.sub_recipe.ingredient_category_id,
            measurement_unit_id: this.subrecipeArray.sub_recipe.measurement_unit_id,
            description: this.subrecipeArray.sub_recipe.description,
            openingBalance: this.subrecipeArray.on_hand_qty,
            reorder_qty: this.subrecipeArray.reorder_qty,
            stock_type: 0,
            is_track_inventory: this.subrecipeArray.sub_recipe.is_track_inventory,
            cost_per_unit: this.subrecipeArray.cost_per_unit,
            yield: this.subrecipeArray.sub_recipe.yield,
            totalAmount: total,

          })
          this.costPerUnit = this.subrecipeArray.cost_per_unit.toFixed(2)
          this.measurementUnit = this.subrecipeArray.sub_recipe.measurement_unit_name
        }
        else {
          console.log("Error in subrecipe");
        }
      });
  }
  getBranch() {
    this.httpService.get('branch')
      .subscribe(result => {
        if (result.status == 200) {
          let locationList = [];
          this.branchRecords = result.data.tenant_branches;
          this.branchRecords.forEach((objData: any) => {
            if (this.subrecipeArray.stock_opening_balance) {
              locationList = this.subrecipeArray.stock_opening_balance;
              locationList.forEach((obj: any) => {
                if (objData.id == obj.branch_id) {
                  let priceData: any = {
                    location_id: objData.id,
                    location_name: objData.name,
                    openingBalance: obj.on_hand_qty,
                    reorder_qty: obj.reorder_qty,
                    is_track_inventory: obj.is_track_inventory
                  }
                  this.locationPrices.push(priceData);
                }
              });
            }

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
  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  branchname(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.locationData[index].location_name;
  }

  showOpeningBalance(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.locationData[index].openingBalance;
  }
  onBuildForm() {
    this.addSubRecipeForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75), Validators.pattern(this.validationExpression)])],
      code: [{ value: '', disabled: true }],
      ingredient_category_id: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      measurement_unit_id: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      description: [{ value: '', disabled: true }],
      ingredientsData: new UntypedFormArray([]),
      openingBalance: [{ value: '', disabled: true }],
      reorder_qty: [{ value: '', disabled: true }],
      stock_type: [{ value: '', disabled: true }],
      is_track_inventory: false,
      cost_per_unit: [{ value: '', disabled: true }],
      yield: [{ value: '', disabled: true }],
      totalAmount: [{ value: 0, disabled: true }],
      locationData: new UntypedFormArray([])
    });

  }
  errorMessageReorder_qty(i: any) {
    let form_data = this.addSubRecipeForm.value;
    if (form_data.locationData[i].reorder_qty >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }

  }
  ingredientSelected(id: any) {
    this.ingredientArray.forEach((obj: any) => {
      if (obj.stock_type == 2 && obj.ingredient) {
        if (obj.ingredient[0].ingredient_id == id) {
          let objData = {
            id: obj.ingredient[0].ingredient_id,
            name: obj.ingredient[0].ingredient_name,
            unit_name: obj.purchase_detail ? obj.purchase_detail.measurement_unit_name : '-',
            cost_per_unit: obj.cost_per_unit,
            qty: 0,
            sub_total: 0
          }
          let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
          items.push(this.createIngredientData(objData));
        }
      }
    });
  }

  get ingredientFormGroups() {
    return this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
  }

  createIngredientData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  get locationPricesFormGroups() {
    return this.addSubRecipeForm.get('locationData') as UntypedFormArray;
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
  quantity(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].qty;
  }
  subTotal(index: any) {
    let form_data = this.addSubRecipeForm.value;
    return form_data.ingredientsData[index].sub_total;
  }
  clearIngredient(index: any) {
    let items = this.addSubRecipeForm.get('ingredientsData') as UntypedFormArray;
    items.removeAt(index);
    let total: any = 0;
    let ingredientList = this.addSubRecipeForm.value['ingredientsData']
    items.value.forEach((obj: any) => {
      total = parseFloat(total) + parseFloat(obj.sub_total)
    });

    this.addSubRecipeForm.patchValue(
      {
        totalAmount: total
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

  findTotal(i: any) {
    let items = this.addSubRecipeForm.value['ingredientsData']
    let netQuantity = items[i].qty ? items[i].qty : 0
    let cost = items[i].cost_per_unit
    if (cost > 0) {
      this.subTotalItem = (netQuantity * cost).toFixed(2);
      items[i].sub_total = this.subTotalItem;
      let total: any = 0;
      items.forEach((obj: any) => {
        total = parseFloat(total) + parseFloat(obj.sub_total);
      });
      let yieldValue = this.addSubRecipeForm.value['yield']


      if (yieldValue > 0) {
        this.costPerUnit = (total / yieldValue).toFixed(2)
      }
      else {
        this.costPerUnit = 0
      }
      this.addSubRecipeForm.patchValue(
        {
          totalAmount: total
        }
      )
    }

  }
  findCostPerUnit() {

    let yieldValue = this.addSubRecipeForm.value['yield']
    let total = this.addSubRecipeForm.value['totalAmount']

    if (yieldValue > 0) {
      this.costPerUnit = (total / yieldValue).toFixed(2)
    }
    else {
      this.costPerUnit = 0
    }

  }

  geCategories() {
    this.httpService.get('ingredient-category')
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryArray = result.data.ingredient_category;

        } else {
          console.log("Error in category");
        }
      });
  }
  getIngredients() {
    this.httpService.get('ingredient')
      .subscribe(result => {
        if (result.status == 200) {
          this.ingredientArray = result.data;
          this.ingredientArray.forEach((obj: any) => {
            if (obj.stock_type == 2 && obj.ingredient) {
              let objData = {
                id: obj.ingredient[0].ingredient_id,
                name: obj.ingredient[0].ingredient_name,
                unit_name: obj.purchase_detail ? obj.purchase_detail.measurement_unit_name : '-',
                cost_per_unit: obj.cost_per_unit,
                qty: 0,
                sub_total: 0
              }
              this.options.push(objData)
            }
          });
          this.getsubRecipes();
        } else {
          console.log("Error in Ingredients");
        }
      });
  }
  back() {
    this.router.navigate(['setup/inventorySetup/subrecipes'])
  }

  savesubRecipe() {

    let ingredientList: any = [];
    let items = this.addSubRecipeForm.value['ingredientsData']
    items.forEach((obj: any) => {
      let objData = {
        ingredient_id: obj.id,
        qty: obj.qty
      }
      ingredientList.push(objData)

    });
    let opening_balance_array: any = []
    let data = this.addSubRecipeForm.value['locationData']
    data.forEach((obj: any) => {
      if (obj.reorder_qty >= 0) {
        let objData = {
          reorder_qty: obj.reorder_qty,
          opening_balance: obj.openingBalance,
          branch_id: obj.location_id,
          is_track_inventory: obj.is_track_inventory
        }
        opening_balance_array.push(objData)
      }
    });
    if (ingredientList.length && ingredientList.length == items.length && opening_balance_array.length > 0) {
      let post = {
        name: this.subrecipeArray.sub_recipe.name,
        code: this.subrecipeArray.sub_recipe.code,
        ingredient_category_id: this.subrecipeArray.sub_recipe.ingredient_category_id,
        measurement_unit_id: this.subrecipeArray.sub_recipe.measurement_unit_id,
        description: this.subrecipeArray.sub_recipe.description,
        openingBalance: this.subrecipeArray.on_hand_qty,
        reorder_qty: this.subrecipeArray.reorder_qty,
        stock_type: 0,
        is_track_inventory: this.subrecipeArray.sub_recipe.is_track_inventory,
        cost_per_unit: this.subrecipeArray.cost_per_unit,
        yield: this.subrecipeArray.sub_recipe.yield,
        sub_recipe_ingredients: ingredientList,
        opening_balance_array: opening_balance_array,
      }
      this.httpService.put('sub-recipe/' + this.route.snapshot.params.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Sub recipe Updated ", "Close");
            this.ingredientValidation = false;
            this.back();
          } else {
            this.snackBService.openSnackBar("Invalid Data", "Close");
          }
        });
    }
    else {
      this.ingredientValidation = true;
    }

  }

}
