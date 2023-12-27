import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmComponent } from './crm.component';
import { CrmRoutingModule } from './crm-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateNewCustomerComponent } from './create-new-customer/create-new-customer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddAddressComponent } from './add-address/add-address.component';
import { AddNotesCrmComponent } from './add-notes-crm/add-notes-crm.component';
import { ShowCrmDetailsComponent } from './show-crm-details/show-crm-details.component';
import { NoDetailsFoundComponent } from './no-details-found/no-details-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { ShowCustomerDetailsComponent } from './show-customer-details/show-customer-details.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { DemoMaterialModule } from '../material-module';
import { CrmOrdersComponent } from './crm-orders/crm-orders.component';
import { TableReservationComponent } from './table-reservation/table-reservation.component';
import { PartyOrdersComponent } from './party-orders/party-orders.component';
import { ShowReservationsComponent } from './show-reservations/show-reservations.component';
import { AvailableTablesComponent } from './available-tables/available-tables.component';
import { CustomEntityDialogComponent } from './custom-entity-dialog/custom-entity-dialog.component';


@NgModule({
  declarations: [
    CrmComponent,
    CreateNewCustomerComponent,
    AddAddressComponent,
    AddNotesCrmComponent,
    ShowCrmDetailsComponent,
    NoDetailsFoundComponent,
    EditCustomerComponent,
    StorePickupComponent,
    ShowCustomerDetailsComponent,
    NotesListComponent,
    CrmOrdersComponent,
    TableReservationComponent,
    PartyOrdersComponent,
    ShowReservationsComponent,
    AvailableTablesComponent,
    CustomEntityDialogComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule,
    DragScrollModule,
    MatCheckboxModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    DemoMaterialModule
  ]
})
export class CrmModule { }
