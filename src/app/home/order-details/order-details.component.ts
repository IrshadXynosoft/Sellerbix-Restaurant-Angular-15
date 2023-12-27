import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ShowDetailsComponent } from 'src/app/dinein/show-details/show-details.component';
import { ReturnUtensilComponent } from '../return-utensil/return-utensil.component';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { LabelPrintComponent } from '../label-print/label-print.component';
import { InvoiceKotPrintComponent } from '../invoice-kot-print/invoice-kot-print.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  staff = this.localservice.get('user1');
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_settings: any = this.localservice.get('branch_settings');
  printOffline: any = this.localservice.get('printOffline');
  accept_payment: any = this.localservice.get('accept_payment');
  dineInMessage: string = 'DineInListener';
  orderListMessage: string = 'OrderListListener';
  selectedIds: any = [];
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialogRef: MatDialogRef<ShowDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Orders: any },
    private localservice: LocalStorage,
    private dataservice: DataService,
    private router: Router,
    private printMqtt: PrintMqttService,
    private readonly newOrderMqtt: NewOrderService
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close('closed');
  }
  modifiercheck(modifierList: any) {
    let flag = false;
    for (let list of modifierList) {
      if (list.status) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  orderHistory() {
    this.dialogRef.close();
    this.router.navigate([
      'walkin/entity-orders/order-history/' + this.data.Orders.id,
    ]);
  }

  returnUtensil(item: any) {
    const dialogRef = this.dialog.open(ReturnUtensilComponent, {
      width: '50%',
      maxHeight: '70%',
      data: {
        order_id: this.data.Orders.id,
        utensil_id: item.id,
        max_qty: item.qty,
        crm_flag: this.data.Orders.order.entity_id == 3 ? true : false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(result);
      }
    });
  }

  editOrder() {
    if (this.data.Orders.entity_id == '1') {
      this.router.navigate([
        'home/walkin/' + this.data.Orders.order.order_number,
      ]);
    } else if (this.data.Orders.entity_id == '2') {
      this.dataservice.setData('tableName', this.data.Orders.order?.table_name);
      this.router.navigate([
        'home/dinein/' +
          this.data.Orders.order.table_id +
          '/' +
          this.data.Orders.order_number,
      ]);
    } else if (this.data.Orders.entity_id == '9') {
      this.router.navigate([
        'home/b-b/editOrder/' + this.data.Orders.order_number,
      ]);
    } else if (this.data.Orders.entity_id == '8') {
      this.router.navigate(['home/party_orders/modify_order/' + this.data.Orders.order_number])
    }
    this.dialogRef.close('modify');
  }

  kotPrint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.data.Orders.id + '/1')
        .subscribe((result) => {
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
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      this.httpService
        .get('offline-print/' + this.data.Orders.id + '/1')
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

  labelPrint() {
    this.httpService
      .get('label-print/' + this.data.Orders.id)
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

  invoiceReprint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.data.Orders.id + '/0')
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
                if (this.data.Orders.entity_id == '2') {
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
        .get('offline-print/' + this.data.Orders.id + '/0')
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

  makePayment() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        Cart: this.data.Orders.order.Cart,
        orderId: this.data.Orders.id,
        invoiceId: null,
        customerid: this.data.Orders.order.customer_id,
        entityid: this.data.Orders.entity_id,
        customer_details: this.data.Orders.order.customer_details,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.data.Orders.entity_id == '2') {
          this.publishOrderDineIn();
        }
        this.publishOrderForOrderList();
        this.close();
      }
    });
  }

  publishOrderForOrderList() {
    //mqtt call for orderlist display
    let data = 'orderlist';
    this.newOrderMqtt
      .publish(this.orderListMessage, data)
      .subscribe((data: any) => {});
  }

  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt
      .publish(this.dineInMessage, data)
      .subscribe((data: any) => {});
  }

  kotReprintSelected() {
    let body = {
      order_id: this.data.Orders.id,
      items: this.selectedIds,
    };
    this.httpService.post('kot-reprint', body).subscribe((result) => {
      if (result.status == 200) {
        this.snackBService.openSnackBar(result.message, 'Close');
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
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  selectionChange(event: any, id: any) {
    if (event.checked) {
      this.selectedIds.push(id);
    } else {
      const index = this.selectedIds.indexOf(id);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
  }

  selectAll(event: any) {
    if (event.checked) {
      this.selectedIds = this.data.Orders?.order?.items.map(
        (item: { id: any }) => item.id
      );
    } else {
      this.selectedIds = [];
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }

  // Check if all items are selected
  isAllSelected(): boolean {
    return this.selectedIds.length === this.data.Orders?.order?.items.length;
  }
}
