import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddHistoryComponent } from '../add-history/add-history.component';
export interface Report {
  id: number;
  item_name: any;
  category_name: any;
  branch_name: any;
  unit_name: any;
  stock_on_hand: any;
  stock_value: any;
  stock_id:any;
  category_id:any;
  button:any;
}

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {
  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatPaginator, { static: true }) matPaginatorForIngredient!: MatPaginator;
  @ViewChild("finishedGood", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild("ingredient", { read: MatPaginator, static: false })
  set pagination1(value: MatPaginator) {
    this.dataSourceForIngredient.paginator = value;
  }
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'item_name', 'category_name','branch_name', 'unit_name', 'stock_on_hand', 'stock_value','button'];
  public displayedColumnsForIngredient: string[] = ['index', 'item_name', 'category_name','branch_name', 'unit_name', 'stock_on_hand', 'stock_value','button'];
  public dataSource = new MatTableDataSource<Report>();
  dataSourceForIngredient = new MatTableDataSource<Report>();
  public generatePurchaseOrderReport!: UntypedFormGroup;
  data: any;
  branch_id:any;
  branch_name:any;
  branchRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
 // totalAmount: any = 0;
  stockOnHandArrayIngredients:any=[]
  stockOnHandArrayFinishedGoods:any=[]
  tempstockOnHandArrayIngredients:any=[]
  tempstockOnHandArrayFinishedGoods:any=[]
  tabIndex:any=0;
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
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute, 
              private formBuilder: UntypedFormBuilder, public dialog: MatDialog,private localService:LocalStorage) {
                this.branch_id=this.localService.get('branch_id') 
                this.branch_name=this.localService.get('branchname') 
               }

  ngOnInit(): void {
    this.getBranch();
  
    this.getStockDataforFinishedGoods(this.branch_id,this.current_page);
  }
  findDateDiff(dateSent:any)
  {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));

  } 
  getStockOnHandForLocation(id:any,name:any)
  {
    this.branch_id = id;
    this.branch_name=name;
    switch (this.tabIndex) {
      case 0:
        this.current_page=1;
        this.getStockDataforFinishedGoods(this.branch_id,this.current_page);
        break;
      case 1:
        this.current_page_ingredients=1;
        this.getStockDataforIngredients(this.branch_id,this.current_page_ingredients);
    }
    
  }
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSourceForIngredient.paginator=this.matPaginatorForIngredient;
  // }
  getStockDataforIngredients(branch_id:any,page_number:any)
  {
    let post:any={
      type:2,
      branch_id:branch_id
    }
   this.httpService.post('report/stock-report?page=' + page_number,post)
   .subscribe(result => {
     if (result.status == 200) {
      this.current_page_ingredients = result.data.current_page;
      this.last_page_ingredients = result.data.last_page;

      if (result.data.data.length > 0) {

        if (page_number == 1) {
          this.stockOnHandArrayIngredients = result.data.data;
        } else {
          result.data.data.forEach(async (obj: any) => {
            this.stockOnHandArrayIngredients.push(obj)
          });
        }
        this.generateReportForIngredient();
     } else {
       console.log("Error");
     }
    }
   });


  }
  
  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getStockDataforFinishedGoods(this.branch_id,this.current_page);
      this.direction = 'down';
    }
  }
  onScrollDownIngredients(ev: any) {
    this.current_page_ingredients = this.current_page_ingredients + 1;
    if (this.current_page_ingredients <= this.last_page_ingredients) {
      this.getStockDataforIngredients(this.branch_id,this.current_page_ingredients);
      this.direction = 'down';
    }
  }
  getStockDataforFinishedGoods(branch_id:any,page_number:any)
  {
   
    let post:any={
      type:1,
      branch_id:branch_id
    }
   this.httpService.post('report/stock-report?page=' + page_number,post)
   .subscribe(result => {
     if (result.status == 200) {
      this.current_page = result.data.current_page;
      this.last_page = result.data.last_page;

      if (result.data.data.length > 0) {

        if (page_number == 1) {
          this.stockOnHandArrayFinishedGoods = result.data.data;
        } else {
          result.data.data.forEach(async (obj: any) => {
            this.stockOnHandArrayFinishedGoods.push(obj)
          });
        }
        this.generateReport();
     } else {
       console.log("Error");
     }
    }
   });
  
  }

  generateReport() {
     this.dataSource.data = [];
    const data: any = [];
    this.stockOnHandArrayFinishedGoods.forEach((obj: any) => {
    obj.items.forEach((element: any) => {
      if(element.stock){
        let stock_value=(parseFloat(element.stock.on_hand_qty) * (element.stock.cost_per_unit))
        let objData = {
          id: element.item_id,
          item_name: element.item_name,
          category_id:obj.category_id,
          category_name: obj.category_name,
          branch_name: this.branch_name,
          unit_name: element.stock?.measurement_unit_name,
          stock_on_hand: element.stock.on_hand_qty?element.stock.on_hand_qty+' '+element.stock?.measurement_unit_name:'--',
          stock_value: stock_value,
          stock_id:element.stock?.stock_id
        }
       data.push(objData)
      }
    
      });
     });
    this.dataSource.data = data as Report[];
 
    
  }
    generateReportForIngredient(){
      this.dataSourceForIngredient.data = [];
      const data: any = [];
      this.stockOnHandArrayIngredients.forEach((obj: any) => {
       obj.ingredient?.forEach((element: any) => {
        if(element.stock){
        let stock_value=( parseFloat(element.stock.on_hand_qty) * element.stock.cost_per_unit)
          let objData = {
            id: element.ingredient_id,
            item_name: element.ingredient_name,
            category_id:obj.ingredient_category_id,
            category_name: obj.ingredient_category_name,
            branch_name: this.branch_name,
            unit_name: element.stock.measurement_unit_name,
            stock_on_hand: element.stock.on_hand_qty +' '+element.stock.measurement_unit_name,
            stock_value: stock_value,
            stock_id:element.stock.stock_id
          }
         data.push(objData)
        }
        });
        obj.sub_recipe?.forEach((element: any) => {
          let stock_value=(  (element.stock.on_hand_qty?element.stock.on_hand_qty:0) * element.stock.cost_per_unit).toFixed(2)
            let objData = {
              id: element.sub_recipe_id,
              item_name: element.sub_recipe_name,
              category_id:obj.ingredient_category_id,
              category_name: obj.ingredient_category_name,
              branch_name: this.branch_name,
              unit_name: element.stock.measurement_unit_name,
              stock_on_hand: element.stock.on_hand_qty +' '+element.stock.measurement_unit_name,
              stock_value: stock_value,
              stock_id:element.stock.stock_id
            }
           data.push(objData)
          });
       });
      this.dataSourceForIngredient.data = data as Report[];
    }
  
  addHistory(stock_id:any,item_name:any): void {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '100%',data: { 'stock_id': stock_id ,'item_name':item_name,'branch_id':this.branch_id}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  tabClick(tab: any) {
   this.tabIndex=tab.index
    switch (tab.index) {
      case 0:
        this.current_page=1;
        this.getStockDataforFinishedGoods(this.branch_id,this.current_page);
        break;
      case 1:
        this.current_page_ingredients=1;
        this.getStockDataforIngredients(this.branch_id,this.current_page_ingredients);
    }
  }
  doFilter(filterText: any) {
    this.dataSourceForIngredient.filter = filterText.trim().toLocaleLowerCase();
  }
}

