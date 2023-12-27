import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyOrdersRoutingModule } from './party-orders-routing.module';
import { PartyOrdersComponent } from './party-orders.component';
import { AddItemComponent } from '../home/add-item/add-item.component';
import { GroupedItemComponent } from '../home/add-groupeditem/grouped-item/grouped-item.component';
import { ComboItemComponent } from '../home/combo-item/combo-item.component';
import { AddNotesComponent } from '../home/add-notes/add-notes.component';
import { AddDiscountComponent } from '../home/add-discount/add-discount.component';
import { EditItemComponent } from '../home/edit-item/edit-item.component';
import { IndividualItemDiscountComponent } from '../home/individual-item-discount/individual-item-discount.component';
import { ItemInfoComponent } from '../home/item-info/item-info.component';
import { PaymentDialogComponent } from '../home/payment-dialog/payment-dialog.component';
import { VoidOrderComponent } from '../home/void-order/void-order.component';
import { ModifyReasonComponent } from '../home/modify-reason/modify-reason.component';
import { ModifierEditReasonComponent } from '../home/modifier-edit-reason/modifier-edit-reason.component';
import { CrmOrderConfirmationComponent } from '../home/crm-order-confirmation/crm-order-confirmation.component';
import { AddSurchargeComponent } from '../home/add-surcharge/add-surcharge.component';
import { SharedModule } from '../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import {  MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DemoMaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BulkOrdersListComponent } from './bulk-orders-list/bulk-orders-list.component';
import { BulkOrderDetailsComponent } from './bulk-order-details/bulk-order-details.component';
import { AdvancePaymentComponent } from './advance-payment/advance-payment.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';


@NgModule({
  declarations: [
    PartyOrdersComponent,
    BulkOrdersListComponent,
    BulkOrderDetailsComponent,
    AdvancePaymentComponent,
    DeleteConfirmationComponent,
  ],
  imports: [
    CommonModule,
    PartyOrdersRoutingModule,
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
    FormsModule,ReactiveFormsModule
  ]
})
export class PartyOrdersModule { }
