import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionExpiredPageComponent } from './home/subscription-expired-page/subscription-expired-page.component';
import { MenuNewComponent } from './menu-new/menu-new.component';
import { EntityOrdersComponent } from './walkin/entity-orders/entity-orders.component';
import { AuthGuard } from './_services/auth.guard';
import { BBHomeComponent } from './home/b-b-home/b-b-home.component';
import { EditHomeComponent } from './home/edit-home/edit-home.component';
import { DatePipe } from '@angular/common';
import { CanDeactivateGuard } from './_services/can-deactivate.guard';
// import { CanDeactivateGuard } from './_services/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  
  },
  {
    path: 'home/walkin',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard],
    // canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'home/b-b/newOrder',
    component: BBHomeComponent
  },
  {
    path: 'home/b-b/editOrder/:order_no',
    component: BBHomeComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'home/walkin/:id',
    component : EditHomeComponent,
    canActivate:[AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'home/crm/new_order',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'home/crm/entity/:custom_entity_id',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'home/crm/edit_order/:id',
    component : EditHomeComponent,
    canActivate:[AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'home/crm/pickup/new_order',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'home/crm/pickup/edit_order/:id',
    component : EditHomeComponent,
    canActivate:[AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'home/dinein/:table_id',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'home/dinein/:table_id/reservation',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'home/dinein/:table_id/:id',
    component : EditHomeComponent,
    canActivate:[AuthGuard],
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'order-status',
    loadChildren: () => import('./order-status/order-status.module').then(m => m.OrderStatusModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'people',
    loadChildren: () => import('./people/people.module').then(m => m.PeopleModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then(m => m.SupportModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'setup',
    loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule),
    canActivate:[AuthGuard]
  },
  {
    path:'inventory',
    loadChildren:() =>import('./inventory/inventory.module').then(m => m.InventoryModule),
    canActivate:[AuthGuard]
  },
  {
    path:'walkin',
    loadChildren:() =>import('./walkin/walkin.module').then(m => m.WalkinModule),
    canActivate:[AuthGuard]
  },
  {
    path:'callcenter',
    loadChildren:() =>import('./crm/crm.module').then(m => m.CrmModule),
    canActivate:[AuthGuard]
  },
  {
    path:'dinein',
    loadChildren:() =>import('./dinein/dinein.module').then(m => m.DineinModule),
    canActivate:[AuthGuard]
  },


  { path: 'menu-new', component: MenuNewComponent },
  { path: 'subscription-expired', component: SubscriptionExpiredPageComponent },
 
  { path: 'qr-code-menu', loadChildren: () => import('./qr-code-menu/qr-code-menu.module').then(m => m.QRCodeMenuModule) },
  { path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) },
  { path: 'party_orders/new_order', loadChildren: () => import('./party-orders/party-orders.module').then(m => m.PartyOrdersModule) },
  { path: 'party_orders/edit_order', loadChildren: () => import('./party-orders/party-orders.module').then(m => m.PartyOrdersModule) },
  { path: 'home/party_orders/modify_order/:id', component : EditHomeComponent },
  { path: 'home/party_orders/confirm_order', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'delivery-manager', loadChildren: () => import('./delivery-manager/delivery-manager.module').then(m => m.DeliveryManagerModule) },
  { path: 'walkin/entity-orders', component: EntityOrdersComponent },
  { path: 'driver-pool-orders', loadChildren: () => import('./driver-pool-orders/driver-pool-orders.module').then(m => m.DriverPoolOrdersModule) },
  { path: 'performace-report', loadChildren: () => import('./performance-report/performance-report.module').then(m => m.PerformanceReportModule) },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class AppRoutingModule { }
