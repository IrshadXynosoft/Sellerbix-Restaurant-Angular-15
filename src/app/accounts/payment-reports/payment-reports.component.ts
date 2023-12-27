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
  selector: 'app-payment-reports',
  templateUrl: './payment-reports.component.html',
  styleUrls: ['./payment-reports.component.scss']
})
export class PaymentReportsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'name', 'amount', 'reference', 'status', 'type','ledger','business_day','date','description'];
  public dataSource = new MatTableDataSource<Report>();
  public paymentForm!: UntypedFormGroup;
  datePeriod: boolean = false;
  specificDate: boolean = false;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any = moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  paymentRecords: any = [];
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getPaymentreports()
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.paymentForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])],
      totalSum:[{value:0, disabled: true}]
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

  getPaymentreports() {
    let body = {
      'from_date': null,
      'to_date': null,
      'date': this.todayDate
    }
    this.httpService.post('payment-report', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.paymentRecords = result.data.reports;
          this.paymentForm.patchValue({
            'totalSum':result.data.sum
          })
          const data: any = [];
          this.paymentRecords.forEach((obj: any) => {
            let objData = {
              'name': obj.name,
              'amount': obj.amount,
              'reference': obj.reference,
              'status': obj.status,
              'type': obj.payment_type_id,
              'ledger':obj.expense_category,
              'business_day':obj.business_day,
              'date':obj.date,
              'description':obj.description
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

  exportExcel(){
    this.matTableExporter.exportTable('xlsx', {fileName:'Payment_Report', sheet: 'payment_report'});
  }

  generateReport() {
    if (this.paymentForm.value['searchBy'] == "") {
      let body = {
        'from_date': null,
        'to_date': null,
        'date': this.todayDate
      }
      this.httpService.post('payment-report', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.paymentRecords = result.data.reports;
            this.paymentForm.patchValue({
              'totalSum':result.data.sum
            })
            const data: any = [];
            this.paymentRecords.forEach((obj: any) => {
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
    else if (this.paymentForm.value['searchBy'] == 1) {
      if (this.paymentForm.value['fromDate'] && this.paymentForm.value['toDate']) {
        let body = {
          'from_date': this.paymentForm.value['fromDate'],
          'to_date': this.paymentForm.value['toDate'],
          'date': null
        }
        this.httpService.post('payment-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.paymentRecords = result.data.reports;
              this.paymentForm.patchValue({
                'totalSum':result.data.sum
              })
              const data: any = [];
              this.paymentRecords.forEach((obj: any) => {
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
    else if (this.paymentForm.value['searchBy'] == 2) {
      if (this.paymentForm.value['date']) {
        let body = {
          'from_date': null,
          'to_date': null,
          'date': this.paymentForm.value['date']
        }
        this.httpService.post('payment-report', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.paymentRecords = result.data.reports;
              this.paymentForm.patchValue({
                'totalSum':result.data.sum
              })
              const data: any = [];
              this.paymentRecords.forEach((obj: any) => {
                let objData = {
                  'name': obj.name,
                  'amount': obj.amount,
                  'reference': obj.reference,
                  'status': obj.status,
                  'type': obj.payment_type_id,
                  'ledger':obj.expense_category,
                  'business_day':obj.business_day,
                  'date':obj.date,
                  'description':obj.description
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

