import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderStatusComponent } from './order-status.component';

const routes: Routes = [
  {
    path: '',
    component:OrderStatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderStatusRoutingModule { }
