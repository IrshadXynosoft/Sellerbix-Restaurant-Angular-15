import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-batch-production',
  templateUrl: './batch-production.component.html',
  styleUrls: ['./batch-production.component.scss']
})
export class BatchProductionComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public batchProductionForm!: UntypedFormGroup;
  processeddata: any = [];
  branchRecords: any = [];
  branch_id: any;
  order_no: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  recipeArray: any = [];
  selectedStockIDs: any = [];
  filteredOptions: Observable<any[]> | undefined;
  total_price: any = 0;
  locationSelected: any;
  isItemsSelected:boolean=false;
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute, private dataservice: DataService) {
    this.branch_id = this.localService.get('branch_id')
    this.locationSelected=this.localService.get('branchname')
  }
  ngOnInit(): void {
    this.getBranch();
    this.generateOrderNo();
    this.onBuildForm();
    this.filteredOptions = this.suppliersData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  onBuildForm() {
    this.batchProductionForm = this.formBuilder.group({
      batch_production_order_number: [this.order_no, Validators.compose([Validators.required])],
      branch_id: [{value:this.branch_id,disabled:true}],
      due_date: [''],
      branch_id_for_past_processed: [this.branch_id],
      suppliersData: new UntypedFormArray([]),
    });
  }
  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no = "BPP_" + date + "." + month + "." + year + "_" + hh + ":" + mm + ":" + ss
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

 
  get supplierFormGroups() {
    return this.batchProductionForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  recipeList() {
    this.httpService.get('search-recipe-sub-recipe/' + this.branch_id)
      .subscribe(result => {
        if (result.status == 200) {
          this.recipeArray = result.data;
          this.options = [];
          this.recipeArray.forEach((element: any) => {
            let ingredients = [];
            let subrecipes = [];
            subrecipes.push(element.sub_recipe ? element.sub_recipe.sub_recipe : element.recipe.sub_recipe)
            ingredients.push(element.sub_recipe ? element.sub_recipe.ingredient : element.recipe.ingredient)
            let objData = {
              stock_type: element.stock_type,
              stock_id: element.stock_id,
              id: element.sub_recipe ? element.sub_recipe.id : element.recipe.id,
              name: element.sub_recipe ? element.sub_recipe.name : element.recipe.name,
              yield: element.sub_recipe ? element.sub_recipe.yield : element.recipe.yield,
              stock_on_hand: element.sub_recipe ? element.sub_recipe.stock_on_hand : element.recipe.stock_on_hand,
              ingredients: ingredients,
              subrecipe_ingredient: subrecipes,
              cost_per_unit:element.sub_recipe ? element.cost_per_unit : element.cost_price,
              measurement_unit_name: element.sub_recipe ? element.sub_recipe.measurement_unit_name : element.recipe.measurement_unit_name,
              qty:'',
              total: 0,
            }
            this.options.push(objData)
            
            
          });
        } else {
          console.log("Error");
        }
      });
  }
  itemFilter(filterText: any) {
    this.options=[];
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {
      this.httpService.get('autocomplete_search_for_batch-process/' + filterText)
        .subscribe(result => {
          if (result.status == 200) {
             if (result.data.length > 0) {
              this.options=[];
              //this.options=result.data
              result.data.forEach((element: any) => {
                let ingredients = [];
                let subrecipes = [];
                if(element.stock_type==3 || element.stock_type==4){
                subrecipes.push(element.sub_recipe ? element.sub_recipe.sub_recipe : element.recipe.sub_recipe)
                ingredients.push(element.sub_recipe ? element.sub_recipe.ingredient : element.recipe.ingredient)
                let objData = {
                  stock_type: element.stock_type,
                  stock_id: element.stock_id,
                  id: element.sub_recipe ? element.sub_recipe.id : element.recipe.id,
                  name: element.sub_recipe ? element.sub_recipe.name : element.recipe.name,
                  yield: element.sub_recipe ? element.sub_recipe.yield : element.recipe.yield,
                  stock_on_hand: element.sub_recipe ? element.sub_recipe.stock_on_hand : element.recipe.stock_on_hand,
                  ingredients: ingredients,
                  subrecipe_ingredient: subrecipes,
                  cost_per_unit:element.sub_recipe ? element.cost_per_unit : element.cost_price,
                  measurement_unit_name: element.sub_recipe ? element.sub_recipe.measurement_unit_name : element.recipe.measurement_unit_name,
                  qty:'',
                  total: 0,
                }
                this.options.push(objData)
              }
                if(element.stock_type==5){
                  subrecipes.push(element.modifier.sub_recipe)
                  ingredients.push(element.modifier.ingredient)
                  let objData = {
                    stock_type: element.stock_type,
                    stock_id: element.stock_id,
                    id: element.modifier.id,
                    name: element.modifier.name,
                    yield: element.modifier.yield,
                    stock_on_hand: element.modifier.stock_on_hand,
                    ingredients: ingredients,
                    subrecipe_ingredient: subrecipes,
                    cost_per_unit:element.cost_price,
                    measurement_unit_name: element.modifier.measurement_unit_name,
                    qty:'',
                    total: 0,
                  }
                  this.options.push(objData)
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

  itemSelected(option: any, input: HTMLInputElement) {
    let items = this.batchProductionForm.value['suppliersData'];
    if (items.length > 0) {
      if (this.selectedStockIDs.includes(option.stock_id)) {
        this.snackBService.openSnackBar("Item already added", "Close")
      } else {
        let items = this.batchProductionForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.isItemsSelected=true;
        this.selectedStockIDs.push(option.stock_id);
      }
    } else {
      let items = this.batchProductionForm.get('suppliersData') as UntypedFormArray;
      items.push(this.createSupplierData(option));
      this.isItemsSelected=true;
      this.selectedStockIDs.push(option.stock_id);
    }
    input.value = '';
    input.blur();
  }
  itemName(index: any) {
    let form_data = this.batchProductionForm.value;
    let measurementUnitName = form_data.suppliersData[index].measurement_unit_name != null ? form_data.suppliersData[index].measurement_unit_name : '';
    return form_data.suppliersData[index].yield?form_data.suppliersData[index].name + ' ( Yield : ' + form_data.suppliersData[index].yield +' ' +measurementUnitName + ')':form_data.suppliersData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.batchProductionForm.value;
    return form_data.suppliersData[index].stock_on_hand?form_data.suppliersData[index].stock_on_hand+' '+form_data.suppliersData[index].measurement_unit_name:'0'
  }
  stockOnHandCheck(index: any) {
    let form_data = this.batchProductionForm.value;
    return form_data.suppliersData[index].stock_on_hand>=0?true:false;
  }
  unit(index: any) {
    let form_data = this.batchProductionForm.value;
    let measurementUnitName = form_data.suppliersData[index].measurement_unit_name != null ? '/' + form_data.suppliersData[index].measurement_unit_name : ''
    return form_data.suppliersData[index].cost_per_unit + ' '  + measurementUnitName;
  }
  measurementunit(index: any) {
    let form_data = this.batchProductionForm.value;
    return form_data.suppliersData[index].measurement_unit_name;
  }
  errorMessage(i:any){
    let form_data = this.batchProductionForm.value;
    let decimal_length=form_data.suppliersData[i].qty.split('.')[1]?form_data.suppliersData[i].qty.split('.')[1].length:0
    let digit_length=form_data.suppliersData[i].qty.split('.')[0]?form_data.suppliersData[i].qty.split('.')[0].length:0
   if(form_data.suppliersData[i].qty>=0 && decimal_length <= 3 && digit_length <= 5){
   
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  }
  listingredients(index: any) {
    let form_data = this.batchProductionForm.value;
    return 'Ingredients: ' + form_data.suppliersData[index].ingredients.ingredient.name;
  }
  ingredients(index: any) {
    let ingredientArray: any = []
    let form_data = this.batchProductionForm.value
    if (form_data.suppliersData[index].ingredients) {
      form_data.suppliersData[index].ingredients.forEach((element: any) => {
        let data = {
          id: element.ingredient_id,
          name: element.ingredient_name ,
          required: element.required,
          qty_per_yield:element.qty_per_yield,
          available: element.available_stock,
          measurement_unit_name:element.measurement_unit_name
        }
        ingredientArray.push(data)
     
        
      });
    }
    if (form_data.suppliersData[index].subrecipe_ingredient) {
      form_data.suppliersData[index].subrecipe_ingredient.forEach((element: any) => {
        let data = {
          id:element.id?element.id:element.ingredient_id,
          name: element.name?element.name:element.ingredient_name,
          required: element.required,
          available: element.available_stock,
          qty_per_yield:element.qty_per_yield,
          measurement_unit_name:element.measurement_unit_name
        }
        ingredientArray.push(data)
      });
    }
   
    return ingredientArray;
  }
  findTotal(i: any) {
    let items = this.batchProductionForm.value['suppliersData']
    let netQuantity = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0) {
      let subTotalItem = (netQuantity * cost).toFixed(2);
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
    }
  }
  subTotal(index: any) {
    let form_data = this.batchProductionForm.value;
    return form_data.suppliersData[index].total;
  }
  clearSupplier(index: any) {
    let items = this.batchProductionForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.batchProductionForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id), 1);
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total)
    });
    if(items.length==0)
    {
      this.isItemsSelected=false;
    }
  }
 
  process() {
    let recipe: any = []
    let subrecipe: any = [];
    let modifier: any = [];
    let item = this.batchProductionForm.value['suppliersData']
    item.forEach((obj: any) => {
    if(obj.qty>0){
      if (obj.stock_type == 4) {
        let objData = {
          recipe_id: obj.id,
          qty: obj.qty,
          total: obj.total
        }
        recipe.push(objData)
      }
      else if (obj.stock_type == 3) {
        let objData = {
          sub_recipe_id: obj.id,
          qty: obj.qty,
          total: obj.total
        }
        subrecipe.push(objData)
      }
     else if (obj.stock_type == 5) {
        let objData = {
          modifier_id: obj.id,
          qty: obj.qty,
          total: obj.total
        }
        modifier.push(objData)
      }
    }
    });
    let arrayLength=parseInt(subrecipe.length)+parseInt(recipe.length)+parseInt(modifier.length)
    if(arrayLength==item.length && item.length>0){
    let postParamsSave = {
      batch_process_reference_no: this.batchProductionForm.value['batch_production_order_number'],
      branch_id: this.branch_id,
      total_amount: this.total_price,
      batch_items_list: [{
        recipe: recipe,
        sub_recipe: subrecipe,
        modifier:modifier
      }]
    }
    this.httpService.post('batch-process', postParamsSave)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("batch processed Successfully ", "Close");
          this.router.navigate(['/inventory/batchProduction']);
        } else {
          console.log("Error in batch process");
        }
      });
    }
  }
  back(){
    this.router.navigate(['/inventory/batchProduction']);
  }
 
  viewBatchProcess(item: any) {
    this.dataservice.setData('batchProcessedItem', item);
    this.router.navigate(['inventory/viewBatchProduction'])
  }
  getItemName(item: any) {
    let itemName: any;
    if (item.sub_recipe) {
      item.sub_recipe.forEach((element: any) => {
        itemName = itemName ? itemName + ',' + element.name : element.name
      });
    }
    if (item.recipe) {
      item.recipe.forEach((element: any) => {
        itemName = itemName ? itemName + ',' + element.name : element.name
      });
    }
    return itemName;
  }
}
