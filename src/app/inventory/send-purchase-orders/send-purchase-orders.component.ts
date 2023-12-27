import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-send-purchase-orders',
  templateUrl: './send-purchase-orders.component.html',
  styleUrls: ['./send-purchase-orders.component.scss']
})
export class SendPurchaseOrdersComponent implements OnInit {
  purchaseOrderArray:any=[]
  purchase_order_number:any
  supplier_name:any;
  supplier_email:any
  supplier_id:any;
  branch:any;
  subjectLine:any;
  note:any;
  type:any=this.route.snapshot.params.type;
  sendAddress:any;
  constructor(private router:Router,private route:ActivatedRoute,private httpService: HttpServiceService, private snackBService: SnackBarService,) { 
      
  }

  ngOnInit(): void {
 
     this.getPurchaseOrder();
  }
  previewOrder(){
    this.router.navigate(['inventory/previewpurchaseOrders'])
  }
  getPurchaseOrder(){
    let url:any=this.type==1?'consignment/'+this.route.snapshot.params.id:'purchase-order/'+this.route.snapshot.params.id
    this.httpService.get(url)
    .subscribe(result => {
      if (result.status == 200) {
         this.purchaseOrderArray=result.data[0]
         this.purchase_order_number=this.purchaseOrderArray.purchase_order_number
         this.branch=this.purchaseOrderArray.branch
         this.subjectLine='Purchase Order '+this.purchase_order_number+': '+this.branch
         if(this.type==2){
          this.supplier_id=this.purchaseOrderArray.supplier_id
          this.getsupplier(this.supplier_id)
         }
        else{
          let supplier_ids:any=[]
          this.purchaseOrderArray.purchase_order_item?.forEach((element: any) => {
            if (!supplier_ids.includes(element.supplier_id)) {
              supplier_ids.push(element.supplier_id);
              this.sendAddress=this.sendAddress?this.sendAddress+ ','+element.supplier_name + ' < '+element.supplier_email+' >':element.supplier_name + ' < '+element.supplier_email+' >'
            }
             });
           this.purchaseOrderArray.ingredient?.forEach((obj: any) => {
          
            if (!supplier_ids.includes(obj.supplier_id)) {
              supplier_ids.push(obj.supplier_id);
              this.sendAddress=this.sendAddress?this.sendAddress+ ','+obj.supplier_name + ' < '+obj.supplier_email+' >':obj.supplier_name + ' < '+obj.supplier_email+' >'
            }
           });
        }
        //  let supplierId:any;
        //  supplierId=this.purchaseOrderArray.purchase_order_item[0]?this.purchaseOrderArray.purchase_order_item[0].supplier_id:this.purchaseOrderArray.ingredient[0]?.supplier_id
        
        } else {
        console.log("Error in purchase order");
      }
    });
  }
  getsupplier(supplierId:any)
  {
    this.httpService.get('supplier/' + supplierId)
    .subscribe(result => {
      if (result.status == 200) {
       let supplierArray = result.data;
        this.supplier_name=supplierArray.name,
        this.supplier_email=supplierArray.email
        this.sendAddress= this.supplier_name + ' < '+this.supplier_email+' >'
       } else {
        console.log("Error in supplier");
      }
    });
  }
  back() {
    this.router.navigate(['inventory/purchaseOrders'])
  }
  sendPurchaseOrder()
  {
    let items: any = [];
    let ingredients: any = [];
    let url:any=this.type==1?'consignment/'+this.route.snapshot.params.id:'purchase-order/'+this.route.snapshot.params.id
    this.purchaseOrderArray.purchase_order_item?.forEach((element: any) => {
     
      
      let total=element.qty * element.cost_per_unit
      let objFinishedGood = {
        finished_good_id: element.finished_good_id,
        ordered_qty: element.qty,
        buying_qty:element.buying_qty,
        qty: element.qty,
        supplier_id:element.supplier_id,
        line_total:element.line_total,
        cost_per_unit_type:0
      }
      
      items.push(objFinishedGood)
     });
     this.purchaseOrderArray.ingredient?.forEach((obj: any) => {
    
      let total=obj.qty * obj.cost_per_unit
      let objIngredient = {
        ingredient_id: obj.id,
        ordered_qty: obj.qty,
        buying_qty:obj.buying_qty,
        qty: obj.qty,
        supplier_id:obj.supplier_id,
        line_total:obj.line_total,
        cost_per_unit_type:0
      }
      
      ingredients.push(objIngredient)
     });
   
     

    let postParamsSave = {
      id:this.route.snapshot.params.id,
      supplier_id:this.supplier_id,
      purchase_order_number: this.purchase_order_number,
      comments: this.purchaseOrderArray.comments,
      due_date: this.purchaseOrderArray.due_date,
      status: 1,
      branch_id: this.purchaseOrderArray.branch_id,
      total_amount: this.purchaseOrderArray.total_amount,
      order_items_list: [{
        items: items,
        ingredients: ingredients
      }],
      note:this.note,
      subject:this.subjectLine
    }
    
    this.httpService.put(url, postParamsSave)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Your Purchase Order was successfully processed and is now being sent", "Close");
         
          this.back();
      
        } else {
          console.log("Error in purchase-order");
        }
      });
  }

  }

