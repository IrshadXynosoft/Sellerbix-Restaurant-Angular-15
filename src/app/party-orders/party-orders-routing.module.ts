import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkOrdersListComponent } from './bulk-orders-list/bulk-orders-list.component';
import { PartyOrdersComponent } from './party-orders.component';

const routes: Routes = [{ path: '', component: PartyOrdersComponent },
{
  path: 'list',
  component:BulkOrdersListComponent
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyOrdersRoutingModule { }
