import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Subscription } from 'rxjs';
import { KotMqttService } from '../_services/mqtt/kot-mqtt.service';
import { IMqttMessage } from "ngx-mqtt";
import { AnyRecord } from 'dns';
import { ShowNoteComponent } from '../show-note/show-note.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuStatusChangeComponent } from './menu-status-change/menu-status-change.component';
import _ from 'lodash';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {
  orderList: any = []
  NewOrderList: any = []
  FinishedOrderList: any = []
  ProcessingOrderList: any = []
  filteredOrderList: any = []
  index_item_order_done: any
  className: any;
  entitiesArray: any = [{ id: 1, name: 'walk-in' }, { id: 2, name: 'dine-in' }, { id: 3, name: 'crm' }, { id: 4, name: 'take-away' }, { id: 5, name: 'e-order' }]
  entityName: any;
  modifiername: any;
  messageType: string = 'kot';
  subscription!: Subscription;
  heading = '';
  currentOrderStatus: any;
  audio: any;
  constructor(public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private readonly kotMqtt: KotMqttService,) {
    this.className = 'item';
  }

  ngOnInit(): void {
    this.getOrders();
    this.audio = new Audio();
    this.audio.src = 'assets/audio/driver.wav';
  }

  ngAfterViewInit(): void {
    this.subscribeToTopic();
  }

  getOrders() {
    this.orderList = [];
    this.filteredOrderList = []
    this.httpService.get('kitchen-orders')
      .subscribe(result => {
        if (result.status == 200) {
          this.orderList = result.data;
          this.heading = 'All';
          this.currentOrderStatus = 1;
          this.filteredOrderList = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  reload() {
    this.filteredOrderList = [];
    this.ngOnInit()
  }
  getNewOrders() {
    this.currentOrderStatus = 2;
    this.heading = 'New';
    this.filteredOrderList = [];
    this.filteredOrderList = this.orderList.filter(function (element: any) {
      return element.kitchen_status == 0;
    });
  }

  getProcessingOrders() {
    this.currentOrderStatus = 3;
    this.heading = 'Processing';
    this.filteredOrderList = [];
    this.filteredOrderList = this.orderList.filter(function (element: any) {
      return (element.kitchen_status == 1 || element.kitchen_status == 2);
    });
  }

  getFinishedOrders() {
    this.currentOrderStatus = 4;
    this.heading = 'Finished';
    this.filteredOrderList = [];
    this.filteredOrderList = this.orderList.filter(function (element: any) {
      return element.kitchen_status == 3;
    });
  }

  updatedOrders(status: any) {
    switch (status) {
      case 1:
        // this.getOrders()
        break;
      case 2:
        this.getNewOrders()
        break;
      case 3:
        this.getProcessingOrders()
        break;
      case 4:
        this.getFinishedOrders()
    }
  }

  openItemNote(items: any, flag: any) {
    if (flag == 'item') {
      const dialogRef = this.dialog.open(ShowNoteComponent, {
        width: '500px',
        data: {
          name: items.item.name,
          note: items.note,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    else {
      const dialogRef = this.dialog.open(ShowNoteComponent, {
        width: '500px',
        data: {
          name: items.order_number,
          note: items.notes,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }


  itemStatus(item: any, status: any) {
    let body = {
      kitchen_status: status
    }
    this.httpService.post('kitchen-order-item/' + item.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          item.kitchen_status = status;
          this.updatedOrders(this.currentOrderStatus);
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  checkAllItemsDone(order: any) {
    let flag = false;
    if (order.kitchen_status == 3) {
      flag = false;
    }
    else {
      const allEqual = order.order_item.every((element: any) => element.kitchen_status == 1);
      if (allEqual) {
        flag = true;
      }
    }
    return flag;
  }

  getListNames(modifiers: any) {
    let modifierName: any;
    modifiers?.forEach((modifier: any) => {
      // if (modifier.status) {
      modifierName = modifierName ? modifierName + ',' + modifier.modifier.name : modifier.modifier.name;
      // }
    });
    return modifierName
  }

  getEntity(entity_id: any) {
    this.entitiesArray.forEach((obj: any) => {
      if (obj.id == entity_id) {
        this.entityName = obj.name
      }
    });
    return this.entityName;
  }
  getEntities() {
    this.httpService.get('entity')
      .subscribe(result => {
        if (result.status == 200) {
        } else {
          console.log("Error in entity");
        }
      });
  }

  updateStatus(index: any) {
    let body = {
      kitchen_status: this.orderList[index].kitchen_status
    }
    this.httpService.post('kitchen-order/' + this.orderList[index].id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.updateOrderRecords(result.data.id, result.data)
        } else {
          console.log("Error");
        }
      });
  }

  updateOrderRecords(order_id: any, data: any) {
    // Find item index using _.findIndex
    console.log(this.filteredOrderList, this.currentOrderStatus);
    var index = _.findIndex(this.filteredOrderList, { id: order_id });
    console.log(index)
    console.log(order_id)
    // Replace item at index using native splice
    this.filteredOrderList.splice(index, 1, data);
    this.updatedOrders(this.currentOrderStatus)
  }


  startProecessingIndex(order: any) {
    let index = this.orderList.indexOf(order)
    this.orderList[index].kitchen_status = 1;
    // this.publishTopic();
    this.updateStatus(index)
  }

  checkStatusColour(index: any) {
    if (this.filteredOrderList[index].kitchen_status == 3) {
      return "active2";
    } else if (this.filteredOrderList[index].kitchen_status == 0) {
      return "active1";
    }
    return 'wow';
  }

  FinishProecessing(order: any) {
    let index = this.orderList.indexOf(order)
    this.orderList[index].kitchen_status = 3;
    let order_id = this.orderList[index].order_id
    // this.publishTopic();
    this.updateStatus(index)
    // this.updatedOrders(this.currentOrderStatus);
  }

  subscribeToTopic() {
    this.subscription = this.kotMqtt.topic(this.messageType)
      .subscribe((data: IMqttMessage) => {
        this.getOrders()
        this.audio.load();
        this.audio.play();
        this.snackBService.openSnackBar("New Order Recieved", "Close")
      });
  }

  publishTopic() {
    let data = '{"status": 1}';
    this.kotMqtt.publish(this.messageType, data)
      .subscribe((data: any) => {
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  scrollDown() {
    window.scrollBy(0, 100)
  }
  scrollUp() {
    window.scrollBy(0, -100)
  }

  menuStatusChange() {
    const dialogRef = this.dialog.open(MenuStatusChangeComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
