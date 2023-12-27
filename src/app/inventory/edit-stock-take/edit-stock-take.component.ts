import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ItemsComponent } from 'src/app/items/items.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-edit-stock-take',
  templateUrl: './edit-stock-take.component.html',
  styleUrls: ['./edit-stock-take.component.scss'],
})
export class EditStockTakeComponent implements OnInit {
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
  stockTakeArray: any = [];
  constructor(
    private localStorage: LocalStorage,
    private snackBService: SnackBarService,
    private route: ActivatedRoute,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.branch_id = localStorage.get('branch_id');
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getStockTake();
  }

  getStockTake() {
    {
      this.httpService
        .get('stock-take/' + this.route.snapshot.params.id)
        .subscribe((result) => {

          this.stockTakeArray = result.data[0];
          this.stocktakeForm.patchValue({
            stockno: this.stockTakeArray.stock_take_number,
            comments: this.stockTakeArray.comments
          })
          this.todayDate = this.stockTakeArray.date
          this.getItems();
        });
    }
  }
  getItems() {
    this.httpService
      .get('get-current-stock-items/' + this.branch_id)
      .subscribe((result) => {
        this.stockItems = result.data;
        let objData: any;

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
        if (this.stockTakeArray.finished_good) {
          this.stockTakeArray.finished_good.forEach((obj: any) => {

            if (obj.finished_good_id == element.finished_good_id) {
              element["box1"] = obj.buying_unit
              element["box2"] = obj.buying_sub_unit
              element["box3"] = obj.measurement_unit
              element["gtotal"] = this.calculate(element);
            }

          });
        }
        itemArray.push(element);
      });

    }
    if (items.ingredient) {

      items.ingredient.forEach((element: any) => {
        if (this.stockTakeArray.ingredient) {
          this.stockTakeArray.ingredient.forEach((obj: any) => {
            if (obj.ingredient_id == element.ingredient_id) {
              element["box1"] = obj.buying_unit
              element["box2"] = obj.buying_sub_unit
              element["box3"] = obj.measurement_unit
              element["gtotal"] = this.calculate(element);
            }
          });
        }
        itemArray.push(element);
      });

    }
    if (items.sub_recipe) {

      items.sub_recipe.forEach((element: any) => {
        if (this.stockTakeArray.sub_recipe) {
          this.stockTakeArray.sub_recipe.forEach((obj: any) => {
            if (obj.sub_recipe_id == element.sub_recipe_id) {
              element["box1"] = obj.buying_unit
              element["box2"] = obj.buying_sub_unit
              element["box3"] = obj.measurement_unit
              element["gtotal"] = this.calculate(element);
            }
          });
        }
        itemArray.push(element);
      });

    }
    return itemArray;
  }
  calculate(items: any) {
    let buyingunit: any;
    if (items.has_sub_unit) {
      buyingunit = items.box1
        ? parseFloat(items.box1) *
        parseFloat(items.unit_equals_measurement_unit) *
        parseFloat(items.unit_equals_sub_unit)
        : 0;
    } else {
      buyingunit = items.box1
        ? parseFloat(items.box1) *
        parseFloat(items.unit_equals_measurement_unit)
        : 0;
    }

    let subunit = items.box2
      ? parseFloat(items.box2) * parseFloat(items.unit_equals_measurement_unit)
      : 0;
    let measurementunit = items.box3 ? parseFloat(items.box3) : 0;
    return buyingunit + subunit + measurementunit;


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
      stockno: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      comments: null,
      box1: [''],
      box2: [''],
      box3: [''],
      stockData: new UntypedFormArray([]),
    });
  }
  get stocktotalFormGroups() {
    return this.stocktakeForm.get('stockData') as UntypedFormArray;
  }
  createItem(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  itemSelected(option: any) {
    let tempFlag = false;

    this.options.forEach((obj: any) => {
      if (obj.category_id == option.category_id) {
        let items = this.stocktakeForm.get('stockData') as UntypedFormArray;
        items.push(this.createItem(option));
      }
    });
  }

  calculateTotal(items: any, itemCount: any, type: any) {
    console.log(items.box1);


    if (itemCount) {
      if (type == 1) {
        items.errorMessage1 = ''
        if (itemCount >= 0) {
          //items.box1 = itemCount;
          items.editedBox1 = itemCount;
          items.errorMessage1 = ''
        }
        else {
          // items.box1 = itemCount;
          items.editedBox1 = itemCount;
          items.errorMessage1 = 'Invalid Input'
        }

      } else if (type == 2) {
        items.errorMessage2 = ''
        if (itemCount >= 0) {
          //  items.box2 = itemCount;
          items.editedBox2 = itemCount;
          items.errorMessage2 = ''
        }
        else {
          //items.box2 = itemCount;
          items.editedBox2 = itemCount;
          items.errorMessage2 = 'Invalid Input'
        }
      } else if (type == 3) {
        items.errorMessage3 = ''
        if (itemCount >= 0) {
          // items.box3 = itemCount;
          items.editedBox3 = itemCount;
          items.errorMessage3 = ''
        }
        else {
          //items.box3 = itemCount;
          items.editedBox3 = itemCount;
          items.errorMessage3 = 'Invalid Input'
        }
      }
      console.log(items.box1);
    }
    else {
      if (type == 1) {
        // items.box1 = itemCount;
        items.editedBox1 = itemCount;
        items.errorMessage1 = ''
      }
      if (type == 2) {
        //items.box2 = itemCount;
        items.editedBox2 = itemCount;
        items.errorMessage2 = ''
      }
      if (type == 3) {
        // items.box3 = itemCount;
        items.editedBox3 = itemCount;
        items.errorMessage3 = ''
      }
    }

    let buyingunit: any;
    let buyingqty = items.editedBox1 ? items.editedBox1 : items.box1;
    let subqty = items.editedBox2 ? items.editedBox2 : items.box2;
    let measuringqty = items.editedBox3 ? items.editedBox3 : items.box3
    if (items.has_sub_unit) {
      buyingunit = parseFloat(buyingqty)
        ? parseFloat(buyingqty) *
        parseFloat(items.unit_equals_measurement_unit) *
        parseFloat(items.unit_equals_sub_unit)
        : 0;
    } else {
      buyingunit = parseFloat(buyingqty)
        ? parseFloat(buyingqty) *
        parseFloat(items.unit_equals_measurement_unit)
        : 0;
    }


    let subunit = parseFloat(items.box2) 
    ? parseFloat(items.box2) * parseFloat(items.unit_equals_measurement_unit)
    : 0;


    let measurementunit = parseFloat(measuringqty) ? parseFloat(measuringqty) : 0;

    console.log(measurementunit);
    let totalAmount: any;
    totalAmount = buyingunit + subunit + measurementunit
    items.total = totalAmount ? totalAmount : 0;


  }

  itemName(index: any) {
    let form_data = this.stocktakeForm.value;
    return form_data.stockData[index].name;
  }
  buyingunitName(index: any) {
    let form_data = this.stocktakeForm.value;
    return form_data.stockData[index].buying_unit;
  }
  buyingsubunitName(index: any) {
    let form_data = this.stocktakeForm.value;
    return form_data.stockData[index].buying_sub_unit;
  }
  measurementunitName(index: any) {
    let form_data = this.stocktakeForm.value;
    return form_data.stockData[index].measurement_unit_name;
  }

  save() {

    this.stockTake = [];
    let items = this.stocktakeForm.value['stockData'];
    let i: any;
    let finished_good: any = [];
    let ingredients: any = [];
    let sub_recipe: any = [];
    console.log(this.stockItems);

    this.stockItems.forEach((obj: any) => {
      let id: any;
      if (obj.ingredient) {
        obj.ingredient.forEach((obj2: any) => {
          if (obj2.editedBox1 >= 0 || obj2.editedBox2 >= 0 || obj2.editedBox3 >= 0) {
            let objData = {
              ingredient_id: obj2.ingredient_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.editedBox1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.editedBox2,
              measurement_unit: obj2.editedBox3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
              inventory_type: obj.inventory_type,
            };
            ingredients.push(objData);
          }
        });
      }
      if (obj.sub_recipe) {
        obj.sub_recipe.forEach((obj2: any) => {
          if (obj2.editedBox1 >= 0 || obj2.editedBox2 >= 0 || obj2.editedBox3 >= 0) {
            let objData = {
              sub_recipe_id: obj2.sub_recipe_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.editedBox1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.editedBox2,
              measurement_unit: obj2.editedBox3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
              inventory_type: obj.inventory_type,
            };
            sub_recipe.push(objData);
          }
        });
      }
      if (obj.items) {
        obj.items.forEach((obj2: any) => {
          if (obj2.editedBox1 >= 0 || obj2.editedBox2 >= 0 || obj2.editedBox3 >= 0) {
            let objData = {
              finished_good_id: obj2.finished_good_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.editedBox1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.editedBox2,
              measurement_unit: obj2.editedBox3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
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
      stock_take_number: this.stockTakeArray.stock_take_number,
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
    this.httpService.put('stock-take/' + this.route.snapshot.params.id, body).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar('Stock take updaed successfully', 'Close');
        this.router.navigate(['inventory/stockTakes']);
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
  submitForReview() {
    let items = this.stocktakeForm.value['stockData']
    let i: any;
    let finished_good: any = []
    let ingredients: any = [];
    let sub_recipe: any = [];
    this.stockItems.forEach((obj: any) => {
      let id: any;
      if (obj.ingredient) {
        obj.ingredient.forEach((obj2: any) => {
          if (obj2.box1 >= 0 || obj2.box2 >= 0 || obj2.box3 >= 0) {
            let objData = {
              ingredient_id: obj2.ingredient_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
              inventory_type: obj.inventory_type
            }
            ingredients.push(objData)
          }
        })

      }
      else if (obj.sub_recipe) {
        obj.sub_recipe.forEach((obj2: any) => {
          if (obj2.box1 >= 0 || obj2.box2 >= 0 || obj2.box3 >= 0) {
            let objData = {
              sub_recipe_id: obj2.sub_recipe_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
              inventory_type: obj.inventory_type
            }
            sub_recipe.push(objData)
          }
        })
      }
      else if (obj.items) {
        obj.items.forEach((obj2: any) => {
          if (obj2.box1 >= 0 || obj2.box2 >= 0 || obj2.box3 >= 0) {
            let objData = {
              finished_good_id: obj2.finished_good_id,
              on_hand_qty: obj2.on_hand_qty,
              buying_unit: obj2.box1,
              has_sub_unit: obj2.has_sub_unit,
              buying_sub_unit: obj2.box2,
              measurement_unit: obj2.box3,
              counted_stock: obj2.total ? obj2.total : obj2.gtotal,
              inventory_type: obj.inventory_type
            }
            finished_good.push(objData)
          }
        })
      }

    })


    let date = moment();
    let currentTime = date.format('hh:mm:ss');
    let todayDate = date.format('YYYY-MM-DD');
    let body = {
      time: currentTime,
      stock_take_number: this.stockTakeArray.stock_take_number,
      comments: this.stocktakeForm.value['comments'],
      date: todayDate,
      status: 1,
      branch_id: this.branch_id,
      stock_take_list: [{
        finished_good: finished_good,
        ingredients: ingredients,
        sub_recipe: sub_recipe
      }]
    }
    this.httpService.put('stock-take/' + this.route.snapshot.params.id, body).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar('Stock take submited For Review successfully', 'Close');
        this.router.navigate(['inventory/stockTakes']);
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

}
