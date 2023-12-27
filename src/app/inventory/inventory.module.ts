import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { SharedModule } from '../shared/shared.module';
import { BatchProductionComponent } from './batch-production/batch-production.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { StockIssuesComponent } from './stock-issues/stock-issues.component';
import { StockOnHandComponent } from './stock-on-hand/stock-on-hand.component';
import { StockReceiptsComponent } from './stock-receipts/stock-receipts.component';
import { StockRequestsComponent } from './stock-requests/stock-requests.component';
import { StockTakesComponent } from './stock-takes/stock-takes.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NewPurchaseOrderComponent } from './new-purchase-order/new-purchase-order.component';
import { NewStockTakeComponent } from './new-stock-take/new-stock-take.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddHistoryComponent } from './add-history/add-history.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material-module';
import { SendPurchaseOrdersComponent } from './send-purchase-orders/send-purchase-orders.component';
import { PreviewPurchaseOrderComponent } from './preview-purchase-order/preview-purchase-order.component';
import { ReceivePurchaseOrderComponent } from './receive-purchase-order/receive-purchase-order.component';
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { ViewBatchProductionComponent } from './view-batch-production/view-batch-production.component';
import { ReportsComponent } from './reports/reports.component';
import { PurchaseOrderReportsComponent } from './purchase-order-reports/purchase-order-reports.component';
import { NewStockRequestComponent } from './new-stock-request/new-stock-request.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { ViewStockIssueDetailsComponent } from './view-stock-issue-details/view-stock-issue-details.component';
import { ViewStockRequestsComponent } from './view-stock-requests/view-stock-requests.component';
import { ReceiveStockRequestComponent } from './receive-stock-request/receive-stock-request.component';
import { NewStockReceiptsComponent } from './new-stock-receipts/new-stock-receipts.component';
import { EditStockTakeComponent } from './edit-stock-take/edit-stock-take.component';
import { ViewStockTakeComponent } from './view-stock-take/view-stock-take.component';
import { BatchProductionListComponent } from './batch-production-list/batch-production-list.component';
import { ReviewStockTakeComponent } from './review-stock-take/review-stock-take.component';
import { ViewStockRecieptsComponent } from './view-stock-reciepts/view-stock-reciepts.component';
import { NewStockIssueComponent } from './new-stock-issue/new-stock-issue.component';
import { ItemStockReportComponent } from './item-stock-report/item-stock-report.component';
import { BatchProductionReportComponent } from './batch-production-report/batch-production-report.component';
import { BatchProductionReportDetailComponent } from './batch-production-report-detail/batch-production-report-detail.component';
import { StockMovementReportComponent } from './stock-movement-report/stock-movement-report.component';
import { NgxPrintModule } from 'ngx-print';
import { InventoryMovementComponent } from './inventory-movement/inventory-movement.component';
import { ReorderReportComponent } from './reorder-report/reorder-report.component';
import { WastageReportComponent } from './wastage-report/wastage-report.component';
import { StockIssueReportComponent } from './stock-issue-report/stock-issue-report.component';
import { MenuRequestsComponent } from './menu-requests/menu-requests.component';
import { NewMenuRequestComponent } from './new-menu-request/new-menu-request.component';
import { ViewMenuRequestComponent } from './view-menu-request/view-menu-request.component';
import { MenuTransferComponent } from './menu-transfer/menu-transfer.component';
import { WastageReportDetailComponent } from './wastage-report-detail/wastage-report-detail.component';
import { PoReportDetailComponent } from './po-report-detail/po-report-detail.component';
import { ReceiveMenuRequestComponent } from './receive-menu-request/receive-menu-request.component';
import { StockConsumptionComponent } from './stock-consumption/stock-consumption.component';
import { FoodCostingReportComponent } from './food-costing-report/food-costing-report.component';
import { EditMenuRequestComponent } from './edit-menu-request/edit-menu-request.component';
import { SupplierPerformanceReportComponent } from './supplier-performance-report/supplier-performance-report.component';
import { SupplierPerformanceGraphComponent } from './supplier-performance-graph/supplier-performance-graph.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CurrentStockPrintComponent } from './current-stock-print/current-stock-print.component';
import { ConsumptionReportComponent } from './consumption-report/consumption-report.component';
import { NewConsignmentOrderComponent } from './new-consignment-order/new-consignment-order.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditConsignmentComponent } from './edit-consignment/edit-consignment.component';
@NgModule({
  declarations: [
    InventoryComponent,
    BatchProductionComponent,
    PurchaseOrdersComponent,
    StockIssuesComponent,
    StockOnHandComponent,
    StockReceiptsComponent,
    StockRequestsComponent,
    StockTakesComponent,
    StockTransferComponent,
    NewPurchaseOrderComponent,
    NewStockTakeComponent,
    AddHistoryComponent,
    NewOrderComponent,
    SendPurchaseOrdersComponent,
    PreviewPurchaseOrderComponent,
    ReceivePurchaseOrderComponent,
    ViewPurchaseOrderComponent,
    EditOrderComponent,
    ViewBatchProductionComponent,
    ReportsComponent,
    PurchaseOrderReportsComponent,
    NewStockRequestComponent,
    StockReportComponent,
    ViewStockIssueDetailsComponent,
    ViewStockRequestsComponent,
    ReceiveStockRequestComponent,
    NewStockReceiptsComponent,
    EditStockTakeComponent,
    ViewStockTakeComponent,
    BatchProductionListComponent,
    ReviewStockTakeComponent,
    ViewStockRecieptsComponent,
    NewStockIssueComponent,
    ItemStockReportComponent,
    BatchProductionReportComponent,
    BatchProductionReportDetailComponent,
    StockMovementReportComponent,
    InventoryMovementComponent,
    ReorderReportComponent,
    WastageReportComponent,
    StockIssueReportComponent,
    MenuRequestsComponent,
    NewMenuRequestComponent,
    ViewMenuRequestComponent,
    MenuTransferComponent,
    WastageReportDetailComponent,
    PoReportDetailComponent,
    ReceiveMenuRequestComponent,
    StockConsumptionComponent,
    FoodCostingReportComponent,
    EditMenuRequestComponent,
    SupplierPerformanceReportComponent,
    SupplierPerformanceGraphComponent,
    CurrentStockPrintComponent,
    ConsumptionReportComponent,
    NewConsignmentOrderComponent,
    EditConsignmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InventoryRoutingModule,
    MatTabsModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    NgxPrintModule,
    NgApexchartsModule,
    InfiniteScrollModule
  ]
})
export class InventoryModule { }
