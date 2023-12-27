import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddSupplierComponent } from 'src/app/setup/add-supplier/add-supplier.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-edit-consignment',
  templateUrl: './edit-consignment.component.html',
  styleUrls: ['./edit-consignment.component.scss']
})
export class EditConsignmentComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public newOrderForm!: UntypedFormGroup;
  branch_id: any;
  order_no: any;
  reOrderItemsArray: any = [];
  branchRecords: any = [];
  stockOnHandBranch: any;
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  supplierArrays: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  total_price: any = 0;
  selectedStockIDs: any = [];
  isItemsSelected: boolean = false;
  branch_name: any;
  todayDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  itemList: any = [];
  flag: boolean = false;
  apiFlag:boolean=false
  id:any;
  constructor(public dialog: MatDialog, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.branch_name = this.localService.get('branchname');
    this.id = this.route.snapshot.params.id
    this.id = this.route.snapshot.params.id
    this.branch_id = this.route.snapshot.params.branch_id
  }
  ngOnInit(): void {
    this.generateOrderNo();
    this.getBranch();
    this.onBuildForm();
    this.getpurchaseOrder();
  }

  // onBuildForm() {
  //   this.newOrderForm = this.formBuilder.group({
  //     purchase_order_number: [this.order_no, Validators.compose([Validators.required])],
  //     deliver_to_branch: [''],
  //     branch_selected: [this.branch_name],
  //     due_date: [this.todayDate, Validators.compose([Validators.required])],
  //     comments: [''],
  //     suppliersData: new UntypedFormArray([]),
  //     supplier_id: ['', Validators.compose([Validators.required])]
  //   });
  //   this.newOrderForm.controls['branch_selected'].disable();
  // }

  onBuildForm() {
    this.newOrderForm = this.formBuilder.group({
      purchase_order_number: [this.order_no, Validators.compose([Validators.required])],
      deliver_to_branch: [''],
      branch_selected: [{value:'',disabled:true}],
      due_date: [this.todayDate],
      comments: [''],
      suppliersData: new UntypedFormArray([]),
      supplier_selected: [{value:'',disabled:true}]
    });
   
  }

  getpurchaseOrder() {
    this.httpService.get('consignment/' + this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.purchaseOrderArray = result.data[0];
          this.total_price = this.purchaseOrderArray.total_amount;
          
          this.newOrderForm.patchValue({
            purchase_order_number: this.purchaseOrderArray.purchase_order_number,
            deliver_to_branch: this.purchaseOrderArray.branch,
            branch_selected: this.purchaseOrderArray.branch,
            due_date: this.purchaseOrderArray.due_date,
            comments: this.purchaseOrderArray.comments,
            supplier_selected: this.purchaseOrderArray.supplier_name
          })
          this.purchaseOrderArray.purchase_order_item?.forEach((element: any) => {
            let total = (element.qty * element.cost_per_unit).toFixed(2)
            let objData = {
              inventory_type: 1,
              stock_id: element.stock_id,
              id: element.finished_good_id,
              name: element.name,
              stock_on_hand: element.on_hand_qty,
              supplier_name: element.supplier,
              supplier_id: element.supplier_id,
              cost_per_unit: element.cost_per_unit,
              buying_unit: element.buying_unit,
              unit_equals_measurement_unit: element.unit_equals_measurement_unit,
              unit_equals_sub_unit:element.unit_equals_sub_unit,
              has_sub_unit:element.has_sub_unit,
              deliver_to: this.purchaseOrderArray.branch,
              ordered_quantity: element.qty,
              qty: element.buying_qty,
              buying_qty:element.buying_qty,
              qtyToMeasurementUnit:element.qty,
              total: element.line_total,
             unit_name: element.measurement_unit_name,
              supplier_price:element.supplier_price
             
            }
             
            let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(objData));
          
          });
          this.purchaseOrderArray.ingredient?.forEach((element: any) => {
           // let total = (element.qty * element.cost_per_unit).toFixed(2)
            let objData = {
              inventory_type: 2,
              stock_id: element.stock_id,
              id: element.id,
              name: element.name,
              stock_on_hand: element.on_hand_qty,
              supplier_name: element.supplier,
              supplier_id: element.supplier_id,
              cost_per_unit: element.cost_per_unit,
              buying_unit: element.buying_unit,
              unit_equals_measurement_unit: element.unit_equals_measurement_unit,
              unit_equals_sub_unit:element.unit_equals_sub_unit,
              has_sub_unit:element.has_sub_unit,
              deliver_to: this.purchaseOrderArray.branch,
              ordered_quantity: element.qty,
              qty: element.buying_qty,
              buying_qty:element.buying_qty,
              total: element.line_total,
              unit_name: element.measurement_unit_name,
              supplier_price:element.supplier_price,
              qtyToMeasurementUnit:element.qty,
              
          
            }
            let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(objData));
          });
        } else {
          console.log("Error in Get po");
        }
      });
  }
  searchItemAutocomplete(searchText: any) {
    this.itemList = [];
    if (searchText.length > 2) {
      this.httpService.get('autocomplete_search_for_po/' + this.branch_id + '/' + searchText)
        .subscribe(result => {
          if (result.status == 200) {
            this.itemList = [];
           
            if (result.data) {
              
              let supp_obj:any={
                name:'Suppliers',
                options:result.data.options,
                type:0
               }
               this.itemList.push(supp_obj)
               let item_obj:any={
                name:'Items',
                options:result.data.options1,
                type:1
               }
               this.itemList.push(item_obj);
          
            }
         
          } else {
            console.log("Error while fetching Item details");
          }
        });
    }
    else {
      this.itemList = [];
    }
  }

  get supplierFormGroups() {
    return this.newOrderForm.get('suppliersData') as UntypedFormArray;
  }
  createSupplierData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  supplierName(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].supplier_name;
  }
  supplierChange(index: any) {
    let items: any = this.newOrderForm.get('suppliersData') as UntypedFormArray;
    items.at(index).get('supplier_change_flag').setValue(1);
    
  }
  supplierFlag(index:any){
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].supplier_change_flag;
  }
  suppliers(index:any){


    let form_data = this.newOrderForm.value;
    let supplier_count=form_data.suppliersData[index].supplier_count;
    let supplier:any=[]
    let items: any = this.newOrderForm.get('suppliersData') as UntypedFormArray;
    if(supplier_count>0){
      for(let i=0;i<supplier_count;i++){
     
      supplier.push( items.at(index).get('suppliers-'+i).value)
      }
    }

    return supplier
  }
  supplierChanged(supplier:any,index:any){
   
    let items: any = this.newOrderForm.get('suppliersData') as UntypedFormArray;
    items.at(index).get('supplier_id').setValue( supplier.supplier_id);
    items.at(index).get('supplier_name').setValue( supplier.supplier_name);
    items.at(index).get('supplier_price').setValue( supplier.supplier_price);
    items.at(index).get('supplier_change_flag').setValue(0);
  }
  supplierSelect(index: any) {
    let suppliers:any=[]
    let form_data = this.newOrderForm.value;
    let stock_id = form_data.suppliersData[index].stock_id;
    if(!this.apiFlag){
      this.httpService.get('get-suppliers-by-goods/' + stock_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.apiFlag=true;
          suppliers = result.data
        } else {
          console.log("Error in get reorder");
        }
      });
      return suppliers;
    }

  }
  stockOnHand(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].stock_on_hand + form_data.suppliersData[index].unit_name;
  }
  price(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].supplier_price +' ' +this.currency_symbol + '/' + form_data.suppliersData[index].buying_unit;
  }
  unit(index: any) {
    let form_data = this.newOrderForm.value;
    let buyingQty = form_data.suppliersData[index].unit_equals_measurement_unit;
    let uingsubqty = form_data.suppliersData[index].unit_equals_sub_unit;
    let quantity = buyingQty * uingsubqty
    if (quantity > 0) {
      return 1 + " " + form_data.suppliersData[index].buying_unit + '=' + quantity + " " + form_data.suppliersData[index].unit_name
    }
    else {
      return '1 ' + form_data.suppliersData[index].buying_unit + '=' + form_data.suppliersData[index].unit_equals_measurement_unit + form_data.suppliersData[index].unit_name;
    }

  }
  measurementunit(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].buying_unit;
  }
  clearSupplier(index: any) {
    let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
    let form_data = this.newOrderForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.suppliersData[index].stock_id), 1);
    items.removeAt(index);
    this.total_price = 0;
    items.value.forEach((obj: any) => {
      this.total_price = parseFloat(this.total_price) + parseFloat(obj.total)
    });
    if (items.length == 0) {
      this.isItemsSelected = false;
    }
  }


  getSupplier() {
    this.httpService.get('supplier')
      .subscribe(result => {
        if (result.status == 200) {
          const data: any = [];
          this.supplierArrays = result.data.suppliers;

        } else {
          console.log("Error in supplier");
        }
      });
  }
  addSuppliers() {
    const dialogRef = this.dialog.open(AddSupplierComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSupplier();
    });
  }
  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no = "PO_" + date + "." + month + "." + year + "_" + hh + ":" + mm + ":" + ss
  }
  getBranch() {
    this.httpService.get('branches-for-inventory/' + this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }

  getReOrderLevel() {
    let post = {
      branch_id: this.branch_id,
      type: 0
    }
    this.httpService.post('get-reorder-level-items-for-PO', post)
      .subscribe(result => {
        if (result.status == 200) {
          let itemsArray: any = result.data;
          if(itemsArray.length>0){
            this.isItemsSelected = true;
            itemsArray.forEach((element: any) => {
              for(let i=0;i<element.suppliers.length;i++){
                element['suppliers-'+i]=element.suppliers[i]
              }
              element.qty = '';
              element.qtyToMeasurementUnit = '';
              element.total = 0;
              element.supplier_change_flag=0;
              element.supplier_count=element.suppliers.length
              let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
              items.push(this.createSupplierData(element));
              
            });
          }
          else{
            const options = {
              title: 'No Low Stock Items!',
              message: 'It Appears All Your Items Are Above Reorder Level',
              cancelText: 'Close',
              confirmText: 'OK'
            
            };
            this.dialogService.open(options);
          }
        } else {
          console.log("Error in get reorder");
        }
      });
  }
  itemSelected(option: any, input: HTMLInputElement) {
   
    if (option.id) {
      this.getItemsbyID(option.id,null,1)  
    }
    else {
      this.getItemsbyID(option.value.stock_id,option.value.inventory_type,2)
    }
 input.value = '';
    input.blur();
  }

  getItemsbyID(id:any,inventory_type:any,type:any){
    let post:any;
    if(type==1){
      post = {
        supplier_id: id,
       
      }
    }
    else if(type==2){
       post = {
        stock_id: id,
        inventory_type:inventory_type
       
      }
    }
   
    this.httpService.post('get-items-by-stock', post)
      .subscribe(result => {
        if (result.status == 200) {
          let itemsArray: any = result.data;
          this.isItemsSelected = true;
          itemsArray.forEach((element: any) => {
            element.qty = '';
            element.qtyToMeasurementUnit = '';
            element.total = 0;
             let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(element));

            
          });
        } else {
          console.log("Error in get reorder");
        }
      });
  }

  itemName(index: any) {
     let form_data = this.newOrderForm.value;
 
    return form_data.suppliersData[index].label?form_data.suppliersData[index].label:form_data.suppliersData[index].name;
  }
  getSuppliers(suppliersData: any) {

    let supplierName: any
    suppliersData?.forEach((element: any) => {
      supplierName = supplierName ? supplierName + ',' + element.supplier_name : element.supplier_name;
    });
    return supplierName
  }


  findTotal(i: any) {

    let items = this.newOrderForm.value['suppliersData']
    let netQuantity = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0) {

      let unitQty = items[i].unit_equals_measurement_unit
      let openingBalance: any;
      if (items[i].has_sub_unit == 1) {
        let subUnitQty = items[i].unit_equals_sub_unit
        openingBalance = netQuantity * unitQty * subUnitQty
      }
      else {
        openingBalance = netQuantity * unitQty
      }
      items[i].qtyToMeasurementUnit = openingBalance
      //console.log(this.newOrderForm.value['suppliersData'])

      let subTotalItem = (openingBalance * cost).toFixed(2);
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
    }
    else {
      let subTotalItem = 0;
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
    }
  }
  errorMessage(i: any) {
    let form_data = this.newOrderForm.value;
    if (form_data.suppliersData[i].qty >= 0) {
      return ''
    }
    else {
      return 'invalid Quantity'
    }
  }


  subTotal(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].total;
  }
  // findTotal(qty: any, cost: any) {
  //   if (cost && qty) {
  //     this.total = (cost * qty).toFixed(2)
  //   }
  //   else {
  //     this.total = 0;
  //   }
  // }
  back() {
    this.router.navigate(['inventory/purchaseOrders'])
  }
  saveandSendPurchaseOrder() {

    const options = {
      title: 'Send  Purchase Order',
      message: 'Send ' + this.newOrderForm.value['purchase_order_number'] + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.savePurchaseOrder(1);
      }
    });
  }
  savePurchaseOrder(status: any) {
    let items: any = []
    let ingredients: any = [];
    let item = this.newOrderForm.value['suppliersData']

    item.forEach((obj: any) => {
      if (obj.qtyToMeasurementUnit > 0) {
        if (obj.inventory_type == 2) {
          let objData = {
            ingredient_id: obj.id,
            ordered_qty: obj.qtyToMeasurementUnit,
            buying_qty: obj.qty,
            qty:obj.qtyToMeasurementUnit,
            supplier_id:obj.supplier_id,
            line_total:obj.total
          }
          ingredients.push(objData)
        }

        else if (obj.inventory_type == 1) {
          let objData = {
            finished_good_id: obj.id,
            ordered_qty: obj.qtyToMeasurementUnit,
            buying_qty: obj.qty,
            qty:obj.qtyToMeasurementUnit,
            supplier_id:obj.supplier_id,
            line_total:obj.total
          }
          items.push(objData)
        }
      }
    });
   
    
    // item.forEach((obj: any) => {
    //   if(obj.qty>0){
    //   if (obj.stock_type == 2) {
    //     let objData = {
    //       ingredient_id: obj.id,
    //       ordered_qty: obj.qtyToMeasurementUnit?obj.qtyToMeasurementUnit:obj.ordered_quantity,
    //       buying_qty:obj.qty,
    //       supplier_id:obj.supplier_id,
    //       line_total:obj.total
    //     }
    //     ingredients.push(objData)
    //   }
    //   else if (obj.stock_type == 1) {
    //     let objData = {
    //       item_id: obj.id,
    //       ordered_qty: obj.qtyToMeasurementUnit?obj.qtyToMeasurementUnit:obj.ordered_quantity,
    //       buying_qty:obj.qty,
    //       supplier_id:obj.supplier_id,
    //       line_total:obj.total
    //     }
    //     items.push(objData)
    //   }
    // }
    // });
    let arrayLength = parseInt(items.length) + parseInt(ingredients.length)
    if (arrayLength == item.length && item.length > 0) {
      let postParamsSave = {
        purchase_order_number: this.newOrderForm.value['purchase_order_number'],
        comments: this.newOrderForm.value['comments'],
        due_date: this.newOrderForm.value['due_date'],
        supplier_id: this.newOrderForm.value['supplier_id'],
        status: status,
        branch_id: this.branch_id,
        total_amount: this.total_price,
        order_items_list: [{
          items: items,
          ingredients: ingredients
        }]
      }


      this.httpService.put('consignment/' + this.id, postParamsSave)
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Purchase Order Created Successfully ", "Close");

            this.back();
          } else {
            console.log("Error in purchase-order");
          }
        });
    }
    else {
      this.snackBService.openSnackBar("Please Enter Item Quantity", "Close");
    }
  }


}
