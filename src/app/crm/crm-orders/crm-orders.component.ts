import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from '../../_services/localstore.service';
import { DataService } from 'src/app/_services/data.service';
import { ShowCrmDetailsComponent } from '../show-crm-details/show-crm-details.component';
import * as moment from 'moment';
import { PaymentDialogComponent } from 'src/app/home/payment-dialog/payment-dialog.component';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import _ from 'lodash';

@Component({
  selector: 'app-crm-orders',
  templateUrl: './crm-orders.component.html',
  styleUrls: ['./crm-orders.component.scss']
})
export class CrmOrdersComponent implements OnInit {
  orderRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  today = new Date().toDateString();
  totalOrdersAmount: any = 0.00;
  totalUnpaid: any = 0.00;
  staff = this.localservice.get('user1');
  branch_id = this.localservice.get('branch_id');
  public url: string = this.router.url;
  orderNumber: any;
  accept_payment: any = this.localservice.get('accept_payment')
  constructor(private snackBService: SnackBarService, private dataservice: DataService, public localservice: LocalStorage, private router: Router, public dialog: MatDialog, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getOrderdetails();
  }

  details(orderData: any): void {
    let Data = {
      locationDetails: orderData.order.address,
      customer_id: orderData.order.customer_id,
      customer_contact_no: orderData.order.crm_contact_no,
      customer_name: orderData.order.customer_name
    }
    const dialogRef = this.dialog.open(ShowCrmDetailsComponent, {
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orderData,
        customerData: Data,
        pickup: orderData.order.store_pickup,
        utensilCrmflag: true
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
    // Replace item at index using native splice
    this.orderRecords.splice(index, 1, data);
  }

  addedAmount(total: any, advance: any) {
    let amount = (parseFloat(total) + parseFloat(advance)).toFixed(2);
    return amount;
  }
  getOrderdetails() {
    let amount = 0.00;
    let unpaid = 0.00;
    this.httpService.get('orders-from-crm/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.orderRecords = result.data;
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status == 1) {
              amount += parseFloat(obj.invoice.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            }
            else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
        } else {
          console.log("Error");
        }
      });
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
      this.httpService.get('orderByNumber/3/' + key)
        .subscribe(result => {
          if (result.status == 200) {
            this.orderRecords = result.data;
            this.orderRecords.forEach((obj: any) => {
              if (obj.payment_status == 1) {
                amount += parseFloat(obj.invoice.amount);
                this.totalOrdersAmount = amount.toFixed(2);
              }
              else {
                if (obj.invoice != "Not Paid") {
                  unpaid = unpaid + (parseFloat(obj.invoice.amount) - parseFloat(obj.invoice.amount_received));
                }
                else {
                  notinvoiced += parseFloat(obj.order.Total)
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

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  payOrder(orderData: any) {
    if (orderData.order.Cart) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: orderData.order.Cart,
          orderId: orderData.order_id,
          invoiceId: orderData.invoice_id,
          customerid: orderData.order.customer_id,
          entityid: orderData.order.entity_id,
          url: this.url,
          customer_details: orderData.order.customer_details.phone_number ? orderData.order.customer_details : orderData.invoice.customer_details
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
      let Data = {
        locationDetails: orderData.order.address ? orderData.order.address : {
          id: orderData.order.address_id,
          branch_id: orderData.order.branch_id,
          branch_name: orderData.branch_name,
        },
        customer_id: orderData.order.customer_id,
        customer_contact_no: orderData.order.crm_contact_no ? orderData.order.crm_contact_no : orderData.order.customer_details.phone_number,
        customer_name: orderData.order.customer_name
      }
      this.dataservice.setData('Crmdetails', Data);
      this.dataservice.setData('editData', orderData);
      if (orderData.order.store_pickup) {
        this.router.navigate(['home/crm/pickup/edit_order/' + orderData.order_number])
      }
      else {
        this.router.navigate(['home/crm/edit_order/' + orderData.order_number])
      }
    }
  }
}
