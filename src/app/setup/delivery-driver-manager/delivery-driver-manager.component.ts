import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { DeliveryShowDetailsComponent } from '../delivery-show-details/delivery-show-details.component';
import { DeliveryShowDriverDetailsComponent } from '../delivery-show-driver-details/delivery-show-driver-details.component';
import { SelectDriverComponent } from '../select-driver/select-driver.component';

@Component({
  selector: 'app-delivery-driver-manager',
  templateUrl: './delivery-driver-manager.component.html',
  styleUrls: ['./delivery-driver-manager.component.scss']
})
export class DeliveryDriverManagerComponent implements OnInit {
  id = this.localservice.get('branch_id');
  driverRecords: any = [];
  OrdersList: any = [];
  newOrdersList: any = [];
  waitingOrdersList: any = [];
  deliveringOrdersList: any = [];
  delieveredOrdersList: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private router: Router, public dialog: MatDialog, private route: ActivatedRoute, private snackBService: SnackBarService, private httpService: HttpServiceService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private localservice: LocalStorage) {
  }

  ngOnInit(): void {

    this.getOrdrs()
  }

  getOrdrs() {
    this.OrdersList = [];
    this.newOrdersList = [];
    this.waitingOrdersList = [];
    this.deliveringOrdersList = [];
    this.delieveredOrdersList = [];
    this.httpService.get('get-all-type-delivery-orders/' + this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.OrdersList = result.data.orders;
          if (this.OrdersList.length > 0) {
            this.OrdersList.forEach((element: any) => {
              if (element.driver_status == 1) {
                this.newOrdersList.push(element)
              }
              if (element.driver_status == 2 || element.driver_status == 3 && element.is_order_collected == 0) {
                this.waitingOrdersList.push(element)
              }
              if (element.driver_status == 3 && element.is_order_collected == 1) {
                this.deliveringOrdersList.push(element)
              }
            });

          }
          this.driverRecords = result.data.drivers_list
        } else {
          console.log("Error in get orders");
        }
      });

  }
  deliveredDriverDetails(driver: any) {
    const dialogRef = this.dialog.open(DeliveryShowDriverDetailsComponent, {
      width: '80%',
      data: {
        itemData: driver,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

  getOrderJson(list: any) {
    let order_json: any
    order_json = JSON.parse(list)
    return order_json.items
  }
  getTotal(list: any) {
    let order_json: any
    order_json = JSON.parse(list)
    return order_json.Total
  }
  getorderNo(list: any) {
    let order_json: any
    order_json = JSON.parse(list)

    return order_json.order_number
  }
  showDetails(list: any) {
    const dialogRef = this.dialog.open(DeliveryShowDetailsComponent, {
      width: '70%',
      data: {
        itemData: list,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }
  OrderReady(item: any) {
    const dialogRef = this.dialog.open(SelectDriverComponent, {
      width: '70%', data: { driverRecords: this.driverRecords, driver_id: item.id, order_id: item.order_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrdrs();
    });

  }
  reassign(item: any) {
    const dialogRef = this.dialog.open(SelectDriverComponent, {
      width: '70%', data: { driverRecords: this.driverRecords, driver_id: item.id, order_id: item.order_id, reassign: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrdrs();
    });
  }
  Orderdelivering(item: any) {
    let params = {
      id: item.id,
      driver_id: item.driver.id,
      status: 3
    }
    this.changeStatus(params)
  }
  Orderdelivered(item: any) {
    let params = {
      id: item.id,
      driver_id: item.driver_id,
      status: 4
    }
    this.changeStatus(params)
  }
  changeStatus(params: any) {

    this.httpService.post('change-driver-order-status', params)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Order Updated Successfully", "Close");
          this.getOrdrs();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  back() {
    this.router.navigate(['setup/delivery_settings'])
  }
  getDeliveryAreaName(item: any) {
    if (item.customer_delivery_location) {
      let areaName: any = item.customer_delivery_location.delivery_area ? item.customer_delivery_location.delivery_area.name : '--'
      return areaName
    }
    return '--'
  }

  getDeliveryArea(item: any) {
    let areaName: any
    // if(item.customer_delivery_location_data){
    //   item.customer_delivery_location_data.forEach((element:any) => {

    //        areaName=areaName?areaName+','+element.delivery_area:element.delivery_area
    //  });

    return item.customer_delivery_location_data ? item.customer_delivery_location_data.delivery_area : '--'
    // }

  }
  reload() {
    this.getOrdrs()
  }
}
