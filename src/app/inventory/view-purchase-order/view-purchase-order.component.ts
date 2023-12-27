import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  styleUrls: ['./view-purchase-order.component.scss']
})
export class ViewPurchaseOrderComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  orderArray: any = []
  purchase_order_number: any;
  comments: any;
  due_date: any;
  branch: any;
  total_price: any;
  ViewPOArray: any = [];
  isSupplierPrice: boolean = true;
  supplier:any;
  constructor(private dataservice: DataService, private route: ActivatedRoute, private httpService: HttpServiceService, private snackBService: SnackBarService, private router: Router,) { }

  ngOnInit(): void {
    this.getOrderDetails()
  }
  getOrderDetails() {
    this.httpService.get('purchase-order/' + this.route.snapshot.params.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.orderArray = result.data[0];

          this.purchase_order_number = this.orderArray.purchase_order_number;
          this.due_date = this.orderArray.due_date;
          this.comments = this.orderArray.comments;
          this.branch = this.orderArray.branch
          this.total_price = this.orderArray.total_amount.toFixed(2);
          this.supplier=this.orderArray.supplier_name;
          this.orderArray.ingredient?.forEach((element: any) => {
            this.ViewPOArray.push(element);
          });
          this.orderArray.purchase_order_item?.forEach((element: any) => {
            this.ViewPOArray.push(element);
          });
        } else {
          console.log("Error in purchase order");
        }
      });

  }
  findOpeningBalance(item: any) {
    let opening = (item.on_hand_qty).toFixed(2)
    let qty = (item.qty).toFixed(2)
    // let unitValue:any=item.unit_equals_measurement_unit * item.qty;
    if (item.received_qty == 0) {
      return parseFloat(opening) + ' ' + item.measurement_unit_name
    }
    else {
      let closingBalance = parseFloat(opening) - parseFloat(qty) + ' ' + item.measurement_unit_name
      return closingBalance;

    }

  }

  back() {
    this.router.navigate(['inventory/purchaseOrders'])
  }
  findTotal(item: any) {
 
    let total: any;
    if (item.received_buying_qty > 0) {
      total = item.received_price * item.received_buying_qty
    }
    else {
        total=item.buying_qty*item.supplier_price
    }
    return (total).toFixed(2);
  }
  getSupplierPrice(price: any, unit: any) {
    if (price > 0) {
      this.isSupplierPrice = true
      return price + ' ' + this.currency_symbol + '/' + unit;
    }
    else {
      this.isSupplierPrice = false
      return '-'
    }
  }
}
