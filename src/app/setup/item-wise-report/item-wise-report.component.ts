import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';

export interface itemReport {
  id: number;
  order_no: any;
  invoice_no: any;
  qty: any;
  staff_name: any;
  branch_name: any;
  entity_name: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}
@Component({
  selector: 'app-item-wise-report',
  templateUrl: './item-wise-report.component.html',
  styleUrls: ['./item-wise-report.component.scss']
})
export class ItemWiseReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  public displayedColumns: string[] = ['index', 'order_no', 'qty', 'entity_name', 'branch_name', 'staff_name', 'date', 'time',
    'amount', 'status', 'button'];
  public dataSource = new MatTableDataSource<itemReport>();
  public generateItemWiseReportForm!: UntypedFormGroup;
  panelOpenState = false;
  data: any;
  id = this.localservice.get('branch_id');
  menuItemRecords: any = []
  itemData = new UntypedFormControl();
  locationData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  salesReportArray: any = [];
  totalAmount: any = 0;
  paymentRecords: any = [];
  itemValidation: boolean = false;
  currentlyOpenedItemIndex = -1;
  currency_symbol = localStorage.getItem('currency_symbol');
  todayDate: any = moment()
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog,
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
    this.menuItemRecords.forEach((obj: any) => {
      if (obj.id == id) {
        let objData = {
          id: obj.id,
          name: obj.name,
        }
        let items = this.generateItemWiseReportForm.get('itemData') as UntypedFormArray;
        items.push(this.createItemData(objData));
        input.value = '';
        input.blur();
      }

    });

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onBuildForm() {
    this.generateItemWiseReportForm = this.formBuilder.group({
      item: [''],
      itemData: new UntypedFormArray([]),
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
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
    this.httpService.get('item')
      .subscribe(result => {
        if (result.status == 200) {
          this.menuItemRecords = result.data.items;
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
          console.log("Error");
        }
      });
  }
  getAllItemReport(itemIdList: []) {
    let postParams = {
      items: itemIdList,
      date_from: this.generateItemWiseReportForm.value['fromDate'],
      date_to: this.generateItemWiseReportForm.value['toDate']
    }

    this.dataSource.data = [];
    this.httpService.post('all-item-sale-report', postParams)
      .subscribe(result => {
        if (result.status == 200) {
          this.salesReportArray = result.data;
        } else {
          console.log("Error");
        }
      });
  }
  get itemFormGroups() {
    return this.generateItemWiseReportForm.get('itemData') as UntypedFormArray;
  }

  createItemData(dataObj: any): UntypedFormGroup {
    return this.formBuilder.group(dataObj);
  }

  ItemName(index: any) {
    let form_data = this.generateItemWiseReportForm.value;
    return form_data.itemData[index].name;
  }
  clearItem(index: any) {
    let items = this.generateItemWiseReportForm.get('itemData') as UntypedFormArray;
    items.removeAt(index);

  }
  generateReport() {
    let itemList: any = [];
    let items = this.generateItemWiseReportForm.value['itemData']
    items.forEach((obj: any) => {
      itemList.push(obj.id)
    });

    let postParams: any = {};

    let data: any = {
      date_from: this.generateItemWiseReportForm.value['fromDate'],
      date_to: this.generateItemWiseReportForm.value['toDate']
    }
    let date_period: any = [];
    date_period.push(data);
    postParams = {
      items: itemList,
      date_from: this.generateItemWiseReportForm.value['fromDate'],
      date_to: this.generateItemWiseReportForm.value['toDate']
    }
    if (itemList.length > 0) {
      this.dataSource.data = [];
      this.httpService.post('item-sale-report', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.salesReportArray = result.data;

          } else {
            console.log("Error");
          }
        });
    }
    else {
      this.itemValidation = true;
    }

  }
  itemsSelected(item_id: any) {
    this.dataSource.data = []
    const data: any = [];
    this.totalAmount = 0;
    this.salesReportArray.forEach((element: any) => {

      element.item_orders?.forEach((obj: any) => {
        if (element.item_id == item_id) {
          obj.order_json['amount_received'] = obj.amount_received ? obj.amount_received : 0;
          obj.order_json['balance_amount'] = obj.balance_amount ? obj.balance_amount : 0;
          let objData = {
            id: obj.id,
            order_no: obj.order_number,
            invoice_no: obj.invoice_id,
            qty: parseFloat(obj.qty).toFixed(2),
            staff_name: obj.staff_name,
            branch_name: obj.branch_name,
            entity_name: obj.entity_name,
            date: obj.date,
            time: obj.time,
            cost: obj.order_items[0].cost_per_unit,
            profit: obj.order_items[0].profit,
            profit_status: obj.order_items[0].profit_status,
            amount: parseFloat(obj.price).toFixed(2),
            orderDetails: obj.order_json
          }
          this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.price)).toFixed(2)
          data.push(objData)
        }
      });

      this.dataSource.data = data as itemReport[];
      this.itemValidation = false
    });
  }
  setOpened(itemIndex: any) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex: any) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
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
    this.matTableExporter.exportTable('xlsx', { fileName: name, sheet: 'itemwise_report' });
  }

}

