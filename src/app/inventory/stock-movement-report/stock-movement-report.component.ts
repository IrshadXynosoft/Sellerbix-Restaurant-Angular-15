import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { DataService } from 'src/app/_services/data.service';
import { Observable, generate } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { BatchProductionReportDetailComponent } from '../batch-production-report-detail/batch-production-report-detail.component';
export interface stockMovement {
  id: number;
  name: any;
  date: any;
  location: any;
  opening_balance: any;
  stock_in: any;
  stock_out: any;
  closing_balance: any;
  status: any;
  movement_type: any;
  source: any;
  staff: any;
}
@Component({
  selector: 'app-stock-movement-report',
  templateUrl: './stock-movement-report.component.html',
  styleUrls: ['./stock-movement-report.component.scss']
})
export class StockMovementReportComponent implements OnInit {

  @ViewChild("stockTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  selectedStockIDs: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'date', 'location', 'opening_balance', 'stock_in', 'stock_out', 'closing_balance', 'status', 'movement_type', 'source', 'staff'];
  public dataSource = new MatTableDataSource<stockMovement>();
  public generatePurchaseOrderReport!: UntypedFormGroup;
  data: any;
  branch_id: any;
  branch_name: any;
  branchRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
  staffRecords: any = []
  public generateReportForm!: UntypedFormGroup;
  processeddata: any = [];
  itemData = new UntypedFormControl();
  itemValidation: boolean = false;
  filteredOptions: Observable<any[]> | undefined;
  options: any = [];
  menuItemRecords: any = [];
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate: any = moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localService: LocalStorage, private dataservice: DataService) {
    this.branch_id = this.localService.get('branch_id')
    this.branch_name = this.localService.get('branchname')
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();
   
    this.filteredOptions = this.itemData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }

  itemFilter(filterText: any) {
    this.options=[]
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {
      this.options=[];
      switch (this.generateReportForm.value['inventory_type']) {
        case '1':
           this.getFinishedGoods(filterText);
          break;
        case '2':

          this.getIngredients(filterText)
          break;
        case '3':
          this.getSubRecipe(filterText);

      }
      // this.httpService.get('autocomplete_search_for_recipeOrModifierInventory/' + filterText)
      //   .subscribe(result => {
      //     if (result.status == 200) {
      //       if (result.data.length > 0) {
      //        // this.list_options = result.data
      //       }

      //     } else {

      //       console.log("Error");
      //     }
      //   });
    }
    else {

    }
  }

