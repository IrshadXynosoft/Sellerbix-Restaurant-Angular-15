import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ShowDineinMultipleOrdersComponent } from '../show-dinein-multiple-orders/show-dinein-multiple-orders.component';

@Component({
  selector: 'app-move-table',
  templateUrl: './move-table.component.html',
  styleUrls: ['./move-table.component.scss']
})
export class MoveTableComponent implements OnInit {
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
    ) { }

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
    let orderid = this.dataservice.getData('orderId')    
    const body = {
      'order_id': orderid,
      'table_id': tableData.table_id
    }
    this.httpService.post('move-table', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.dataservice.setData('editData', result.data[0])
          this.router.navigate(["home/dinein/" + tableData.table_id + '/' + result.data[0].order_number]);
        } else {
          console.log("Error");
        }
      });
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




//   diningSelected(event: any) {
//     let id = event.target.value;
//     if (id > 0) {
//       this.availableTableArray = [];
//       this.diningSectionRecords.forEach((element: any) => {
//         element.branch_dining_table.forEach((obj: any) => {
//           if (element.dinning_section_id == id && !obj.orders) {
//             this.availableTableArray = element.branch_dining_table;
//           }
//         })
//       });
//     }
//   }

//   moveTable(id: any) {
//     let orderid = this.dataservice.getData('orderId')
//     const body = {
//       'order_id': orderid,
//       'table_id': id
//     }
//     this.httpService.post('move-table', body)
//       .subscribe(result => {
//         if (result.status == 200) {
//           this.dataservice.setData('editData', result.data[0])
//           this.router.navigate(["home/dinein/" + id + '/' + result.data[0].order_number]);
//         } else {
//           console.log("Error");
//         }
//       });
//   }
// }
