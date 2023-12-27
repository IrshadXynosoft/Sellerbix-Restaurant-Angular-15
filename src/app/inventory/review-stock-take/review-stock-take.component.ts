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
  selector: 'app-review-stock-take',
  templateUrl: './review-stock-take.component.html',
  styleUrls: ['./review-stock-take.component.scss']
})
export class ReviewStockTakeComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  todayDate: any;
  public stocktakeForm!: UntypedFormGroup;
  itemArray = new UntypedFormControl();
  options: any = [];
  stocktake_filteredOptions: Observable<any[]> | undefined;
  branch_id: any;
  stockTake: any = [];
  stockdata = new UntypedFormControl();
  stockTakeArray: any = [];
  constructor(
    private localService: LocalStorage,
    private snackBService: SnackBarService,
    private route: ActivatedRoute,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private router:Router
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
        .get('stock-take/' + this.route.snapshot.params.id)
        .subscribe((result) => {
          this.stockTakeArray = result.data[0];
          this.stocktakeForm.patchValue({
            stockno: this.stockTakeArray.stock_take_number,
            comments: this.stockTakeArray.comments
          })
          this.todayDate=this.stockTakeArray.date
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
    return itemArray;
  }


  onBuildForm() {
    this.stocktakeForm = this.formBuilder.group({
      stockno: [{value:'',disabled:true}, Validators.compose([Validators.required])],
      comments:[{value:'',disabled:true}]
    });
  }

  reviewStckTake(){
       let body = {
      id:this.route.snapshot.params.id,
      branch_id:this.stockTakeArray.branch_id,
      stock_take_number:this.stockTakeArray.stock_take_number,
      status: 2
    }
    this.httpService.put('stock-take/'+this.route.snapshot.params.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Item reviewied successfully", "Close");
          this.router.navigate(['inventory/stockTakes']);
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
  rejectStockTake(){
    let body = {
      id:this.route.snapshot.params.id,
      branch_id:this.stockTakeArray.branch_id,
      stock_take_number:this.stockTakeArray.stock_take_number,
      status: 3
    }
    this.httpService.put('stock-take/'+this.route.snapshot.params.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Item Rejected successfully", "Close");
          this.router.navigate(['inventory/stockTakes']);
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
    }
 
}

