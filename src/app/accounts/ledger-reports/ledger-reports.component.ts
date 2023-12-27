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
  selector: 'app-ledger-reports',
  templateUrl: './ledger-reports.component.html',
  styleUrls: ['./ledger-reports.component.scss']
})
export class LedgerReportsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'name', 'amount', 'reference', 'status', 'type', 'ledger', 'business_day', 'date', 'description'];
  public dataSource = new MatTableDataSource<Report>();
  public ledgerForm!: UntypedFormGroup;
  datePeriod: boolean = false;
  specificDate: boolean = false;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  ledgerRecords: any = [];
  ledgerSelected: any;
  ledgers: any = [];
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getLedgerReports();
    this.getLedger()
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.ledgerForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      ledger: ['', Validators.compose([Validators.required])],
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

  filterLedger(event: any) {
    if (event.target.value) {
      this.ledgerSelected = event.target.value;
    }
    else {
      this.ledgerSelected = null;
    }
  }

  getLedger() {
    this.httpService.get('expense-category')
      .subscribe(result => {
        if (result.status == 200) {
          this.ledgers = result.data.categories;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Ledger_Report', sheet: 'Ledger_report' });
  }

  getLedgerReports() {
    let body = {
      'from_date': null,
      'to_date': null,
      'date': this.todayDate,
      'ledger_id': null
    }
    this.httpService.post('ledger-report', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.ledgerRecords = result.data.reports;
          this.ledgerForm.patchValue({
            'totalSum': result.data.sum
          })
          const data: any = [];
          this.ledgerRecords.forEach((obj: any) => {
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

  generateReport() {
    if (this.ledgerForm.value['searchBy'] == "") {
      let body = {
        'from_date': null,
        'to_date': null,
        'date': this.todayDate,
        'ledger_id': this.ledgerSelected ? this.ledgerSelected : null
      }
      this.httpService.post('ledger-report', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.ledgerRecords = result.data.reports;
            this.ledgerForm.patchValue({
              'totalSum': result.data.sum
            })
            const data: any = [];
            this.ledgerRecords.forEach((obj: any) => {
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
    else if (this.ledgerForm.value['searchBy'] == 1) {
      if (this.ledgerForm.value['fromDate'] && this.ledgerForm.value['toDate']) {
        let body = {
          'from_date': this.ledgerForm.value['fromDate'],
          'to_date': this.ledgerForm.value['toDate'],
          'date': null,
          'ledger_id': this.ledgerSelected ? this.ledgerSelected : null
        }
        this.httpService.post('ledger-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.ledgerRecords = result.data.reports;
              this.ledgerForm.patchValue({
                'totalSum': result.data.sum
              })
              const data: any = [];
              this.ledgerRecords.forEach((obj: any) => {
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
    else if (this.ledgerForm.value['searchBy'] == 2) {
      if (this.ledgerForm.value['date']) {
        let body = {
          'from_date': null,
          'to_date': null,
          'date': this.ledgerForm.value['date'],
          'ledger_id': this.ledgerSelected ? this.ledgerSelected : null
        }
        this.httpService.post('ledger-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.ledgerRecords = result.data.reports;
              this.ledgerForm.patchValue({
                'totalSum': result.data.sum
              })
              const data: any = [];
              this.ledgerRecords.forEach((obj: any) => {
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

