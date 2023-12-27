import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-stock-consumption',
  templateUrl: './stock-consumption.component.html',
  styleUrls: ['./stock-consumption.component.scss']
})
export class StockConsumptionComponent implements OnInit {

  currency_symbol = localStorage.getItem('currency_symbol');
  public newStockRequestForm!: UntypedFormGroup;
  branch_id: any;
  order_no: any;
  consumptionRecord: any = [];
  branchRecords: any = [];
  stockOnHandBranch: any;
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  supplierArrays: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  recipeArray: any = [];
  subrecipeArray: any = [];
  total_price: any = 0;
  selectedStockIDs: any = [];
  allItemArray: any = [];
  today: any;
  isItemsSelected: boolean = false;
  getRequestArray = [];
  branch_name: any;
  stockType: any;
  Records: any = [];
  SelectedOption:any;
  constructor(private dataService: DataService, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.branch_id = this.localService.get('branch_id');
    this.branch_name = this.localService.get('branchname');

  }
  ngOnInit(): void {
    this.generateOrderNo();
    this.getBranch();
    this.onBuildForm();
    this.getItems();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    // this.consumptionRecord = [{
    //   "stock_id": 5, "cost_per_unit": 0, "cost_price": 2701.47, "stock_type": 4,
    //   "recipe": {
    //     "id": 5, "name": "Chick'N Cone", "yield": 1, "cost_price": 2701.47, "measurement_unit_name": null, "measurement_unit_id": null,
    //     "sub_recipe_ingredient": [{ "id": 6, "name": "Waffle cone batter", "required": 40, "measurement_unit_name": "Gram", "available_stock": 1418 },
    //     { "id": 4, "name": "chciken  masala", "required": 100, "measurement_unit_name": "Gram", "available_stock": -901 }],
    //     "ingredient": [{ "ingredient_id": 19, "ingredient_name": "Cone Flour", "required": 6, "measurement_unit_name": "Gram", "available_stock": 132554.69 },
    //     { "ingredient_id": 18, "ingredient_name": "potato", "required": 1, "measurement_unit_name": "Kg", "available_stock": 115.75 }]
    //   }
    // }
    //   , {
    //     "stock_id": 6, "cost_per_unit": 0, "cost_price": 12.25, "stock_type": 4, "recipe": {
    //       "id": 6, "name": "KICK'NFRIES", "yield": 1, "cost_price": 12.25,
    //       "measurement_unit_name": null, "measurement_unit_id": null, "sub_recipe_ingredient": [{
    //         "id": 7, "name": "Kick'n Ranch Sauce", "required": 80,
    //         "measurement_unit_name": "Gram", "available_stock": 22460
    //       }, {
    //         "id": 6, "name": "Waffle cone batter", "required": 10,
    //         "measurement_unit_name": "Gram", "available_stock": 1418
    //       }], "ingredient": [{
    //         "ingredient_id": 19, "ingredient_name": "Cone Flour",
    //         "required": 200, "measurement_unit_name": "Gram", "available_stock": 132554.69
    //       }]
    //     }
    // }]
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }

  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no = "STREQ_" + date + "." + month + "." + year + "_" + hh + ":" + mm + ":" + ss;
    this.today = date + '/' + month + '/' + year

  }
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          let branchs = result.data.tenant_branches;
          branchs.forEach((element: any) => {
            if (element.id != this.branch_id) {
              this.branchRecords.push(element)
            }
          });
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  // branchSelected(id: any, name: any) {
  //   if (id) {
  //     this.branch_id = id
  //     this.branch_selected = true;
  //     this.newStockRequestForm.patchValue({
  //       branch_selected: name,
  //       branch_id_for_requst:id
  //     })

  //   }
  // }
  onBuildForm() {
    this.newStockRequestForm = this.formBuilder.group({
      stock_request_number: [this.order_no, Validators.compose([Validators.required])],
      branch_selected: [this.branch_name],
      from_branch: [this.branch_id],
      branch_id_for_requst: [this.branch_id],
      req_date: [this.today],
      comments: [''],
      suppliersData: new UntypedFormArray([]),
      to_branch: ['', Validators.compose([Validators.required])],
    });
    this.newStockRequestForm.controls['branch_selected'].disable();
    this.newStockRequestForm.controls['req_date'].disable();
  }
  getItems() {

    this.httpService.get('get-inventory-all-type/' + this.newStockRequestForm.value['from_branch'])
      .subscribe(result => {
        if (result.status == 200) {
          this.allItemArray = result.data;
          this.ingredientArray = this.allItemArray.ingredients;
          this.ingredientArray?.forEach((element: any) => {
            let objData: any;
            if (element.ingredient) {
              if (element.stock_type == 2) {
                let objData = {
                  stock_type: 2,
                  stock_id: element.stock_id,
                  id: element.ingredient.ingredient_id,
                  name: element.ingredient.ingredient_name,
                  stock_on_hand: element.on_hand_qty,
                  supplier_name: element.item_supplier[0].supplier_name,
                  cost_per_unit: element.cost_per_unit,
                  buying_unit: element.purchase_detail.buying_unit,
                  has_sub_unit: element.purchase_detail.has_sub_unit,
                  unit_equals_sub_unit: element.purchase_detail.unit_equals_sub_unit,
                  unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
                  qty: "",
                  qtybuyingUnit: '',
                  qtybuyingSubUnit: '',
                  qtyToMeasurementUnit: '',
                  qtyMeasurementUnit: '',
                  total: 0,
                  measurement_unit_name: element.purchase_detail.measurement_unit_name
                }
                this.options.push(objData)
              }

            }
          });
          this.subrecipeArray = this.allItemArray.recipes_subRecipes;
          this.subrecipeArray?.forEach((element: any) => {
            let objData: any;
            if (element.sub_recipe) {

              let objData = {
                stock_type: 3,
                stock_id: element.stock_id,
                id: element.sub_recipe.id,
                name: element.sub_recipe.name,
                stock_on_hand: element.sub_recipe.stock_on_hand,
                supplier_name: '--',
                cost_per_unit: element.cost_per_unit,
                buying_unit: element.sub_recipe.measurement_unit_name,
                has_sub_unit: 0,
                unit_equals_sub_unit: '--',
                unit_equals_measurement_unit: element.sub_recipe.measurement_unit_name,
                qty: "",
                qtybuyingUnit: '',
                qtybuyingSubUnit: '',
                qtyToMeasurementUnit: '',
                qtyMeasurementUnit: '',
                total: 0,
                measurement_unit_name: element.sub_recipe.measurement_unit_name
              }
              this.options.push(objData)


            }
          });
          if (result.data == null) {
            this.showNoReorderItemDialog();
          }

        } else {
          console.log("Error in get reorder");
        }
      });
  }

  itemSelected(option: any, input: HTMLInputElement) {
    this.SelectedOption=option;
    let postData: any = {
      stock_type: option.stock_type,
      inventory_id: option.id
    }
    if (option.stock_type)
      this.httpService.post('reports/inventory-conception', postData)
        .subscribe(result => {
          if (result.status == 200) {
            let objData: any=[];
          
            this.Records=[];
            this.consumptionRecord = result.data;
            this.consumptionRecord?.forEach((element: any) => {
              let datas: any=[];
             
              if (element.recipe) {
            let data: any=[];

                if (element.recipe.ingredient) {
                  element.recipe.ingredient.forEach((obj: any) => {
                    let ingredientArray = {
                      name: obj.ingredient_name,
                      type: 'Ingredient',
                      required: obj.required,
                      unit: obj.measurement_unit_name,
                      available: obj.available_stock
                    }
                    data.push(ingredientArray)
                  })
                
                }
                if(element.recipe.sub_recipe_ingredient) {
                  element.recipe.sub_recipe_ingredient.forEach((obj: any) => {
                    let subRecipeArray = {
                      name: obj.name,
                      type: 'Sub Recipe',
                      required: obj.required,
                      unit: obj.measurement_unit_name,
                      available: obj.available_stock
                    }
                    data.push(subRecipeArray)
                  })
                 
                }
                objData = {
                  name: element.recipe.name,
                  stock_on_hand: element.recipe.available_stock,
                  cost: element.cost_price,
                  measurement_unit: null,
                  type: 'Recipe',
                  inventory: data
                }
              }
              else {
                element.sub_recipe.sub_recipe_ingredient.forEach((obj: any) => {
                  let ingredientArray = {
                    name: obj.ingredient_name,
                    type: 'Ingredient',
                    required: obj.required,
                    unit: obj.measurement_unit_name,
                    available: obj.available_stock
                  }
                  datas.push(ingredientArray)
                })
              
                
                objData = {
                  name: element.sub_recipe.name,
                  stock_on_hand: element.sub_recipe.stock_on_hand,
                  cost: element.cost_per_unit,
                  measurement_unit: element.sub_recipe.measurement_unit_name,
                  type: 'Sub Recipe',
                  inventory: datas
                }
              }
              this.Records.push(objData);

            })

          }

        })
    input.value = '';
    input.blur();
  }


  get supplierFormGroups() {
    return this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  supplierName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].supplier_name;
  }
  itemName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].stock_on_hand + form_data.suppliersData[index].measurement_unit_name;
  }
  price(index: any) {
    let form_data = this.newStockRequestForm.value;

    return form_data.suppliersData[index].cost_per_unit + this.currency_symbol + '/' + form_data.suppliersData[index].measurement_unit_name;
  }
  errorMessage(i: any) {
    let form_data = this.newStockRequestForm.value;
    let decimal_length = form_data.suppliersData[i].qty.split('.')[1] ? form_data.suppliersData[i].qty.split('.')[1].length : 0
    let digit_length = form_data.suppliersData[i].qty.split('.')[0] ? form_data.suppliersData[i].qty.split('.')[0].length : 0
    if (form_data.suppliersData[i].qty >= 0 && decimal_length <= 3 && digit_length <= 5) {

      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }
  unit(index: any) {
    let form_data = this.newStockRequestForm.value;
    let unitQty = form_data.suppliersData[index].unit_equals_measurement_unit
    let openingBalance: any;
    if (form_data.suppliersData[index].has_sub_unit == 1) {
      let subUnitQty = form_data.suppliersData[index].unit_equals_sub_unit
      openingBalance = unitQty * subUnitQty
    }
    else {
      openingBalance = unitQty
    }
    let value: any;
    if (form_data.suppliersData[index].stock_type == 3) {
      value = unitQty
    }
    else {
      value = form_data.suppliersData[index].buying_unit ? '1 ' + form_data.suppliersData[index].buying_unit + '=' + openingBalance + form_data.suppliersData[index].measurement_unit_name : '-';
    }
    return value;
  }
  measurementunit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].buying_unit;
  }
  isBuyingSubUnit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].has_sub_unit ? true : false;
  }
  clearSupplier(index: any) {
    let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.newStockRequestForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id), 1);
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total)
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }


  showNoReorderItemDialog() {

  }
  findTotal(i: any) {
    let items = this.newStockRequestForm.value['suppliersData']

    let netQuantity = parseFloat(items[i].qty)
    let cost = items[i].cost_per_unit

    if (netQuantity > 0 && cost > 0) {
      if (items[i].stock_type == 3) {
        items[i].qtyToMeasurementUnit = netQuantity
        let subTotalItem = (netQuantity * cost).toFixed(2);
        items[i].total = subTotalItem;
      }
      else {

        //qtyToMeasurementUnit
        let unitQty = items[i].unit_equals_measurement_unit
        let openingBalance: any;
        if (items[i].has_sub_unit == 1) {
          let subUnitQty = items[i].unit_equals_sub_unit
          openingBalance = netQuantity * unitQty * subUnitQty
        }
        else {
          openingBalance = netQuantity * unitQty
        }
        items[i].qtyToMeasurementUnit = openingBalance
        //console.log(this.newOrderForm.value['suppliersData'])

        let subTotalItem = (openingBalance * cost).toFixed(2);
        items[i].total = subTotalItem;
      }
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
    }
  }

  subTotal(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].total;
  }


  back() {
    this.router.navigate(['inventory/stockRequests'])
  }

  saveStockRequest() {
    let recipe: any = []
    let ingredients: any = [];
    let finished_good: any = [];
    let subRecipe: any = [];
    let item = this.newStockRequestForm.value['suppliersData']
    item.forEach((obj: any) => {
      if (obj.qty > 0) {
        if (obj.stock_type == 2) {
          let objData = {
            ingredient_id: obj.id,
            qty: obj.qtyToMeasurementUnit,
            total: obj.total
          }
          ingredients.push(objData)
        }
        else if (obj.stock_type == 1) {
          let objData = {
            finished_good_id: obj.id,
            qty: obj.qtyToMeasurementUnit,
            total: obj.total
          }
          finished_good.push(objData)
        }
        else {
          let objData = {
            sub_recipe_id: obj.id,
            qty: obj.qtyToMeasurementUnit,
            total: obj.total
          }
          subRecipe.push(objData)
        }
      }
    });

    let arrayLength = parseInt(finished_good.length) + parseInt(ingredients.length) + parseInt(subRecipe.length)
    if (arrayLength == item.length && item.length > 0) {
      let postParamsSave = {
        stock_request_number: this.newStockRequestForm.value['stock_request_number'],
        comments: this.newStockRequestForm.value['comments'] ? this.newStockRequestForm.value['comments'] : null,
        from_branch: this.newStockRequestForm.value['from_branch'],
        to_branch: this.newStockRequestForm.value['to_branch'],
        total_amount: this.total_price,
        branch_id: this.newStockRequestForm.value['from_branch'],
        request_items_list: [{
          ingredients: ingredients,
          finished_good: finished_good,
          sub_recipe: subRecipe
        }]
      }

      this.httpService.post('stock-request', postParamsSave)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Stock Request Created Successfully ", "Close");
            this.back();
          } else {
            console.log("Error in stock-request");
          }
        });
    }
  }

  viewRequestDetail(id: any) {
    this.getRequestArray.forEach((element: any) => {
      if (id == element.id) {
        this.dataService.setData('stockrequestItem', element);
        this.router.navigate(['inventory/stockrequestdetail'])

      }
    });
  }

}
