import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OnlineOrderCancellationReasonComponent } from '../online-order-cancellation-reason/online-order-cancellation-reason.component';
import { DetailComponent } from '../walkin/detail/detail.component';
import { DataService } from '../_services/data.service';
import { HttpServiceService } from '../_services/http-service.service';
import { LocalStorage } from '../_services/localstore.service';
import { PrintMqttService } from '../_services/mqtt/print-mqtt.service';
import { SnackBarService } from '../_services/snack-bar.service';

@Component({
  selector: 'app-eorder-confirmation',
  templateUrl: './eorder-confirmation.component.html',
  styleUrls: ['./eorder-confirmation.component.scss']
})
export class EorderConfirmationComponent implements OnInit {
  staff=this.localservice.get('user1');
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_id = this.localservice.get('branch_id');
  customerAddress:any;
  audio:any;
  constructor(private printMqtt:PrintMqttService,private snackBService: SnackBarService,private httpService:HttpServiceService,private localservice:LocalStorage, private dataservice:DataService ,private router:Router ,@Inject(MAT_DIALOG_DATA) public data: { Orders: any },public dialog: MatDialog, public dialogRef: MatDialogRef<DetailComponent>) { 
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void { 
    this.customerAddress=this.data.Orders.driver_order?.customer_delivery_location;
    this.audio = new Audio();
    this.audio.src = 'assets/audio/track1.mpeg';
    this.audio.load();
    this.audio.play();
  }

  ngOnDestroy(): void{
    this.audio.pause();
  }

 close() {
  this.dialogRef.close();
 }
 acceptOrder(){
  let postParams:any={
   customer_id:this.data.Orders.order.customer_id,
   order_id:this.data.Orders.order_id,
   branch_id:this.branch_id
  }
  this.httpService.post('online/accept-eorder',postParams)
  .subscribe(result => {
    if (result.status == 200) {
      this.printKOTorInvoice(result.data);
      this.snackBService.openSnackBar(result.message, "Close");
      this.close();
     } else {
      this.snackBService.openSnackBar(result.message, "Close");
    }
  });

 }
 printKOTorInvoice(data: any) {
  data.forEach((obj: any) => {
    let print = this.printMqtt.checkPrinterAvailablity(obj);
    if (print.status) {
      this.printMqtt
        .publish('print', print.printObj)
        .subscribe((data: any) => {});
    } else {
      this.snackBService.openSnackBar(print.message, 'Close');
    }
  });
}
 rejectOreder(){
  const dialogRef = this.dialog.open(OnlineOrderCancellationReasonComponent, {
    width: '500px',data: { 'order_id': this.data.Orders.order_id }
  });

  dialogRef.afterClosed().subscribe(result => {
    this.close();
  });
}

modifiercheck(modifierList:any) {
    let flag = false;
    for(let list of modifierList){
      if (list.status) {
        flag =  true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }
  reprint() {
    this.httpService.get('receipt/' + this.data.Orders.order_id + '/0')
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("Invoice Receipt Generated Successfully!", "Close");
        this.close();
        
        result.data.forEach((obj:any) => {
          let print= this.printMqtt.checkPrinterAvailablity(obj)
          if(print.status){
          this.printMqtt.publish('print', print.printObj)
            .subscribe((data: any) => {
            });
          }
          else {
            this.snackBService.openSnackBar(print.message,"Close")
          }
        });
        
      } else {
        this.snackBService.openSnackBar("Error!", "Close");
      }
    });
  }

  KOTreprint() {
    this.httpService.get('receipt/' + this.data.Orders.order_id +'/1')
    .subscribe(result => {
      if (result.status == 200) {
        this.snackBService.openSnackBar("KOT Receipt Generated Successfully!", "Close");
        this.close();
        
        result.data.forEach((obj:any) => {
          let print= this.printMqtt.checkPrinterAvailablity(obj)
            if(print.status){
            this.printMqtt.publish('print', print.printObj)
              .subscribe((data: any) => {
              });
            }
            else {
              this.snackBService.openSnackBar(print.message,"Close")
            }
          });
      } else {
        this.snackBService.openSnackBar("Error!", "Close");
      }
    });
  }
}