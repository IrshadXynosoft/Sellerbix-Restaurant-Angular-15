import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import _ from 'lodash';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import { PaymentDialogComponent } from 'src/app/home/payment-dialog/payment-dialog.component';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import moment from 'moment';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { ListTablesModalComponent } from '../list-tables-modal/list-tables-modal.component';

@Component({
  selector: 'app-running-orders',
  templateUrl: './running-orders.component.html',
  styleUrls: ['./running-orders.component.scss'],
})
export class RunningOrdersComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  runningOrderRecords: any = [];
  public url: string = this.router.url;
  printOffline: any = this.localservice.get('printOffline');
  accept_payment: any = this.localservice.get('accept_payment');
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
  totalOrdersAmount: any = 0.0;
  totalUnpaid: any = 0.0;
  dineInMessage: string = 'DineInListener';
  selectedOrders: any = [];
  constructor(
    private printMqtt: PrintMqttService,
    private snackBService: SnackBarService,
    private dataservice: DataService,
    private httpService: HttpServiceService,
    private router: Router,
    public dialog: MatDialog,
    private localservice: LocalStorage,
    private readonly newOrderMqtt: NewOrderService,
    private dialogService: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    this.getOrderdetails(1);
  }

  getOrderdetails(page_number: number) {
    let amount = 0.0;
    let unpaid = 0.0;
    this.httpService
      .get('current-orders/2/1?page=' + page_number)
      .subscribe((result) => {
        if (result.status == 200) {
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.runningOrderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.runningOrderRecords.push(obj);
            });
          }
          this.runningOrderRecords.forEach((obj: any) => {
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

  onScrollDown(ev: any) {
    this.currentPage = this.currentPage + 1;
    if (this.currentPage <= this.last_page) {
      this.getOrderdetails(this.currentPage);
      this.direction = 'down';
    }
  }

  checkboxChange(e: any, orders: any) {
    if (e.checked) {
      this.selectedOrders.push({
        order_id: orders.order_id,
        table_id: orders.order.table_id,
        table_name: orders.order.table_name,
        items: orders.order.items,
      });
    } else {
      const indexToRemove = this.selectedOrders.findIndex(
        (selectedOrder: { order_id: any }) =>
          selectedOrder.order_id === orders.order_id
      );
      if (indexToRemove !== -1) {
        this.selectedOrders.splice(indexToRemove, 1);
      }
    }    
  }

  mergeOrders() {
    const options = {
      title: 'Merge Orders',
      message: 'Are you sure you want to merge these orders ?',
      cancelText: 'NO',
      confirmText: 'YES',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        const dialogRef = this.dialog.open(ListTablesModalComponent, {
          width: '80%',
          maxHeight: '100%',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if(result) {
            const extractedItemsArrays = this.selectedOrders.map((order: { items: any; }) => order.items);
            const mergedItemsArray = [].concat(...extractedItemsArrays);
            const extractedIdArrays = this.selectedOrders.map((order: { order_id: any; }) => order.order_id);
            const mergedIdArray = [].concat(...extractedIdArrays);
            this.dataservice.setData('tableName', result.tableName);
            this.dataservice.setData('editData', mergedItemsArray);
            this.dataservice.setData('merged_order_ids', mergedIdArray);
            this.router.navigate(['home/dinein/' + result.table_id]);
          }
        });
      }
    });
  }

  reload() {
    this.ngOnInit();
  }

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
  showDetails(orders: any): void {
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orders,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.operation == 'utensil') {
        this.updateOrderRecords(result.data.order_id, result.data);
      } else if (result?.operation == 'void') {
        var index = _.findIndex(this.runningOrderRecords, {
          order_id: result.data,
        });
        this.runningOrderRecords.splice(index, 1);
      }
    });
  }

  updateOrderRecords(order_id: any, data: any) {
    // Find item index using _.findIndex
    var index = _.findIndex(this.runningOrderRecords, { order_id: order_id });
    // Replace item at index using native splice
    this.runningOrderRecords.splice(index, 1, data);
  }

  dayCheck(day: any) {
    let newDate = moment(day).format('DD-MM-YYYY');
    return newDate;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  makepayment(orders: any) {
    if (orders.order.Cart) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: orders.order.Cart,
          orderId: orders.order_id,
          invoiceId: orders.invoice_id,
          customerid: orders.order.customer_id,
          entityid: orders.order.entity_id,
          url: this.url,
          customer_details: orders.order.customer_details,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.publishOrderDineIn();
          this.getOrderdetails(1);
        }
      });
    } else {
      this.dataservice.setData('editData', orders);
      this.router.navigate([
        'home/dinein/' + orders.order.table_id + '/' + orders.order_number,
      ]);
    }
  }

  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt
      .publish(this.dineInMessage, data)
      .subscribe((data: any) => {});
  }

  reprint(orderid: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService.get('receipt/' + orderid + '/1').subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Kot Receipt Generated Successfully!',
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
        .get('offline-print/' + orderid + '/1')
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

  Invoicereprint(orderid: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService.get('receipt/' + orderid + '/0').subscribe((result) => {
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
              this.publishOrderDineIn();
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
        .get('offline-print/' + orderid + '/0')
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
}
