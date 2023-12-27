import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { DeliveryShowDetailsComponent } from '../delivery-show-details/delivery-show-details.component';

@Component({
  selector: 'app-delivery-show-driver-details',
  templateUrl: './delivery-show-driver-details.component.html',
  styleUrls: ['./delivery-show-driver-details.component.scss'],
})
export class DeliveryShowDriverDetailsComponent implements OnInit {
  branch_id: any;
  itemArray: any = [];
  tempItemArray:any=[];
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeliveryShowDriverDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { itemData:any },
    private localService: LocalStorage
  ) {
    this.branch_id = this.localService.get('branch_id');
  }

  ngOnInit(): void { 
    this.tempItemArray=this.data.itemData.driver_order_data;
    this.tempItemArray.forEach((element:any) => {
      if(element.driver_status==4){
        this.itemArray.push(element)
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  showDetails(list:any,index:any){

    const dialogRef = this.dialog.open(DeliveryShowDetailsComponent, {
      width: '70%',
      data:{
        itemData:list.orders_json,
        customerData:this.data.itemData.customer_delivery_location_data
       }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
    
  }
  getOrderNumber(item:any){
    let orderData=JSON.parse(item)
    return orderData.order_number
  }
}
