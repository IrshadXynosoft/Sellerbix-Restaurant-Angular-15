import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SalesReportItemDetailsComponent } from '../sales-report-item-details/sales-report-item-details.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
export interface Report {
  id: number;
  order_no: any;
  date: any;
  customer_id: any;
  customer_name: any;
  customer_contact: any;
  customer_wallet: any;
  amount: any;
  amount_to_pay: any;
  amount_received: any;
}

@Component({
  selector: 'app-unpaid-order-report',
  templateUrl: './unpaid-order-report.component.html',
  styleUrls: ['./unpaid-order-report.component.scss']
})
export class UnpaidOrderReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'customer_name', 'number', 'wallet', 'count', 'amount_to_pay', 'unpaid_commercial_sum', 'paid_commercial_sum', 'commercial_invoice_count', 'actions'];
  public dataSource = new MatTableDataSource<Report>();
  public unpaidReportForm!: UntypedFormGroup;
  data: any;
  id = this.route.snapshot.params.id;
  reportArray: any = [];
  customerList: any = [];
  unPaidCustomerList: any = [];
  reportsList: any = [];
  list_options: any = [];
  totalUnpaid: any;
  branch_id = this.localservice.get('branch_id');
  customersData = new UntypedFormControl();
  filteredOptions: Observable<any[]> | undefined;
  constructor(private dialogService: ConfirmationDialogService, private printMqtt: PrintMqttService, private localservice: LocalStorage, private localService: LocalStorage, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.generateReport();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  generateReport() {
    this.dataSource.data = [];
    this.httpService.get('unpaid-reports')
      .subscribe(result => {
        if (result.status == 200) {
          this.reportArray = result.data.customers;
          this.totalUnpaid = result.data.toal_sum;
          this.reportArray.forEach((obj: any) => {
            let objData = {
              customer_id: obj.customer_id,
              customer_name: obj.customer_name,
              count: obj.count,
              unpaid_commercial_sum: obj.unpaid_commercial_sum,
              paid_commercial_sum: obj.paid_commercial_sum,
              commercial_invoice_count: obj.commercial_invoice_count,
              amount_to_pay: (parseFloat(obj.amount)).toFixed(2),
              wallet: obj.customer_wallet,
              number: obj.customer_no,
            }
            if (obj.count != 0) {
              this.reportsList.push(objData)
            }
          });
          this.dataSource.data = this.reportsList as Report[];
        } else {
          console.log("Error");
        }
      });
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

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Unpaid_Report', sheet: 'unpaid_report' });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  back() {
    this.router.navigate(['setup/reports'])
  }

  viewOrder(customer_id: any) {
    this.localService.store('customer_id', customer_id)
    this.router.navigate(['setup/reports/unPaidCustomerReport/' +customer_id])
  }

  commercialInvoice(id: any) {
    this.router.navigate(['setup/CommercialInvoice/' + id])
  }

  printInvoice(id: any) {
    const options = {
      title: 'Print',
      message: 'Are You Sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('customer-receipt/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Print Generated Successfully!", "Close");
              result.data.forEach((obj: any) => {
                let print = this.printMqtt.checkPrinterAvailablity(obj)
                if (print.status) {
                  this.printMqtt.publish('print', print.printObj)
                    .subscribe((data: any) => {
                    });
                }
                else {
                  this.snackBService.openSnackBar(print.message, "Close")
                }
              });
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }
}

