import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import moment from 'moment';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { PrintDaybookReportComponent } from '../print-daybook-report/print-daybook-report.component';
import { CurrentStockPrintComponent } from 'src/app/inventory/current-stock-print/current-stock-print.component';
import { EnterDrawerBalanceComponent } from '../enter-drawer-balance/enter-drawer-balance.component';

export interface dayBook {
  id: any;
  category_name: any;
  debit: any;
  credit: any;
  balance: any;
}
@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss']
})
export class DayBookComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
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
  constructor(private dialogService: ConfirmationDialogService, private localservice: LocalStorage, private router: Router, private httpService: HttpServiceService, private dialog: MatDialog, private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.getDaybook();
    this.checkBusinessDay();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getDaybook() {
    this.httpService.get('daybook')
      .subscribe(result => {
        if (result.status == 200) {
          this.invoiceCount = result.data.to_be_invoiced;
          this.dayBookRecords = result.data.daybook;
          this.business_day_status = result.data.business_day_status;
          
          this.business_day_status = result.data ? result.data?.business_day_status : 'closed';
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
              accepted_balance : obj.invoice?.accepted_balance,
              tip_payment_type : obj.invoice?.tip_payment_type_id == 1 ? 'Cash' : 'Card',
              createdby: obj.user?.name,
              expenseid: obj.expense?.id,
              expense_category_name: obj.expense_category?.name,
              type: obj.invoice?.invoice_payment
            }
            data.push(objData)
          });
          this.dataSource.data = data as dayBook[];
        } else {
          this.business_day_status = result.data ? result.data?.business_day_status : 'closed';
          this.snackBService.openSnackBar(result.message,"close")
        }
      });
  }
  checkBusinessDay() {
    this.httpService.get('check-business-day')
      .subscribe(result => {
        if (result.status == 200) {
          if (result.data.business_day) {
            this.business_day_id = result.data.business_day;
            this.isStock = true;
          }
          else {
            this.isStock = false;
          }
        } else {
          console.log("Error");
        }
      });
  }
  currentStock() {
    const dialogRef = this.dialog.open(CurrentStockPrintComponent, {
      width: '800px', data: { business_day_id: this.business_day_id, business_day: this.business_day }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  report() {
    // let body = {}
    // this.httpService.post('revenue-details', body)
    //   .subscribe(result => {
    //     if (result.status == 200) {
          const dialogRef = this.dialog.open(PrintDaybookReportComponent, {
            width: '450px',
            // data: {
            //   printData: result.data
            // }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
      //   } else {
      //     this.snackBService.openSnackBar(result.message, "Close")
      //   }
      // });
  }

  back() {
    this.router.navigate(['accounts'])
  }

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
      this.getDaybook();
    });
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }

  closeSale() {
    let body = {
      branch_id: this.branch_id,
      drawer_bal: parseFloat(this.drayer_balance)
    }

    const options = {
      title: 'Close Sale',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.post('close-sale', body)
          .subscribe(result => {
            if (result.status == 200) {
              this.closeSaleFlag = true;
              this.snackBService.openSnackBar("Sale Closed successfully!!", "Close");
              this.getDaybook()
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }

  openSale() {

    const options = {
      title: 'Open Sale',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        const dialogRef = this.dialog.open(EnterDrawerBalanceComponent, {
          width: '500px',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            let body = {
              drawer_bal: result,
            }
            this.httpService.post('new-open-sale', body)
              .subscribe(result => {
                if (result.status == 200) {
                  // this.closeSaleFlag = true;
                  this.snackBService.openSnackBar("Sale opened successfully!!", "Close");
                  this.getDaybook()
                } else {
                  this.snackBService.openSnackBar(result.message, "Close");
                }
              });
          }
        });
      }
    });
  }
}
