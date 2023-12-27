import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from '../../_services/http-service.service';
import { SnackBarService } from '../../_services/snack-bar.service';
import { I } from '@angular/cdk/keycodes';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';

@Component({
  selector: 'app-finishedgood-edit',
  templateUrl: './finishedgood-edit.component.html',
  styleUrls: ['./finishedgood-edit.component.scss']
})
export class FinishedgoodEditComponent implements OnInit {
  measurementArray: any = [];
  categoryArray: any = [];
  supplierArray: any = [];
  menuItemArray: any = [];
  ingredientArray: any = [];
  addIngredientForm!: UntypedFormGroup;
  measurementUnit: any = '';
  public validationExpression = '^(?! )[A-Za-z0-9 +,()&-()-]*(?<! )$';
  public validationExpressionForFloating = '[+]?([0-9]*[.])?[0-9]+';
  suppliersData = new UntypedFormControl();
  locationData = new UntypedFormControl();
  menuItemData = new UntypedFormControl();
  options: any = [];
  list_options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  menuItem_filteredOptions: Observable<any[]> | undefined;
  totalQty: any;
  public locationPrices: any = [];
  branchName: any;
  branchrecords: any = [];
  costPerUnit: any;
  openingBalance: number;
  item_id: any;
  item_name: any;
  validationSupplier: boolean;
  finishedGoodArray: any = [];
  validationForOpeningBalance: boolean = true;
  validationForSubUnit: boolean = true;
  ErrorArray: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private formBuilder: UntypedFormBuilder,
    private localService: LocalStorage,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.branchName = this.localService.get('branchname');
    this.costPerUnit = 0;
    this.openingBalance = 0;
    this.validationSupplier = true;
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getFinishedGood();
    this.getMeasurementUnits();
    //.getSuppliers();
    // this.getMenuItem();
    //this.getFinishedGood();
    this.totalQty = '';
    //this.getBranch();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.menuItem_filteredOptions = this.menuItemData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtermenulist(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }
  private _filtermenulist(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.list_options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }

