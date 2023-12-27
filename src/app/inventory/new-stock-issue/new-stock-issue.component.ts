import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
export interface StockIssue{
  id:any;
  stock_issuing_number:any;
  issuing_type:any;
  staff:any;
  location:any;
 }

@Component({
  selector: 'app-new-stock-issue',
  templateUrl: './new-stock-issue.component.html',
  styleUrls: ['./new-stock-issue.component.scss']
})
export class NewStockIssueComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','stock_issuing_number', 'issuing_type','staff','location', 'button'];
  public dataSource = new MatTableDataSource<StockIssue>();
  currency_symbol = localStorage.getItem('currency_symbol');
  public stockIssuesForm!: UntypedFormGroup;
  total: any = 0.0;
  total1: any = 0.0;
  processeddata: any = [];
  branch_id: any;
  branchRecords: any = [];
  order_no: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  selectedStockIDs: any = [];
  filteredOptions: Observable<any[]> | undefined;
  purchasereturnItemsArray: any = [];
  total_price: any = 0;
  allItemArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  recipeArray: any = [];
  subrecipeArray = [];
  isItemsSelected: boolean = false;
  getIssuesArray=[];
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    private dataservice: DataService
  ) {
    this.branch_id = this.localService.get('branch_id');
  }

  ngOnInit(): void {
    this.getBranch();
    this.generateOrderNo();
    this.onBuildForm();
 
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) =>
      option.name.toString().toLowerCase().includes(filterValue)
    );
  }
  searchItem(filterText: any) {
  if(filterText.length>2){
    this.options=[];
   this.httpService.get('autocomplete_search_for_stock_issue/'+filterText)
   .subscribe(result => {
     if (result.status == 200) {
       if (result.data.length > 0) {
        this.allItemArray = result.data;
        this.options = [];
        if(this.stockIssuesForm.value['issuing_type']=="3"){
          
          this.allItemArray?.forEach((element: any) => {
            if(element.stock_type==1 ){
              let objData = {
                stock_type: 1,
                stock_id: element.stock_id,
                id: element.finished_good.item_id,
                name: element.finished_good.name,
                stock_on_hand: element.finished_good.stock_on_hand,
                cost_per_unit: element.finished_good.cost_per_unit,
                buying_unit: element.finished_good.buying_unit,
                unit_equals_sub_unit:element.finished_good.unit_equals_sub_unit,
               unit_equals_measurement_unit:element.finished_good.unit_equals_measurement_unit,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:element.finished_good.measurement_unit_name
              
              };
              this.options.push(objData);
            }
            else if(element.stock_type==2  ){
              let objData = {
                stock_type: 2,
                stock_id: element.stock_id,
                id: element.ingredient.id,
                name: element.ingredient.name,
                stock_on_hand: element.ingredient.stock_on_hand,
                cost_per_unit: element.ingredient.cost_per_unit,
                buying_unit: element.ingredient.buying_unit,
                unit_equals_sub_unit:
                  element.ingredient.unit_equals_sub_unit,
                unit_equals_measurement_unit:
                  element.ingredient.unit_equals_measurement_unit,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:
                  element.ingredient.measurement_unit_name,
              };
              this.options.push(objData);
            }
          });
     
        }
        else{
          this.allItemArray?.forEach((element: any) => {
            if(element.stock_type==1 ){
              let objData = {
                stock_type: 1,
                stock_id: element.stock_id,
                id: element.finished_good.item_id,
                name: element.finished_good.name,
                stock_on_hand: element.finished_good.stock_on_hand,
                cost_per_unit: element.finished_good.cost_per_unit,
                buying_unit: element.finished_good.buying_unit,
                unit_equals_sub_unit:element.finished_good.unit_equals_sub_unit,
               unit_equals_measurement_unit:element.finished_good.unit_equals_measurement_unit,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:element.finished_good.measurement_unit_name
              };
              this.options.push(objData);
            }
            else if(element.stock_type==2  ){
              let objData = {
                stock_type: 2,
                stock_id: element.stock_id,
                id: element.ingredient.id,
                name: element.ingredient.name,
                stock_on_hand: element.ingredient.stock_on_hand,
                cost_per_unit: element.ingredient.cost_per_unit,
                buying_unit: element.ingredient.buying_unit,
                unit_equals_sub_unit:
                  element.ingredient.unit_equals_sub_unit,
                unit_equals_measurement_unit:
                  element.ingredient.unit_equals_measurement_unit,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:
                  element.ingredient.measurement_unit_name,
              
              };
              this.options.push(objData);
            }
            else if(element.stock_type==3){
              let objData = {
                stock_type: element.stock_type,
                stock_id: element.stock_id,
                id: element.sub_recipe.id,
                name: element.sub_recipe.name,
                stock_on_hand:element.sub_recipe.stock_on_hand,
                cost_per_unit: element.sub_recipe.cost_per_unit,
                buying_unit: element.sub_recipe.buying_unit,
                unit_equals_sub_unit:element.sub_recipe.unit_equals_sub_unit,
                unit_equals_measurement_unit:  element.sub_recipe.unit_equals_measurement_unit ,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:element.sub_recipe.measurement_unit_name,
              };
              this.options.push(objData);
            }
            else if(element.stock_type==4){
              let objData = {
                stock_type: element.stock_type,
                stock_id: element.stock_id,
                id: element.recipe.id,
                name: element.recipe.name,
                stock_on_hand:element.recipe.on_hand_qty,
                cost_per_unit: element.recipe.cost_per_unit,
                buying_unit: element.recipe.buying_unit,
                unit_equals_sub_unit:element.recipe.unit_equals_sub_unit,
                unit_equals_measurement_unit:  element.recipe.unit_equals_measurement_unit ,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:element.recipe.measurement_unit_name,
              };
              this.options.push(objData);
            }
            else if(element.stock_type==5){
              let objData = {
                stock_type: element.stock_type,
                stock_id: element.stock_id,
                id: element.modifier.id,
                name: element.modifier.name,
                stock_on_hand:element.modifier.on_hand_qty,
                cost_per_unit: element.modifier.cost_per_unit,
                buying_unit: element.modifier.buying_unit,
                unit_equals_sub_unit:element.modifier.unit_equals_sub_unit,
                unit_equals_measurement_unit:  element.modifier.unit_equals_measurement_unit ,
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name:element.modifier.measurement_unit_name,
              };
              this.options.push(objData);
            }
          });
        


      }

       
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
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id')).subscribe((result) => {
      if (result.status == 200) {
        this.branchRecords = result.data.tenant_branches;
      } else {
        console.log('Error');
      }
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no =
      'ISSUE_ST' +
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
  onBuildForm() {
    this.stockIssuesForm = this.formBuilder.group({
      stock_issuing_number: [
        this.order_no,
        Validators.compose([Validators.required]),
      ],
      branch_id: [{value:this.branch_id,disabled:true},Validators.compose([Validators.required])],
      issuing_type: ['',Validators.compose([Validators.required])],
      comments: ['',Validators.compose([Validators.required])],
      branch_id_for_issued: [this.branch_id],
      suppliersData: new UntypedFormArray([]),
    });
  }
  errorMessage(i:any){
    let form_data = this.stockIssuesForm.value;
    if(form_data.suppliersData[i].qty>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  }
  getItems() {
    this.httpService
      .get('get-inventory-all-type/' + this.branch_id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.allItemArray = result.data;
          this.options = [];
          if(this.stockIssuesForm.value['issuing_type']=="3"){
            this.finishedGoodArray = this.allItemArray.finished_good;
            this.finishedGoodArray?.forEach((element: any) => {
              let objData = {
                stock_type: 1,
                stock_id: element.stock_id,
                id: element.finished_good.item_id,
                name: element.finished_good.name,
                stock_on_hand: element.on_hand_qty,
                cost_per_unit: element.cost_per_unit,
                buying_unit: element
                  ? element.buying_unit
                  : '',
                unit_equals_sub_unit: element
                  ? element.unit_equals_sub_unit
                  : '',
                unit_equals_measurement_unit: element
                  ? element.unit_equals_measurement_unit
                  : '',
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name: element
                  ? element.measurement_unit_name
                  : '',
              };
              this.options.push(objData);
            });
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
                    cost_per_unit: element.cost_per_unit,
                    buying_unit: element.buying_unit,
                    unit_equals_sub_unit:
                      element.unit_equals_sub_unit,
                    unit_equals_measurement_unit:
                      element.unit_equals_measurement_unit,
                    qty: '',
                    qtyToMeasurementUnit: '',
                    total: 0,
                    measurement_unit_name:
                      element.measurement_unit_name,
                  };
                  this.options.push(objData);
                }
              }
            });
          }
          else{

          
          this.finishedGoodArray = this.allItemArray.finished_good;
          this.finishedGoodArray?.forEach((element: any) => {
            let objData = {
              stock_type: 1,
              stock_id: element.stock_id,
              id: element.finished_good.item_id,
              name: element.finished_good.name,
              stock_on_hand: element.on_hand_qty,
              cost_per_unit: element.cost_per_unit,
              buying_unit: element
                ? element.buying_unit
                : '',
              unit_equals_sub_unit: element
                ? element.unit_equals_sub_unit
                : '',
              unit_equals_measurement_unit: element
                ? element.unit_equals_measurement_unit
                : '',
              qty:'',
              qtyToMeasurementUnit: '',
              total: 0,
              measurement_unit_name: element
                ? element.measurement_unit_name
                : '',
            };
            this.options.push(objData);
          });
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
                  cost_per_unit: element.cost_per_unit,
                  buying_unit: element.buying_unit,
                  unit_equals_sub_unit:
                    element.unit_equals_sub_unit,
                  unit_equals_measurement_unit:
                    element.unit_equals_measurement_unit,
                  qty: '',
                  qtyToMeasurementUnit: '',
                  total: 0,
                  measurement_unit_name:
                    element.measurement_unit_name,
                };
                this.options.push(objData);
              }
            }
          });
          this.recipeArray = this.allItemArray.recipes_subRecipes;
          this.recipeArray?.forEach((element: any) => {
             
            if (element.stock_type == 3 || element.stock_type == 4) {
              let objData = {
                stock_type: element.stock_type,
                stock_id: element.stock_id,
                id: element.recipe ? element.recipe.id : element.sub_recipe.id,
                name: element.recipe
                  ? element.recipe.name
                  : element.sub_recipe.name,
                stock_on_hand: element.recipe
                  ? element.recipe.stock_on_hand
                  : element.sub_recipe.stock_on_hand,
                cost_per_unit: element.recipe
                  ? element.cost_price
                  : element.cost_per_unit,
                buying_unit: element
                  ? element.buying_unit
                  : '',
                unit_equals_sub_unit: element
                  ? element.unit_equals_sub_unit
                  : '',
                unit_equals_measurement_unit: element
                  ? element.unit_equals_measurement_unit
                  : '',
                qty: '',
                qtyToMeasurementUnit: '',
                total: 0,
                measurement_unit_name: element.sub_recipe
                  ? element.sub_recipe.measurement_unit_name
                  : element.recipe.measurement_unit_name,
              };
              this.options.push(objData);
             
               
            }
          });
        }
          if (result.data == null) {
            this.showNoReorderItemDialog();
          }
        } else {
          console.log('Error in get reorder');
        }
      });

     
      
  }
  process() {
    let recipe: any = [];
    let ingredients: any = [];
    let finished_good: any = [];
    let subRecipe: any = [];
    let modifier: any = [];
    let item = this.stockIssuesForm.value['suppliersData'];
    item.forEach((obj: any) => {
      if(obj.qty>0){
        if (obj.stock_type == 2) {
          let objData = {
            ingredient_id: obj.id,
            qty: obj.qty,
            total: obj.total,
          };
          ingredients.push(objData);
        } else if (obj.stock_type == 1) {
          let objData = {
            item_id: obj.id,
            qty: obj.qty,
            total: obj.total,
          };
          finished_good.push(objData);
        } else if (obj.stock_type == 3) {
          let objData = {
            sub_recipe_id: obj.id,
            qty: obj.qty,
            total: obj.total,
          };
          subRecipe.push(objData);
        } else if (obj.stock_type == 4) {
          let objData = {
            recipe_id: obj.id,
            qty: obj.qty,
            total: obj.total,
          };
          recipe.push(objData);
        } else if (obj.stock_type == 5) {
          let objData = {
            modifier_id: obj.id,
            qty: obj.qty,
            total: obj.total,
          };
          modifier.push(objData);
        }
      }
     
    });
    let arrayLength=parseInt(finished_good.length)+parseInt(ingredients.length)+parseInt(subRecipe.length)+parseInt(recipe.length)+parseInt(modifier.length)
    if(arrayLength==item.length && item.length>0){
    let postParamsSave = {
      stock_issuing_number: this.stockIssuesForm.value['stock_issuing_number'],
      comments: this.stockIssuesForm.value['comments'],
      issuing_type: this.stockIssuesForm.value['issuing_type'],
      branch_id: this.branch_id,
      total_amount: this.total_price,
      issue_items_list: [
        {
          recipe: recipe,
          ingredients: ingredients,
          finished_good: finished_good,
          sub_recipe: subRecipe,
          modifier:modifier
        },
      ],
    };
    this.httpService.post('stock-issue', postParamsSave).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar(
          'Stock issue created successfully',
          'Close'
        );
        this.router.navigate(['inventory/stockIssues'])
      } else {
        this.snackBService.openSnackBar(
          result.message,
          'Close'
        );
      }
    });
  }
  }

  itemSelected(option: any, input: HTMLInputElement) {
    let items = this.stockIssuesForm.value['suppliersData'];
    if (items.length > 0) {
      if (this.selectedStockIDs.includes(option.stock_id)) {
        this.snackBService.openSnackBar('Item already added', 'Close');
      } else {
        let items = this.stockIssuesForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.isItemsSelected = true;
        this.selectedStockIDs.push(option.stock_id);
      }
    } else {
      let items = this.stockIssuesForm.get('suppliersData') as UntypedFormArray;
      items.push(this.createSupplierData(option));
      this.isItemsSelected = true;
      this.selectedStockIDs.push(option.stock_id);
    }

    input.value = '';
    input.blur();
    this.options=[];
  }
  get supplierFormGroups() {
    return this.stockIssuesForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  itemName(index: any) {
    let form_data = this.stockIssuesForm.value;
    return form_data.suppliersData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.stockIssuesForm.value;
    return form_data.suppliersData[index].stock_on_hand?form_data.suppliersData[index].stock_on_hand+' '+form_data.suppliersData[index].measurement_unit_name:0
  }
  price(index: any) {
    let form_data = this.stockIssuesForm.value;
   
    
    return (
      form_data.suppliersData[index].measurement_unit_name?
      form_data.suppliersData[index].cost_per_unit +this.currency_symbol+
      '/' +
      form_data.suppliersData[index].measurement_unit_name: form_data.suppliersData[index].cost_per_unit +this.currency_symbol
    );
  }
  unit(index: any) {
    let form_data = this.stockIssuesForm.value;
    return (
      '1 ' +
      form_data.suppliersData[index].buying_unit +
      '=' +
      form_data.suppliersData[index].unit_equals_measurement_unit +
      form_data.suppliersData[index].measurement_unit_name
    );
  }
  measurementunit(index: any) {
    let form_data = this.stockIssuesForm.value;
    return form_data.suppliersData[index].measurement_unit_name?form_data.suppliersData[index].measurement_unit_name:'';
  }
  clearSupplier(index: any) {
    let items = this.stockIssuesForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.stockIssuesForm.value;
    this.selectedStockIDs.splice(
      this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id),
      1
    );
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total);
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }


  showNoReorderItemDialog() {}

  findTotal(i: any) {
    let items = this.stockIssuesForm.value['suppliersData'];
    let netQuantity = items[i].qty;
    let cost = items[i].cost_per_unit;
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
    let form_data = this.stockIssuesForm.value;
    return form_data.suppliersData[index].total;
  }


 
}

