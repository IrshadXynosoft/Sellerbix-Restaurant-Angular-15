import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import { SelectWaiterComponent } from 'src/app/home/select-waiter/select-waiter.component';

@Component({
  selector: 'app-show-dinein-multiple-orders',
  templateUrl: './show-dinein-multiple-orders.component.html',
  styleUrls: ['./show-dinein-multiple-orders.component.scss']
})
export class ShowDineinMultipleOrdersComponent implements OnInit {
  assignWaiter: any = this.localservice.get('branch_settings')?.assign_waiter;
  staff = this.localservice.get('user1');
  printOffline: any = this.localservice.get('printOffline');
  dineInMessage: string = 'DineInListener';
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    public dialogRef: MatDialogRef<ShowDineinMultipleOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { table: any },
    private localservice: LocalStorage,
    private dataservice: DataService,
    private router: Router,
    private snackBService: SnackBarService,
    private printMqtt: PrintMqttService,
    private readonly newOrderMqtt: NewOrderService
  ) { }

  ngOnInit(): void {
    console.log(this.data.table);
    
  }

  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt.publish(this.dineInMessage, data).subscribe((data: any) => {});
  }

  close() {
    this.dialogRef.close();
  }

  onOrderIdClick(orders: any) {
    let data = {
      order: orders.order,
      order_id: orders.id
    }
    this.dataservice.setData('tableName', this.data.table.name)
    this.dataservice.setData('discount', orders?.order?.discount);
    this.dataservice.setData('surcharge', orders?.order?.surcharge)
    this.dataservice.setData('editData', data);
    this.close()
    this.router.navigate(['home/dinein/' + this.data.table.table_id + '/' + orders.order_number]);
  }

  splitTable() {
    this.dataservice.setData('tableName', this.data.table.name)
    // if (this.assignWaiter == 1 || this.assignWaiter == true) {
    //   const dialogRef = this.dialog.open(SelectWaiterComponent, {
    //     width: '600px',
    //   });
    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       this.dataservice.setData('waiterId', result.id)
    //       this.dataservice.setData('waiterName', result.name);
    //       this.close()
    //       this.router.navigate(["home/dinein/" + this.data.table.table_id]);
    //     }
    //   });
    // }
    // else {
    this.close()
    this.router.navigate(["home/dinein/" + this.data.table.table_id]);
    // }
  }

  reprint(orderid: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (this.printOffline == null || this.printOffline == undefined || this.printOffline == false) {
      this.httpService.get('receipt/' + orderid + '/1')
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Kot Receipt Generated Successfully!", "Close");
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj)
              if (print.status) {
                this.printMqtt.publish('print', print.printObj)
                  .subscribe((data: any) => {
                  });
              }
              else {
                this.snackBService.openSnackBar(print.message, "Close")
              }
            });
          } else {
            this.snackBService.openSnackBar("Error!", "Close");
          }
        });
    }
    else {
      this.httpService.get('offline-print/' + orderid + '/1')
        .subscribe(result => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm', data: { 'printData': result.data }
            });

            dialogRef.afterClosed().subscribe(result => {
            });

          }
        });
    }
  }

  Invoicereprint(orderid: any) {
    this.printOffline = this.localservice.get('printOffline');
    if (this.printOffline == null || this.printOffline == undefined || this.printOffline == false) {
      this.httpService.get('receipt/' + orderid + '/0')
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Invoice Receipt Generated Successfully!", "Close");
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj)
              if (print.status) {
                this.printMqtt.publish('print', print.printObj)
                  .subscribe((data: any) => {
                  });
                  this.dialogRef.close();
                  this.publishOrderDineIn()
              }
              else {
                this.snackBService.openSnackBar(print.message, "Close")
              }
            });
          } else {
            this.snackBService.openSnackBar("Error!", "Close");
          }
        });
    }
    else {
      this.httpService.get('offline-print/' + orderid + '/0')
        .subscribe(result => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm', data: { 'printData': result.data }
            });

            dialogRef.afterClosed().subscribe(result => {
            });

          }
        });
    }
  }
}
