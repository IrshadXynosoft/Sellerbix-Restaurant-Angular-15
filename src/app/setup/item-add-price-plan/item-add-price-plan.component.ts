import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';

export interface CategoryItems {
  item_id: any,
  item_name: any;
  default_rate: any;
  category_name: any;
  rate: any;
}

@Component({
  selector: 'app-item-add-price-plan',
  templateUrl: './item-add-price-plan.component.html',
  styleUrls: ['./item-add-price-plan.component.scss']
})
export class ItemAddPricePlanComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  } @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  branchName: any;
  public displayedColumns: string[] = ['index', 'item_name', 'category_name', 'default_rate', 'rate'];
  public dataSource = new MatTableDataSource<CategoryItems>();
  id: any;
  tabIndex: any;
  branch_id: any;
  name: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  menuItemData: FormControl = new FormControl([]);
  priceDetails: any = [];
  records: any = [];
  editData: any;
  menuItemArray: any = [];
  itemData: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private route: ActivatedRoute, private dataService: DataService) {
    this.branchName = localService.get('branchname');
    this.branch_id = localService.get('branch_id');
    this.id = this.route.snapshot.params.id;
    this.editData = dataService.getData('pricePlanID')
  }

  ngOnInit(): void {
    if (this.editData?.operation == 'edit' || this.editData?.operation == 'copy') {
      this.setData()
    }
  }

  searchItem(searchText: any) {
    if (searchText.length > 0) {
      this.httpService.get('autocomplete_for_price-plan/' + this.branch_id + '/' + searchText)
        .subscribe(result => {
          if (result.status == 200) {
            this.menuItemArray = [];
            if (result.data.length > 0) {
              this.menuItemArray = result.data;
            }
          } else {
            console.log("Error");
          }
        });
    }
    else {
      this.menuItemArray = [];
    }
  }

  menuItemSelected(item: any, inputElement: HTMLInputElement) {
    let found = this.itemData.filter((obj: { item_id: any; }) => obj.item_id == item.item_id);
    if (found.length > 0) {
      this.snackBService.openSnackBar("Duplicate Item Entry", "Close");
    }
    else {
      item["rate"] = '';
      this.itemData.push(item);
      this.dataSource.data = this.itemData as CategoryItems[];
    }
    inputElement.value = '';
    inputElement.blur();
    this.menuItemArray = [];
  }

  priceCheck(input: any, element: any) {

    if (input && input != '') {
      if (!isNaN(input) && Number(input) > 0) {
        element.rate = input;
      }
      else {
        this.snackBService.openSnackBar("Invalid price", "Close");
        element.rate = null;
      }
    }
    else {
      element.rate = null;
    }
  }

  ngOnDestroy(): void {
    this.dataService.setData('pricePlanID', null)
  }

  setData() {
    this.httpService.get('price-plan-edit-details/' + this.editData.id)
      .subscribe(result => {
        if (result.status == 200) {
          const data: any = []
          this.itemData = result.data.data ? result.data.data : [];
          if (this.editData?.operation == 'edit') {
            this.name.setValue(result.data.price_plan.name);
            this.description.setValue(result.data.price_plan.description)
          }
          this.dataSource.data = this.itemData as CategoryItems[];
        } else {
          this.snackBService.openSnackBar(result.message, 'close')
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  back() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/pricePlan'])
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  save() {
    if (this.name.value) {
      this.dataSource.data.forEach((element: any) => {
        if (element.rate && element.rate != null) {
          let item = {
            'item_id': element.item_id,
            'rate': element.rate
          }
          this.priceDetails.push(item)
        }
      })
      if (this.priceDetails.length > 0) {
        let body: any = {
          'name': this.name.value,
          'description': this.description.value,
          'details': this.priceDetails
        }
        this.httpService.post('price-plan', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, 'close');
              this.back()
            } else {
              this.snackBService.openSnackBar(result.message, 'close')
            }
          });
      }
      else {
        this.snackBService.openSnackBar("Please add atleast one item price", "Close")
      }
    }
    else {
      this.snackBService.openSnackBar("Please Add Name", "Close")
    }
  }

  update() {
    if (this.name.value) {
      this.dataSource.data.forEach((element: any) => {
        if (element.rate && element.rate != null) {
          let item = {
            'item_id': element.item_id,
            'rate': element.rate
          }
          this.priceDetails.push(item)
        }
      })
      if (this.priceDetails.length > 0) {
        let body: any = {
          'name': this.name.value,
          'description': this.description.value,
          'details': this.priceDetails
        }
        this.httpService.put('price-plan/' + this.editData.id, body)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, 'close');
              this.back()
            } else {
              this.snackBService.openSnackBar(result.message, 'close')
            }
          });
      }
      else {
        this.snackBService.openSnackBar("Please add atleast one item price", "Close")
      }
    }
    else {
      this.snackBService.openSnackBar("Please Add Name", "Close")
    }
  }


}



