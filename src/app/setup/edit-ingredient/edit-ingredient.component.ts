import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.scss']
})
export class EditIngredientComponent implements OnInit {
  measurementArray: any = []
  categoryArray: any = []
  supplierArray: any = []
  addIngredientForm!: UntypedFormGroup;
  measurementUnit: any = '';
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  suppliersData = new UntypedFormControl();
  locationData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  totalQty: any;
  public locationPrices: any = [];
  branchName: any;
  branchRecords: any = [];
  costPerUnit: any;
  openingBalance: number;
  ingredientArray: any = []
  validationSupplier: boolean;
  currency_symbol = localStorage.getItem('currency_symbol');

  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, private localService: LocalStorage, private route: ActivatedRoute) {
    this.branchName = localService.get('branchname')
    this.costPerUnit = 0;
    this.openingBalance = 0;
    this.validationSupplier = false;
    this.totalQty = '';
  }

  ngOnInit(): void {
    this.getIngredients();
    this.onBuildForm();
    this.getMeasurementUnits();
    this.geCategories();
    this.getSuppliers();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  getIngredients() {
    this.httpService.get('ingredient/' + this.route.snapshot.params.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.ingredientArray = result.data[0]
          let supplierList = [];
          if (this.ingredientArray.item_supplier) {
            supplierList = this.ingredientArray.item_supplier;
            supplierList.forEach((obj: any) => {
              let objData: any = {
                supplier_id: obj.supplier_id,
                supplier_name: obj.supplier_name,
                price: obj.price,
                is_default: obj.is_default
              }

              let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
              items.push(this.createSupplierData(objData));
            });
          }

          this.getBranch();
          console.log(this.ingredientArray.purchase_detail.has_sub_unit);

          this.addIngredientForm.patchValue({
            name: this.ingredientArray.ingredient[0].ingredient_name,
            code: this.ingredientArray.ingredient[0].ingredient_code,
            ingredient_category_id: this.ingredientArray.ingredient[0].ingredient_category_id,
            measurement_unit_id: this.ingredientArray.purchase_detail.measurement_unit_id,
            description: this.ingredientArray.ingredient[0].ingredient_description,
            buying_unit: this.ingredientArray.purchase_detail.buying_unit,
            has_sub_unit: this.ingredientArray.purchase_detail.has_sub_unit,
            buying_sub_unit: this.ingredientArray.purchase_detail.buying_sub_unit,
            unit_equals_measurement_unit: this.ingredientArray.purchase_detail.unit_equals_measurement_unit,
            unit_equals_sub_unit: this.ingredientArray.purchase_detail.unit_equals_sub_unit,
            net_unit: this.ingredientArray.purchase_detail.net_unit,
            lastBuyingPrice: (this.ingredientArray.cost_per_unit.toFixed(2)) * (this.ingredientArray.purchase_detail.net_unit.toFixed(2)),
            tax_rate: this.ingredientArray.item_supplier[0].tax_rate,
            stock_type: '',
          })
          this.costPerUnit = this.ingredientArray.cost_per_unit.toFixed(2);
          this.measurementUnit = this.ingredientArray.purchase_detail.measurement_unit_name;
          this.findTotalQty();
        }
        else {
          console.log("Error in ingredient");
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
            if (this.ingredientArray.stock_opening_balance) {
              locationList = this.ingredientArray.stock_opening_balance;
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
            let items = this.addIngredientForm.get('locationData') as UntypedFormArray;
            items.push(this.createPriceItem(dataObj));
          });


        } else {
          console.log("Error");
        }
      });
  }

  showOpeningBalance(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.locationData[index].openingBalance;
  }
  onBuildForm() {
    this.addIngredientForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75), Validators.pattern(this.validationExpression)])],
      code: [{ value: '', disabled: true }],
      ingredient_category_id: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      measurement_unit_id: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      description: [{ value: '', disabled: true }],
      buying_unit: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      has_sub_unit: [{ value: 0, disabled: true }],
      buying_sub_unit: [{ value: '', disabled: true }],
      unit_equals_measurement_unit: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      unit_equals_sub_unit: [{ value: '', disabled: true }],
      net_unit: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      suppliersData: new UntypedFormArray([]),
      locationData: new UntypedFormArray([]),
      lastBuyingPrice: [{ value: '', disabled: true }],
      tax_rate: [{ value: '', disabled: true }],
      stock_type: [{ value: '', disabled: true }]
    });
    // this.addIngredientForm.controls['name'].disable();
    // this.addIngredientForm.controls['code'].disable();
    // this.addIngredientForm.controls['ingredient_category_id'].disable();
    // this.addIngredientForm.controls['measurement_unit_id'].disable();
    // this.addIngredientForm.controls['buying_unit'].disable();
    // this.addIngredientForm.controls['has_sub_unit'].disable();
    // this.addIngredientForm.controls['buying_sub_unit'].disable();
    // this.addIngredientForm.controls['unit_equals_sub_unit'].disable();
    // this.addIngredientForm.controls['unit_equals_measurement_unit'].disable();
    // this.addIngredientForm.controls['net_unit'].disable();
    // this.addIngredientForm.controls['lastBuyingPrice'].disable();
    // this.addIngredientForm.controls['tax_rate'].disable();

  }

  supplierSelected(suppliername: any, id: any) {
    let objData: any = {
      supplier_id: id,
      supplier_name: suppliername,
      price: 0,
      is_default: 0
    }

    let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
    items.clear();
    items.push(this.createSupplierData(objData));


    this.validationSupplier = true;
  }

  get supplierFormGroups() {
    return this.addIngredientForm.get('suppliersData') as UntypedFormArray;
  }
  get locationPricesFormGroups() {
    return this.addIngredientForm.get('locationData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  supplierName(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.suppliersData[index].supplier_name;
  }
  price(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.suppliersData[index].price;
  }
  clearSupplier(index: any) {
    let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
    items.clear();
    this.validationSupplier = false
  }
  createPriceItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
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
  findTotalQty() {
    let buyingQty = this.addIngredientForm.value['unit_equals_measurement_unit'];
    let uingsubqty = this.addIngredientForm.value['unit_equals_sub_unit']
    let quantity = buyingQty * uingsubqty
    if (quantity > 0) {
      this.totalQty = 1 + " " + this.addIngredientForm.value['buying_unit'] + " = " + this.addIngredientForm.value['unit_equals_sub_unit'] + " " + this.addIngredientForm.value['buying_sub_unit'] + " = " + quantity + " " + this.measurementUnit
    }
  }
  findCostPerUnit() {

    let netQuantity = this.addIngredientForm.value['net_unit'];
    let items = this.addIngredientForm.value['suppliersData']
    let netPrice = items[0].price

    if (netQuantity > 0 && netPrice > 0) {
      this.costPerUnit = (netPrice / netQuantity).toFixed(2)
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
  getSuppliers() {
    this.httpService.get('supplier')
      .subscribe(result => {
        if (result.status == 200) {
          this.supplierArray = result.data.suppliers;
          this.supplierArray.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            this.options.push(objData)
          });

        } else {
          console.log("Error in supplier");
        }
      });
  }
  errorMessageReorder_qty(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.locationData[i].reorder_qty >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }
  branchname(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.locationData[index].location_name;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/ingredients'])
  }

  saveIngredient() {

    let supplierList: any = [];
    let items = this.addIngredientForm.value['suppliersData']
    items.forEach((obj: any) => {
      let objData = {
        supplier_id: obj.supplier_id,
        tax_rate: this.addIngredientForm.value['tax_rate'],
        price: obj.price,
        is_default: obj.is_default
      }
      supplierList.push(objData)

    });
    let opening_balance_array: any = []
    let data = this.addIngredientForm.value['locationData']

    data.forEach((obj: any) => {
      if (obj.openingBalance >= 0 && obj.reorder_qty >= 0) {
        let objData = {
          reorder_qty: obj.reorder_qty,
          opening_balance: obj.openingBalance,
          branch_id: obj.location_id,
          is_track_inventory: obj.is_track_inventory
        }
        opening_balance_array.push(objData)
      }


    });

    let post = {
      name: this.ingredientArray.ingredient[0].ingredient_name,
      code: this.ingredientArray.ingredient[0].ingredient_code,
      ingredient_category_id: this.ingredientArray.ingredient[0].ingredient_category_id,
      measurement_unit_id: this.ingredientArray.purchase_detail.measurement_unit_id,
      description: this.ingredientArray.ingredient[0].ingredient_description,
      buying_unit: this.ingredientArray.purchase_detail.buying_unit,
      has_sub_unit: this.ingredientArray.purchase_detail.has_sub_unit,
      buying_sub_unit: this.ingredientArray.purchase_detail.buying_sub_unit,
      unit_equals_measurement_unit: this.ingredientArray.purchase_detail.unit_equals_measurement_unit,
      unit_equals_sub_unit: this.ingredientArray.purchase_detail.unit_equals_sub_unit,
      net_unit: this.ingredientArray.purchase_detail.net_unit,
      lastBuyingPrice: this.ingredientArray.item_supplier[0].price,
      tax_rate: this.ingredientArray.item_supplier[0].tax_rate,
      cost_per_unit: this.costPerUnit,
      opening_balance_array: opening_balance_array,
      stock_type: 0,
      supplier: supplierList,
    }

    if (opening_balance_array.length > 0 && opening_balance_array.length == data.length) {
      this.httpService.put('ingredient/' + this.route.snapshot.params.id, post)
        .subscribe(result => {
          if (result.status == 200) {
            this.back();
            this.snackBService.openSnackBar("ingredient Updated ", "Close");
          } else {
            this.snackBService.openSnackBar("Invalid Data", "Close");
          }
        });
    }

  }

}
