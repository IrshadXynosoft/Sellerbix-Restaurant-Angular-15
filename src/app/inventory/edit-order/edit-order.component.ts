import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { formatDate } from '@angular/common' 
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public newOrderForm!: UntypedFormGroup;
  branch_id: any;
  supplier_id: any;
  order_no: any;
  reOrderItemsArray: any = [];
  branchRecords: any = [];
  stockOnHandBranch: any;
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  total_price: any = 0;
  selectedStockIDs: any = [];
  id: any;
  purchaseOrdereArray: any = [];
  todayDate:any=formatDate(new Date(),'yyyy-MM-dd','en');
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id
    this.branch_id = this.route.snapshot.params.branch_id
  }

  ngOnInit(): void {

    this.getBranch();
    this.getItems();
    this.getpurchaseOrder();
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
  getpurchaseOrder() {
    this.httpService.get('consignment/' + this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.purchaseOrderArray = result.data[0];
          this.total_price = this.purchaseOrderArray.total_amount;
          this.supplier_id = this.purchaseOrderArray.supplier_id;
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
              stock_type: 1,
              stock_id: element.stock_id,
              id: element.item_id,
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
              total: total,
              measurement_unit_name: element.measurement_unit_name
            }
             
            let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(objData));
            this.selectedStockIDs.push(element.stock_id);
          });
          this.purchaseOrderArray.ingredient?.forEach((element: any) => {
            let total = (element.qty * element.cost_per_unit).toFixed(2)
            let objData = {
              stock_type: 2,
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
              total: total,
              measurement_unit_name: element.measurement_unit_name
            }
          
            let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
            items.push(this.createSupplierData(objData));
            this.selectedStockIDs.push(element.stock_id);
          });
        } else {
          console.log("Error in Get po");
        }
      });
  }
  branchSelected(id: any, name: any) {
    if (id) {
      this.branch_id = id
      this.branch_selected = true;
      this.newOrderForm.patchValue({
        branch_selected: name
      })
      this.getItems();
    }
  }
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
  getItems() {

    let post = {
      branch_id: this.branch_id,
      type: 0
    }
    this.httpService.post('get-reorder-level-items', post)
      .subscribe(result => {
        if (result.status == 200) {
          this.reOrderItemsArray = result.data;

          this.supplierArray = this.reOrderItemsArray.suppliers;
          this.supplierArray.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
              stock_type: 5
            }
            this.options.push(objData)
          });
          this.finishedGoodArray = this.reOrderItemsArray.finished_good;
          this.finishedGoodArray?.forEach((element: any) => {

            let objData = {
              stock_type: 1,
              stock_id: element.stock_id,
              id: element.finished_good.item_id,
              name: element.finished_good.name,
              stock_on_hand: element.on_hand_qty,
              supplier_name: element.item_supplier[0].supplier_name,
              supplier_id: element.item_supplier[0].supplier_id,
              cost_per_unit: element.cost_per_unit,
              buying_unit: element.purchase_detail.buying_unit,
              unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
              has_sub_unit:element.purchase_detail.has_sub_unit,
              unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
              qty:'',
              qtyToMeasurementUnit:'',
              total: 0,
              measurement_unit_name: element.purchase_detail.measurement_unit_name
            }
            this.options.push(objData)
          });
          this.ingredientArray = this.reOrderItemsArray.ingredients;
          this.ingredientArray.forEach((element: any) => {
            let objData: any;
            if (element.ingredient) {
              if (element.stock_type == 2) {
                let objData = {
                  stock_type: 2,
                  stock_id: element.stock_id,
                  id: element.ingredient.ingredient_id,
                  name: element.ingredient.ingredient_name,
                  stock_on_hand: element.on_hand_qty,
                  supplier_name: element.item_supplier[0].supplier_name,
                  supplier_id: element.item_supplier[0].supplier_id,
                  cost_per_unit: element.cost_per_unit,
                  buying_unit: element.purchase_detail.buying_unit,
                  unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
                  has_sub_unit:element.purchase_detail.has_sub_unit,
                  unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
                  qty:'',
                 qtyToMeasurementUnit:'',
                  total: 0,
                  measurement_unit_name: element.purchase_detail.measurement_unit_name
                }
                this.options.push(objData)
              }

            }
          });
          if (result.data == null) {
            this.showNoReorderItemDialog();
          }

        } else {
          console.log("Error in get reorder");
        }
      });
  }

  pushToArrayFromReorder(items: any) {
    if (this.newOrderForm.value['suppliersData'].length > 0) {
      // this.newOrderForm.value['suppliersData'].forEach((element1: any) => {
      items.forEach((element: any) => {
        if (!this.selectedStockIDs.includes(element.stock_id)) {
          let objData = {
            stock_type: element.stock_type,
            stock_id: element.stock_id,
            id: element.stock_type == 2 ? element.ingredient.ingredient_id : element.finished_good.item_id,
            name: element.stock_type == 2 ? element.ingredient.ingredient_name : element.finished_good.name,
            stock_on_hand: element.on_hand_qty,
            supplier_name: element.item_supplier[0].supplier_name,
            supplier_id: element.item_supplier[0].supplier_id,
            cost_per_unit: element.cost_per_unit,
            buying_unit: element.purchase_detail.buying_unit,
            unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
            has_sub_unit:element.purchase_detail.has_sub_unit,
            unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
            qty:'',
           qtyToMeasurementUnit:'',
            total: 0,
            measurement_unit_name: element.purchase_detail.measurement_unit_name
          }
          let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(objData));
          this.selectedStockIDs.push(element.stock_id);
        } else {
          this.snackBService.openSnackBar("Item already added", "Close")
        }
      });
      // });
    }
    else {
      items.forEach((element: any) => {

        let objData = {
          stock_type: element.stock_type,
          stock_id: element.stock_id,
          id: element.stock_type == 2 ? element.ingredient.ingredient_id : element.finished_good.item_id,
          name: element.stock_type == 2 ? element.ingredient.ingredient_name : element.finished_good.name,
          stock_on_hand: element.on_hand_qty,
          supplier_name: element.item_supplier[0].supplier_name,
          supplier_id: element.item_supplier[0].supplier_id,
          cost_per_unit: element.cost_per_unit,
          buying_unit: element.purchase_detail.buying_unit,
          unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
          has_sub_unit:element.purchase_detail.has_sub_unit,
          unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
          qty:'',
         qtyToMeasurementUnit:'',
          total: 0,
          measurement_unit_name: element.purchase_detail.measurement_unit_name
        }
        let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(objData));
        this.selectedStockIDs.push(element.stock_id);
      });
    }

  }
  pushToArrayFromSupplier(items: any) {


    this.reOrderItemsArray.suppliers_data.forEach((element: any) => {
      element.item_supplier.forEach((element1: any) => {
        if (element1.supplier_id == items.id) {
          this.pushToArrayFromSupplierItems(element);
        }
      });
    });
  }
  pushToArrayFromSupplierItems(element: any) {
    if (this.newOrderForm.value['suppliersData'].length > 0) {

      if (!this.selectedStockIDs.includes(element.stock_id)) {
        let objData = {
          stock_type: element.stock_type,
          stock_id: element.stock_id,
          id: element.stock_type == 2 ? element.ingredient.ingredient_id : element.finished_good.item_id,
          name: element.stock_type == 2 ? element.ingredient.ingredient_name : element.finished_good.name,
          stock_on_hand: element.on_hand_qty,
          supplier_name: element.item_supplier[0].supplier_name,
          supplier_id: element.item_supplier[0].supplier_id,
          cost_per_unit: element.cost_per_unit,
          buying_unit: element.purchase_detail.buying_unit,
          unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
          has_sub_unit:element.purchase_detail.has_sub_unit,
          unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
          qty:'',
          qtyToMeasurementUnit:'',
          total: 0,
          measurement_unit_name: element.purchase_detail.measurement_unit_name
        }
        let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(objData));
        this.selectedStockIDs.push(element.stock_id);
      } else {
        this.snackBService.openSnackBar("Item already added", "Close")
      }

    }
    else {


      let objData = {
        stock_type: element.stock_type,
        stock_id: element.stock_id,
        id: element.stock_type == 2 ? element.ingredient.ingredient_id : element.finished_good.item_id,
        name: element.stock_type == 2 ? element.ingredient.ingredient_name : element.finished_good.name,
        stock_on_hand: element.on_hand_qty,
        supplier_name: element.item_supplier[0].supplier_name,
        supplier_id: element.item_supplier[0].supplier_id,
        cost_per_unit: element.cost_per_unit,
        buying_unit: element.purchase_detail.buying_unit,
        unit_equals_measurement_unit: element.purchase_detail.unit_equals_measurement_unit,
        has_sub_unit:element.purchase_detail.has_sub_unit,
        unit_equals_sub_unit:element.purchase_detail.unit_equals_sub_unit,
        qty:'',
        qtyToMeasurementUnit:'',
        total: 0,
        measurement_unit_name: element.purchase_detail.measurement_unit_name
      }
      let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
      items.push(this.createSupplierData(objData));
      this.selectedStockIDs.push(element.stock_id);

    }

  }

  itemSelected(option: any, input: HTMLInputElement) {
    if (option.stock_type == 5) {
      this.pushToArrayFromSupplier(option)
    }
    else {
      let items = this.newOrderForm.value['suppliersData'];
      if (items.length > 0) {
        if (this.selectedStockIDs.includes(option.stock_id)) {
          this.snackBService.openSnackBar("Item already added", "Close")
        } else {
          let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(option));
          this.selectedStockIDs.push(option.stock_id);
        }
      } else {
        let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
        items.push(this.createSupplierData(option));
        this.selectedStockIDs.push(option.stock_id);
      }

    }

    input.value = '';
    input.blur();
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
  itemName(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].name;
  }
  stockOnHand(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].stock_on_hand+form_data.suppliersData[index].measurement_unit_name ;
  }
  price(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].cost_per_unit + '/' + form_data.suppliersData[index].measurement_unit_name;
  }
  unit(index: any) {
    let form_data = this.newOrderForm.value;
    let buyingQty=form_data.suppliersData[index].unit_equals_measurement_unit;

    let uingsubqty=form_data.suppliersData[index].unit_equals_sub_unit;
    let quantity=buyingQty*uingsubqty
    if(quantity>0)
    {
       return 1+" "+form_data.suppliersData[index].buying_unit+ '=' +quantity+" "+form_data.suppliersData[index].measurement_unit_name
    }
    else{
      return '1 ' + form_data.suppliersData[index].buying_unit + '=' + form_data.suppliersData[index].unit_equals_measurement_unit + form_data.suppliersData[index].measurement_unit_name;
    }
   
  }
  errorMessage(i:any){
    let form_data = this.newOrderForm.value;
    if(form_data.suppliersData[i].qty>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
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
  }
  getReOrderLevel() {

    this.pushToArrayFromReorder(this.reOrderItemsArray.get_data);
  }
  getSuppliers(suppliersData: any) {

    let supplierName: any
    suppliersData?.forEach((element: any) => {
      supplierName = supplierName ? supplierName + ',' + element.supplier_name : element.supplier_name;
    });
    return supplierName
  }

  showNoReorderItemDialog() { }

  findTotal(i: any) {
    let items = this.newOrderForm.value['suppliersData']
    let netQuantity = items[i].qty
    let cost = items[i].cost_per_unit
    if (netQuantity > 0 && cost > 0) {
    
      let unitQty=items[i].unit_equals_measurement_unit
      let openingBalance:any;
     if(items[i].has_sub_unit==1)
     {
      let subUnitQty=items[i].unit_equals_sub_unit
      openingBalance=netQuantity*unitQty*subUnitQty
     }
      else{
        openingBalance=netQuantity*unitQty
      }

      items[i].qtyToMeasurementUnit= openingBalance
      //console.log(this.newOrderForm.value['suppliersData'])
     
      let subTotalItem = (openingBalance * cost).toFixed(2);
      items[i].total = subTotalItem;
      this.total_price = 0;
      items.forEach((obj: any) => {
        this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
      });
     
      
    }
   else{
    let subTotalItem =0;
    items[i].total = subTotalItem;
    this.total_price = 0;
    items.forEach((obj: any) => {
      this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
    });
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
  saveandSendPurchaseOrder(){
    
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
      if(obj.qty>0){
      if (obj.stock_type == 2) {
        let objData = {
          ingredient_id: obj.id,
          ordered_qty: obj.qtyToMeasurementUnit?obj.qtyToMeasurementUnit:obj.ordered_quantity,
          buying_qty:obj.qty,
          supplier_id:obj.supplier_id,
          line_total:obj.total
        }
        ingredients.push(objData)
      }
      else if (obj.stock_type == 1) {
        let objData = {
          item_id: obj.id,
          ordered_qty: obj.qtyToMeasurementUnit?obj.qtyToMeasurementUnit:obj.ordered_quantity,
          buying_qty:obj.qty,
          supplier_id:obj.supplier_id,
          line_total:obj.total
        }
        items.push(objData)
      }
    }
    });

    let arrayLength=parseInt(items.length)+parseInt(ingredients.length)
    if(arrayLength==item.length && item.length>0){
    let postParamsSave = {
      purchase_order_number: this.newOrderForm.value['purchase_order_number'],
      comments: this.newOrderForm.value['comments'],
      due_date: this.newOrderForm.value['due_date'],
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
          this.snackBService.openSnackBar("Purchase Order updated Successfully ", "Close");

          this.back();

        } else {
          console.log("Error in purchase-order");
        }
      });
  }
  }


}
