import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { SupportRoutingModule } from './support-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    SupportComponent
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule
  ]
})
export class SupportModule { }
