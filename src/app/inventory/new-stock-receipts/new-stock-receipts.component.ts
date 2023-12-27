import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-new-stock-receipts',
  templateUrl: './new-stock-receipts.component.html',
  styleUrls: ['./new-stock-receipts.component.scss'],
})
export class NewStockReceiptsComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public newReceiptForm!: UntypedFormGroup;
  order_no: any;
  branch_id: any;
  branch_name: any;
  stockReceipt_filteredOptions: Observable<any[]> | undefined;
  itemArray = new UntypedFormControl();
  options: any = [];
  allItemArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  subrecipeArray = [];
  isItemsSelected: boolean = false;
  total_price: any = 0;
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute
  ) {
    this.branch_id = this.localService.get('branch_id');
    this.branch_name = this.localService.get('branchname');
  }

  ngOnInit(): void {
    this.generateOrderNo();
    this.onBuildForm();
    this.stockReceipt_filteredOptions = this.itemArray.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
   // this.getItems();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }
  onBuildForm() {
    this.newReceiptForm = this.formBuilder.group({
      receipt_reference_number: [
        this.order_no,
        Validators.compose([Validators.required]),
      ],
      receiving_type: ['', Validators.compose([Validators.required])],
      branch_selected: [{ value: this.branch_name, disabled: true }],
      comments: ['', Validators.compose([Validators.required])],
      stockData: new UntypedFormArray([]),
    });
  }
  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no =
      'RECEIVE_ST_' +
      date +
      '.' +
      month +
      '.' +
      year +
      '_' +
      hh +
      ':' +
      mm +
      ':' +
      ss;
  }
  searchItem(filterText: any) {
    this.options=[];
    if(filterText.length>2){
    
     this.httpService.get('autocomplete_search_for_stock_receipt/'+filterText)
     .subscribe(result => {
       if (result.status == 200) {
         if (result.data.length > 0) {
          this.allItemArray = result.data;
          this.options = [];
          this.allItemArray?.forEach((element: any) => {
            if(element.stock_type==1){
              let objData = {
                stock_type: 1,
                stock_id: element.stock_id,
                finished_good_id: element.finished_good.id,
                name: element.finished_good.name,
                stock_on_hand: element.finished_good.stock_on_hand,
                cost_per_unit: element.finished_good.cost_per_unit,
                has_sub_unit: element.finished_good.has_sub_unit,
                buying_unit: element.finished_good.buying_unit ,
                buying_sub_unit: element.finished_good.buying_sub_unit,
                unit_equals_sub_unit: element.finished_good.unit_equals_sub_unit,
                unit_equals_measurement_unit: element.finished_good.unit_equals_measurement_unit,
                measurement_unit_name: element.finished_good.measurement_unit_name,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                receiving_price: '',
              
              };
              this.options.push(objData);
            }
          else  if (element.stock_type == 2) {
              let objData = {
                stock_type: 2,
                stock_id: element.stock_id,
                ingredient_id: element.ingredient.id,
                name: element.ingredient.name,
                stock_on_hand: element.ingredient.stock_on_hand,
                cost_per_unit: element.ingredient.cost_per_unit,
                buying_unit: element.ingredient.buying_unit,
                buying_sub_unit: element.ingredient.buying_sub_unit,
                has_sub_unit:  element.ingredient.has_sub_unit,
                unit_equals_sub_unit:element.ingredient.unit_equals_sub_unit,
                unit_equals_measurement_unit:element.ingredient.unit_equals_measurement_unit,
                measurement_unit_name: element.ingredient.measurement_unit_name,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                receiving_price: '',
               
              };
              this.options.push(objData);
            }
         else   if (element.stock_type == 3) {
              let objData = {
                stock_type: element.stock_type,
                stock_id: element.stock_id,
                sub_recipe_id: element.sub_recipe.id,
                name: element.sub_recipe.name,
                stock_on_hand: element.sub_recipe.stock_on_hand,
                has_sub_unit: element.sub_recipe.has_sub_unit,
                cost_per_unit: element.sub_recipe.cost_per_unit,
                buying_unit: element.sub_recipe.buying_unit,
                buying_sub_unit: element.sub_recipe.buying_sub_unit,
                unit_equals_sub_unit: element.sub_recipe.unit_equals_sub_unit,
                unit_equals_measurement_unit: element.sub_recipe.unit_equals_measurement_unit,
                measurement_unit_name: element.sub_recipe.measurement_unit_name,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                receiving_price: '',
               
              };
              this.options.push(objData);
            }
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
  // getItems() {
  //   this.httpService
  //     .get('get-inventory-all-type/' + this.branch_id)
  //     .subscribe((result) => {
  //       if (result.status == 200) {
  //         this.allItemArray = result.data;
  //         this.options = [];
  //         this.finishedGoodArray = this.allItemArray.finished_good;
  //         this.finishedGoodArray?.forEach((element: any) => {
  //           let objData = {
  //             stock_type: 1,
  //             stock_id: element.stock_id,
  //             finished_good_id: element.finished_good.finished_good_id,
  //             name: element.finished_good.name,
  //             stock_on_hand: element.on_hand_qty,
  //             cost_per_unit: element.cost_per_unit,
  //             has_sub_unit: element..has_sub_unit:0,
  //             buying_unit: element..buying_unit : '',
  //             buying_sub_unit: element..buying_sub_unit:'',
  //             unit_equals_sub_unit: element.purchase_detail
  //               ? element.purchase_detail.unit_equals_sub_unit
  //               : '',
  //             unit_equals_measurement_unit: element.purchase_detail
  //               ? element.purchase_detail.unit_equals_measurement_unit
  //               : '',
  //             qty: '',
  //             qtyToMeasurementUnit: '',
  //             total: 0,
  //             receiving_price: '',
  //             measurement_unit_name: element.purchase_detail
  //               ? element.purchase_detail.measurement_unit_name
  //               : '',
  //           };
  //           this.options.push(objData);
  //         });
  //         this.ingredientArray = this.allItemArray.ingredients;
  //         this.ingredientArray?.forEach((element: any) => {
  //           let objData: any;
  //           if (element.ingredient) {
  //             if (element.stock_type == 2) {
  //               let objData = {
  //                 stock_type: 2,
  //                 stock_id: element.stock_id,
  //                 ingredient_id: element.ingredient.id,
  //                 name: element.ingredient.name,
  //                 stock_on_hand: element.ingredient.on_hand_qty,
  //                 cost_per_unit: element.ingredient.cost_per_unit,
  //                 buying_unit: element.purchase_detail.buying_unit,
  //                 buying_sub_unit: element.purchase_detail.buying_sub_unit,
  //                 has_sub_unit:  element..has_sub_unit:0,
  //                 unit_equals_sub_unit:
  //                   element.purchase_detail.unit_equals_sub_unit,
  //                 unit_equals_measurement_unit:
  //                   element.purchase_detail.unit_equals_measurement_unit,
  //                 qty: '',
  //                 qtyToMeasurementUnit: '',
  //                 total: 0,
  //                 receiving_price: '',
  //                 measurement_unit_name:
  //                   element.ingredient.measurement_unit_name,
  //               };
  //               this.options.push(objData);
  //             }
  //           }
  //         });
  //         this.subrecipeArray = this.allItemArray.recipes_subRecipes;
  //         this.subrecipeArray?.forEach((element: any) => {
  //           if (element.stock_type == 3) {
  //             let objData = {
  //               stock_type: element.stock_type,
  //               stock_id: element.stock_id,
  //               sub_recipe_id: element.sub_recipe.id,
  //               name: element.sub_recipe.name,
  //               stock_on_hand: element.sub_recipe.on_hand_qty,
  //               has_sub_unit: element..has_sub_unit:0,
  //               cost_per_unit: element.sub_recipe.cost_per_unit,
  //               buying_unit: element..buying_unit: '',
  //               buying_sub_unit: element.purchase_detail?element.purchase_detail.buying_sub_unit:'',
  //               unit_equals_sub_unit: element.purchase_detail ? element.purchase_detail.unit_equals_sub_unit : '',
  //               unit_equals_measurement_unit: element..unit_equals_measurement_unit : '',
  //               qty: '',
  //               qtyToMeasurementUnit: '',
  //               total: 0,
  //               receiving_price: '',
  //               measurement_unit_name: element.sub_recipe.measurement_unit_name,
  //             };
  //             this.options.push(objData);
  //           }
  //         });
  //       } else {
  //         console.log('Error in get reorder');
  //       }
  //     });
  // }
  get stocktotalFormGroups() {
    return this.newReceiptForm.get('stockData') as UntypedFormArray;
  }
  createItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  itemName(index: any) {
    let form_data = this.newReceiptForm.value;
    return form_data.stockData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.newReceiptForm.value;
    return (form_data.stockData[index].stock_on_hand ?
      form_data.stockData[index].stock_on_hand +' '+
      form_data.stockData[index].measurement_unit_name : '0'
    );
  }
  price(index: any) {
    let form_data = this.newReceiptForm.value;
    return (
      form_data.stockData[index].cost_per_unit +
      this.currency_symbol +
      '/' +
      form_data.stockData[index].measurement_unit_name
    );
  }
  unit(index: any) {
    let form_data = this.newReceiptForm.value;
    return (
      '1 ' +
      form_data.stockData[index].buying_unit +
      '=' +
      form_data.stockData[index].unit_equals_measurement_unit +
      form_data.stockData[index].measurement_unit_name
    );
  }
  measurementunit(index: any) {
    let form_data = this.newReceiptForm.value;
    return form_data.stockData[index].measurement_unit_name;
  }
  unitSelect(i: any) {
    let form_data = this.newReceiptForm.value;
    let selectData: any = [];
    if (form_data.stockData[i].has_sub_unit) {
      selectData = [
        { id: 1, name: form_data.stockData[i].measurement_unit_name },
        { id: 2, name: form_data.stockData[i].buying_sub_unit },
        { id: 3, name: form_data.stockData[i].buying_unit }
      ]
    }
    else {
      selectData = [
        { id: 1, name: form_data.stockData[i].measurement_unit_name },
        { id: 3, name: form_data.stockData[i].buying_unit }
      ]
    }
    return selectData;
  }
  clearSupplier(index: any) {
    let items = this.newReceiptForm.get('stockData') as UntypedFormArray;
    let form_data = this.newReceiptForm.value;

    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total);
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }

 

  showNoReorderItemDialog() { }

  unitSelected(event:any,i:any){
    let items = this.newReceiptForm.value['stockData'];
    let unitSelectedForQty:any=event.target.value
    let qtyCalculatedtoUnit:any=0.00;
     if(unitSelectedForQty=="2"){
      qtyCalculatedtoUnit=parseFloat(items[i].unit_equals_measurement_unit)*(items[i].qty)
     }
     else if(unitSelectedForQty=="3"){
      qtyCalculatedtoUnit=parseFloat(items[i].unit_equals_measurement_unit)*(items[i].unit_equals_sub_unit)*(items[i].qty)
     }
    //  items.at(i).get('qty').setValue(unitSelectedForQty);

    
   // items[i].qty=qtyCalculatedtoUnit;
  }
  findTotal(i: any) {
    let items = this.newReceiptForm.value['stockData'];
    let netQuantity = items[i].qty;
    let cost = items[i].receiving_price;
    if (netQuantity > 0 && cost > 0) {

      let subTotalItem = (netQuantity * cost).toFixed(2);
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (
          parseFloat(this.total_price) + parseFloat(obj.total)
        ).toFixed(2);
      });

    }
  }

  subTotal(index: any) {
    let form_data = this.newReceiptForm.value;
    return form_data.stockData[index].total;
  }
  itemSelected(option: any, input: HTMLInputElement) {
    let tempFlag = false;
    if (this.newReceiptForm.value['stockData'].length > 0) {
      this.newReceiptForm.value['stockData'].forEach((obj: any) => {
        if (obj.stock_id == option.stock_id) {
          this.snackBService.openSnackBar('Item already added', 'Close');
          tempFlag = true;
        }
      });
      if (!tempFlag) {
        let items = this.newReceiptForm.get('stockData') as UntypedFormArray;
        items.push(this.createItem(option));
        this.isItemsSelected = true;
      }
    } else {
      let items = this.newReceiptForm.get('stockData') as UntypedFormArray;
      items.push(this.createItem(option));
      this.isItemsSelected = true;
    }
    input.value = '';
    input.blur();
    this.options=[];
  }
  errorMessage(i: any) {
    let form_data = this.newReceiptForm.value;
    let decimal_length = form_data.stockData[i].qty.split('.')[1] ? form_data.stockData[i].qty.split('.')[1].length : 0
    let digit_length = form_data.stockData[i].qty.split('.')[0] ? form_data.stockData[i].qty.split('.')[0].length : 0
    if (form_data.stockData[i].qty >= 0 && decimal_length <= 3 && digit_length <= 5) {

      return ''
    }
    else {
      return 'invalid Quantity'
    }

  }
  errorMessageforPrice(i: any) {
    let form_data = this.newReceiptForm.value;
    if (form_data.stockData[i].receiving_price >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }
  stockReceive() {
    let items: any = [];
    let ingredients: any = [];
    let sub_recipe: any = [];
    let item = this.newReceiptForm.value['stockData'];
    item.forEach((obj: any) => {
      if (obj.qty > 0 && obj.receiving_price > 0) {
        let unit_price: any;
        unit_price = (obj.receiving_price / obj.qty).toFixed(2);
        if (obj.stock_type == 2) {
          let objData = {
            ingredient_id: obj.ingredient_id,
            received_qty: obj.qty,
            received_price: obj.receiving_price,
            total: obj.total,
            cost_per_unit: unit_price
          };
          ingredients.push(objData);
        } else if (obj.stock_type == 1) {
          let objData = {
            finished_good_id: obj.finished_good_id,
            received_qty: obj.qty,
            received_price: obj.receiving_price,
            total: obj.total,
            cost_per_unit: unit_price
          };
          items.push(objData);
        } else if (obj.stock_type == 3) {
          let objData = {
            sub_recipe_id: obj.sub_recipe_id,
            received_qty: obj.qty,
            received_price: obj.receiving_price,
            total: obj.total,
            cost_per_unit: unit_price
          };
          sub_recipe.push(objData);
        }
      }
    });
    let arrayLength = parseInt(items.length) + parseInt(ingredients.length) + parseInt(sub_recipe.length)
    if (arrayLength == item.length && item.length > 0) {
      let postParamsSave = {
        receiving_number: this.newReceiptForm.value['receipt_reference_number'],
        comments: this.newReceiptForm.value['comments'],
        receiving_type: this.newReceiptForm.value['receiving_type'],
        branch_id: this.branch_id,
        total_amount: this.total_price,
        receipt_items_list: [
          {
            finished_good: items,
            ingredients: ingredients,
            sub_recipe: sub_recipe,
          },
        ],
      };
      this.httpService
        .post('stock-receipt', postParamsSave)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Receipt Created Successfully ',
              'Close'
            );
            this.router.navigate(['/inventory/stockReceipts']);
          } else {
            console.log('Error in stock-receipt');
          }
        });
    }
  }
  back() {
    this.router.navigate(['/inventory/stockReceipts']);
  }
}
