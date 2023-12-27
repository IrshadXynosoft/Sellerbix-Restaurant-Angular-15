import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteOrdersComponent } from './complete-orders/complete-orders.component';
import { DineinComponent } from './dinein.component';
import { MoveTableComponent } from './move-table/move-table.component';
import { RunningOrdersComponent } from './running-orders/running-orders.component';
import { TableReservationsComponent } from './table-reservations/table-reservations.component';

const routes: Routes = [
  {
    path: '',
    component: DineinComponent,
  },
  {
    path: 'runningOrders',
    component: RunningOrdersComponent,
  },
  {
    path: 'completeOrders',
    component: CompleteOrdersComponent,
  },
  {
    path: 'tableReservations',
    component: TableReservationsComponent,
  },
  {
    path: 'move-table',
    component: MoveTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DineinRoutingModule {}
