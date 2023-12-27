import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkinComponent } from './walkin.component';
import { WalkinRoutingModule } from './walkin-routing.module';
import { AddItemComponent } from './add-item/add-item.component';
import { OrdersComponent } from './orders/orders.component';
import { SharedModule } from '../shared/shared.module';
import { DetailComponent } from './detail/detail.component';
import { DemoMaterialModule } from '../material-module';
import { EntityOrdersComponent } from './entity-orders/entity-orders.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OrderHistoryDetailsComponent } from './order-history-details/order-history-details.component';
import { DetailedOrderViewComponent } from './detailed-order-view/detailed-order-view.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrintDetailsHistoryComponent } from './print-details-history/print-details-history.component';

@NgModule({
  declarations: [
    WalkinComponent,
    AddItemComponent,
    OrdersComponent,
    DetailComponent,
    EntityOrdersComponent,
    OrderHistoryDetailsComponent,
    DetailedOrderViewComponent,
    PrintDetailsHistoryComponent
  ],
  imports: [
    CommonModule,
    WalkinRoutingModule,
    SharedModule,
    DemoMaterialModule,
    InfiniteScrollModule,
    FormsModule,
    MatCheckboxModule
  ]
})
export class WalkinModule { }
