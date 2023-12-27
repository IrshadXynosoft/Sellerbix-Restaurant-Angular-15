import { RepositionScrollStrategy } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchProductionListComponent } from './batch-production-list/batch-production-list.component';
import { BatchProductionReportComponent } from './batch-production-report/batch-production-report.component';
import { BatchProductionComponent } from './batch-production/batch-production.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { EditStockTakeComponent } from './edit-stock-take/edit-stock-take.component';
import { InventoryComponent } from './inventory.component';
import { ItemStockReportComponent } from './item-stock-report/item-stock-report.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { NewStockIssueComponent } from './new-stock-issue/new-stock-issue.component';
import { NewStockReceiptsComponent } from './new-stock-receipts/new-stock-receipts.component';
import { NewStockRequestComponent } from './new-stock-request/new-stock-request.component';
import { NewStockTakeComponent } from './new-stock-take/new-stock-take.component';
import { PreviewPurchaseOrderComponent } from './preview-purchase-order/preview-purchase-order.component';
import { PurchaseOrderReportsComponent } from './purchase-order-reports/purchase-order-reports.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { ReceivePurchaseOrderComponent } from './receive-purchase-order/receive-purchase-order.component';
import { ReceiveStockRequestComponent } from './receive-stock-request/receive-stock-request.component';
import { ReportsComponent } from './reports/reports.component';
import { ReviewStockTakeComponent } from './review-stock-take/review-stock-take.component';
import { SendPurchaseOrdersComponent } from './send-purchase-orders/send-purchase-orders.component';
import { StockIssuesComponent } from './stock-issues/stock-issues.component';
import { StockMovementReportComponent } from './stock-movement-report/stock-movement-report.component';
import { StockOnHandComponent } from './stock-on-hand/stock-on-hand.component';
import { StockReceiptsComponent } from './stock-receipts/stock-receipts.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { StockRequestsComponent } from './stock-requests/stock-requests.component';
import { StockTakesComponent } from './stock-takes/stock-takes.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { ViewBatchProductionComponent } from './view-batch-production/view-batch-production.component';
import { ViewPurchaseOrderComponent } from './view-purchase-order/view-purchase-order.component';
import { ViewStockIssueDetailsComponent } from './view-stock-issue-details/view-stock-issue-details.component';
import { ViewStockRecieptsComponent } from './view-stock-reciepts/view-stock-reciepts.component';
import { ViewStockRequestsComponent } from './view-stock-requests/view-stock-requests.component';
import { ViewStockTakeComponent } from './view-stock-take/view-stock-take.component';
import { InventoryMovementComponent } from './inventory-movement/inventory-movement.component';
import { StockIssueReportComponent } from './stock-issue-report/stock-issue-report.component';
import { WastageReportComponent } from './wastage-report/wastage-report.component';
import { ReorderReportComponent } from './reorder-report/reorder-report.component';
import { MenuRequestsComponent } from './menu-requests/menu-requests.component';
import { NewMenuRequestComponent } from './new-menu-request/new-menu-request.component';
import { ViewMenuRequestComponent } from './view-menu-request/view-menu-request.component';
import { MenuTransferComponent } from './menu-transfer/menu-transfer.component';
import { ReceiveMenuRequestComponent } from './receive-menu-request/receive-menu-request.component';
import { StockConsumptionComponent } from './stock-consumption/stock-consumption.component';
import { FoodCostingReportComponent } from './food-costing-report/food-costing-report.component';
import { EditMenuRequestComponent } from './edit-menu-request/edit-menu-request.component';
import { SupplierPerformanceReportComponent } from './supplier-performance-report/supplier-performance-report.component';
import { ConsumptionReportComponent } from './consumption-report/consumption-report.component';
import { NewConsignmentOrderComponent } from './new-consignment-order/new-consignment-order.component';
import { EditConsignmentComponent } from './edit-consignment/edit-consignment.component';


