import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import moment from 'moment';
import _ from 'lodash';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';

@Component({
  selector: 'app-complete-orders',
  templateUrl: './complete-orders.component.html',
  styleUrls: ['./complete-orders.component.scss'],
})
export class CompleteOrdersComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  completedOrderRecords: any = [];
  printOffline: any = this.localservice.get('printOffline');
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
  constructor(
    private printMqtt: PrintMqttService,
    private snackBService: SnackBarService,
    private router: Router,
    private httpService: HttpServiceService,
    public dialog: MatDialog,
    private localservice: LocalStorage,
    private readonly newOrderMqtt: NewOrderService
  ) {}

  ngOnInit(): void {
    this.getCompletedOrderdetails(this.currentPage);
  }

  getCompletedOrderdetails(page_number: number) {
    let amount = 0.0;
    let unpaid = 0.0;
    this.httpService
      .get('current-orders/2/2?page=' + page_number)
      .subscribe((result) => {
        if (result.status == 200) {
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;
          if (page_number == 1) {
            this.completedOrderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.completedOrderRecords.push(obj);
            });
          }
          this.completedOrderRecords.forEach((obj: any) => {
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

  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt.publish(this.dineInMessage, data).subscribe((data: any) => {});
  }

  onScrollDown(ev: any) {
    this.currentPage = this.currentPage + 1;
    if (this.currentPage <= this.last_page) {
      this.getCompletedOrderdetails(this.currentPage);
      this.direction = 'down';
    }
  }

  dayCheck(day: any) {
    let newDate = moment(day).format('DD-MM-YYYY');
    return newDate;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
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
        var index = _.findIndex(this.completedOrderRecords, {
          order_id: result.data,
        });
        this.completedOrderRecords.splice(index, 1);
      }
    });
  }

  updateOrderRecords(order_id: any, data: any) {
    // Find item index using _.findIndex
    var index = _.findIndex(this.completedOrderRecords, { order_id: order_id });
    // Replace item at index using native splice
    this.completedOrderRecords.splice(index, 1, data);
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
                this.publishOrderDineIn()
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