  getFinishedGoods(filterText:any) {
    this.httpService.get('autocomplete_search_for_finished_good/' + filterText, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data;
          this.menuItemRecords.forEach((obj: any) => {
            let objData = {
              inventory_type: '1',
              finished_good_id: obj.id,
              stock_id: obj.stock_id,
              name: obj.name, 
              cost_per_unit:obj.cost_per_unit,
              unit_name:obj.unit_name
            }
            this.options.push(objData)

          }
          )

        } else {
          console.log("Error");
        }
      });
  }
  getSubRecipe(filterText:any) {
    this.httpService.get('autocomplete_search_for_sub_recipe/' + filterText, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data;
          this.menuItemRecords.forEach((obj: any) => {
            let objData = {
              sub_recipe_id: obj.id,
              stock_id: obj.stock_id,
              name: obj.name, 
              cost_per_unit:obj.cost_per_unit,
              unit_name:obj.unit_name,
              inventory_type: '3'
            }
            this.options.push(objData)
          }
          )

        } else {
          console.log("Error");
        }
      });
  }
  getIngredients(filterText:any) {
    this.httpService.get('autocomplete_search_for_ingredient/' + filterText, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data;
          this.menuItemRecords.forEach((obj: any) => {
             let objData = {
                ingredient_id:obj.id,
                stock_id: obj.stock_id,
                name: obj.name, 
                cost_per_unit:obj.cost_per_unit,
                unit_name:obj.unit_name,
                inventory_type: '2'
              }


              this.options.push(objData)
            }
          
          )

        } else {
          console.log("Error");
        }
      });
  }
  itemSelected(item: any, input: HTMLInputElement) {
    if (!this.selectedStockIDs.includes(item.stock_id)) {
      let items = this.generateReportForm.get('itemData') as UntypedFormArray;
      items.push(this.createItemData(item));
      this.selectedStockIDs.push(item.stock_id);
      this.itemValidation = false
    }
    else {
      this.snackBService.openSnackBar("Item already added", "Close")
    }

    input.value = '';
    input.blur();
    this.options=[];
  }
  get itemFormGroups() {
    return this.generateReportForm.get('itemData') as UntypedFormArray;
  }

  createItemData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  ItemName(index: any) {
    let form_data = this.generateReportForm.value;
    return form_data.itemData[index].name;
  }
  clearItem(index: any) {
    let items = this.generateReportForm.get('itemData') as UntypedFormArray;
    let form_data = this.generateReportForm.value;
    this.selectedStockIDs.splice(this.selectedStockIDs.indexOf(form_data.itemData[index].stock_id), 1);
    items.removeAt(index);


  }
  onBuildForm() {
    this.generateReportForm = this.formBuilder.group({
      inventory_type: ['1'],
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      branch_id: [this.branch_id],
      date: [''],
      itemData: new UntypedFormArray([]),
    }, { validator: this.dateLessThan('fromDate', 'toDate') });
  }
  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "From date should be less than To date"
        };
      }
      return {};
    }
  }
  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true
      this.searchBySpecificDate = false

    } else if (searchbyId == 0) {

      this.searchByPeriod = false
      this.searchBySpecificDate = false

    }
    else if (searchbyId == 2) {
      this.searchBySpecificDate = true
      this.searchByPeriod = false
    }

  }
  fetchInventoryData(event: any) {
    this.options = [];
   

  }
  viewBatchProcess(item: any) {
    var found = this.processeddata.find(function (obj: any) {
      return obj.id == item.id;
    });

    if (found) {
      const dialogRef = this.dialog.open(BatchProductionReportDetailComponent, {
        width: '900px', data: { 'detailData': found }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }
  findDateDiff(dateSent: any) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));

  }


  getBranch() {
    this.httpService.get('branches-for-inventory/' + this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }





  generateReport() {
    let postParams: any;
    let items = this.generateReportForm.value['itemData']
    if (this.searchByPeriod) {
      if (this.generateReportForm.value['fromDate'] && this.generateReportForm.value['toDate']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          date_from: this.generateReportForm.value['fromDate'],
          date_to: this.generateReportForm.value['toDate'],
          items: items
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.generateReportForm.value['date']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          specify_date: true,
          date: this.generateReportForm.value['date'],
          inventory_type: this.generateReportForm.value['inventory_type'],
          items: items
        }
      }
    }
    else {
      postParams = {
        inventory_type: this.generateReportForm.value['inventory_type'],
        branch_id: this.generateReportForm.value['branch_id'],
        current_date: true,
        items: items
      }
    }

    this.dataSource.data = [];
    if (items.length > 0) {
      if (postParams) {
        this.httpService.post('stock-movement-report', postParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.processeddata = result.data;
              let items = this.generateReportForm.get('itemData') as UntypedFormArray;
              items.clear();
              this.selectedStockIDs = [];
            } else {
              console.log("Error in batch-process");
            }

          });
      }
      else {
        this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
      }
    }
    else {
      this.itemValidation = true;
    }
  }
  setTableData(processeddata: any) {
    const data: any = [];
    processeddata.forEach((obj: any) => {
      let objData = {
        id: obj.id,
        name: obj.item_name,
        date: this.dayCheck(obj.created_at),
        location: obj.branch,
        opening_balance: obj.opening_balance ? obj.opening_balance + ' ' + obj.measurement_unit : '',
        stock_in: obj.stock_in ? obj.stock_in + ' ' + obj.measurement_unit : '--',
        stock_out: obj.stock_out ? obj.stock_out + ' ' + obj.measurement_unit : '--',
        closing_balance: obj.closing_balance ? obj.closing_balance + ' ' + obj.measurement_unit : '',
        status: obj.status ? obj.status : '--',
        movement_type: obj.movement_type ? obj.movement_type : '--',
        source: obj.sourse ? obj.sourse : '--',
        staff: obj.staff ? obj.staff : '--'
      }
      data.push(objData)
    });
    this.dataSource.data = data as stockMovement[];
  }
  getItemName(item: any) {
    let itemName: any;
    if (item.sub_recipe) {
      item.sub_recipe.forEach((element: any) => {
        itemName = itemName ? itemName + ',' + element.name : element.name
      });
    }
    if (item.recipe) {
      item.recipe.forEach((element: any) => {
        itemName = itemName ? itemName + ',' + element.name : element.name
      });
    }
    return itemName;
  }
  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }
  addHistory(stock_id: any, item_name: any): void {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '100%', data: { 'stock_id': stock_id, 'item_name': item_name, 'branch_id': this.branch_id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}


