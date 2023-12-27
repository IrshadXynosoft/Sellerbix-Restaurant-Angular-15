import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ShowDetailsComponent } from 'src/app/dinein/show-details/show-details.component';
import { ShowCrmDetailsComponent } from 'src/app/crm/show-crm-details/show-crm-details.component';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SelectDriverComponent } from 'src/app/setup/select-driver/select-driver.component';
import { EntityOrdersCancellationComponent } from 'src/app/entity-orders-cancellation/entity-orders-cancellation.component';
import { LabelPrintComponent } from 'src/app/home/label-print/label-print.component';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { Subscription } from 'rxjs';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-entity-orders',
  templateUrl: './entity-orders.component.html',
  styleUrls: ['./entity-orders.component.scss'],
})
export class EntityOrdersComponent implements OnInit {
  @ViewChild('Searchitem') searchItemInput!: ElementRef;
  orderRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  order_cancel_permission = this.localservice.get('order_cancel_permission');
  today = new Date().toDateString();
  totalOrdersAmount: any = 0.0;
  totalUnpaid: any = 0.0;
  staff = this.localservice.get('user1');
  public url: string = this.router.url;
  orderNumber: any;
  branch_id = this.localservice.get('branch_id');
  sum = 0;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  currentPage: number = 1;
  date_current_page: any = 1;
  last_page: number = 1;
  totalCount: any;
  customPreLoader: boolean = false;
  branch_settings: any = this.localservice.get('branch_settings');
  printOffline: any = this.localservice.get('printOffline');
  accept_payment: any = this.localservice.get('accept_payment');
  tabActive: any;
  entityRecords: any;
  entitySelected: any;
  entityName: any;
  dineInMessage: string = 'DineInListener';
  orderListMessage: string = 'OrderListListener';
  orderType: any;
  subscription!: Subscription;
  constructor(
    private printMqtt: PrintMqttService,
    private snackBService: SnackBarService,
    private dataservice: DataService,
    public localservice: LocalStorage,
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private readonly newOrderMqtt: NewOrderService
  ) {}

  ngOnInit(): void {
    this.getEntity();
    this.getOrderdetails(this.currentPage);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscribeToTopic();
  }

