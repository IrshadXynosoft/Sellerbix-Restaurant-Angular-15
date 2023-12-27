import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { DetailComponent } from '../detail/detail.component';
import { LocalStorage } from '../../_services/localstore.service';
import { PaymentDialogComponent } from 'src/app/home/payment-dialog/payment-dialog.component';
import { DataService } from 'src/app/_services/data.service';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import _ from 'lodash';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  today = new Date().toDateString();
  totalOrdersAmount: any = 0.00;
  totalUnpaid: any = 0.00;
  staff = this.localservice.get('user1');
  public url: string = this.router.url;
  orderNumber: any;
  accept_payment: any = this.localservice.get('accept_payment')
  constructor(private snackBService: SnackBarService, private dataservice: DataService, public localservice: LocalStorage, private router: Router, public dialog: MatDialog, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getOrderdetails();
  }

  details(order: any): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: order
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateOrderRecords(result.order_id, result)
      }
    });
  }

  updateOrderRecords(order_id: any, data: any) {
    // Find item index using _.findIndex
    var index = _.findIndex(this.orderRecords, { order_id: order_id });
    console.log(index)
    console.log(order_id)
    // Replace item at index using native splice
    this.orderRecords.splice(index, 1, data);
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  getOrderdetails() {
    let amount = 0.00;
    let unpaid = 0.00;
    this.httpService.get('current-orders/1', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.orderRecords = result.data;
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status == 1) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            }
            else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          this.orderRecords.reverse();
        } else {
          console.log("Error");
        }
      });

  }

  payOrder(order: any) {
    if (order.order.Cart) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: order.order.Cart,
          orderId: order.order_id,
          invoiceId: order.invoice_id,
          customerid: order.order.customer_id,
          entityid: order.order.entity_id,
          url: this.url,
          customer_details: order.invoice?.customer_details?.phone_number ? order.invoice?.customer_details : order.order.customer_details
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (this.orderNumber) {
          this.searchOrder(this.orderNumber)
        }
        else {
          this.getOrderdetails()
        }
      });
    }
    else {
      this.dataservice.setData('editData', order);
      this.router.navigate(['home/walkin/' + order.order.order_number])
    }
  }

  searchOrder(key: any) {
    if (key.length > 2) {
      this.orderNumber = key;
      this.orderRecords = [];
      let amount = 0.00;
      let unpaid = 0.00;
      let notinvoiced = 0.00;
      this.totalOrdersAmount = null;
      this.totalUnpaid = null;
      this.httpService.get('orderByNumber/1/' + key)
        .subscribe(result => {
          if (result.status == 200) {
            this.orderRecords = result.data;
            this.orderRecords.forEach((obj: any) => {
              if (obj.payment_status == 2) {
                amount += parseFloat(obj.invoice_json?.amount);
                this.totalOrdersAmount = amount.toFixed(2);
              }
              else {
                if (obj.invoice_json != "Not Paid") {
                  unpaid = unpaid + (parseFloat(obj.invoice_json?.amount) - parseFloat(obj.invoice_json?.amount_received));
                }
                else {
                  notinvoiced += parseFloat(obj.order_json.Total)
                }
                this.totalUnpaid = (unpaid + notinvoiced).toFixed(2);
              }
            });
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
    else if (key.length == '') {
      this.orderNumber = null;
      this.getOrderdetails()
    }
  }
}

