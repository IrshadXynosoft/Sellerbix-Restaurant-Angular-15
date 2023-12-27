import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { StockRequest } from '../stock-requests/stock-requests.component';

@Component({
  selector: 'app-receive-stock-request',
  templateUrl: './receive-stock-request.component.html',
  styleUrls: ['./receive-stock-request.component.scss']
})
export class ReceiveStockRequestComponent implements OnInit {
 
  currency_symbol = localStorage.getItem('currency_symbol');
  public newStockRequestForm!: UntypedFormGroup;
  branch_id: any;
  order_no: any;
  branchRecords: any = [];
  total: any;
  suppliersData = new UntypedFormControl();
  branch_selected: boolean = false;
  total_price: any = 0;
  selectedStockIDs:any = [];
  allItemArray:any=[];
  today:any;
  isItemsSelected:boolean=false;
  getRequestArray:any=[];
  constructor(private dataService:DataService,private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
  
  }
  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();
   
  }
 

 
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
          this.getProcessedData();
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  getProcessedData(){
    this.getRequestArray=this.dataService.getData('stockreceivetItem');

    this.getRequestArray.finished_good?.forEach((element: any) => {
    let objData = {
        id: element.finished_good_id,
        name: element.name,
        stock_type:1,
        cost_per_unit: element.cost_per_unit,
        available_stock:element.available_stock,
        requested_qty:element.requested_qty,
        qty: '',
        total: 0,
        measurement_unit_name: element.measurement_unit_name
      }
      let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
      items.push(this.createSupplierData(objData));
    });
    this.getRequestArray.ingredient?.forEach((element: any) => {
      let objData = {
            id: element.ingredient_id,
            name: element.name,
            stock_type:2,
            cost_per_unit: element.cost_per_unit,
            available_stock:element.available_stock,
            requested_qty:element.requested_qty,
            qty:'',
            total: 0,
            measurement_unit_name: element.measurement_unit_name
          }
          let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(objData));
      });
      this.getRequestArray.sub_recipe?.forEach((element: any) => {
        let objData = {
              id: element.sub_recipe_id,
              name: element.name,
              stock_type:3,
              cost_per_unit: element.cost_per_unit,
              available_stock:element.available_stock,
              requested_qty:element.requested_qty,
              qty:'',
              total: 0,
              measurement_unit_name: element.measurement_unit_name
            }
            let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(objData));
        });
      let fromBranch=this.getBranchName(this.getRequestArray.from_branch_id);
      let toBranch=this.getBranchName(this.getRequestArray.to_branch_id);
   this.newStockRequestForm.patchValue({
    stock_request_number:this.getRequestArray.stock_request_number,
    from_branch:fromBranch,
    comments:this.getRequestArray.comments,
    to_branch:toBranch
   })
  }
  onBuildForm() {
    this.newStockRequestForm = this.formBuilder.group({
      stock_request_number: [{value:'',disabled:true}],
      from_branch:[{value:'',disabled:true}],
      comments: [{value:'',disabled:true}],
      suppliersData: new UntypedFormArray([]),
      to_branch:[{value:'',disabled:true}],
    });
    
  
   
  }
  getBranchName(branch_id:any)
  {

  let branch_name:any;
    this.branchRecords.forEach((element:any) => {
       if(element.id==branch_id){

         branch_name=element.name
       }
    });
  
    
    return branch_name
  }

  itemSelected(option: any, input: HTMLInputElement) {
    
      let items = this.newStockRequestForm.value['suppliersData'];
      if (items.length > 0) {
        if (this.selectedStockIDs.includes(option.stock_id) ) {
          this.snackBService.openSnackBar("Item already added", "Close")
        } else {
          let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(option));
          this.isItemsSelected=true;
          this.selectedStockIDs.push(option.stock_id);
         }
      } else {
        let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.isItemsSelected=true;
        this.selectedStockIDs.push(option.stock_id);
       }
  
    
    
    input.value = '';
    input.blur();
  }


  get supplierFormGroups() {
    return this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }
  
  itemName(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].name;
  }

  price(index: any) {
    let form_data = this.newStockRequestForm.value;
   
    return form_data.suppliersData[index].cost_per_unit +this.currency_symbol+ '/' + form_data.suppliersData[index].measurement_unit_name;
  }
stock(index:any){
  let form_data = this.newStockRequestForm.value;
   
  return form_data.suppliersData[index].available_stock;
}
  measurementunit(index: any) {
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].measurement_unit_name;
  }
  requestedQuantity(index:any){
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].requested_qty;
  }
  errorMessage(i:any){
    let form_data = this.newStockRequestForm.value;
    if(form_data.suppliersData[i].qty>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
  }
  }
  clearSupplier(index: any) {
    let items = this.newStockRequestForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.newStockRequestForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id),1);
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

  findTotal(i: any) {
    let items = this.newStockRequestForm.value['suppliersData']
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
    let form_data = this.newStockRequestForm.value;
    return form_data.suppliersData[index].total;
  }
  
  back() {
    this.router.navigate(['/inventory/stockTransfer'])
  }
  processStockRequest() {
    let ingredients: any = [];
    let finished_good:any=[];
    let sub_recipe:any=[];
    let item = this.newStockRequestForm.value['suppliersData']
    item.forEach((obj: any) => {
      if(obj.qty>0){
      if (obj.stock_type == 2) {
        let objData = {
          ingredient_id: obj.id,
          qty: obj.qty,
          total:obj.total
        }
        ingredients.push(objData)
      }
      else if (obj.stock_type == 1) {
        let objData = {
          finished_good_id: obj.id,
          qty: obj.qty,
          total:obj.total
        }
        finished_good.push(objData)
      }
      else if (obj.stock_type == 3) {
        let objData = {
          sub_recipe_id: obj.id,
          qty: obj.qty,
          total:obj.total
        }
        sub_recipe.push(objData)
      }
    }
    
    });

    let arrayLength=parseInt(finished_good.length)+parseInt(ingredients.length)+parseInt(sub_recipe.length)
    if(arrayLength==item.length && item.length>0){
    let postParamsSave = {
      stock_request_number: this.getRequestArray.stock_request_number,
      comments:  this.getRequestArray.comments,
      from_branch_id: this.getRequestArray.from_branch_id,
      to_branch_id: this.getRequestArray.to_branch_id,
      total_amount: this.total_price,
      branch_id: this.getRequestArray.from_branch_id,
      status:2,
      request_items_list: [{
        ingredients: ingredients,
        finished_good:finished_good,
        sub_recipe:sub_recipe
      }]
    }
    
    this.httpService.put('stock-request/'+this.getRequestArray.id, postParamsSave)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Stock Request Processed Successfully ", "Close");
         
          this.back();

        } else {
          console.log("Error in purchase-order");
        }
      });
    }
  }

  viewRequestDetail(id:any)
  {
    this.getRequestArray.forEach((element:any) => {
      if(id==element.id)
      {
        this.dataService.setData('stockrequestItem',element);
        this.router.navigate(['inventory/stockrequestdetail'])
        
      }
    });
  }

}
