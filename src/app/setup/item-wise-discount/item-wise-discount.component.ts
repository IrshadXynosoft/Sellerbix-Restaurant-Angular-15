import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
export interface DiscountItems {
  id: any;
  item_id: any;
  name: any;
  branch_price: any;
  selected_discount_type: any;
  discount_value: any;
  amount_after_discount: any;
}
@Component({
  selector: 'app-item-wise-discount',
  templateUrl: './item-wise-discount.component.html',
  styleUrls: ['./item-wise-discount.component.scss'],
})
export class ItemWiseDiscountComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  innerMenuArray: any = [];
  taxArray: any = [];
  branchName: any;
  isMenuSave: any;
  datasourceLength: any;
  public displayedColumns: string[] = [
    'index',
    'name',
    'branch_price',
    'selected_discount_type',
    'discount_value',
    'amount_after_discount',
  ];
  public dataSource = new MatTableDataSource<DiscountItems>();
  id: any;
  tabIndex: any;
  categoryData = new UntypedFormControl();
  category_filteredOptions!: Observable<any[]>;
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private route: ActivatedRoute
  ) {
    this.branchName = localService.get('branchname');
    this.isMenuSave = false;
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getBranchName();
    this.getInnerMenu();
  }

  getBranchName() {
    this.httpService.get('branch', false).subscribe((result) => {
      if (result.status == 200) {
        let branchRecords = result.data.tenant_branches;
        branchRecords.forEach((element: any) => {
          if (this.id == element.id) {
            this.branchName = element.name;
          }
        });
      } else {
        console.log('Error in Get Branch');
      }
    });
  }

  backspaceEvent() {
    this.categoryData.setValue('');
  }

  getInnerMenu() {
    this.httpService
      .post('online/item-discount-setup', { tenant_id: 4, branch_id: this.id })
      .subscribe((result) => {
        if (result.status == 200) {
          let menuCategories = result.data;
          menuCategories.forEach((obj: any) => {
            let objData = {
              id: obj.category_id,
              name: obj.category_name,
            };
            this.innerMenuArray.push(objData);
          });
          this.category_filteredOptions = this.categoryData.valueChanges.pipe(
            startWith(''),
            map((value) => this._filtercustomerlist(value))
          );
        } else {
          console.log('Error');
        }
      });
  }

  private _filtercustomerlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    const results = this.innerMenuArray.filter((option: any) =>
      option.name.toLowerCase().includes(filterValue)
    );
    return results.length ? results : [{ id: 0, name: 'Not found' }];
  }

  categorySelected(id: any) {
    if (id != 0) {
      this.httpService
        .post('online/category-item-discount-setup', {
          tenant_id: 4,
          branch_id: this.id,
          category_id: id,
        })
        .subscribe((result) => {
          if (result.status == 200) {
            const data: any = [];
            result.data.item.forEach((element: any) => {
              if (element.item_location_price) {
                let items = {
                  id: element.item_id,
                  name: element.item_name,
                  branch_price: element.item_location_price.branch_price,
                  amount_after_discount:
                    element.item_location_price.item_discount_price,
                  selected_discount_type:
                    element.item_location_price.discount_type,
                  discount_value: element.item_location_price.discount_value,
                };
                data.push(items);
              }
            });
            this.dataSource.data = data as DiscountItems[];
          } else {
            console.log('Error');
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  roleChanged(textLabel: any) {
    let data: any = [];
    this.innerMenuArray.forEach((element: any) => {
      if (element.name == textLabel) {
        let j = 1;
        element.menu.forEach((obj: any) => {
          let rate: any = 0;
          let itemAmountAfterdiscount: any = 0;

          if (obj.selected_discount_type == 'none' || obj.discount_value == 0) {
            itemAmountAfterdiscount = parseFloat(obj.branch_price);
          } else if (
            obj.selected_discount_type == 'percentage' &&
            obj.discount_value > 0
          ) {
            rate = ((obj.discount_value * obj.branch_price) / 100).toFixed(2);
            itemAmountAfterdiscount = (
              parseFloat(obj.branch_price) - parseFloat(rate)
            ).toFixed(2);
          } else if (
            obj.selected_discount_type == 'value' &&
            obj.discount_value > 0
          ) {
            itemAmountAfterdiscount = (
              parseFloat(obj.branch_price) - parseFloat(obj.discount_value)
            ).toFixed(2);
          }

          let objValue = {
            id: j,
            item_id: obj.id,
            name: obj.name,
            branch_price: obj.branch_price,
            selected_discount_type: obj.selected_discount_type,
            discount_value: obj.discount_value,
            amount_after_discount: itemAmountAfterdiscount,
          };
          data.push(objValue);
          j++;
        });
        this.dataSource.data = data as DiscountItems[];
        this.datasourceLength = data.length;
      }
    });
  }

  discountChanged(discountId: any, element: any) {
    console.log(discountId);

    let rate: any;
    let itemAmountAfterdiscount: any = 0.0;
    let index = this.dataSource.data.indexOf(element);
    if (discountId == 'none' || element.discount_value == 0) {
      itemAmountAfterdiscount = parseFloat(element.branch_price);
    } else if (discountId == 'percentage' && element.discount_value > 0) {
      rate = ((element.discount_value * element.branch_price) / 100).toFixed(2);
      itemAmountAfterdiscount = (
        parseFloat(element.branch_price) - parseFloat(rate)
      ).toFixed(2);
    } else if (discountId == 'value' && element.discount_value > 0) {
      itemAmountAfterdiscount = (
        parseFloat(element.branch_price) - parseFloat(element.discount_value)
      ).toFixed(2);
    }

    this.dataSource.data[index].amount_after_discount = itemAmountAfterdiscount;
    this.dataSource.data[index].selected_discount_type = discountId;
    if (discountId == 'none') {
      this.dataSource.data[index].discount_value = 0;
    }
  }

  priceChanged(discountAmount: any, element: any) {
    let rate: any;
    let itemAmountAfterdiscount: any = 0.0;
    let index = this.dataSource.data.indexOf(element);
    if (element.selected_discount_type == 'none' || discountAmount == 0) {
      itemAmountAfterdiscount = parseFloat(element.branch_price);
    } else if (
      element.selected_discount_type == 'percentage' &&
      discountAmount > 0
    ) {
      rate = ((discountAmount * element.branch_price) / 100).toFixed(2);
      itemAmountAfterdiscount = (
        parseFloat(element.branch_price) - parseFloat(rate)
      ).toFixed(2);
    } else if (
      element.selected_discount_type == 'value' &&
      discountAmount > 0
    ) {
      itemAmountAfterdiscount = (
        parseFloat(element.branch_price) - parseFloat(discountAmount)
      ).toFixed(2);
    }
    this.dataSource.data[index].amount_after_discount = itemAmountAfterdiscount;
    this.dataSource.data[index].discount_value = discountAmount;
  }
  saveBranchMenu() {
    let post: any = [];
    this.dataSource.data.forEach((obj: any) => {
      this.isMenuSave = true;
      let objData = {
        tenant_id: 4,
        branch_id: this.id,
        item_id: obj.id,
        price: obj.branch_price,
        item_discount_price: obj.amount_after_discount,
        discount_type: obj.selected_discount_type,
        discount_value: obj.discount_value,
      };
      post.push(objData);
    });

    if (this.isMenuSave) {
      let postParam: any = {
        items: post,
      };
      this.httpService
        .post('online/update-item-discount', postParam)
        .subscribe((result) => {
          if (result.status == 200) {
            this.getInnerMenu();
            this.snackBService.openSnackBar('Branch Menu added', 'Close');
          } else {
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    }
  }
  back() {
    this.router.navigate(['setup/location/' + this.id + '/online']);
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
