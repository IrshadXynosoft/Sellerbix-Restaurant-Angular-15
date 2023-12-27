import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSalesTaxComponent } from '../add-sales-tax/add-sales-tax.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { EditSalesTaxComponent } from '../edit-sales-tax/edit-sales-tax.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddCouponComponent } from '../add-coupon/add-coupon.component';
import moment from 'moment';
import { AddAdvaneDiscountComponent } from '../add-advane-discount/add-advane-discount.component';
import { AdvancePromotionsDetailComponent } from '../advance-promotions-detail/advance-promotions-detail.component';
export interface Promotion{
  id:any,
  promotion_title:any,
  promotion_type:any,
  trigger_type:any,
  applies_to:any,
  offer_start_date:any,
  offer_end_date:any,
  discount_type:any,
  discount_value:any,
  is_repeat:any;
  purchase_qty:any;
  receive_qty:any;
  status:any;
  min_qty:any;
  max_qty:any;
  categories_to_count:any;
  categories_to_receive:any;
  products_to_count:any;
  products_to_receive:any;
}

@Component({
  selector: 'app-advane-discount',
  templateUrl: './advane-discount.component.html',
  styleUrls: ['./advane-discount.component.scss']
})
export class AdvaneDiscountComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index','promotion_title', 'promotion_type','applies_to','offer_start_date','offer_end_date','is_repeat','status','button'];
  public dataSource = new MatTableDataSource<Promotion>();
  promotionArray: any = []
  id:any;
  branch_id:any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
    this.branch_id=this.localService.get('branch_id') 
   }
  ngOnInit(): void {
    this.getPromotions();
   
   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getPromotions() {
    this.httpService.get('advance-promotion',false)
      .subscribe(result => {
        if (result.status == 200) {
         this.promotionArray = result.data;
          const data:any = [];
          this.promotionArray.forEach( (obj:any) => {
           let objData = {
            id:obj.id,
            promotion_title:obj.promotion_title,
            promotion_type:obj.promotion_type==1?'Category Wise':'Product Wise',
            trigger_type:obj.trigger_type==1?'Automatic Trigger':'Coupon',
            applies_to:obj.is_first_time_buyer==1?'First Time Buyer':'Applies To EveryOne',
            offer_start_date:obj.offer_start_date?this.dateFormat(obj.offer_start_date):'--',
            offer_end_date:obj.offer_end_date?this.dateFormat(obj.offer_end_date):'--',
            discount_type:obj.discount_type,
            discount_value:obj.discount_value,
            is_repeat:obj.is_repeat,
            purchase_qty:parseFloat(obj.purchase_qty).toFixed(2),
            receive_qty:parseFloat(obj.receive_qty).toFixed(2),
            status:obj.status,
            min_qty:parseFloat(obj.min_qty).toFixed(2),
            max_qty:parseFloat(obj.max_qty).toFixed(2),
            categories_to_count:obj.categories_to_count,
            categories_to_receive:obj.categories_to_receive,
            products_to_count:obj.products_to_count,
            products_to_receive:obj.products_to_receive
          }
             data.push(objData)
          });
         this.dataSource.data = data as Promotion[];  
        } else {
          console.log("Error in Promotion");
        }
      });
  }
  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }
  dateFormat(day:any){
    let newDate = moment(day).format("DD MMM YY");
    return newDate;
  }
  back() {
    
    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
  addPromotions(): void {
    const dialogRef = this.dialog.open(AddAdvaneDiscountComponent, {
      width: '800px',data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPromotions();
    });
  }
  editPromotions(id: any): void {

    const dialogRef = this.dialog.open(AddAdvaneDiscountComponent, {
      width: '800px', data: { 'id': id,'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPromotions();
    });
  }
  viewPromotionsDetail(element: any): void {

    const dialogRef = this.dialog.open(AdvancePromotionsDetailComponent, {
      width: '900px', data: { 'detailData': element }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPromotions();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


}

