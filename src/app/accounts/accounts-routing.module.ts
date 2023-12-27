import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsReportComponent } from './accounts-report/accounts-report.component';
import { AccountsComponent } from './accounts.component';
import { AddingExpensesComponent } from './adding-expenses/adding-expenses.component';
import { ApprovedLedgersComponent } from './approved-ledgers/approved-ledgers.component';
import { ApprovedReceiptComponent } from './approved-receipt/approved-receipt.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { DayBookComponent } from './day-book/day-book.component';
import { DaybookReportComponent } from './daybook-report/daybook-report.component';
import { ExpenseCategoriesComponent } from './expense-categories/expense-categories.component';
import { LedgerReportsComponent } from './ledger-reports/ledger-reports.component';
import { NotApprovedReceiptComponent } from './not-approved-receipt/not-approved-receipt.component';
import { NotapprovedLedgersComponent } from './notapproved-ledgers/notapproved-ledgers.component';
import { PaymentReportsComponent } from './payment-reports/payment-reports.component';
import { ReceiptReportsComponent } from './receipt-reports/receipt-reports.component';
import { RecieptsComponent } from './reciepts/reciepts.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { DaybookSummaryComponent } from './daybook-summary/daybook-summary.component';
import { BusinessdayStockReportComponent } from './businessday-stock-report/businessday-stock-report.component';
import { TipReportComponent } from './tip-report/tip-report.component';

const routes: Routes = [
  { path: '', component: AccountsComponent },
  { path: 'expensecategories', component: ExpenseCategoriesComponent},
  { path: 'addingexpense', component: AddingExpensesComponent},
  { path: 'addingreceipts', component: RecieptsComponent},
  { path: 'daybook' , component: DayBookComponent },
  { path: 'approvedledger' , component: ApprovedLedgersComponent },
  { path: 'notapprovedledger' , component: NotapprovedLedgersComponent },
  { path: 'approvedreceipt' , component: ApprovedReceiptComponent },
  { path: 'notapprovedreceipt' , component: NotApprovedReceiptComponent },
  { path: 'accountsreport' , component: AccountsReportComponent },
  { path: 'reports/dailyReport' , component: DailyReportComponent},
  { path: 'reports/daybookReport' , component: DaybookReportComponent},
  { path: 'reports/paymentReport', component : PaymentReportsComponent},
  { path: 'reports/ledgerReport', component : LedgerReportsComponent},
  { path: 'reports/receiptReport', component : ReceiptReportsComponent},
  { path: 'reports/revenueReport', component : RevenueReportComponent},
  { path: 'reports/daybookSummary', component : DaybookSummaryComponent},
  { path: 'reports/stockReport', component : BusinessdayStockReportComponent},
  { path: 'reports/tipReport', component : TipReportComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
