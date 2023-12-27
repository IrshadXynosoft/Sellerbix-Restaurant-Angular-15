import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from '../../_services/localstore.service';
import { DataService } from 'src/app/_services/data.service';
import { BulkOrderDetailsComponent } from '../bulk-order-details/bulk-order-details.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-bulk-orders-list',
  templateUrl: './bulk-orders-list.component.html',
  styleUrls: ['./bulk-orders-list.component.scss'],
})
export class BulkOrdersListComponent implements OnInit {
  orderRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  today = new Date().toDateString();
  staff = this.localservice.get('user1');
  branch_id = this.localservice.get('branch_id');
  constructor(
    private dataservice: DataService,
    public localservice: LocalStorage,
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService
  ) {}

  ngOnInit(): void {
    this.getOrderdetails();
  }

  // details(order:any): void {
  //   const dialogRef = this.dialog.open(DetailComponent, {
  //     width: '70%',
  //     data: {
  //       Orders:order
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

  getOrderdetails() {
    this.httpService
      .get('get-bulk-order/' + this.branch_id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.orderRecords = result.data;

          this.orderRecords.reverse();
        } else {
          console.log('Error');
        }
      });
  }

  ModifyOrder(orders: any) {
    let partyDetails = {
      branch_id: orders.branch_id,
      order_type: orders.delivery_type,
      date: orders.delivery_date,
      event: orders.event,
      branch_name: orders.booking_order_json.branch_name,
      pax_no: orders.booking_order_json.pax_no,
    };
    let Data = {
      customer_id: orders.customer_id,
      customer_contact_no:
        orders.booking_order_json.customer_details.phone_number,
      customer_name: orders.customer_name,
      id: orders.bulk_order_id,
      party_details: partyDetails,
    };
    if (orders.booking_order_json.address) {
      let locationDetails = {
        locationDetails: {
          id: orders.booking_order_json.address.id,
          country_id: orders.booking_order_json.address.country_id,
          building_or_villa:
            orders.booking_order_json.address.building_or_villa,
          country_name: orders.booking_order_json.address.country_name,
          street: orders.booking_order_json.address.street,
        },
      };
      this.dataservice.setData('Address', locationDetails);
    } else {
      this.dataservice.setData('Address', null);
    }
    this.dataservice.setData('editData', orders.booking_order_json.items);
    this.dataservice.setData('Crmdetails', Data);
    this.dataservice.setData(
      'advancepayment',
      orders.payment_order_json?.amount_received
    );
    this.router.navigate(['party_orders/edit_order']);
  }

  BulkOrders(orders: any) {
    let partyDetails = {
      branch_id: orders.branch_id,
      order_type: orders.delivery_type,
      date: orders.delivery_date,
      event: orders.event,
      branch_name: orders.booking_order_json.branch_name,
      pax_no: orders.booking_order_json.pax_no,
    };
    let Data: any = {
      customer_id: orders.customer_id,
      customer_contact_no:
        orders.booking_order_json.customer_details.phone_number,
      customer_name: orders.customer_name,
      id: orders.bulk_order_id,
      party_details: partyDetails,
    };
    if (orders.booking_order_json.address) {
      Data.locationDetails = {
        id: orders.booking_order_json.address.id,
        country_id: orders.booking_order_json.address.country_id,
        building_or_villa: orders.booking_order_json.address.building_or_villa,
        country_name: orders.booking_order_json.address.country_name,
        street: orders.booking_order_json.address.street,
      };
    }
    this.dataservice.setData('editData', orders.booking_order_json.items);
    this.dataservice.setData('Crmdetails', Data);
    this.dataservice.setData(
      'advancepayment',
      orders.payment_order_json?.amount_received
    );
    this.dataservice.setData('tableid', orders.booking_order_json.table_id);
    this.router.navigate(['home/party_orders/confirm_order']);
  }

  deleteOrder(order: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.httpService
        .delete('bulk-order/' + order.bulk_order_id)
        .subscribe((result) => {
          if (result.status == 200) {
            this.getOrderdetails()
          } else {
            console.log('Error');
          }
        });
      }
    });
  }

  details(order: any): void {
    const dialogRef = this.dialog.open(BulkOrderDetailsComponent, {
      width: '70%',
      data: {
        Orders: order,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