  getMenuItem() {
    this.httpService.get('get-items-for-inventory/1').subscribe((result) => {
      if (result.status == 200) {
        this.menuItemArray = result.data.items;
        this.menuItemArray.forEach((obj: any) => {
          let objData = {
            id: obj.id,
            name: obj.name,
          };
          this.list_options.push(objData);
        });
      } else {
        console.log('Error');
      }
    });
  }
  // getFinishedGood() {
  //   this.httpService.get('finished-good').subscribe((result) => {
  //     if (result.status == 200) {
  //       this.finishedGoodArray = result.data;
  //     } else {
  //       console.log('Error in Fnishedgood');
  //     }
  //   });
  // }
  valueChangedSubUnit() {
    if (
      this.addIngredientForm.value['has_sub_unit'] == 1 &&
      this.addIngredientForm.value['buying_sub_unit'] == ''
    ) {
      this.validationForSubUnit = false;
    } else {
      this.validationForSubUnit = true;
    }
  }
  onBuildForm() {
    this.addIngredientForm = this.formBuilder.group({
      is_track_inventory: false,
      measurement_unit_id: ['', Validators.compose([Validators.required])],
      description: [''],
      buying_unit: ['', Validators.compose([Validators.required])],
      has_sub_unit: 0,
      buying_sub_unit: [''],
      unit_equals_measurement_unit: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpressionForFloating),
        ]),
      ],
      unit_equals_sub_unit: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpressionForFloating),
        ]),
      ],
      net_unit: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.validationExpressionForFloating),
        ]),
      ],
      suppliersData: new UntypedFormArray([]),
      lastBuyingPrice: [
        '',
        Validators.compose([
          Validators.pattern(this.validationExpressionForFloating),
        ]),
      ],
      reorder_level: [''],
      opening_balance: [''],
      reorder_qty: [''],
      stock_type: [''],
      unit_opening_balance: [''],
      subunit_opening_balance: [''],
      measuringunit_opening_balance: [''],
      locationData: new UntypedFormArray([]),
    });
  }

  getFinishedGood() {
    this.httpService.get('finished-good/' + this.route.snapshot.params.id)
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
           let  locationList = this.ingredientArray.stock_opening_balance;
            locationList.forEach((obj: any) => {
             
                let priceData: any = {
                  location_id: obj.branch_id,
                  location_name: obj.branch_name,
                  openingBalance: obj.on_hand_qty,
                  reorder_qty: obj.reorder_qty,
                  is_track_inventory: obj.is_track_inventory,
                  unit_opening_balance:0,
                  subunit_opening_balance: 0,
                  measuringunit_opening_balance: 0,
                }
                this.locationPrices.push(priceData);
              
            });
            this.locationPrices.forEach((dataObj: any) => {
              let items = this.addIngredientForm.get('locationData') as UntypedFormArray;
              items.push(this.createPriceItem(dataObj));
  
  
            });
          }
          this.addIngredientForm.patchValue({
            is_track_inventory: this.ingredientArray.finished_good.is_track_inventory,
            measurement_unit_id: this.ingredientArray.purchase_detail.measurement_unit_id,
            buying_unit: this.ingredientArray.purchase_detail.buying_unit,
            has_sub_unit: this.ingredientArray.purchase_detail.has_sub_unit,
            buying_sub_unit: this.ingredientArray.purchase_detail.buying_sub_unit,
            unit_equals_measurement_unit: this.ingredientArray.purchase_detail.unit_equals_measurement_unit,
            unit_equals_sub_unit: this.ingredientArray.purchase_detail.unit_equals_sub_unit,
            net_unit: this.ingredientArray.purchase_detail.net_unit,
            lastBuyingPrice: parseFloat(this.ingredientArray.cost_per_unit) * parseFloat(this.ingredientArray.purchase_detail.net_unit),
             reorder_qty: this.ingredientArray.reorder_qty,

          })
          this.costPerUnit = this.ingredientArray.cost_per_unit;
          this.measurementUnit = this.ingredientArray.purchase_detail.measurement_unit_name;
          this.openingBalance = this.ingredientArray.on_hand_qty;
          this.item_id = this.ingredientArray.finished_good.items.id
          this.item_name = this.ingredientArray.finished_good.items.name
        }
        else {
          console.log("Error in ingredient");
        }
      });
  }

  // subUnitConditionallyRequiredValidator(formControl: AbstractControl) {
  //   if (!formControl.parent) {
  //     return null;
  //   }

  //   if (formControl.parent.get('has_sub_unit')?.value==1 && formControl.parent.get('buying_sub_unit')?.value) {
  //     alert(5)
  //     return Validators.required(formControl);
  //   }
  //   return null;
  // }
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

  menuItemSelected(name: any, id: any, input: HTMLInputElement) {
    let isEdit: boolean = false;
    let finishedGoodId: any;
    this.finishedGoodArray.forEach((objdata: any) => {
      if (objdata.finished_good.items.id == id) {
        finishedGoodId = objdata.finished_good.finished_good_id;
        isEdit = true;
      }
    });
    if (isEdit) {
      this.router.navigate([
        '/setup/inventorySetup/finishedGoods/edit/' + finishedGoodId,
      ]);
    } else {
      this.item_id = id;
      this.item_name = name;

    }
    input.value = '';
    input.blur();
  }
  isSupplierAdded(){
    let items = this.addIngredientForm.get('suppliersData') as UntypedFormArray;
    if(items.length>0){
      return false;
    }
    else
    return true;
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
  errorMessageReorder_qty(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.locationData[i].reorder_qty >= 0) {
      this.validationSupplier = true;
      return '';
    } else {
      this.validationSupplier = false;
      return 'invalid Quantity';
    }
  }
  erroropening_balance(index: any) {
    let items = this.addIngredientForm.value['locationData'];

    let unitOpeningBalance = items[index].unit_opening_balance
      ? items[index].unit_opening_balance
      : 0;
    let subUnitOpeningBalance = items[index].subunit_opening_balance
      ? items[index].subunit_opening_balance
      : 0;
    let measuringUnitOpeningBalance = items[index].measuringunit_opening_balance
      ? items[index].measuringunit_opening_balance
      : 0;
    if (this.addIngredientForm.value['has_sub_unit']) {
      if (
        unitOpeningBalance >= 0 &&
        subUnitOpeningBalance >= 0 &&
        measuringUnitOpeningBalance >= 0
      ) {
        return '';
      } else {
        return 'invalid Input';
      }
    } else {
      if (unitOpeningBalance >= 0 && measuringUnitOpeningBalance >= 0) {
        return '';
      } else {
        return 'invalid Input';
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
    this.httpService.get('measurement-unit').subscribe((result) => {
      if (result.status == 200) {
        this.measurementArray = result.data.measurement_unit;
      } else {
        console.log('Error in unit');
      }
    });
  }
  errorMessage(i: any) {
    let form_data = this.addIngredientForm.value;
    if (form_data.suppliersData[i].price >= 0) {
      return '';
    } else {
      return 'invalid Price';
    }
  }
  measurementChanged(event: any) {
    let measurementId = event.target.value;
    if (measurementId > 0) {
      this.measurementArray.forEach((obj: any) => {
        if (obj.id == measurementId) {
          this.measurementUnit = obj.name;
        }
      });
    }
  }
  findTotalQty() {
    let buyingQty =
      this.addIngredientForm.value['unit_equals_measurement_unit'];
    let uingsubqty = this.addIngredientForm.value['unit_equals_sub_unit'];
    let quantity = buyingQty * uingsubqty;
    if (quantity > 0) {
      this.totalQty =
        1 +
        ' ' +
        this.addIngredientForm.value['buying_unit'] +
        ' = ' +
        this.addIngredientForm.value['unit_equals_sub_unit'] +
        ' ' +
        this.addIngredientForm.value['buying_sub_unit'] +
        ' = ' +
        quantity +
        ' ' +
        this.measurementUnit;
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

  getSuppliers() {
    this.httpService.get('supplier').subscribe((result) => {
      if (result.status == 200) {
        this.supplierArray = result.data.suppliers;
        this.supplierArray.forEach((obj: any) => {
          let objData = {
            id: obj.id,
            name: obj.name,
          };
          this.options.push(objData);
        });
      } else {
        console.log('Error in supplier');
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
          this.branchrecords = result.data.tenant_branches;
            
          this.branchrecords.forEach((objData: any) => {
            if (this.ingredientArray.stock_opening_balance) {
              locationList = this.ingredientArray.stock_opening_balance;
              locationList.forEach((obj: any) => {
                if (objData.id == obj.branch_id) {
                  let priceData: any = {
                    location_id: objData.id,
                    location_name: objData.name,
                    openingBalance: obj.on_hand_qty,
                    reorder_qty: obj.reorder_qty,
                    is_track_inventory: obj.is_track_inventory,
                    unit_opening_balance:0,
                    subunit_opening_balance: 0,
                    measuringunit_opening_balance: 0,
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
  validateAllFormFields(formGroup: UntypedFormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach((field) => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof UntypedFormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }
  saveFinishedGood() {
    if (this.addIngredientForm.valid) {
      if (
        this.addIngredientForm.value['has_sub_unit'] == 1 &&
        this.addIngredientForm.value['buying_sub_unit'] == ''
      ) {
        this.validationForSubUnit = false;
      } else {
        this.validationForSubUnit = true;
        let supplierList: any = [];
        let items = this.addIngredientForm.value['suppliersData'];
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
        if (supplierList.length > 0) {
          this.validationSupplier = true;
        } else {
          this.validationSupplier = false;
        }
        let opening_balance_array: any = [];
        let data = this.addIngredientForm.value['locationData'];
        data.forEach((obj: any) => {
          this.validationForOpeningBalance = true;
          if (obj.openingBalance<0) {
            this.validationForOpeningBalance = false;
          }
          if (obj.openingBalance >= 0 && obj.reorder_qty >=0) {
            let objData = {
              reorder_qty: obj.reorder_qty,
              opening_balance: obj.openingBalance,
              branch_id: obj.location_id,
              is_track_inventory: obj.is_track_inventory,
            };
            opening_balance_array.push(objData);
          }
        });
        if (
          this.validationForOpeningBalance &&
          this.validationSupplier &&
          opening_balance_array.length == data.length
        ) {
          let post = {
            item_id: this.item_id,
            is_track_inventory:
              this.addIngredientForm.value['is_track_inventory'],
            measurement_unit_id:
              this.addIngredientForm.value['measurement_unit_id'],
            description: this.addIngredientForm.value['description'],
            buying_unit: this.addIngredientForm.value['buying_unit'],
            has_sub_unit: this.addIngredientForm.value['has_sub_unit'],
            buying_sub_unit: this.addIngredientForm.value['buying_sub_unit'],
            unit_equals_measurement_unit:
              this.addIngredientForm.value['unit_equals_measurement_unit'],
            unit_equals_sub_unit:
              this.addIngredientForm.value['unit_equals_sub_unit'],
            net_unit: this.addIngredientForm.value['net_unit'],
            cost_per_unit: this.costPerUnit,
             reorder_level: this.addIngredientForm.value['reorder_level'],
            opening_balance: this.openingBalance,
            reorder_qty: this.addIngredientForm.value['reorder_qty'],
            stock_type: 0,
            supplier: supplierList,
            opening_balance_array: opening_balance_array,
          };
          this.httpService.put('finished-good/'+this.route.snapshot.params.id, post).subscribe((result) => {
            if (result.status == 200) {
              this.snackBService.openSnackBar('Finished good Updated ', 'Close');
              this.back();
            } else {
              if (result.data) {
                this.ErrorArray = result.data
              }
              this.snackBService.openSnackBar(result.data.name, 'Close');
            }
          });
        }
        else {
          this.validationForOpeningBalance = false;
        }
      }
    } else {
      this.validateAllFormFields(this.addIngredientForm);
    }
  }
  showOpeningBalance(index: any) {
    let form_data = this.addIngredientForm.value;
    return form_data.locationData[index].openingBalance;
  }
  findOpeningBalance(index: any) {
    let items = this.addIngredientForm.value['locationData'];

    let unitOpeningBalance =
      items[index].unit_opening_balance > 0
        ? items[index].unit_opening_balance
        : 0;
    let subUnitOpeningBalance =
      items[index].subunit_opening_balance > 0
        ? items[index].subunit_opening_balance
        : 0;
    let measuringUnitOpeningBalance =
      items[index].measuringunit_opening_balance > 0
        ? items[index].measuringunit_opening_balance
        : 0;
    let unitQty =
      this.addIngredientForm.value['unit_equals_measurement_unit'] > 0
        ? this.addIngredientForm.value['unit_equals_measurement_unit']
        : 0;
    let subUnitQty =
      this.addIngredientForm.value['unit_equals_sub_unit'] > 0
        ? this.addIngredientForm.value['unit_equals_sub_unit']
        : 0;

    if (this.addIngredientForm.value['has_sub_unit']) {
      this.openingBalance =
        unitOpeningBalance * unitQty * subUnitQty +
        subUnitOpeningBalance * unitQty +
        parseFloat(measuringUnitOpeningBalance);
    } else {
      this.openingBalance =
        unitOpeningBalance * unitQty + parseFloat(measuringUnitOpeningBalance);
    }
    items[index].openingBalance = this.openingBalance;

    this.addIngredientForm.patchValue({
      locationData: items,
    });
  }
  back() {
    this.router.navigate(['setup/inventorySetup/finishedGoods']);
  }
}

