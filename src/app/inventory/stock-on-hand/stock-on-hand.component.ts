import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddHistoryComponent } from '../add-history/add-history.component';

@Component({
  selector: 'app-stock-on-hand',
  templateUrl: './stock-on-hand.component.html',
  styleUrls: ['./stock-on-hand.component.scss']
})
export class StockOnHandComponent implements OnInit {
  branchRecords: any = [];
  stockOnHandArrayIngredients: any = []
  stockOnHandArrayFinishedGoods: any = []
  stockOnHandArraybatchProccesedItems: any = []

  tempstockOnHandArrayIngredients: any = []
  tempstockOnHandArrayFinishedGoods: any = []
  currency_symbol: any;
  branch_id: any;
  tabIndex: any = 0;
  ingredientDetailArray: any = [];
  finishedGoodDetailArray:any=[];
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
 
  current_page: any = 1;
  last_page: number = 1;
  throttle1 = 300;
  scrollDistance1= 1;
  scrollUpDistance1 = 2;
  direction1 = '';

  current_page_ingredients: any = 1;
  last_page_ingredients: number = 1;
  constructor(public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage) {
    this.currency_symbol = localStorage.getItem('currency_symbol');
    this.branch_id = this.localService.get('branch_id')
  }

  ngOnInit(): void {
    this.getBranch();

    this.getStockDataforFinishedGoods();

  }
  tabClick(tab: any) {
    this.tabIndex = tab.index;
    switch (tab.index) {
      case 0:
        this.stockOnHandArrayFinishedGoods=[];
        this.getStockDataforFinishedGoods();
        break;
      case 1:
        this.stockOnHandArrayIngredients=[];
        this.getStockDataforIngredients();
        break;
      case 2:
        this.stockOnHandArraybatchProccesedItems=[];
        this.current_page=1
        this.getStockDataforBatchProcessedItems(this.current_page);

    }
  }

  getStockOnHandForLocation(event: any) {
    this.branch_id = event.target.value;
    switch (this.tabIndex) {
      case 0:
        this.stockOnHandArrayFinishedGoods=[];
        this.getStockDataforFinishedGoods();
        break;
      case 1:
       this.stockOnHandArrayIngredients=[];
        this.getStockDataforIngredients();
        break;
      case 2:
        this.stockOnHandArraybatchProccesedItems=[];
        this.current_page=1
        this.getStockDataforBatchProcessedItems(this.current_page);

    }
  }

  openGroup(event:any){
    console.log(event);
    
  }
  findDateDiff(dateSent: any) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));

  }
  
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;

        } else {
          console.log("Error");
        }
      });
  }

  getStockDataforIngredients()
  { 
    this.httpService.get('get-inventory-category/2/' + this.branch_id)
      .subscribe(result => {
        if (result.status == 200) {
      
              this.stockOnHandArrayIngredients = result.data
         }
       
        else {
          console.log("Error");
        }
      });
  }
  getStockDataforFinishedGoods() {
    this.httpService.get('get-inventory-category/1/' + this.branch_id)
      .subscribe(result => {
        if (result.status == 200) {

          this.stockOnHandArrayFinishedGoods = result.data;
          this.tempstockOnHandArrayFinishedGoods = result.data;
        } else {
          console.log("Error");
        }
      });
  }
  getDetails(cat_id: any, type: any) {
    this.ingredientDetailArray = [];
    this.finishedGoodDetailArray=[];
    this.httpService.get('get-inventory-category-stock/' + type + '/' + this.branch_id + '/' + cat_id)
      .subscribe(result => {
        if (result.status == 200) {
          if (type == 2) {
            this.ingredientDetailArray = result.data[0];
          }
          else {
            this.finishedGoodDetailArray = result.data[0];
           }
        } else {
          console.log("Error");
        }
      });
  }
  getStockDataforBatchProcessedItems(page_number:any) {
    this.httpService.get('recipe-stock-pagination/' + this.branch_id+'?page=' + page_number)
      .subscribe(result => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;
    
          if (result.data.data.length > 0) {
    
            if (page_number == 1) {
              this.stockOnHandArraybatchProccesedItems = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.stockOnHandArraybatchProccesedItems.push(obj)
              });
            }
            
         } else {
           console.log("Error");
         }
         

        } else {
          console.log("Error");
        }
      });
  }


  addHistory(stock_id: any, item_name: any): void {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '100%', data: { 'stock_id': stock_id, item_name: item_name, branch_id: this.branch_id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  addHistorybatchProcessed(recipe_id: any, item_name: any) {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '100%', data: { 'recipe_id': recipe_id, item_name: item_name, branch_id: this.branch_id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  totalAmount(qty: any, cost: any) {
    if (qty && cost) {
      let total = (qty * cost).toFixed(2)
      return total;
    }
    else {
      return 0;
    }

  }

  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getStockDataforBatchProcessedItems(this.current_page);
      this.direction = 'down';
    }
  }
 

  // itemSearch(searchText:any){
  //   if (searchText) {
  //     this.stockOnHandArrayFinishedGoods = this.tempstockOnHandArrayFinishedGoods;
  //     this.stockOnHandArrayIngredients=this.tempstockOnHandArrayIngredients;
  //     var filterItems = this.stockOnHandArrayFinishedGoods.items.filter(function (obj: any) {
  //       return ((obj.item_name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

  //     });
  //     var filterItems = this.stockOnHandArrayIngredients.items.filter(function (obj: any) {
  //       return ((obj.item_name).toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

  //     });

  //     if (filterItems.length < 1) {
  //       filterItems = []
  //     }
  //     this.stockOnHandArrayIngredients = filterItems;
  //     this.stockOnHandArrayFinishedGoods = filterItems;
  //   }
  //   else{
  //     this.stockOnHandArrayIngredients = this.tempstockOnHandArrayIngredients
  //     this.stockOnHandArrayFinishedGoods = this.tempstockOnHandArrayFinishedGoods
  //   }
  // }

  isLowStock(items:any){
    if(items.stock){
      if(items.stock.on_hand_qty<0){
        return true;
      }
      else{
        return false;
      }
    }
    else if(items.stock_on_hand){
      if(items.stock_on_hand<0){
        return true;
      }
      else{
        return false;
      }
    }
   return false;
  }
}
