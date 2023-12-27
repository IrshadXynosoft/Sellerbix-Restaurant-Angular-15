import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryItems } from './inner-menu.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-inner-menu',
  templateUrl: './inner-menu.component.html',
  styleUrls: ['./inner-menu.component.scss']
})
export class InnerMenuComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  innerMenuArray: any = [];
  taxArray: any = [];
  branchName: any;
  isMenuSave: any;
  datasourceLength: any;
  public displayedColumns: string[] = ['index', 'name', 'branch_price', 'tax_name', 'tax_rate','sale_price', 'POS', 'Quick Menu'];
  public dataSource = new MatTableDataSource<CategoryItems>();
  id: any;
  tabIndex:any;
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private route: ActivatedRoute) {
    this.branchName = localService.get('branchname')
    this.isMenuSave = false
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getBranchName();
    this.getTax();
    this.getInnerMenu();
  }
  getBranchName() {
    this.httpService.get('branch', false)
      .subscribe(result => {
        if (result.status == 200) {
          let branchRecords = result.data.tenant_branches;
          branchRecords.forEach((element: any) => {
            if (this.id == element.id) {
              this.branchName = element.name
            }
          });
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  getTax() {
    this.httpService.get('get-tax-by-location/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.taxArray = result.data
        }
      });
  }
  getInnerMenu() {
    this.httpService.get('category-branch-item/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          const data: any = [];
          let menuCategories = result.data;
          menuCategories.forEach(function (obj: any) {
            let itemData: any = []
            if (obj.item.length) {
              obj.item.forEach((element: any) => {
                let isQuickMenu: boolean = false;
                if (element.quick_item[0]) {
                  isQuickMenu = true;
                }
             
                
               if(element.item_location_price.length>0){
                let items = {
                  id: element.id,
                  name: element.name,
                  branch_price: element.item_location_price[0].price,
                  sale_price: element.item_location_price[0].price,
                  selected_tax_id: element.item_location_price[0].tax_id,
                  pos: element.item_entity[0].is_pos_entity,
                  quickMenu: isQuickMenu ? element.quick_item[0].is_quick_item : 0
                }
                itemData.push(items)
               }
              });
              if (itemData.length > 0) {
                let objData = {
                  id: obj.id,
                  name: obj.name,
                  menu: itemData
                }
                data.push(objData)
              }
            }
          });
          this.innerMenuArray = data
        } else {
          console.log("Error");
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  roleChanged(textLabel: any) {
    let data: any = [];
    this.innerMenuArray.forEach((element:any) => {
      if(element.name==textLabel)
      {
        let j=1;
        element.menu.forEach((obj:any) => {
          let rate: any = 0;
          let itemAmountAfterTax :any=0;
          let taxrate:any=0;
          this.taxArray.forEach((objData:any) => {
            if(obj.selected_tax_id==objData.id)
            {
              taxrate=objData.rate
            }
          });
          rate=((taxrate*obj.branch_price) / 100).toFixed(2);
          itemAmountAfterTax = (parseFloat(obj.branch_price) - parseFloat(rate)).toFixed(2);;
          let objValue = {
            id: j,
            item_id: obj.id,
            name: obj.name,
            branch_price: obj.branch_price,
            tax_name: obj.selected_tax_id ? obj.selected_tax_id : 0,
            tax_rate: rate,
            price: itemAmountAfterTax,
            sale_price: obj.branch_price,
            selected_tax_id: obj.selected_tax_id ? obj.selected_tax_id : 0,
            POS: obj.pos,
            quickMenu: obj.quickMenu
          }
          data.push(objValue)
          j++;
        });
        this.dataSource.data = data as CategoryItems[];
        this.datasourceLength = data.length
      }
    });
  }


  taxChanged(taxId: any, element: any) {
    let rate: any
    let taxRate:any
    let itemAmountAfterTax = 0.00
    let index = this.dataSource.data.indexOf(element) 
    if (taxId > 0) {
     this.taxArray.forEach((element:any) => {
        if(taxId==element.id)
        {
          taxRate=element.rate
        }
      });
      rate=((taxRate* (element.price-element.tax_rate)) / 100).toFixed(2);
      itemAmountAfterTax = parseFloat(element.price) + parseFloat(rate);
      this.dataSource.data[index].tax_rate = rate
      this.dataSource.data[index].selected_tax_id = taxId
      this.dataSource.data[index].sale_price = itemAmountAfterTax.toFixed(2);
     
    }
    else {
      this.dataSource.data[index].sale_price=(element.price-0)
      this.dataSource.data[index].tax_rate = 0;
      this.dataSource.data[index].selected_tax_id = taxId
    }
  }

  checkValue(event: any, element: any) {
    let index = this.dataSource.data.indexOf(element) 
    if (event.currentTarget.checked) {
      this.dataSource.data[index].POS = "1"
    }
    else {
      this.dataSource.data[index].POS = "0"
    }
  }
  QuickMenu(event: any, element: any) {
    let index =this.dataSource.data.indexOf(element) 
    if (event.currentTarget.checked) {
      this.dataSource.data[index].quickMenu = 1
    }
    else {
      this.dataSource.data[index].quickMenu = 0
    }
  }
  saveBranchMenu(data: any) {
    let item: any = [];
    this.dataSource.data.forEach((obj: any) => {
      if (obj.selected_tax_id != null) {
        this.isMenuSave = true
        let objData = {
          item_id: obj.item_id,
          price: obj.sale_price,
          selected_tax_id: obj.selected_tax_id,
          pos: obj.POS,
          is_quick_menu: obj.quickMenu
        }
        item.push(objData)
      }
    });
    let post = {
      category_id: data.id,
      branch_id: this.id,
      items: item
    }
    if (this.isMenuSave) {
      this.httpService.post('update-item-tax', post)
        .subscribe(result => {
          if (result.status == 200) {
            this.getInnerMenu();
            this.snackBService.openSnackBar("Branch Menu added", "Close");

          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    }
  }
  back() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}



