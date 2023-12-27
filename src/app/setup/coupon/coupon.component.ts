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
export interface Coupons{
  coupon_code:any,
  description:any,
  minimum_order_value:any,
  no_of_coupons_issued:any,
  discount_type:any,
  discount_value:any,
  valid_from_date:any,
  valid_to_date:any,
  start_time:any,
  end_time:any,
  active:any;
}

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index','coupon_code', 'minimum_order_value','no_of_coupons_issued','discount_type','discount_value','valid_from_date','valid_to_date','active','button'];
  public dataSource = new MatTableDataSource<Coupons>();
  couponArray: any = []
  id:any;
  branch_id:any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
    this.branch_id=this.localService.get('branch_id') 
   }
  ngOnInit(): void {
    this.getCoupons();
   
   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getCoupons() {
    this.httpService.get('all-coupons/'+this.id,false)
      .subscribe(result => {
        if (result.status == 200) {
         this.couponArray = result.data;
          const data:any = [];
          this.couponArray.forEach( (obj:any) => {
           let objData = {
              id: obj.id,
              coupon_code:obj.coupon_code,
              description:obj.description,
              minimum_order_value:obj.minimum_order_value,
              no_of_coupons_issued:obj.no_of_coupons_issued,
              discount_type:obj.discount_type,
              discount_value:obj.discount_value,
              valid_from_date:obj.valid_from_date?this.dateFormat(obj.valid_from_date)+(obj.start_time?','+this.timeCheck(obj.start_time):''):'--',
              valid_to_date:obj.valid_to_date?this.dateFormat(obj.valid_to_date)+(obj.end_time?','+this.timeCheck(obj.end_time):''):'--',
              start_time:obj.valid_from_date?this.timeCheck(obj.start_time):'',
              end_time:obj.valid_to_date?this.timeCheck(obj.end_time):'',
              active:obj.active
              }
            data.push(objData)
          });
         this.dataSource.data = data as Coupons[];  
        } else {
          console.log("Error in tax");
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
  addCoupons(): void {
    const dialogRef = this.dialog.open(AddCouponComponent, {
      width: '700px',data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCoupons();
    });
  }
  editCoupons(id: any): void {

    const dialogRef = this.dialog.open(AddCouponComponent, {
      width: '700px', data: { 'id': id,'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCoupons();
    });
  }
 
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


}

