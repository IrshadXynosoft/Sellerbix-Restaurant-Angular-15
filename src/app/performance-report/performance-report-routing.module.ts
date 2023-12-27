import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceReportComponent } from './performance-report.component';

const routes: Routes = [{ path: '', component: PerformanceReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceReportRoutingModule { }
