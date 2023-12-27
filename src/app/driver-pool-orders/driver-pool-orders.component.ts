import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { DriverPoolMqttService } from '../_services/mqtt/driver-pool-mqtt.service';
import { RequestDriverPoolOrdersComponent } from './request-driver-pool-orders/request-driver-pool-orders.component';
import { Subscription } from 'rxjs';
import { NotificationListenerComponent } from './notification-listener/notification-listener.component';
import { IMqttMessage } from 'ngx-mqtt';
import { UpdateWalletComponent } from './update-wallet/update-wallet.component';

export interface Orders {
  id: any;
  name: string;
  description: string;
}

@Component({
  selector: 'app-driver-pool-orders',
  templateUrl: './driver-pool-orders.component.html',
  styleUrls: ['./driver-pool-orders.component.scss']
})
export class DriverPoolOrdersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  public displayedColumns: string[] = ['order_no', 'tenant_id', 'branch_id', 'ref_no', 'date', 'time', 'payment_status', 'amount', 'button'];
  public dataSource = new MatTableDataSource<Orders>();
  agentRecords: any = [];
  id = this.route.snapshot.params.id;
  currency_symbol = localStorage.getItem('currency_symbol');
  branchRecords: any;
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = "";
  // orderRecords:any=[];
  pickupOrders: any = [];
  deliveringOrders: any = [];
  newOrders: any = [];
  currentTime: any;
  branch_id = this.localservice.get('branch_id');
  tenant_id = this.localservice.get('tenant_id');
  messageType: string = 'DriverPoolOrder';
  subscription!: Subscription;
  driverAppMessage: any = 'NotificationListener';
  walletAmount:any = 0.00;
  constructor(private readonly driverPoolMqtt: DriverPoolMqttService, private route: ActivatedRoute, private snackBService: SnackBarService, private dialogService: ConfirmationDialogService, private httpService: HttpServiceService, private router: Router, public dialog: MatDialog, private localservice: LocalStorage) { }

  ngOnInit(): void {
    this.getKey()
    this.getOrders()
    this.getBranches()
    this.getPickupDeliveryOrders()
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subscribeToTopic()
  }

  getKey() {
    this.httpService.get('driverpool-key/' + this.branch_id)
      .subscribe(result => {
        if (result.status == 200) {
          this.localservice.store('driverPoolKey', result.data)
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  back() {
    this.router.navigate(['callcenter'])
  }

  reports() {
    this.router.navigate(['driver-pool-orders/reports'])
  }

  subscribeToTopic() {
    this.subscription = this.driverPoolMqtt.topic(this.driverAppMessage)
      .subscribe((data: IMqttMessage) => {
        let item = JSON.parse(data.payload.toString());
        // this.snackBService.openSnackBar('Order No:#' + item.order_no + ' Accepted Successfully!', 'Close')
        const dialogRef = this.dialog.open(NotificationListenerComponent, {
          width: '400px',
          data: {
            order_no: item.order_no,
            status: item.status,
            driver_name: item.driver_name
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getOrders()
          }
        });
      });
  }

  reset() {
    this.deliveringOrders = [];
    this.pickupOrders = [];
    this.current_page = 1;
    this.last_page = 2;
    this.getPickupDeliveryOrders()
    this.getOrders()
  }

  getBranches() {
    this.httpService.get('branch')
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data;
        } else {
          console.log("Error");
        }
      });
  }

  assignDriver(orders: any) {
    let body = {
      order_id: orders.id,
      key: this.localservice.get('driverPoolKey')
    }
    this.httpService.driver_pool_post('assign-order', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close")
          this.reset()
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  async getOrders() {
    let post = {
      branch_id: this.branch_id,
      tenant_id: this.tenant_id
    }
    this.httpService.post('all-delivery-orders', post)
      .subscribe(async result => {
        if (result.status == 200) {
          this.currentTime = moment().format('LT');
          // this.newOrders = result.data.filter(function (element: any) {
          //   return element.driver_order?.driver_status == 1;
          // });          
          this.newOrders = result.data;
        } else {
          console.log(result.message, "Close");
        }
      });
  }

  makeOrderRequest(orders: any) {
    const dialogRef = this.dialog.open(RequestDriverPoolOrdersComponent, {
      width: '1200px',
      data: {
        details: orders
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reset()
        this.publishTopic()
      }
    });
  }

  doFilter(value: any) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  addUpfrontAmount() {
    const dialogRef = this.dialog.open(UpdateWalletComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getOrders()
      }
    });
  }

  async getPickupDeliveryOrders() {
    let body: any = {}
    body.key = this.localservice.get('driverPoolKey');
    this.httpService.driver_pool_post('order-list?page=' + this.current_page, body)
      .subscribe(async result => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;
          this.walletAmount = result.data.data[0]?.branch.wallet;
          if (result.data.data.length > 0) {
            await this.pushToArray(result.data.data);
            if (this.current_page < this.last_page) {
              await this.getIteratedData();
            }
          }
        }
      })
  }
  async pushToArray(params: any) {
    params.forEach(async (obj: any) => {
      if (obj.driver_status == 1 || obj.driver_status == 0) {
        this.pickupOrders.push(obj)
      }
      if (obj.is_order_collected == 1) {
        this.deliveringOrders.push(obj)
      }
    });
  }

  async getIteratedData(initializeCurrentPage = true) {
    this.processingResponseStr = "Processing " + this.current_page + " / " + this.last_page + " please wait";
    if (initializeCurrentPage) {
      this.current_page = 2;
    }
    let body: any = {}
    body.key = this.localservice.get('driverPoolKey');
    this.httpService
      .driver_pool_post('order-list?page=' + this.current_page, body, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.data.length > 0) {
            await this.pushToArray(result.data.data);
          }
        }
        if (this.current_page < this.last_page) {
          this.current_page++;
          this.getIteratedData(false);
        } else {
          this.processingResponseStr = "";
        }
      });
  }

  publishTopic() {
    let data = '{"status": 1}';
    this.driverPoolMqtt.publish(this.messageType, data)
      .subscribe((data: any) => {
      });
  }

}