const routes: Routes =[
    {
        path: '',
        component:InventoryComponent
      },
      {
        path: 'batchProduction',
        component:BatchProductionListComponent
      },
      {
        path: 'newbatchProduction',
        component:BatchProductionComponent
      },
      
      {
        path: 'viewBatchProduction',
        component:ViewBatchProductionComponent
      },
      {
        path: 'purchaseOrders',
        component:PurchaseOrdersComponent
      },
      {
        path: 'stockIssues',
        component:StockIssuesComponent
      },
      {
        path: 'stockOnHand',
        component:StockOnHandComponent
      },
      {
        path: 'stockReceipts',
        component:StockReceiptsComponent
      },
      {
        path: 'viewReceipt',
        component:ViewStockRecieptsComponent
      },
      {
        path: 'stockRequests',
        component:StockRequestsComponent
      },
      {
        path: 'newstockRequests',
        component:NewStockRequestComponent
      },
      {
        path: 'menuRequests',
        component:MenuRequestsComponent
      },
      {
        path: 'newmenuRequests',
        component:NewMenuRequestComponent
      },
      {
        path: 'editmenurequest/:id',
        component:EditMenuRequestComponent
      },
      {
        path: 'stockTakes',
        component:StockTakesComponent
      }, {
        path: 'reviewStocktake/:id',
        component:ReviewStockTakeComponent
      },
      
      {
        path: 'stockTransfer',
        component:StockTransferComponent
      },
      {
        path: 'menuTransfer',
        component:MenuTransferComponent
      },
      {
        path: 'newOrder',
        component:NewConsignmentOrderComponent
      },
      {
        path: 'newStocktake/:branchid',
        component:NewStockTakeComponent
      },
      {
        path: 'sendpurchaseOrders/:type/:id',
        component:SendPurchaseOrdersComponent
      },
      {
        path: 'previewpurchaseOrders',
        component:PreviewPurchaseOrderComponent
      },
      {
        path: 'viewpurchaseOrder/:id',
        component:ViewPurchaseOrderComponent
      },
      {
        path: 'editpurchaseOrder/:id/:branch_id',
        component:EditConsignmentComponent
      },
      {
        path: 'receivepurchaseOrder/:id',
        component:ReceivePurchaseOrderComponent
      }, {
        path: 'reports',
        component:ReportsComponent
      },
      {
        path: 'purchaseOrderReport',
        component:PurchaseOrderReportsComponent
      },
      {
        path: 'stockReport',
        component:StockReportComponent
      },
      {
        path: 'itemStockReport',
        component:ItemStockReportComponent
      },
      {
        path: 'batchProductionReport',
        component:BatchProductionReportComponent
      },
      {
        path: 'stockMovement',
        component:StockMovementReportComponent
      },
      {
        path: 'reOrderReport',
        component:ReorderReportComponent
      },
      {
        path: 'wastageReport',
        component:WastageReportComponent
      },
      {
        path: 'stockIssueReport',
        component:StockIssueReportComponent
      },
      {
        path: 'stockConsumptionReport',
        component:ConsumptionReportComponent
      },
      {
        path: 'foodCostingReport',
        component:FoodCostingReportComponent
      },
      {
        path: 'stockissuedetail',
        component:ViewStockIssueDetailsComponent
      },
      {
        path: 'newstockissue',
        component:NewStockIssueComponent
      },{
        path: 'stockrequestdetail',
        component:ViewStockRequestsComponent
      },
      {
        path: 'menurequestdetail',
        component:ViewMenuRequestComponent
      },
      {
        path: 'receivestockrequest',
        component:ReceiveStockRequestComponent
      },
      {
        path: 'receivemenustockrequest',
        component:ReceiveMenuRequestComponent
      },
      
      {
        path: 'newstockReceipt',
        component:NewStockReceiptsComponent
      },
      {
        path: 'editStocktake/:id',
        component:EditStockTakeComponent
      }, {
        path: 'viewStocktake/:id',
        component:ViewStockTakeComponent
      },
      {
        path: 'inventoryMovement',
        component:InventoryMovementComponent
      },
      {
        path: 'supplierReport',
        component:SupplierPerformanceReportComponent
      }
      



];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class InventoryRoutingModule { }
  
