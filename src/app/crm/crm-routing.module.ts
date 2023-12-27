import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableTablesComponent } from './available-tables/available-tables.component';
import { CreateNewCustomerComponent } from './create-new-customer/create-new-customer.component';
import { CrmOrdersComponent } from './crm-orders/crm-orders.component';
import { CrmComponent } from './crm.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { NoDetailsFoundComponent } from './no-details-found/no-details-found.component';
const routes: Routes = [
  {
    path: '',
    component:CrmComponent
  },
  {
    path: 'orders',
    component:CrmComponent
  },
  {
    path: 'CreateNewCustomer/:contactNumber',
    component:CreateNewCustomerComponent
  },
  {
    path: 'CreateNewCustomer',
    component:CreateNewCustomerComponent
  },
  // {
  //   path: 'EditCustomer/:location_id/:customer_id',
  //   component:EditCustomerComponent
  // },
  {
    path: 'notFound',
    component:NoDetailsFoundComponent
  },
  {
    path: 'available-tables',
    component:AvailableTablesComponent
  },
  {
    path: 'order-list',
    component:CrmOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
