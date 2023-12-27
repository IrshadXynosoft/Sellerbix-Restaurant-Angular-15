import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DineinComponent } from './dinein.component';
import { DineinRoutingModule } from './dinein-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RunningOrdersComponent } from './running-orders/running-orders.component';
import { CompleteOrdersComponent } from './complete-orders/complete-orders.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MoveTableComponent } from './move-table/move-table.component';
import { TableReservationsComponent } from './table-reservations/table-reservations.component';
import { EditTableReservationsComponent } from './edit-table-reservations/edit-table-reservations.component';
import { DemoMaterialModule } from '../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowDineinMultipleOrdersComponent } from './show-dinein-multiple-orders/show-dinein-multiple-orders.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListTablesModalComponent } from './list-tables-modal/list-tables-modal.component';

@NgModule({
  declarations: [
    DineinComponent,
    RunningOrdersComponent,
    CompleteOrdersComponent,
    ShowDetailsComponent,
    MoveTableComponent,
    TableReservationsComponent,
    EditTableReservationsComponent,
    ShowDineinMultipleOrdersComponent,
    ListTablesModalComponent,
  ],
  imports: [CommonModule, DineinRoutingModule, SharedModule, MatTabsModule,DemoMaterialModule,FormsModule,ReactiveFormsModule,InfiniteScrollModule],

})
export class DineinModule {}
