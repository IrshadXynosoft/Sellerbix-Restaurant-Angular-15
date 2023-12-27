import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

@Component({
  selector: 'app-delivery-show-details',
  templateUrl: './delivery-show-details.component.html',
  styleUrls: ['./delivery-show-details.component.scss']
})
export class DeliveryShowDetailsComponent implements OnInit {
 showReceipt: boolean = true;
  showHistory: boolean = false;
  staff=this.localservice.get('user1');
  currency_symbol = localStorage.getItem('currency_symbol');
  itemList:any=[];
  total_price:any;
  constructor(
    public dialog: MatDialog,
    public httpService:HttpServiceService,
    private snackBService: SnackBarService,
    public dialogRef: MatDialogRef<DeliveryShowDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemData: any,customerData:any },
    private localservice:LocalStorage,
    private dataservice:DataService ,private router:Router
  ) {}

  ngOnInit(): void {    
  
    
    let items=this.data.itemData.order?this.data.itemData.order.order_json:this.data.itemData
   this.itemList=(JSON.parse(items))
   
  }
  showReceiptTag() {
    this.showReceipt = true;
    this.showHistory = false;
  }
  showHistoryTag() {
    this.showReceipt = false;
    this.showHistory = true;
  }
  close() {
    this.dialogRef.close();
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

}

