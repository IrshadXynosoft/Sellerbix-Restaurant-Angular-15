import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceReportRoutingModule } from './performance-report-routing.module';
import { PerformanceReportComponent } from './performance-report.component';
import { SharedModule } from '../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    PerformanceReportComponent
  ],
  imports: [
    CommonModule,
    PerformanceReportRoutingModule,
    SharedModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class PerformanceReportModule { }
