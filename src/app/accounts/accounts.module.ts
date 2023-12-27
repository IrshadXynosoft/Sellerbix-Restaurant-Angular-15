import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { ExpenseCategoriesComponent } from './expense-categories/expense-categories.component';
import { DemoMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { AddExpenseCategoryComponent } from './add-expense-category/add-expense-category.component';
import { AddingExpensesComponent } from './adding-expenses/adding-expenses.component';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { DayBookComponent } from './day-book/day-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovedLedgersComponent } from './approved-ledgers/approved-ledgers.component';
import { NotapprovedLedgersComponent } from './notapproved-ledgers/notapproved-ledgers.component';
import { RecieptsComponent } from './reciepts/reciepts.component';
import { AddReceiptDialogComponent } from './add-receipt-dialog/add-receipt-dialog.component';
import { ApprovedReceiptComponent } from './approved-receipt/approved-receipt.component';
import { NotApprovedReceiptComponent } from './not-approved-receipt/not-approved-receipt.component';
import { DaybookReportComponent } from './daybook-report/daybook-report.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AccountsReportComponent } from './accounts-report/accounts-report.component';
import { PaymentReportsComponent } from './payment-reports/payment-reports.component';
import { ReceiptReportsComponent } from './receipt-reports/receipt-reports.component';
import { LedgerReportsComponent } from './ledger-reports/ledger-reports.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { DailyReportDetailComponent } from './daily-report-detail/daily-report-detail.component';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { PrintDaybookReportComponent } from './print-daybook-report/print-daybook-report.component';
import {NgxPrintModule} from 'ngx-print';
import { DaybookSummaryComponent } from './daybook-summary/daybook-summary.component';
import { BusinessdayStockReportComponent } from './businessday-stock-report/businessday-stock-report.component';
import { EnterDrawerBalanceComponent } from './enter-drawer-balance/enter-drawer-balance.component';
import { TipReportComponent } from './tip-report/tip-report.component';
@NgModule({
  declarations: [
    AccountsComponent,
    ExpenseCategoriesComponent,
    AddExpenseCategoryComponent,
    AddingExpensesComponent,
    AddExpenseDialogComponent,
    DayBookComponent,
    ApprovedLedgersComponent,
    NotapprovedLedgersComponent,
    RecieptsComponent,
    AddReceiptDialogComponent,
    ApprovedReceiptComponent,
    NotApprovedReceiptComponent,
    DaybookReportComponent,
    AccountsReportComponent,
    PaymentReportsComponent,
    ReceiptReportsComponent,
    LedgerReportsComponent,
    DailyReportComponent,
    DailyReportDetailComponent,
    RevenueReportComponent,
    PrintDaybookReportComponent,
    DaybookSummaryComponent,
    BusinessdayStockReportComponent,
    EnterDrawerBalanceComponent,
    TipReportComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    DemoMaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    NgxPrintModule
  ]
})
export class AccountsModule { }
