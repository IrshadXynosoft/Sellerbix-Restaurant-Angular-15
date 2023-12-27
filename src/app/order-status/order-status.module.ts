import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatusComponent } from './order-status.component';
import { SharedModule } from '../shared/shared.module';
import { OrderStatusRoutingModule } from './order-status-routing.module';
import { DemoMaterialModule } from '../material-module';
import { MenuStatusChangeComponent } from './menu-status-change/menu-status-change.component';



@NgModule({
  declarations: [
    OrderStatusComponent,
    MenuStatusChangeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrderStatusRoutingModule,
    DemoMaterialModule
  ]
})
export class OrderStatusModule { }
