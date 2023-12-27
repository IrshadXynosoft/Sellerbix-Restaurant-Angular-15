import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReturnUtensilComponent } from 'src/app/home/return-utensil/return-utensil.component';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
@Component({
  selector: 'app-advance-promotions-detail',
  templateUrl: './advance-promotions-detail.component.html',
  styleUrls: ['./advance-promotions-detail.component.scss']
})
export class AdvancePromotionsDetailComponent implements OnInit {
  countItems:any;
  receiveItems:any;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    public dialogRef: MatDialogRef<AdvancePromotionsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { detailData: any },
  
  ) { }

  ngOnInit(): void {
     
    this.getNames();
  }
 
  getNames(){
  
    if(this.data.detailData.categories_to_count && this.data.detailData.categories_to_count.length>0)
    {
      let categories_to_count: any = this.data.detailData.categories_to_count;
      categories_to_count.forEach((element: any) => {
       this.countItems=this.countItems?this.countItems+','+element.category.name:element.category.name
      });
    }
    else if(this.data.detailData.products_to_count && this.data.detailData.products_to_count.length>0){
      let products_to_count: any = this.data.detailData.products_to_count;
      products_to_count.forEach((element: any) => {
        this.countItems=this.countItems?this.countItems+','+element.item.name:element.item.name
      });
    }
    if(this.data.detailData.categories_to_receive && this.data.detailData.categories_to_receive.length>0)
    {
      let categories_to_receive: any = this.data.detailData.categories_to_receive;
      categories_to_receive.forEach((element: any) => {
       this.receiveItems=this.receiveItems?this.receiveItems+','+element.category.name:element.category.name
      });
    }
    else if(this.data.detailData.products_to_count && this.data.detailData.products_to_count.length>0){
      let products_to_receive: any = this.data.detailData.products_to_receive;
      products_to_receive.forEach((element: any) => {
        this.receiveItems=this.receiveItems?this.receiveItems+','+element.item.name:element.item.name
      });
    }

   }
  close() {
    this.dialogRef.close();
  }



}

