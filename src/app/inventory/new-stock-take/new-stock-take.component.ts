import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-new-stock-take',
  templateUrl: './new-stock-take.component.html',
  styleUrls: ['./new-stock-take.component.scss'],
})
export class NewStockTakeComponent implements OnInit {
  stock_take_no: any;
  todayDate: any;
  public stocktakeForm!: UntypedFormGroup;
  itemArray = new UntypedFormControl();
  options: any = [];
  stocktake_filteredOptions: Observable<any[]> | undefined;
  branch_id: any;
  stockItems: any = [];
  table_items: any = [];
  stockTake: any = [];
  stockdata = new UntypedFormControl();
  errorMessage:any;
  errorMessageSub:any;
  errorMessageUnit:any;
  itemArrayLength:any;
  constructor(
    private router: Router,
    private localStorage: LocalStorage,
    private snackBService: SnackBarService,
    private route: ActivatedRoute,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.branch_id = this.localStorage.get('branch_id');
  }

  ngOnInit(): void {
    this.generateStockNo();
    this.onBuildForm();
    this.stocktake_filteredOptions = this.itemArray.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
    this.getItems();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }

  getItems() {
    this.httpService
      .get('get-current-stock-items/' + this.branch_id)
      .subscribe((result) => {
        this.stockItems = result.data;
      });
  }
  getItemsName(items: any) {
  
    let itemName: any;
    if (items.item_name) {
      itemName = items.item_name;
    }
    if (items.ingredient_name) {
      itemName = items.ingredient_name;
    }
    if (items.sub_recipe_name) {
      itemName = items.sub_recipe_name;
    }
    return itemName;
  
  }
  getItemsArray(items: any) {
   let itemArray: any = [];
    if (items.items) {
      items.items.forEach((element: any) => {
        itemArray.push(element);
      });
    }

    if (items.ingredient) {
      items.ingredient.forEach((element: any) => {
        itemArray.push(element);
      });
    }
    if (items.sub_recipe) {
      items.sub_recipe.forEach((element: any) => {
        itemArray.push(element);
      });
    }
    this.itemArrayLength=itemArray.length;
    return itemArray;
  }

  generateStockNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.stock_take_no =
      'ST_' + date + '.' + month + '.' + year + '_' + hh + ':' + mm + ':' + ss;
    this.todayDate = date + '-' + month + '-' + year;
  }

  onBuildForm() {
    this.stocktakeForm = this.formBuilder.group({
      stockno: [this.stock_take_no, Validators.compose([Validators.required])],
      comments: null,
    });
  }

  createItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  calculateTotal(items: any, itemCount: any, type: any) {
   
    if(itemCount){
    if (type == 1 ) {
      items.errorMessage1=''
      if(itemCount>=0){
        items.box1 = itemCount;
        items.errorMessage1=''
      }
     else{
      items.box1 = itemCount;
        items.errorMessage1='Invalid Input'
      }
     
    } else if (type == 2) {
      items.errorMessage2=''
      if(itemCount>=0){
        items.box2 = itemCount;
        items.errorMessage2=''
      }
      else{
        items.box2 = itemCount;
        items.errorMessage2='Invalid Input'
      }
    } else if (type == 3 ) {
      items.errorMessage3=''
      if(itemCount>=0){
        items.box3 = itemCount;
        items.errorMessage3=''
      }
      else{
        items.box3 = itemCount;
        items.errorMessage3='Invalid Input'
      }
    }
  }
  else{
    if (type == 1 ) {
      items.box1 = itemCount;
      items.errorMessage1=''
    }
    if (type == 2 ) {
      items.box2 = itemCount;
      items.errorMessage2=''
    }
    if (type == 3 ) {
      items.box3 = itemCount;
      items.errorMessage3=''
    } 
  }
    let buyingunit: any;
    if (items.has_sub_unit) {
      buyingunit = parseFloat(items.box1)
        ? parseFloat(items.box1) *
          parseFloat(items.unit_equals_measurement_unit) *
          parseFloat(items.unit_equals_sub_unit)
        : 0;
    } else {
      buyingunit =parseFloat(items.box1)
        ? parseFloat(items.box1) *
          parseFloat(items.unit_equals_measurement_unit)
        : 0;
    }
   
    
    let subunit = parseFloat(items.box2) 
      ? parseFloat(items.box2) * parseFloat(items.unit_equals_measurement_unit)
      : 0;
    
      
    let measurementunit = parseFloat(items.box3) ? parseFloat(items.box3) : 0;

    items.total = buyingunit + subunit + measurementunit;
 
  }
  save() {
    this.generateStockNo();
    this.stockTake = [];
    let items = this.stocktakeForm.value['stockData'];
    let i: any;
    let finished_good: any = [];
    let ingredients: any = [];
    let sub_recipe: any = [];
    this.stockItems.forEach((obj: any) => {
     let id: any;
      if (obj.ingredient) {
        obj.ingredient.forEach((obj2: any) => {
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              ingredient_id: obj2.ingredient_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            ingredients.push(objData);
          }
        });
      } 
       if (obj.sub_recipe) {
        obj.sub_recipe.forEach((obj2: any) => {
          
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              sub_recipe_id: obj2.sub_recipe_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            sub_recipe.push(objData);
          }
        });
      } 
       if (obj.items) {
        obj.items.forEach((obj2: any) => {
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              finished_good_id: obj2.finished_good_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            finished_good.push(objData);
          }
        });
      }
    });

    let date = moment();
    let currentTime = date.format('hh:mm:ss');
    let todayDate = date.format('YYYY-MM-DD');
    let body = {
      time: currentTime,
      stock_take_number: this.stock_take_no,
      comments: this.stocktakeForm.value['comments'],
      date: todayDate,
      status: 0,
      branch_id: this.branch_id,
      stock_take_list: [
        {
          finished_good: finished_good,
          ingredients: ingredients,
          sub_recipe: sub_recipe,
        },
      ],
    };
    if(finished_good.length>0 || sub_recipe.length>0 || ingredients.length>0){
      this.httpService.post('stock-take', body).subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Stock take created successfully',
            'Close'
          );
          this.router.navigate(['inventory/stockTakes']);
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
    }
    else{
      this.snackBService.openSnackBar('Select any item to save stock take', 'Close');
    }
    
  }

  submitForReview() {
    this.generateStockNo();
    this.stockTake = [];
    let items = this.stocktakeForm.value['stockData'];
    let i: any;
    let finished_good: any = [];
    let ingredients: any = [];
    let sub_recipe: any = [];
    this.stockItems.forEach((obj: any) => {
      let id: any;
      if (obj.ingredient) {
        obj.ingredient.forEach((obj2: any) => {
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              ingredient_id: obj2.ingredient_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            ingredients.push(objData);
          }
        });
      } 
       if (obj.sub_recipe) {
        obj.sub_recipe.forEach((obj2: any) => {
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              sub_recipe_id: obj2.sub_recipe_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            sub_recipe.push(objData);
          }
        });
      } 
       if (obj.items) {
        obj.items.forEach((obj2: any) => {
          if (obj2.box1>=0|| obj2.box2>=0 || obj2.box3>=0) {
            let objData = {
              finished_good_id: obj2.finished_good_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total,
              inventory_type: obj.inventory_type,
            };
            finished_good.push(objData);
          }
        });
      }
    });

    let date = moment();
    let currentTime = date.format('hh:mm:ss');
    let todayDate = date.format('YYYY-MM-DD');
    let body = {
      time: currentTime,
      stock_take_number: this.stock_take_no,
      comments: this.stocktakeForm.value['comments'],
      date: todayDate,
      status: 1,
      branch_id: this.branch_id,
      stock_take_list: [
        {
          finished_good: finished_good,
          ingredients: ingredients,
          sub_recipe: sub_recipe,
        },
      ],
    };
    this.httpService.post('stock-take', body).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar('Item submitted for review', 'Close');
        this.router.navigate(['inventory/stockTakes']);
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
}
