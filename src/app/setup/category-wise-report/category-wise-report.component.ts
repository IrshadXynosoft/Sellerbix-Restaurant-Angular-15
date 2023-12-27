import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';
import { ExportPdfReportComponent } from '../export-pdf-report/export-pdf-report.component';
import { ExportCategoryPdfComponent } from '../export-category-pdf/export-category-pdf.component';

export interface itemReport {
  id: number;
  item_code: any;
  name: any;
  qty: any;
  sales: any;
  cost: any;
  tax: any;
  sales_tax: any;
}

@Component({
  selector: 'app-category-wise-report',
  templateUrl: './category-wise-report.component.html',
  styleUrls: ['./category-wise-report.component.scss']
})
export class CategoryWiseReportComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  public displayedColumns: string[] = ['item_code', 'name', 'qty', 'amount', 'cost', 'tax_rate', 'sales_tax_amount'];
  public dataSource = new MatTableDataSource<itemReport>();
  public generateCatWiseReportForm!: UntypedFormGroup;
  panelOpenState = false;
  data: any;
  id = this.localservice.get('branch_id');
  menuItemRecords: any = []
  itemData = new UntypedFormControl();
  locationData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  reportArray: any = [];
  itemValidation: boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  todayDate: any = moment()
  selectedIds: any = [];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private localservice: LocalStorage
  ) {
    this.todayDate = this.todayDate.format('YYYY-MM-DD')
  }

  ngOnInit(): void {

    this.onBuildForm();
    this.getItem();
    this.filteredOptions = this.itemData.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  itemSelected(id: any, input: HTMLInputElement) {
    if (this.selectedIds.includes(id)) {
      input.value = '';
      input.blur();
      this.snackBService.openSnackBar("category already added", "Close")
    }
    else {
      this.menuItemRecords.forEach((obj: any) => {
        if (obj.id == id) {
          let objData = {
            id: obj.id,
            name: obj.name,
          }
          let items = this.generateCatWiseReportForm.get('itemData') as UntypedFormArray;
          items.push(this.createItemData(objData));
          input.value = '';
          input.blur();
          this.selectedIds.push(id)
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true;
      this.searchBySpecificDate = false;
    } else if (searchbyId == 0) {
      this.searchByPeriod = false;
      this.searchBySpecificDate = false;
    } else if (searchbyId == 2) {
      this.searchBySpecificDate = true;
      this.searchByPeriod = false;
    }
  }
  onBuildForm() {
    this.generateCatWiseReportForm = this.formBuilder.group({
      item: [''],
      itemData: new UntypedFormArray([]),
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      searchBy: ['0'],
      date: [''],
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

  getItem() {
    let itemIdList: any = [];
    this.httpService.get('category')
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data.categories;
          this.menuItemRecords.forEach((obj: any) => {
            itemIdList.push(obj.id);
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            this.options.push(objData)
          }
          )
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  get itemFormGroups() {
    return this.generateCatWiseReportForm.get('itemData') as UntypedFormArray;
  }

  createItemData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  ItemName(index: any) {
    let form_data = this.generateCatWiseReportForm.value;
    return form_data.itemData[index].name;
  }
  clearItem(index: any) {
    let items = this.generateCatWiseReportForm.get('itemData') as UntypedFormArray;
    let form_data = this.generateCatWiseReportForm.value;
    this.selectedIds.splice(this.selectedIds.indexOf(form_data.itemData[index].id), 1);
    items.removeAt(index);

  }

  generateReport() {
    this.dataSource.data = [];
    this.reportArray = [];
    let postParams: any;
    let itemList: any = [];
    let items = this.generateCatWiseReportForm.value['itemData']
    items.forEach((obj: any) => {
      itemList.push(obj.id)
    });

    if (this.searchByPeriod) {
      if (
        this.generateCatWiseReportForm.value['fromDate'] &&
        this.generateCatWiseReportForm.value['toDate']
      ) {
        postParams = {
          category_ids: itemList,
          date_from: this.generateCatWiseReportForm.value['fromDate'],
          date_to: this.generateCatWiseReportForm.value['toDate'],
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.generateCatWiseReportForm.value['date']) {
        postParams = {
          category_ids: itemList,
          specify_date: true,
          date: this.generateCatWiseReportForm.value['date'],
        };
      }
    } else {
      postParams = {
        category_ids: itemList,
        current_date: true,
      };
    }
    this.dataSource.data = [];

    if (postParams) {
      if (itemList.length > 0) {
        this.dataSource.data = [];
        this.httpService.post('category-sale-report', postParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.reportArray = result.data;
              this.reportArray.forEach((element: any) => {

                let totals = {
                  id: 0,
                  name: 'Group Totals',
                  qty: element.group_totals.qty_total,
                  amount: element.group_totals.sales_total,
                  cost: element.group_totals.cost_total,
                  tax_rate: element.group_totals.tax_total,
                  sales_tax_amount: element.group_totals.sales_tax_amount
                }
                element.items.push(totals)
              });
              this.itemValidation = false
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
      else {
        this.itemValidation = true;
      }
    } else {
      this.snackBService.openSnackBar(
        'Please Select Date to Generate Report',
        'Close'
      );
    }
  }
  viewDetails(orderDetails: any): void {
    const dialogRef = this.dialog.open(SalesReportItemDetailsComponent, {
      width: '70%',
      data: {
        Orders: orderDetails
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  exportExcel(name: any) {
    this.matTableExporter.exportTable('xlsx', { fileName: name, sheet: 'category_report' });
  }

  //pdf
  // export() {
  //   let datePeriod = '';
  //   if (this.searchByPeriod) {
  //     if (
  //       this.generateCatWiseReportForm.value['fromDate'] &&
  //       this.generateCatWiseReportForm.value['toDate']
  //     ) {
  //       datePeriod = moment(this.generateCatWiseReportForm.value['fromDate']).format('L') + ' - ' + moment(this.generateCatWiseReportForm.value['toDate']).format('L')
  //     }
  //   } else if (this.searchBySpecificDate) {
  //     if (this.generateCatWiseReportForm.value['date']) {
  //       datePeriod = moment(this.generateCatWiseReportForm.value['date']).format('L')
  //     }
  //   } else {
  //     datePeriod = moment().format('L')
  //   }

  //   const dialogRef = this.dialog.open(ExportCategoryPdfComponent, {
  //     width: '80%',
  //     data: {
  //       dataSource: this.reportArray,
  //       datePeriod : datePeriod
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => { });
  // }
}