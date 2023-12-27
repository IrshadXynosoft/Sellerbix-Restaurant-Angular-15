import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddItemComponent } from './add-item/add-item.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { GroupedItemComponent } from './add-groupeditem/grouped-item/grouped-item.component';
import { DemoMaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboItemComponent } from './combo-item/combo-item.component';
import { AddNotesComponent } from './add-notes/add-notes.component';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { IndividualItemDiscountComponent } from './individual-item-discount/individual-item-discount.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { VoidOrderComponent } from './void-order/void-order.component';
import { ModifyReasonComponent } from './modify-reason/modify-reason.component';
import { ModifierEditReasonComponent } from './modifier-edit-reason/modifier-edit-reason.component';
import { CrmOrderConfirmationComponent } from './crm-order-confirmation/crm-order-confirmation.component';
import { AddSurchargeComponent } from './add-surcharge/add-surcharge.component';
import { OpenSaleNotificationComponent } from './open-sale-notification/open-sale-notification.component';
import { UtensilsComponent } from './utensils/utensils.component';
import { ReturnUtensilComponent } from './return-utensil/return-utensil.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { LabelPrintComponent } from './label-print/label-print.component';
import { NgxPrintModule } from 'ngx-print';
import { InvoiceKotPrintComponent } from './invoice-kot-print/invoice-kot-print.component';
import { SubscriptionStatusDialogComponent } from './subscription-status-dialog/subscription-status-dialog.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { SubscriptionExpiredPageComponent } from './subscription-expired-page/subscription-expired-page.component';
import { CustomerLoyaltyCouponsComponent } from './customer-loyalty-coupons/customer-loyalty-coupons.component';
import { SelectWaiterComponent } from './select-waiter/select-waiter.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { BBHomeComponent } from './b-b-home/b-b-home.component';
import { SplitBillComponent } from './split-bill/split-bill.component';
import { ChangeTaxComponent } from './change-tax/change-tax.component';
import { SplitBillPaymentComponent } from './split-bill-payment/split-bill-payment.component';
import { EditHomeComponent } from './edit-home/edit-home.component';

@NgModule({
  declarations: [
    HomeComponent,
    AddItemComponent,
    GroupedItemComponent,
    ComboItemComponent,
    AddNotesComponent,
    AddDiscountComponent,
    EditItemComponent,
    IndividualItemDiscountComponent,
    ItemInfoComponent,
    PaymentDialogComponent,
    VoidOrderComponent,
    ModifyReasonComponent,
    ModifierEditReasonComponent,
    CrmOrderConfirmationComponent,
    AddSurchargeComponent,
    OpenSaleNotificationComponent,
    UtensilsComponent,
    ReturnUtensilComponent,
    CustomerDetailsComponent,
    LabelPrintComponent,
    InvoiceKotPrintComponent,
    SubscriptionStatusDialogComponent,
    CustomerSupportComponent,
    SubscriptionExpiredPageComponent,
    CustomerLoyaltyCouponsComponent,
    SelectWaiterComponent,
    OrderDetailsComponent,
    BBHomeComponent,
    SplitBillComponent,
    ChangeTaxComponent,
    SplitBillPaymentComponent,
    EditHomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MatDividerModule,
    MatGridListModule,
    MatChipsModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    DragScrollModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule
  ],
  providers: [DatePipe], 
})
export class HomeModule { }
