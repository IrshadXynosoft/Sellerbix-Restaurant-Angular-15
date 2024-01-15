import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import { LabelPrintComponent } from 'src/app/home/label-print/label-print.component';
import { ReturnUtensilComponent } from 'src/app/home/return-utensil/return-utensil.component';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EntityOrdersCancellationComponent } from 'src/app/entity-orders-cancellation/entity-orders-cancellation.component';
import { SelectDriverComponent } from 'src/app/setup/select-driver/select-driver.component';
import moment from 'moment';
import { SplitBillComponent } from 'src/app/home/split-bill/split-bill.component';

@Component({
  selector: 'app-show-crm-details',
  templateUrl: './show-crm-details.component.html',
  styleUrls: ['./show-crm-details.component.scss'],
})
export class ShowCrmDetailsComponent implements OnInit {
  showReceipt: boolean = true;
  showHistory: boolean = false;
  customPreLoader: boolean = false;
  orderRecords: any = [];
  selectedIds: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  // staff = this.localservice.get('user1');
  printOffline: any = this.localservice.get('printOffline');
  branch_settings: any = this.localservice.get('branch_settings');
  order_cancel_permission = this.localservice.get('order_cancel_permission');
  constructor(
    private localservice: LocalStorage,
    private printMqtt: PrintMqttService,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private router: Router,
    private dataservice: DataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ShowCrmDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Orders: any;
      customerData: any;
      pickup: any;
      utensilCrmflag: any;
    }
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.customPreLoader = true;
    this.httpService
      .get('orderByNumber/1/' + this.data.Orders.order.order_number, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.orderRecords = result.data[0];
          this.customPreLoader = false;
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  splitBill() {
    const dialogRef = this.dialog.open(SplitBillComponent, {
      // maxWidth: '100vw',
      width: '90%',
      // panelClass: 'full-screen-modal',
      data: {
        editData: this.orderRecords,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  close() {
    this.dialogRef.close();
  }
  modifyOrder() {
    if (this.orderRecords.entity_id == 9) {
      let obj: any = {
        id: this.orderRecords.order.price_plan_id,
        name: this.orderRecords.order.price_plan_name,
      };
      this.dataservice.setData('pricePlan', obj);
      this.dataservice.setData(
        'CustomEntityOrderNO',
        this.orderRecords.order.entity_order_no
      );
      this.router.navigate([
        'home/b-b/editOrder/' + this.orderRecords.order_number,
      ]);
    } else if (this.orderRecords.entity_id == 8) {
      this.router.navigate([
        'home/party_orders/modify_order/' + this.orderRecords.order_number,
      ]);
    } else {
      if (this.data.pickup) {
        this.router.navigate([
          'home/crm/pickup/edit_order/' + this.orderRecords.order_number,
        ]);
      } else {
        this.router.navigate([
          'home/crm/edit_order/' + this.orderRecords.order_number,
        ]);
      }
    }
    this.close();
  }

  orderHistory() {
    this.close();
    this.router.navigate([
      'walkin/entity-orders/order-history/' + this.data.Orders.order_id,
    ]);
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

  labelPrint() {
    this.httpService
      .get('label-print/' + this.data.Orders.order_id)
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

  returnUtensil(item: any) {
    const dialogRef = this.dialog.open(ReturnUtensilComponent, {
      width: '50%',
      maxHeight: '70%',
      data: {
        order_id: this.data.Orders.order_id,
        utensil_id: item.id,
        max_qty: item.qty,
        crm_flag: this.data.Orders.order.entity_id == 3 ? true : false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let data: any = {
          operation: 'utensil',
          data: result,
        };
        this.dialogRef.close(data);
      }
    });
  }

  reprint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.data.Orders.order_id + '/0', false)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Invoice Receipt Generated Successfully!',
              'Close'
            );
            this.close();
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
        .get('offline-print/' + this.data.Orders.order_id + '/0')
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

  KOTreprint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.data.Orders.order_id + '/1', false)
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'KOT Receipt Generated Successfully!',
              'Close'
            );
            this.close();
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
        .get('offline-print/' + this.data.Orders.order_id + '/1')
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
        let data: any = {
          operation: 'void',
          data: result,
        };
        this.dialogRef.close(data);
      }
    });
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
        let data: any = {
          operation: 'ready',
          data: result,
        };
        this.dialogRef.close(data);
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
      this.selectedIds = this.orderRecords?.order?.items.map(
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
    return this.selectedIds.length === this.orderRecords?.order?.items.length;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'H:mm').format('h:mm a');
    return newTime;
  }

  kotReprintSelected() {
    let body = {
      order_id: this.orderRecords.order_id,
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
}