  subscribeToTopic() {
    this.subscription = this.newOrderMqtt
      .topic(this.orderListMessage)
      .subscribe((data: IMqttMessage) => {
        this.getOrderdetails(1);
      });
  }

  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt
      .publish(this.dineInMessage, data)
      .subscribe((data: any) => {});
  }

  details(order: any): void {
    if (order.entity_id == 1) {
      const dialogRef = this.dialog.open(DetailComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil') {
          this.updateOrderRecords(
            result.data.id ? result.data.id : result.data.order_id,
            result.data
          );
        } else if (result?.operation == 'void') {
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    } else if (order.entity_id == 2) {
      const dialogRef = this.dialog.open(ShowDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil') {
          this.updateOrderRecords(result.data.order_id, result.data);
        } else if (result?.operation == 'void') {
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    } else {
      let Data = {
        locationDetails: order.order.address,
        customer_id: order.order.customer_id,
        customer_contact_no: order.order.crm_contact_no,
        customer_name: order.order.customer_name,
      };
      const dialogRef = this.dialog.open(ShowCrmDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
          customerData: Data,
          pickup: order.order.store_pickup,
          utensilCrmflag: false,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil' || result?.operation == 'ready') {
          this.updateOrderRecords(result.data.order_id, result.data);
        } else if (result?.operation == 'void') {
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    }
  }

  onScrollDown(ev: any) {
    this.currentPage = this.currentPage + 1;
    if (this.currentPage <= this.last_page) {
      if (this.tabActive == 'Running') {
        this.runningOrders(this.currentPage);
      } else if (this.tabActive == 'All') {
        this.getOrderdetails(this.currentPage);
      } else if (this.tabActive == 'Completed') {
        this.completedOrders(this.currentPage);
      } else if (this.tabActive == 'Void') {
        this.voidOrders(this.currentPage);
      } else if (this.tabActive == 'Refund') {
        this.refundOrders(this.currentPage);
      } else if (this.tabActive == 'Entity') {
        this.entityOrders(
          this.entitySelected,
          this.entityName,
          this.orderType,
          this.currentPage
        );
      }
      this.direction = 'down';
    }
  }

  updateOrderRecords(order_id: any, data: any) {
    // Find item index using _.findIndex
    var index = _.findIndex(this.orderRecords, { order_id: order_id });
    console.log(index);

    // data.entity_name = this.orderRecords[index].entity_name
    // Replace item at index using native splice
    this.orderRecords.splice(index, 1, data);
  }

  orderReady(orders: any) {
    const dialogRef = this.dialog.open(SelectDriverComponent, {
      width: '100%',
      // height : '100%',
      data: {
        driverRecords: [],
        order_id: orders.order_id,
        driver_id: orders.driver_order.driver_order_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateOrderRecords(result.order_id, result);
      }
    });
  }

  dayCheck(day: any) {
    let newDate = moment(day).format('DD-MM-YYYY');
    return newDate;
  }

  getTotal(orders: any) {
    let total: any = '-';
    if (orders.order.Total) {
      total = orders.order.Total;
    }
    return orders.amount != 'Not Paid' ? orders.amount.toFixed(2) : total;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  getEntity() {
    this.httpService.get('entities').subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  getOrderdetails(page_number: number) {
    this.tabActive = 'All';
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    this.httpService
      .get('all-entities-order-list?page=' + page_number)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          console.log('Error');
        }
      });
  }

  entityOrders(id: any, name: any, type: any, page_number: number) {
    this.tabActive = 'Entity';
    this.entitySelected = id;
    this.entityName = name;
    this.orderType = type;
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    let body :any= {
      entity_id: this.entitySelected,
    };
    if(parseInt(this.entitySelected) == 3){      
      body = {
        order_type: type
      }
    }
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          console.log('Error');
        }
      });
  }

  runningOrders(page_number: number) {
    this.searchItemInput.nativeElement.value = '';
    this.tabActive = 'Running';
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    let body = {
      status: 1,
    };
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  completedOrders(page_number: number) {
    this.tabActive = 'Completed';
    this.searchItemInput.nativeElement.value = '';
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    let body = {
      status: 2,
    };
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  voidOrders(page_number: number) {
    this.tabActive = 'Void';
    this.searchItemInput.nativeElement.value = '';
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    let body = {
      status: 4,
    };
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  refundOrders(page_number: number) {
    this.tabActive = 'Refund';
    this.searchItemInput.nativeElement.value = '';
    let amount = 0.0;
    let unpaid = 0.0;
    this.customPreLoader = true;
    let body = {
      status: 6,
    };
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customPreLoader = false;
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // this.orderRecords.reverse();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
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
          entityid: order.entity_id,
          url: this.url,
          customer_details: order.invoice?.customer_details?.phone_number
            ? order.invoice?.customer_details
            : order.order.customer_details,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateOrderRecords(result[0].order_id, result[0]);
          if (order.entity_id == '2') {
            this.publishOrderDineIn();
          }
        }
      });
    } else {
      this.dataservice.setData('editData', order);
      this.router.navigate(['home/walkin/' + order.order.order_number]);
    }
  }

  searchOrder(key: any) {
    if (key.length > 2) {
      this.orderNumber = key;
      this.orderRecords = [];
      let amount = 0.0;
      let unpaid = 0.0;
      let notinvoiced = 0.0;
      this.totalOrdersAmount = null;
      this.totalUnpaid = null;
      this.httpService.get('orderByNumber/1/' + key).subscribe((result) => {
        if (result.status == 200) {
          this.orderRecords = result.data;
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status == 1) {
              amount += parseFloat(obj.invoice_json?.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              if (obj.invoice_json != 'Not Paid') {
                unpaid =
                  unpaid +
                  (parseFloat(obj.invoice_json?.amount) -
                    parseFloat(obj.invoice_json?.amount_received));
              } else {
                notinvoiced += parseFloat(obj.order_json.Total);
              }
              this.totalUnpaid = (unpaid + notinvoiced).toFixed(2);
            }
          });
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
    } else if (key.length == '') {
      this.orderNumber = null;
      this.getOrderdetails(1);
    }
  }

  reprint(Orders: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + Orders.order_id + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Invoice Receipt Generated Successfully!',
              'Close'
            );
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj);
              if (print.status) {
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});
                if (Orders.entity_id == '2') {
                  this.publishOrderDineIn();
                }
              } else {
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      this.httpService
        .get('offline-print/' + Orders.order_id + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  KOTreprint(Orders: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + Orders.order_id + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'KOT Receipt Generated Successfully!',
              'Close'
            );
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj);
              if (print.status) {
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});
              } else {
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      this.httpService
        .get('offline-print/' + Orders.order_id + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  labelPrint(Orders: any) {
    this.httpService
      .get('label-print/' + Orders.order_id)
      .subscribe((result) => {
        if (result.status == 200) {
          if (result.data.length > 0) {
            const dialogRef = this.dialog.open(LabelPrintComponent, {
              width: '350px',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {});
          } else {
            this.snackBService.openSnackBar('No specifications added', 'Close');
          }
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  rejectOrder(Orders: any) {
    const dialogRef = this.dialog.open(EntityOrdersCancellationComponent, {
      width: '500px',
      data: {
        order_id: Orders.order_id,
        payment_status: Orders.payment_status,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var index = _.findIndex(this.orderRecords, { order_id: result });
        this.orderRecords.splice(index, 1);
      }
    });
  }
  reload() {
    this.orderRecords = [];
    this.currentPage = 1;
    this.ngOnInit();
  }
}
