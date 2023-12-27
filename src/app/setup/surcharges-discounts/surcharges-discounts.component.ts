import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddItemDiscountComponent } from '../add-item-discount/add-item-discount.component';
import { AddOrderDiscountComponent } from '../add-order-discount/add-order-discount.component';
import { AddSurchargeComponent } from '../add-surcharge/add-surcharge.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { EditSurchargeComponent } from '../edit-surcharge/edit-surcharge.component';
import { EditOrderDiscountComponent } from '../edit-order-discount/edit-order-discount.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { itemDiscounts, orderDiscounts, Surcharges } from './surcharges-discounts.model';
import { EditItemDiscountComponent } from '../edit-item-discount/edit-item-discount.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-surcharges-discounts',
  templateUrl: './surcharges-discounts.component.html',
  styleUrls: ['./surcharges-discounts.component.scss']
})
export class SurchargesDiscountsComponent implements OnInit {
  @ViewChild("surchargeTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild("orderdiscount", { read: MatPaginator, static: false })
  set pagination1(value: MatPaginator) {
    this.dataSourceOrderDiscounts.paginator = value;
  }
  @ViewChild("itemdiscount", { read: MatPaginator, static: false })
  set pagination2(value: MatPaginator) {
    this.dataSourceItemDiscounts.paginator = value;
  }

  // sort
  @ViewChild("surchargeTable", { read: MatSort, static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild("orderdiscount", { read: MatSort, static: false })
  set sort1(value: MatSort) {
    this.dataSourceOrderDiscounts.sort = value;
  }
  @ViewChild("itemdiscount", { read: MatSort, static: false })
  set sort2(value: MatSort) {
    this.dataSourceItemDiscounts.sort = value;
  }
  public displayedColumns: string[] = ['index', 'name', 'type', 'rate', 'walkIn', 'dineIn', "callCenter", "takeAway", "eorder", "isTaxable", "status", "button"];
  public dataSource = new MatTableDataSource<Surcharges>();
  public displayedColumnsOrderDiscounts: string[] = ['index', 'name', 'type', 'rate', 'walkIn', 'dineIn', "callCenter", "takeAway", "eorder", "onTotal", "status", "button"];
  public dataSourceOrderDiscounts = new MatTableDataSource<orderDiscounts>();
  public displayedColumnsItemDiscounts: string[] = ['index', 'name', 'type', 'rate', 'walkIn', 'dineIn', "callCenter", "takeAway", "eorder", "status", "button"];
  public dataSourceItemDiscounts = new MatTableDataSource<itemDiscounts>();
  surchargeArray: any = []
  orderArray: any = []
  itemArray: any = []
  isWalkin: any;
  isDinein: any;
  isCallCenter: any;
  isTakeAway: any;
  ise_order: any;
  radioSelected: any;
  id: any
  branch_id: any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute, private localService: LocalStorage) {
    this.branch_id = this.localService.get('branch_id')
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getSurcharges();
    this.getOrderDiscounts();
    this.getItemDiscounts();
  }

  addSurcharge(): void {
    const dialogRef = this.dialog.open(AddSurchargeComponent, {
      width: '500px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSurcharges();
    });
  }
  addOrderDiscount(): void {
    const dialogRef = this.dialog.open(AddOrderDiscountComponent, {
      width: '500px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrderDiscounts()
    });
  }
  addItemDiscount(): void {
    const dialogRef = this.dialog.open(AddItemDiscountComponent, {
      width: '500px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getItemDiscounts();
    });
  }
  back() {


    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }
  getSurcharges() {
    this.httpService.get('surcharge-by-location/' + this.id, false)
      .subscribe(result => {

        if (result.status == 200) {
          this.surchargeArray = result.data;
          const data: any = [];
          let surcharges = result.data;
          surcharges.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.name,
              type: obj.type,
              rate: parseFloat(obj.rate).toFixed(2),
              walkIn: obj.walk_in,
              dineIn: obj.dine_in,
              callCenter: obj.call_center,
              takeAway: obj.take_away,
              eorder: obj.e_order,
              isTaxable: obj.is_taxable,
              status: obj.status
            }
            data.push(objData)
          });
          this.dataSource.data = data as Surcharges[];
        } else {
          console.log("Error in get surcharge")
        }
      });
  }
  getOrderDiscounts() {
    this.httpService.get('order-discount-by-location/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.orderArray = result.data;
          const data: any = [];
          let orderDiscounts = result.data;
          orderDiscounts.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.name,
              type: obj.discount_type,
              rate: parseFloat(obj.rate).toFixed(2),
              walkIn: obj.walk_in,
              dineIn: obj.dine_in,
              callCenter: obj.call_center,
              takeAway: obj.take_away,
              eorder: obj.e_order,
              onTotal: obj.is_discount_on_total_amount,
              status: obj.status
            }
            data.push(objData)
          });
          this.dataSourceOrderDiscounts.data = data as orderDiscounts[];
        } else {
          console.log("Error in get order discount");
        }
      });
  }
  getItemDiscounts() {
    this.httpService.get('item-discount-by-location/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.itemArray = result.data;

          const data: any = [];
          let itemDiscounts = result.data;

          itemDiscounts.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.name,
              type: obj.discount_type,
              rate: parseFloat(obj.rate).toFixed(2),
              walkIn: obj.walk_in,
              dineIn: obj.dine_in,
              callCenter: obj.call_center,
              takeAway: obj.take_away,
              eorder: obj.e_order,
              status: obj.status
            }
            data.push(objData)
          });
          this.dataSourceItemDiscounts.data = data as itemDiscounts[];
        } else {
          console.log("Error in get item discount");
        }
      });
  }
  onToggleOrderDiscounts(event: any, id: any) {
    let status = event.checked
    this.httpService.post('order-discount-status-change/' + id, { status: status })
      .subscribe(result => {
        if (result.status == 200) {
          this.getOrderDiscounts();
        } else {
          console.log("Error in status order discount");
        }
      });
  }
  onToggleItemDiscounts(event: any, id: any) {
    let status = event.checked
    this.httpService.post('item-discount-status-change/' + id, { status: status })
      .subscribe(result => {
        if (result.status == 200) {
          this.getItemDiscounts();
        } else {
          console.log("Error in status order discount");
        }
      });
  }
  onToggleSurcharges(event: any, id: any) {
    let status = event.checked
    this.httpService.post('surcharge-status-change/' + id, { status: status })
      .subscribe(result => {
        if (result.status == 200) {
          this.getItemDiscounts();
        } else {
          console.log("Error in status order discount");
        }
      });
  }
  editsurcharge(id: any): void {
    const dialogRef = this.dialog.open(EditSurchargeComponent, {
      width: '500px', data: { 'id': id, 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSurcharges();
    });
  }
  editorderDiscount(id: any): void {
    const dialogRef = this.dialog.open(EditOrderDiscountComponent, {
      width: '500px', data: { 'id': id, 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getOrderDiscounts()
    });
  }
  edititemDiscount(id: any): void {
    const dialogRef = this.dialog.open(EditItemDiscountComponent, {
      width: '500px', data: { 'id': id, 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getItemDiscounts()
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  doFilterOrder(filterValue: any) {

    this.dataSourceOrderDiscounts.filter = filterValue.trim().toLocaleLowerCase();
  }
  doFilterItem(filterValue: any) {

    this.dataSourceItemDiscounts.filter = filterValue.trim().toLocaleLowerCase();
  }
}
