import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';
import { AddExpenseDialogComponent } from 'src/app/accounts/add-expense-dialog/add-expense-dialog.component';
import { CurrentStockPrintComponent } from 'src/app/inventory/current-stock-print/current-stock-print.component';

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
export interface dayBook {
  id: any;
  category_name: any;
  debit: any;
  credit: any;
  balance: any;
}

@Component({
  selector: 'app-daybook-report',
  templateUrl: './daybook-report.component.html',
  styleUrls: ['./daybook-report.component.scss']
})
export class DaybookReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  
  public daybookForm!: UntypedFormGroup;
  daybookRecords: any = [];
  businessdayRecords: any = [];
  selectedBusinessday: any;
  orderSummary: any;
public displayedColumns: string[] = ['index', 'name', 'title', 'createdby', 'date', 'invoice_amt', 'type', 'debit', 'credit', 'balance'];
  public dataSource = new MatTableDataSource<dayBook>();
  dayBookRecords: any = [];
  date = moment();
  payments: any = []
  business_day: any = '';
  closing_bal: any;
  drayer_balance: any;
  creditTotal = 0.00;
  debitTotal = 0.00;
  invoiceCount = 0;
  todayDate = this.date.format('DD-MM-YYYY');
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_id = this.localservice.get('branch_id');
  closeSaleFlag: boolean = false;
  business_day_status: any;
  opening_bal: any;
  refundAmount: any = 0;
  receipts: any = [];
  isStock: boolean = false;
  business_day_id: any;
  diff_in_drawer_bal: any;
  tipsAmount:any=0;
  creditAmount:any=0;
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBuisnessday()
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.daybookForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
    })
  }

  filterReport(event: any) {
    console.log(event.target);
    
    this.selectedBusinessday = event.target.value;
    var found = this.businessdayRecords.find(function (obj: any) {
      return obj.id == event.target.value;
    });
    if(found){
      this.business_day=found.name;
    }
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }

  getBuisnessday() {
    this.httpService.get('businessdays')
      .subscribe(result => {
        if (result.status == 200) {
          this.businessdayRecords = result.data;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  // viewDetails(id: any, categoryname: any) {
  //   const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
  //     width: '500px',
  //     data: {
  //       operation: 'view',
  //       id: id,
  //       categoryname: categoryname
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  viewDetails(id: any, categoryname: any) {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '500px',
      data: {
        operation: 'view',
        id: id,
        categoryname: categoryname
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.generateReport();
    });
  }
  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Daybook_Report', sheet: 'daybook_report' });
  }

  generateReport() {
    if (this.daybookForm.value['searchBy']) {
      let body = {
        business_day_id: this.selectedBusinessday
      }
      this.httpService.post('business-day-report', body)
        .subscribe(result => {
          if (result.status == 200) {
          this.invoiceCount = result.data.to_be_invoiced;
          this.dayBookRecords = result.data.daybook;
          this.business_day_status = result.data.business_day_status;
          
          this.business_day = result.data.business_day;
          this.closing_bal = result.data.closing_balance.toFixed(2);
          this.drayer_balance = result.data.drayer_balance.toFixed(2);
          this.diff_in_drawer_bal = result.data.diff_in_drawer_bal?.toFixed(2)
          this.creditTotal = result.data.credits.toFixed(2);
          this.debitTotal = result.data.debits.toFixed(2);
          this.opening_bal = result.data.opening_balance.toFixed(2);
          this.refundAmount = result.data.refund_amount ? parseFloat(result.data.refund_amount).toFixed(2) : 0;
          this.tipsAmount=result.data.tips_received ? parseFloat(result.data.tips_received).toFixed(2) : 0;
          this.creditAmount=result.data.credit_payments ? parseFloat(result.data.credit_payments).toFixed(2) : 0;
          const data: any = [];
         
          if(result.data.payments.length>0){
            result.data.payments.forEach((element:any) => {
              if(element.amount>0){
                this.payments.push(element)
              }
            });
          }
          if(result.data.receipts.length>0){
            result.data.receipts.forEach((element:any) => {
              if(element.amount>0){
                this.receipts.push(element)
              }
            });
          }
          this.dayBookRecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.expense_category ? obj.expense_category.name : '',
              debit: obj.debit,
              credit: obj.credit,
              balance: obj.total,
              title: obj.title,
              date: obj.date,
              time: obj.time,
              invoice_amt: obj.invoice?.amount,
              createdby: obj.user?.name,
              expenseid: obj.expense?.id,
              expense_category_name: obj.expense_category?.name,
              type: obj.invoice?.invoice_payment
            }
            data.push(objData)
          });
          this.dataSource.data = data as dayBook[];
        } else {
          console.log("Error");
        }
    
        })
    }
    else {
      this.snackBService.openSnackBar("Select business day to generate report", "Close")
    }
  }

  back() {
    this.router.navigate(['accounts/accountsreport'])
  }
  currentStock() {
    const dialogRef = this.dialog.open(CurrentStockPrintComponent, {
      width: '800px',data:{business_day_id:this.selectedBusinessday,business_day:this.business_day}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
