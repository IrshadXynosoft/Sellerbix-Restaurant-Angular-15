import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableExporterDirective } from 'mat-table-exporter';
import moment from 'moment';

export interface Report {
  id: number;
  items: any;
  qty: any;
  sales: any;
  cost: any;
  tax: any;
  offer_price: any;
}
@Component({
  selector: 'app-item-sales-report',
  templateUrl: './item-sales-report.component.html',
  styleUrls: ['./item-sales-report.component.scss']
})
export class ItemSalesReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild(MatTableExporterDirective)
  matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = [
    'index',
    'items',
    'qty',
    'sales',
    // 'cost',
    // 'offer_price',
    // 'tax',
    //'sales_tax_amount'
  ];
  public dataSource = new MatTableDataSource<Report>();
  public generateSalesReport!: UntypedFormGroup;
  data: any;
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = []
  totalAmount: any = 0;
  todayDate: any = moment();
  minDate: any = moment(this.todayDate)
    .subtract(2, 'months')
    .format('YYYY-MM-DD');
  constructor(
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
  ) {
    this.todayDate = this.todayDate.format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.onBuildForm();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.generateSalesReport = this.formBuilder.group(
      {
        searchBy: ['0'],
        fromDate: ['', Validators.compose([Validators.required])],
        toDate: ['', Validators.compose([Validators.required])],
        date: [''],
      },
      { validator: this.dateLessThan('fromDate', 'toDate') }
    );
  }
  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'From date should be less than To date',
        };
      }
      return {};
    };
  }

  reset() {
    this.salesReportArray = [];
  }

  async generateReport() {
    this.reset();
    let postParams: any;
    if (this.searchByPeriod) {
      if (
        this.generateSalesReport.value['fromDate'] &&
        this.generateSalesReport.value['toDate']
      ) {
        postParams = {
          date_from: this.generateSalesReport.value['fromDate'],
          date_to: this.generateSalesReport.value['toDate'],
        };
      }
    } else if (this.searchBySpecificDate) {
      if (this.generateSalesReport.value['date']) {
        postParams = {
          specify_date: true,
          date: this.generateSalesReport.value['date'],
        };
      }
    } else {
      postParams = {
        current_date: true,
      };
    }
    this.dataSource.data = [];
    this.totalAmount = 0;
    if (postParams) {
      this.httpService
        .post(
          'item-sale-report-by-filter',
          postParams
        )
        .subscribe(async (result) => {
          if (result.status == 200) {
            if (result.data.report.length > 0) {
              this.salesReportArray = result.data.report;
              this.dataSource.data = this.salesReportArray as Report[];
              this.salesReportArray?.forEach((obj: any) => {
                this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.amount)).toFixed(2)
              });
            }
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        });
    } else {
      this.snackBService.openSnackBar(
        'Please Select Date to Generate Report',
        'Close'
      );
    }
  }

  //old
  // setDataTable() {
  //   const data: any = [];
  //   this.salesReportArray?.forEach((obj: any) => {
  //     let objData = {
  //       id: obj.item_id,
  //       items: obj.name,
  //       qty: parseFloat(obj.qty).toFixed(2),
  //       sales: parseFloat(obj.amount).toFixed(2),
  //       tax: parseFloat(obj.tax_rate).toFixed(2),
  //       cost: parseFloat(obj.cost).toFixed(2),
  //       offer_price: obj.discounted_price ? parseFloat(obj.discounted_price).toFixed(2) : '--'
  //     };
  //     this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.amount)).toFixed(2)
  //     data.push(objData);
  //   });
  //   this.dataSource.data = data as Report[];
  // }


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
  exportExcel() {
    this.matTableExporter.exportTable('xlsx', {
      fileName: 'Sales_Report',
      sheet: 'sales_report',
    });
  }
}
