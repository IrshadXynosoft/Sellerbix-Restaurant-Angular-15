import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverPoolOrdersComponent } from './driver-pool-orders.component';
import { DriverpoolReportsComponent } from './driverpool-reports/driverpool-reports.component';
import { OrderReportComponent } from './order-report/order-report.component';

const routes: Routes = [
  { path: '', component: DriverPoolOrdersComponent },
  { path: 'reports', component: DriverpoolReportsComponent },
  { path: 'reports/order-report', component: OrderReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverPoolOrdersRoutingModule { }
