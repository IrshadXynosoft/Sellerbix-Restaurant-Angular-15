import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryDetailsComponent } from './order-history-details/order-history-details.component';
import { OrdersComponent } from './orders/orders.component';
import { WalkinComponent } from './walkin.component';
import { DetailedOrderViewComponent } from './detailed-order-view/detailed-order-view.component';
const routes: Routes = [
  {
    path: '',
    component: WalkinComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'order-details',
    component: OrderHistoryDetailsComponent
  },
  {
    path: 'entity-orders/order-history/:order_id',
    component: DetailedOrderViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalkinRoutingModule { }
