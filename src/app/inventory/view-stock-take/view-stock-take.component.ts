import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-view-stock-take',
  templateUrl: './view-stock-take.component.html',
  styleUrls: ['./view-stock-take.component.scss'],
})
export class ViewStockTakeComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  todayDate: any;
  public stocktakeForm!: UntypedFormGroup;
  branch_id: any;
  stockTakeArray: any = [];
  ArrayForSave: any = [];
  isAutoreconcile: boolean = false;
  all_item_reconcile_status: boolean = false;
  
  constructor(
    private localService: LocalStorage,
    private snackBService: SnackBarService,
    private route: ActivatedRoute,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.branch_id = this.localService.get('branch_id');
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getStockTake();
  }

  getStockTake() {
    {
      this.httpService
        .get('stock-take/' + this.route.snapshot.params.id,false)
        .subscribe((result) => {
          this.stockTakeArray = result.data[0];
          this.ArrayForSave = result.data[0];
          this.stocktakeForm.patchValue({
            stockno: this.stockTakeArray.stock_take_number,
            comments: this.stockTakeArray.comments,
          });
          this.todayDate = this.stockTakeArray.date;
        });
    }
  }

  getItemsName(items: any) {
    let itemName: any;
    if (items.item_name) {
      itemName = items.item_name;
    }
    if (items.name) {
      itemName = items.name;
    }
    if (items.sub_recipe_name) {
      itemName = items.sub_recipe_name;
    }
    return itemName;
  }
  AutoReconsileAll(event: any) {
    this.all_item_reconcile_status=false
    if (event.target.checked) {
    this.all_item_reconcile_status=true
    }
    else{
      this.all_item_reconcile_status=false
    }
 
   
  }
  addToReconsile(event: any, items: any) {
    this.all_item_reconcile_status=false
    if (event.target.checked) {
      if (items.finished_good_id) {
        this.ArrayForSave.finished_good.forEach((element: any) => {
          if (items.finished_good_id == element.finished_good_id) {
            element.reconciled = 1;
            items.reconcile_status=0;
          }
        });
      }
      if (items.ingredient_id) {
        this.ArrayForSave.ingredient.forEach((element: any) => {
          if (items.ingredient_id == element.ingredient_id) {
            element.reconciled = 1;
            items.reconcile_status=0;
          }
        });
      }
      if (items.sub_recipe_id) {
        this.ArrayForSave.sub_recipe.forEach((element: any) => {
          if (items.sub_recipe_id == element.sub_recipe_id) {
            element.reconciled = 1;
            items.reconcile_status=0;
          }
        });
      }
    } else {
      if (items.finished_good_id) {
        this.ArrayForSave.finished_good.forEach((element: any) => {
          if (items.finished_good_id == element.finished_good_id) {
            element.reconciled = 0;
            items.reconcile_status=0;
          }
        });
      }
      if (items.ingredient_id) {
        this.ArrayForSave.ingredient.forEach((element: any) => {
          if (items.ingredient_id == element.ingredient_id) {
            element.reconciled = 0;
            items.reconcile_status=0;
          }
        });
      }
      if (items.sub_recipe_id) {
        this.ArrayForSave.sub_recipe.forEach((element: any) => {
          if (items.sub_recipe_id == element.sub_recipe_id) {
            element.reconciled = 0;
            items.reconcile_status=0;
          }
        });
      }
    }
   
    
  }
  getItemsArray() {
    let itemArray: any = [];
    if (this.stockTakeArray.finished_good) {
      this.stockTakeArray.finished_good.forEach((element: any) => {
        itemArray.push(element);
      });
    
    }
    if (this.stockTakeArray.ingredient) {
      
      this.stockTakeArray.ingredient.forEach((element: any) => {
        itemArray.push(element);
      });
    }
    if (this.stockTakeArray.sub_recipe) {
     
      this.stockTakeArray.sub_recipe.forEach((element: any) => {
        itemArray.push(element);
      });
    }
    itemArray?.forEach((element: any) => {
      if (element.reconcile_status == 1) {
        this.isAutoreconcile = true;
      }
    });
    return itemArray;
  }
  onBuildForm() {
    this.stocktakeForm = this.formBuilder.group({
      stockno: [
        { value: '', disabled: true },
        Validators.compose([Validators.required]),
      ],
     comments:[{value:'',disabled:true}]
    });
  }
  reconsileStockTake() {
let finished_good: any = [];
    let ingredients: any = [];
    let sub_recipe: any = [];
    if (this.ArrayForSave.ingredient) {
      this.ArrayForSave.ingredient.forEach((obj2: any) => {
      
          let objData = {
            ingredient_id: obj2.ingredient_id,
            stock_take_ingredient_id: obj2.stock_take_ingredinet_id,
            reconcile_status: obj2.reconciled?1:0,
          };
          ingredients.push(objData);
        
      });
    }
    if (this.ArrayForSave.sub_recipe) {
      this.ArrayForSave.sub_recipe.forEach((obj2: any) => {
       
          let objData = {
            sub_recipe_id: obj2.sub_recipe_id,
            stock_take_sub_recipe_id: obj2.stock_take_sub_recipe_id,
            reconcile_status: obj2.reconciled?1:0,
          };
          sub_recipe.push(objData);
        
      });
    }
    if (this.ArrayForSave.finished_good) {
      this.ArrayForSave.finished_good.forEach((obj2: any) => {
       
          let objData = {
            finished_good_id: obj2.finished_good_id,
            stock_take_finished_good_id: obj2.stock_take_finished_good_id,
            reconcile_status: obj2.reconciled?1:0,
          };
          finished_good.push(objData);
        
      });
    }

    let body = {
      stock_take_number: this.stockTakeArray.stock_take_number,
      stock_take_id: this.stockTakeArray.id,
      branch_id: this.branch_id,
      all_item_reconcile_status:this.all_item_reconcile_status,
      status: 'reconciled',
      reconcile_items_list: {
        finished_good: finished_good,
        ingredients: ingredients,
        sub_recipe: sub_recipe,
      },
    };
    this.httpService
      .put('stock-take/' + this.route.snapshot.params.id, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Item Reconciled Successfully',
            'Close'
          );
          this.router.navigate(['inventory/stockTakes']);
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }
}
