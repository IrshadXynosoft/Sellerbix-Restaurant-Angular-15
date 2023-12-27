import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';

export interface Report {
  id: number;
  order_no: any;
  invoice_no: any;
  staff_name: any;
  branch_name: any;
  date: any;
  time: any;
  amount: any;
  orderDetails: any
}

@Component({
  selector: 'app-receipt-reports',
  templateUrl: './receipt-reports.component.html',
  styleUrls: ['./receipt-reports.component.scss']
})
export class ReceiptReportsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'name', 'amount', 'reference', 'status', 'type', 'ledger', 'business_day', 'date', 'description'];
  public dataSource = new MatTableDataSource<Report>();
  public receiptForm!: UntypedFormGroup;
  datePeriod: boolean = false;
  specificDate: boolean = false;
  receiptRecords: any = [];
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getReceiptreports()
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.receiptForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      totalSum: [{ value: 0, disabled: true }]
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

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Receipt_Report', sheet: 'receipt_report' });
  }

  getReceiptreports() {
    let body = {
      'from_date': null,
      'to_date': null,
      'date': this.todayDate
    }
    this.httpService.post('receipt-report', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.receiptRecords = result.data.reports;
          this.receiptForm.patchValue({
            'totalSum': result.data.sum
          })
          const data: any = [];
          this.receiptRecords.forEach((obj: any) => {
            let objData = {
              'name': obj.name,
              'amount': obj.amount,
              'reference': obj.reference,
              'status': obj.status,
              'type': obj.payment_type_id,
              'ledger': obj.expense_category,
              'business_day': obj.business_day,
              'date': obj.date,
              'description': obj.description
            }
            data.push(objData)
          });
          this.dataSource.data = data as Report[];
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  filterReport(event: any) {
    this.datePeriod = false;
    this.specificDate = false;
    if (event.target.value == "1") {
      this.datePeriod = true;
    }
    else if (event.target.value == "2") {
      this.specificDate = true;
    }
  }

  generateReport() {
    if (this.receiptForm.value['searchBy'] == "") {
      let body = {
        'from_date': null,
        'to_date': null,
        'date': this.todayDate
      }
      this.httpService.post('receipt-report', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.receiptRecords = result.data.reports;
            this.receiptForm.patchValue({
              'totalSum': result.data.sum
            })
            const data: any = [];
            this.receiptRecords.forEach((obj: any) => {
              let objData = {
                'name': obj.name,
                'amount': obj.amount,
                'reference': obj.reference,
                'status': obj.status,
                'type': obj.payment_type_id,
                'ledger': obj.expense_category,
                'business_day': obj.business_day,
                'date': obj.date,
                'description': obj.description
              }
              data.push(objData)
            });
            this.dataSource.data = data as Report[];
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        })
    }
    else if (this.receiptForm.value['searchBy'] == 1) {
      if (this.receiptForm.value['fromDate'] && this.receiptForm.value['toDate']) {
        let body = {
          'from_date': this.receiptForm.value['fromDate'],
          'to_date': this.receiptForm.value['toDate'],
          'date': null
        }
        this.httpService.post('receipt-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.receiptRecords = result.data.reports;
              this.receiptForm.patchValue({
                'totalSum': result.data.sum
              })
              const data: any = [];
              this.receiptRecords.forEach((obj: any) => {
                let objData = {
                  'name': obj.name,
                  'amount': obj.amount,
                  'reference': obj.reference,
                  'status': obj.status,
                  'type': obj.payment_type_id,
                  'ledger': obj.expense_category,
                  'business_day': obj.business_day,
                  'date': obj.date,
                  'description': obj.description
                }
                data.push(objData)
              });
              this.dataSource.data = data as Report[];
            }
            else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          })
      }
      else {
        this.snackBService.openSnackBar("Please enter date period", "Close")
      }
    }
    else if (this.receiptForm.value['searchBy'] == 2) {
      if (this.receiptForm.value['date']) {
        let body = {
          'from_date': null,
          'to_date': null,
          'date': this.receiptForm.value['date']
        }
        this.httpService.post('receipt-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.receiptRecords = result.data.reports;
              this.receiptForm.patchValue({
                'totalSum': result.data.sum
              })
              const data: any = [];
              this.receiptRecords.forEach((obj: any) => {
                let objData = {
                  'name': obj.name,
                  'amount': obj.amount,
                  'reference': obj.reference,
                  'status': obj.status,
                  'type': obj.payment_type_id,
                  'ledger': obj.expense_category,
                  'business_day': obj.business_day,
                  'date': obj.date,
                  'description': obj.description
                }
                data.push(objData)
              });
              this.dataSource.data = data as Report[];
            }
            else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          })
      }
      else {
        this.snackBService.openSnackBar("Enter Date", "Close")
      }
    }
  }

  back() {
    this.router.navigate(['accounts/accountsreport'])
  }
}
