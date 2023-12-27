import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { DataService } from '../_services/data.service';
import { LocalStorage } from '../_services/localstore.service';
import { ShowDineinMultipleOrdersComponent } from './show-dinein-multiple-orders/show-dinein-multiple-orders.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectWaiterComponent } from '../home/select-waiter/select-waiter.component';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { NewOrderService } from '../_services/mqtt/new-order-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-dinein',
  templateUrl: './dinein.component.html',
  styleUrls: ['./dinein.component.scss'],
})
export class DineinComponent implements OnInit {
  diningSectionRecords: any = [];

  tableRecords: any = [];
  availableCount: any = 0;
  occupiedCount: any = 0;
  dropdownContent: boolean = false;
  branch_id = this.localservice.get('branch_id');
  assignWaiter: any = this.localservice.get('branch_settings')?.assign_waiter;
  subscription!: Subscription;
  dineInMessage: string = 'DineInListener';
  constructor(
    private localservice: LocalStorage,
    private dataservice: DataService,
    private router: Router,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private dialog: MatDialog,
    private readonly newOrderMqtt: NewOrderService
  ) {}

  ngOnInit(): void {
    this.getTableOrders();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscribeToTopic();
  }

  getTableOrders() {
    this.httpService
      .get('table-orders/' + this.branch_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.diningSectionRecords = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  reload() {
    this.ngOnInit();
  }

  getColor(table: any) {
    if (table.orders) {
      if (table.orders[0].inv_print_count > 0) {
        return 'select-tag-yellow';
      } else {
        return 'select-tag-grey';
      }
    } else {
      return 'select-tag-green';
    }
  }
  checkDinningStatus(diningTableArray: any) {
    this.occupiedCount = 0;
    this.availableCount = 0;
    if (
      diningTableArray.branch_dining_table &&
      diningTableArray.branch_dining_table.length > 0
    ) {
      diningTableArray.branch_dining_table.forEach((item: any) => {
        if (item.orders) {
          this.occupiedCount++;
        } else {
          this.availableCount++;
        }
      });
    }
    return this.availableCount;
  }
  onTableClick(tableData: any) {
    this.dataservice.setData('tableName', tableData.name);
    // if (this.assignWaiter == 1 || this.assignWaiter == true) {
    //   const dialogRef = this.dialog.open(SelectWaiterComponent, {
    //     width: '600px',
    //   });
    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       this.dataservice.setData('waiterId', result.id)
    //       this.dataservice.setData('waiterName', result.name)
    //       this.router.navigate(['home/dinein/' + tableData.table_id]);
    //     }
    //   });
    // }
    // else {
    this.router.navigate(['home/dinein/' + tableData.table_id]);
    // }
  }
  // onOrderIdClick(table: any, orderno: any, tableid: any, orders: any, orderid: any) {
  //   let data = {
  //     order: orders.order,
  //     order_id: orderid
  //   }
  //   this.dataservice.setData('tableName', table.name)
  //   this.dataservice.setData('discount', orders?.order?.discount)
  //   this.dataservice.setData('surcharge', orders?.order?.surcharge)
  //   this.dataservice.setData('editData', data)
  //   this.router.navigate(['home/dinein/' + tableid + '/' + orderno]);
  // }
  allTables() {
    this.router.navigate(['dinein']);
  }
  runningOrders() {
    this.router.navigate(['dinein/runningOrders']);
  }
  completedOrders() {
    this.router.navigate(['dinein/completeOrders']);
  }
  tableReservations() {
    this.router.navigate(['dinein/tableReservations']);
  }
  showDeopdownContent(table: any) {
    // this.dropdownContent = id;
    const dialogRef = this.dialog.open(ShowDineinMultipleOrdersComponent, {
      width: '600px',
      data: {
        table: table,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  close() {
    this.dropdownContent = false;
  }

  subscribeToTopic() {
    this.subscription = this.newOrderMqtt
      .topic(this.dineInMessage)
      .subscribe((data: IMqttMessage) => {
        this.getTableOrders();
      });
  }
}
