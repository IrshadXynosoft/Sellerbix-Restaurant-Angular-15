import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DriverPoolOrdersRoutingModule } from './driver-pool-orders-routing.module';
import { DriverPoolOrdersComponent } from './driver-pool-orders.component';
import { RequestDriverPoolOrdersComponent } from './request-driver-pool-orders/request-driver-pool-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material-module';
import { NotificationListenerComponent } from './notification-listener/notification-listener.component';
import { DriverpoolReportsComponent } from './driverpool-reports/driverpool-reports.component';
import { OrderReportComponent } from './order-report/order-report.component';
import { SettlementReportComponent } from './settlement-report/settlement-report.component';
import { OrderReportDetailComponent } from './order-report-detail/order-report-detail.component';
import { UpdateWalletComponent } from './update-wallet/update-wallet.component';


@NgModule({
  declarations: [
    DriverPoolOrdersComponent,
    RequestDriverPoolOrdersComponent,
    NotificationListenerComponent,
    DriverpoolReportsComponent,
    OrderReportComponent,
    SettlementReportComponent,
    OrderReportDetailComponent,
    UpdateWalletComponent
  ],
  imports: [
    CommonModule,
    DriverPoolOrdersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ]
})
export class DriverPoolOrdersModule { }
