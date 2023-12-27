
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { AddIngredientCategoryComponent } from '../add-ingredient-category/add-ingredient-category.component';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';


@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.scss']
})
export class IngredientEditComponent implements OnInit {
  measurementArray: any = []
  categoryArray: any = []
  supplierArray: any = []
  addIngredientForm!: UntypedFormGroup;
  measurementUnit: any = '';
  public validationExpression = "^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$"
  public validationExpressionForFloating = "[+]?([0-9]*[.])?[0-9]+"
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
  validationSupplier: boolean;
  validationForOpeningBalance: boolean;
  quantity: any
  user_type: any;
  branch_id: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  ErrorArray: any = [];
  ingredientArray: any = []
  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, private localService: LocalStorage) {
    this.branchName = localService.get('branchname')
    this.user_type = this.localService.get('user_type');
    this.branch_id = this.localService.get('branch_id')
    this.costPerUnit = 0;
    this.openingBalance = 0;
    this.validationSupplier = true;
    this.validationForOpeningBalance = true;
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getIngredients();
    this.getMeasurementUnits();
    this.geCategories()
   // this.getSuppliers();
   this.totalQty = '';
    //this.getBranch();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  branchSelected(event: any) {
    this.branch_id = event.target.value;
  }
  isSupplierAdded(){
    let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
  }
  onBuildForm() {
    this.addIngredientForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(75)])],
      code: ['', Validators.compose([Validators.pattern(this.validationExpression)])],
      ingredient_category_id: ['', Validators.compose([Validators.required])],
      is_track_inventory: false,
      measurement_unit_id: ['', Validators.compose([Validators.required])],
      description: [''],
      buying_unit: ['', Validators.compose([Validators.required, , Validators.pattern(this.validationExpression)])],
      has_sub_unit: 0,
      buying_sub_unit: ['', Validators.compose([Validators.pattern(this.validationExpression)])],
      unit_equals_measurement_unit: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpressionForFloating)])],
      unit_equals_sub_unit: ['', Validators.pattern(this.validationExpressionForFloating)],
      net_unit: ['', Validators.compose([Validators.required, Validators.pattern(this.validationExpressionForFloating)])],
      suppliersData: new UntypedFormArray([]),
      lastBuyingPrice: ['', Validators.pattern(this.validationExpressionForFloating)],
      reorder_level: ['', Validators.pattern(this.validationExpressionForFloating)],
      opening_balance: ['', Validators.pattern(this.validationExpressionForFloating)],
      reorder_qty: ['', Validators.pattern(this.validationExpressionForFloating)],
      stock_type: [''],
      unit_opening_balance: ['', Validators.pattern(this.validationExpressionForFloating)],
      subunit_opening_balance: ['', Validators.pattern(this.validationExpressionForFloating)],
      measuringunit_opening_balance: ['', Validators.pattern(this.validationExpressionForFloating)],
      locationData: new UntypedFormArray([]),
      net_buying_unit: '',
      openingBalance: 0
    });
    //  this.addIngredientForm.controls['net_unit'].disable();
    this.addIngredientForm.controls['openingBalance'].disable();
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

          if (this.ingredientArray.stock_opening_balance) {
            this.ingredientArray.stock_opening_balance.forEach((obj: any) => {
             let priceData: any = {
                   location_id: obj.branch_id,
                   location_name: obj.branch_name,
                   openingBalance: obj.on_hand_qty,
                   reorder_qty: obj.reorder_qty,
                   is_track_inventory: obj.is_track_inventory,
                   unit_opening_balance:0,
                   subunit_opening_balance:0,
                   measuringunit_opening_balance:0,
                 }
                 this.locationPrices.push(priceData);
               
             });

             this.locationPrices.forEach((dataObj: any) => {
              let items = this.addIngredientForm.get('locationData') as UntypedFormArray;
              items.push(this.createPriceItem(dataObj));
            });
           }
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
            lastBuyingPrice: (this.ingredientArray.cost_per_unit.toFixed(4)) * (this.ingredientArray.purchase_detail.net_unit.toFixed(4)),
             stock_type: '',
          })
          this.costPerUnit = this.ingredientArray.cost_per_unit;
          this.measurementUnit = this.ingredientArray.purchase_detail.measurement_unit_name;
          this.findTotalQty();
        }
        else {
          console.log("Error in ingredient");
        }
      });
  }

  searchSupplier(filterText: any) {
    this.options=[];
  if(filterText.length>2){
    
    this.httpService.get('autocomplete_search_for_supplier/'+filterText)
    .subscribe(result => {
      if (result.status == 200) {
          this.options=result.data
      } else {
        this.snackBService.openSnackBar('No Supplier Found','Close')
      }
    });
   }
  }

  supplierSelected(option: any, input: HTMLInputElement) {
    let flag = false;
    if (this.addIngredientForm.value['suppliersData'].length > 0) {
      this.addIngredientForm.value['suppliersData'].forEach((element: any) => {
        if (element.supplier_id == option.id) {
          flag = true;
        }
      });
    }
   // this.costPerUnit = 0;
    if (!flag) {
      let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
      let objData: any = {
        supplier_id: option.id,
        supplier_name: option.name,
        price: '',
        is_default: items.length == 0 ? true : false
      }
      //items.clear();
      items.push(this.createSupplierData(objData));
     
      this.validationSupplier = true;
    }
    else {
      this.snackBService.openSnackBar("Duplicate Entry", "Close")
    }
    input.value = '';
    input.blur();

  }
  checkboxChanged(index: any) {
    let items: any = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
    items.at(index).get('is_default').setValue(true);
    for (let i = 0; i < items.length; i++) {
      if (i !== index) {
        items.at(i).get('is_default').setValue(false);
      }
    }
    this.findCostPerUnit();

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
  errorMessage(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.suppliersData[i].price >= 0) {
      return ''
    }
    else {
      return 'invalid Price'
    }
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
  errorMessagemeasuringunit_opening_balance(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.suppliersData[i].measuringunit_opening_balance >= 0) {
      return ''
    }
    else {
      return 'invalid Input'
    }
  }
  errorMessagesubunit_opening_balance(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.suppliersData[i].subunit_opening_balance >= 0) {
      return ''
    }
    else {
      return 'invalid Input'
    }
  }
  erroropening_balance(index: any) {
    let items = this.addIngredientForm.value['locationData']

    let unitOpeningBalance = items[index].unit_opening_balance ? items[index].unit_opening_balance : 0
    let subUnitOpeningBalance = items[index].subunit_opening_balance ? items[index].subunit_opening_balance : 0
    let measuringUnitOpeningBalance = items[index].measuringunit_opening_balance ? items[index].measuringunit_opening_balance : 0
    if (this.addIngredientForm.value['has_sub_unit']) {
      if (unitOpeningBalance >= 0 && subUnitOpeningBalance >= 0 && measuringUnitOpeningBalance >= 0) {
        return ''
      }
      else {
        return 'invalid Input'
      }
    }
    else {
      if (unitOpeningBalance >= 0 && measuringUnitOpeningBalance >= 0) {
        return ''
      }
      else {
        return 'invalid Input'
      }
    }

  }
  clearSupplier(index: any) {
    let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
   // items.clear();
    items.removeAt(index);
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
    this.quantity = buyingQty * uingsubqty
    if (this.quantity > 0) {
      this.totalQty = 1 + " " + this.addIngredientForm.value['buying_unit'] + " = " + this.addIngredientForm.value['unit_equals_sub_unit'] + " " + this.addIngredientForm.value['buying_sub_unit'] + " = " + this.quantity + " " + this.measurementUnit
    }
  }
  findCostPerUnit() {
    this.costPerUnit=0;
    let netQuantity = this.addIngredientForm.value['net_unit'];
    let items = this.addIngredientForm.value['suppliersData']
    
    if (netQuantity > 0 && items.length > 0) {
      items.forEach((element:any) => {
        if(element.is_default){
          let netPrice = element.price;
          this.costPerUnit = (netPrice / netQuantity);
        }
      });
     
    }
    else {
      this.costPerUnit = 0;
    }

  }
  findnetUnit() {
    let buyingQty = this.addIngredientForm.value['net_buying_unit'];
    let unitQty = this.addIngredientForm.value['unit_equals_measurement_unit'];
    let netUnit: any;
    if (this.quantity > 0) {
      netUnit = (buyingQty * this.quantity).toFixed(4)
    }
    else {
      netUnit = (buyingQty * unitQty).toFixed(4)
    }
    this.addIngredientForm.patchValue({
      net_unit: netUnit
    })
  }
  geCategories() {
    this.httpService.get('ingredient-category')
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryArray = result.data.ingredient_category;
          //  if(this.categoryArray.length==0){

          //}
        } else {
          console.log("Error in category");
        }
      });
  }
  addCategory() {
    const dialogRef = this.dialog.open(AddIngredientCategoryComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.geCategories();
    });
  }
  addMeasurementUnit() {
    const dialogRef = this.dialog.open(AddMeasurementUnitComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMeasurementUnits();
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
  addSuppliers() {
    const dialogRef = this.dialog.open(AddSupplierComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSuppliers();
    });
  }
  getBranch() {
    this.httpService.get('branch')
      .subscribe(result => {
        if (result.status == 200) {
           this.branchRecords = result.data.tenant_branches;   
          this.branchRecords.forEach((objData: any) => {
            if (this.ingredientArray.stock_opening_balance) {
             this.ingredientArray.stock_opening_balance.forEach((obj: any) => {
                if (objData.id == obj.branch_id) {
                  let priceData: any = {
                    location_id: objData.id,
                    location_name: objData.name,
                    openingBalance: obj.on_hand_qty,
                    reorder_qty: obj.reorder_qty,
                    is_track_inventory: obj.is_track_inventory,
                    unit_opening_balance:0,
                    subunit_opening_balance:0,
                    measuringunit_opening_balance:0,
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
  branchname(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.locationData[index].location_name;
  }
  showOpeningBalance(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.locationData[index].openingBalance;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/ingredients'])
  }

  saveIngredient() {
    let supplierList: any = [];
    let items = this.addIngredientForm.value['suppliersData']
    let netQuantity = this.addIngredientForm.value['net_unit'];
    items.forEach((obj: any) => {
      if (obj.price > 0) {

        let objData = {
          supplier_id: obj.supplier_id,
          price: obj.price,
          is_default: obj.is_default,
          cost_per_unit:parseFloat(obj.price)/parseFloat(netQuantity)
        }
        supplierList.push(objData)
      }

    });
    let opening_balance_array: any = []
    let data = this.addIngredientForm.value['locationData'] 

    
    data.forEach((obj: any) => {
      this.validationForOpeningBalance = true;
      if (obj.openingBalance<0) {
        this.validationForOpeningBalance = false;
      }
    
        let objData = {
          reorder_qty: obj.reorder_qty,
          opening_balance: obj.openingBalance,
          branch_id: obj.location_id,
          is_track_inventory: obj.is_track_inventory,
          location_name: obj.name,
          unit_opening_balance:'',
          subunit_opening_balance:'',
          measuringunit_opening_balance:'',
        }
        opening_balance_array.push(objData)
      


    });
    if (this.addIngredientForm.valid) {
     if (this.validationForOpeningBalance && supplierList.length > 0 && opening_balance_array.length == data.length) {
       
        let post = {
          name: this.addIngredientForm.value['name'],
          code: this.addIngredientForm.value['code'],
          ingredient_category_id: this.addIngredientForm.value['ingredient_category_id'],
          measurement_unit_id: this.addIngredientForm.value['measurement_unit_id'],
          description: this.addIngredientForm.value['description'],
          buying_unit: this.addIngredientForm.value['buying_unit'],
          has_sub_unit: this.addIngredientForm.value['has_sub_unit'],
          buying_sub_unit: this.addIngredientForm.value['buying_sub_unit'],
          unit_equals_measurement_unit: this.addIngredientForm.value['unit_equals_measurement_unit'],
          unit_equals_sub_unit: this.addIngredientForm.value['unit_equals_sub_unit'],
          net_unit: this.addIngredientForm.value['net_unit'] ? this.addIngredientForm.value['net_unit'] : 0,
          cost_per_unit: this.costPerUnit,
          branch_id: this.branch_id,
          //reorder_level:this.addIngredientForm.value['reorder_level'],
          //opening_balance:this.openingBalance,
          opening_balance_array: opening_balance_array,
          stock_type: 0,
          supplier: supplierList,
        }
        this.httpService.put('ingredient/' + this.route.snapshot.params.id, post)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("ingredient Updated ", "Close");
              this.back();
            } else {
              if (result.data) {
                this.ErrorArray = result.data
              }
              this.snackBService.openSnackBar(this.ErrorArray.name, "Close");
            }
          });
      }
    }
    else {
      this.validateAllFormFields(this.addIngredientForm)
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


  findOpeningBalance(index: any) {
    let items = this.addIngredientForm.value['locationData']

    let unitOpeningBalance: any = items[index].unit_opening_balance > 0 ? items[index].unit_opening_balance : 0.00
    let subUnitOpeningBalance: any = items[index].subunit_opening_balance > 0 ? items[index].subunit_opening_balance : 0.00
    let measuringUnitOpeningBalance: any = items[index].measuringunit_opening_balance > 0 ? items[index].measuringunit_opening_balance : 0.00
    let unitQty: any = this.addIngredientForm.value['unit_equals_measurement_unit'] > 0 ? this.addIngredientForm.value['unit_equals_measurement_unit'] : 0.00
    let subUnitQty: any = this.addIngredientForm.value['unit_equals_sub_unit'] > 0 ? this.addIngredientForm.value['unit_equals_sub_unit'] : 0.00

    if (this.addIngredientForm.value['has_sub_unit']) {
      this.openingBalance = unitOpeningBalance * unitQty * subUnitQty + subUnitOpeningBalance * unitQty + parseFloat(measuringUnitOpeningBalance)
    }
    else {
      this.openingBalance = unitOpeningBalance * unitQty + parseFloat(measuringUnitOpeningBalance)
    }
    items[index].openingBalance = this.openingBalance
    this.validationForOpeningBalance = true;
    this.addIngredientForm.patchValue({
      locationData: items
    })
  }
}
