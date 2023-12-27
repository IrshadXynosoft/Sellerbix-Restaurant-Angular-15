import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { elementAt, map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-receive-purchase-order',
  templateUrl: './receive-purchase-order.component.html',
  styleUrls: ['./receive-purchase-order.component.scss']
})
export class ReceivePurchaseOrderComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public newOrderForm!: UntypedFormGroup;
  branch_id: any;
  branchRecords: any = [];
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  purchase_order_number:any;
  comments:any;
  branch:any;
  total_price: any = 0;
  supplier_name:any;
  supplier_id:any;
 
  constructor(private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {

    this.getPurchaseOrder(this.route.snapshot.params.id)
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
  getPurchaseOrder(id:any){
    this.httpService.get('purchase-order/'+id)
    .subscribe(result => {
      if (result.status == 200) {
         this.purchaseOrderArray=result.data
         this.purchase_order_number=this.purchaseOrderArray[0].purchase_order_number
         this.branch=this.purchaseOrderArray[0].branch
         this.comments=this.purchaseOrderArray[0].comments
         this.supplier_name=this.purchaseOrderArray[0].supplier_name
         this.supplier_id=this.purchaseOrderArray[0].supplier_id
         this.purchaseOrderArray[0].purchase_order_item?.forEach((element:any) => {
          let netQuantity = element.buying_qty
          let cost = element.supplier_price
          let openingBalance:any='';
          if (netQuantity > 0 && cost > 0) {
          
            let unitQty=element.unit_equals_measurement_unit
           
           if(element.has_sub_unit==1)
           {
            let subUnitQty=element.unit_equals_sub_unit
            openingBalance=netQuantity*unitQty*subUnitQty
           }
            else{
              openingBalance=netQuantity*unitQty
            }
            element.qtyToMeasurementUnit= openingBalance
            //console.log(this.newOrderForm.value['suppliersData'])
           
            //let subTotalItem = (openingBalance * cost).toFixed(2);
            let subTotalItem = (netQuantity * cost).toFixed(2);
            element.total = subTotalItem;
            element.total1 = (cost / openingBalance).toFixed(2);
            
          }
          let objData = {
            stock_type: 1,
            id: element.finished_good_id,
            name: element.name,
            stock_on_hand: element.on_hand_qty,
            supplier_name: element.prev_supplier,
            supplier_id:element.supplier_id,
            cost_per_unit: element.cost_per_unit,
            buying_unit: element.buying_unit,
            has_sub_unit:element.has_sub_unit,
            unit_equals_measurement_unit: element.unit_equals_measurement_unit,
            unit_equals_sub_unit:element.unit_equals_sub_unit,
            deliver_to:this.branch,
            ordered_quantity:element.qty,
            qty:element.buying_qty,
            total: (element.buying_qty*element.supplier_price).toFixed(2),
            total1:element.total1,
            receiving_price:element.supplier_price,
            buying_qty:element.buying_qty,
            qtyToMeasurementUnit:openingBalance,
            measurement_unit_name: element.measurement_unit_name,
            cost_per_unit_type:1
          }
          let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(objData));
         });
         this.purchaseOrderArray[0].ingredient?.forEach((element:any) => {
          let netQuantity = element.buying_qty
          let cost = element.supplier_price
          let openingBalance:any='';
          if (netQuantity > 0 && cost > 0) {
          
            let unitQty=element.unit_equals_measurement_unit
           
           if(element.has_sub_unit==1)
           {
            let subUnitQty=element.unit_equals_sub_unit
            openingBalance=netQuantity*unitQty*subUnitQty
           }
            else{
              openingBalance=netQuantity*unitQty
            }
            element.qtyToMeasurementUnit= openingBalance
            //console.log(this.newOrderForm.value['suppliersData'])
           
            //let subTotalItem = (openingBalance * cost).toFixed(2);
            let subTotalItem = (netQuantity * cost).toFixed(2);
            element.total = subTotalItem;
            element.total1 = (cost / openingBalance).toFixed(2);
          }
          let objData = {
            stock_type: 2,
            id: element.id,
            name: element.name,
            stock_on_hand: element.on_hand_qty,
            supplier_name: element.prev_supplier,
            cost_per_unit: element.cost_per_unit,
            buying_unit: element.buying_unit,
            has_sub_unit:element.has_sub_unit,
            unit_equals_measurement_unit: element.unit_equals_measurement_unit,
            unit_equals_sub_unit:element.unit_equals_sub_unit,
            deliver_to:this.branch,
            ordered_quantity:element.qty,
            supplier_id:element.supplier_id,
            qty: element.buying_qty,
            total:  (element.buying_qty*element.supplier_price).toFixed(2),
            total1:element.total1,
            receiving_price:element.supplier_price,
            qtyToMeasurementUnit:openingBalance,
            buying_qty:element.buying_qty,
            measurement_unit_name: element.measurement_unit_name,
            cost_per_unit_type:1
          }
          let items = this.newOrderForm.get('suppliersData') as UntypedFormArray;
          items.push(this.createSupplierData(objData));
         
         });
         let item = this.newOrderForm.value['suppliersData']
         this.total_price = 0;
           item.forEach((obj: any) => {
             this.total_price = (parseFloat(this.total_price) + parseFloat(obj.total)).toFixed(2)
           });
        } else {
        console.log("Error in purchase order");
      }
    });
  }

  onBuildForm() {
    this.newOrderForm = this.formBuilder.group({
      receive_purchase_order_number: [''],
       suppliersData: new UntypedFormArray([]),

    });
    
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
  errorMessageforPrice(i:any){
    let form_data = this.newOrderForm.value;
    if(form_data.suppliersData[i].receiving_price>=0 ){
      return ''
    }
  else{
    return 'invalid Quantity'
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
    return form_data.suppliersData[index].supplier_name?form_data.suppliersData[index].supplier_name:'--';
  }
  cost(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].cost_per_unit+' '+this.currency_symbol+ '/' + form_data.suppliersData[index].measurement_unit_name;
  }
  itemName(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].name;
  }
  onChangecostUnitType(event:any,index:any){

    let items: any = this.newOrderForm.get('suppliersData') as UntypedFormArray;
    items.at(index).get('cost_per_unit_type').setValue(event.value);
    this.findTotal(index)

    
  }
  stockOnHand(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].stock_on_hand+' '+form_data.suppliersData[index].measurement_unit_name 
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
  measurementunit1(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].measurement_unit_name;
  }
  measurementunit(index: any) {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].buying_unit;
  }
  deliverTo(index:any)
  {
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].deliver_to;
  }
  receivingQuantity(index:any){
    let form_data = this.newOrderForm.value;
    return form_data.suppliersData[index].buying_qty+' '+form_data.suppliersData[index].buying_unit;
  
  }
  closingBalance(index:any){
    let form_data = this.newOrderForm.value;
    let opening=(form_data.suppliersData[index].stock_on_hand).toFixed(2)
    let qty=form_data.suppliersData[index].qty
    let buyingQty=form_data.suppliersData[index].unit_equals_measurement_unit;
   
    let quantity:any;
    if(form_data.suppliersData[index].has_sub_unit)
    {
      let uingsubqty=form_data.suppliersData[index].unit_equals_sub_unit;
      quantity=(buyingQty*uingsubqty*qty).toFixed(2)
    }
    else{
      quantity=(buyingQty*qty).toFixed(2)
    }
   return parseFloat(quantity)+parseFloat(opening)+' '+form_data.suppliersData[index].measurement_unit_name
    
   

    
  }

  findTotal(i: any) {
    let items = this.newOrderForm.value['suppliersData']
    let netQuantity = items[i].qty
    let cost = items[i].receiving_price
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
     
      //let subTotalItem = (openingBalance * cost).toFixed(2);
      let subTotalItem = (netQuantity * cost).toFixed(2);
      items[i].total = subTotalItem;
      items[i].total1 = (cost / openingBalance).toFixed(2);
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
  receivePurchaseOrder() {
    const options = {
      title: 'Receive Purchase Order',
      message: 'Are you sure to receive-'+this.purchase_order_number+' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        if(this.purchase_order_number==this.newOrderForm.value['receive_purchase_order_number'])
        {
    
          let items: any = []
          let ingredients: any = [];
          let item = this.newOrderForm.value['suppliersData']
          item.forEach((obj: any) => {
            if(obj.qty>0 && obj.receiving_price>0){
            let unit_price:any;
            //unit_price=(obj.total1 /obj.qtyToMeasurementUnit).toFixed(2);
            if (obj.stock_type == 2) {
              let objData = {
                ingredient_id: obj.id,
                buying_qty:obj.buying_qty,
                received_buying_qty:obj.qty,
                ordered_qty:obj.ordered_quantity,
                received_qty: obj.qtyToMeasurementUnit,
                received_price:obj.receiving_price,
                cost_per_unit:obj.total1,
                supplier_id:obj.supplier_id,
                cost_per_unit_type:obj.cost_per_unit_type,
                line_total:obj.total
              }
              ingredients.push(objData)
            }
            else if (obj.stock_type == 1) {
              let objData = {
                finished_good_id: obj.id,
                buying_qty:obj.buying_qty,
                received_buying_qty:obj.qty,
                ordered_qty:obj.ordered_quantity,
                received_qty: obj.qtyToMeasurementUnit,
                received_price:obj.receiving_price,
                cost_per_unit:obj.total1,
                supplier_id:obj.supplier_id,
                cost_per_unit_type:obj.cost_per_unit_type,
                line_total:obj.total
              }
              items.push(objData)
            }
            }
          });
      
          let arrayLength=parseInt(items.length)+parseInt(ingredients.length)
          if(arrayLength==item.length && item.length>0){
          let postParamsSave = {
            id:this.route.snapshot.params.id,
            supplier_id:this.supplier_id,
            purchase_order_number: this.purchase_order_number,
            comments: this.comments,
            due_date: this.purchaseOrderArray[0].due_date,
            total_amount: this.total_price,
            status: 2,
            is_approval:1,
            branch_id: this.purchaseOrderArray[0].branch_id,
            order_items_list: [{
              items: items,
              ingredients: ingredients
            }]
          }
          console.log(postParamsSave);
          
          this.httpService.put('purchase-order/'+this.route.snapshot.params.id, postParamsSave)
            .subscribe(result => {
              if (result.status == 200) {
                this.snackBService.openSnackBar("Purchase Order Received Successfully ", "Close");
             
                this.back();
      
              } else {
                console.log("Error in recieve purchase-order");
              }
            });
         }
         else
         {
          this.snackBService.openSnackBar("Quantity or price required to receive order", "Close");
         }
      }
      else{
        this.snackBService.openSnackBar("Invoice/Ref No should be same as purchase order number", "Close");
      }
      }
    })
 
  
  }


}

