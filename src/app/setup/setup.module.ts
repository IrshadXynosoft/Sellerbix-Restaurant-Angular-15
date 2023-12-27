import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup.component';
import { SetupRoutingModule } from './setup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LocationComponent } from './location/location.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { SurchargesDiscountsComponent } from './surcharges-discounts/surcharges-discounts.component';
import { TaxRatesComponent } from './tax-rates/tax-rates.component';
import { InnerMenuComponent } from './inner-menu/inner-menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { LocationStaffComponent } from './location-staff/location-staff.component';
import { DiningComponent } from './dining/dining.component';
import { PrintersComponent } from './printers/printers.component';
import { DeliverySettingsComponent } from './delivery-settings/delivery-settings.component';
import { SelfOrderingComponent } from './self-ordering/self-ordering.component';
import { StaffComponent } from './staff/staff.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddSurchargeComponent } from './add-surcharge/add-surcharge.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { AddOrderDiscountComponent } from './add-order-discount/add-order-discount.component';
import { AddItemDiscountComponent } from './add-item-discount/add-item-discount.component';
import { AddSalesTaxComponent } from './add-sales-tax/add-sales-tax.component';
import { AddDiningComponent } from './add-dining/add-dining.component';
import { DeliveryAreaComponent } from './delivery-area/delivery-area.component';
import { DeliveryManagerComponent } from './delivery-manager/delivery-manager.component';
import { AddDeliveryAreaComponent } from './add-delivery-area/add-delivery-area.component';
import { UploadDeliveryAreaComponent } from './upload-delivery-area/upload-delivery-area.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuSetupComponent } from './menu-setup/menu-setup.component';
import { EditMenuItemComponent } from './edit-menu-item/edit-menu-item.component';
import { AddMenuItemComponent } from './add-menu-item/add-menu-item.component';
import { UploadMenuComponent } from './upload-menu/upload-menu.component';
import { AddMenuCategoryComponent } from './add-menu-category/add-menu-category.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
import { StaffHistoryComponent } from './staff-history/staff-history.component';
import { AddNewStaffComponent } from './add-new-staff/add-new-staff.component';
import { AddNewStaffRoleComponent } from './add-new-staff-role/add-new-staff-role.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { OrderCancellationComponent } from './order-cancellation/order-cancellation.component';
import { OrderModifyReasonsComponent } from './order-modify-reasons/order-modify-reasons.component';
import { ComboSectionsComponent } from './combo-sections/combo-sections.component';
import { SupervisorPasswordComponent } from './supervisor-password/supervisor-password.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { ReferalsComponent } from './referals/referals.component';
import { ModifierListComponent } from './modifier-list/modifier-list.component';
import { ModifierGroupComponent } from './modifier-group/modifier-group.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { CrmAddressLabelsComponent } from './crm-address-labels/crm-address-labels.component';
import { OthersComponent } from './others/others.component';
import { AlternateLanguageComponent } from './alternate-language/alternate-language.component';
import { PartnerIntegrationsComponent } from './partner-integrations/partner-integrations.component';
import { PartnerAccountComponent } from './partner-account/partner-account.component';
import { AddReasonComponent } from './add-reason/add-reason.component';
import { AddModifyReasonComponent } from './add-modify-reason/add-modify-reason.component';
import { AddComboSectionComponent } from './add-combo-section/add-combo-section.component';
import { AddReferalComponent } from './add-referal/add-referal.component';
import { ManageModifierComponent } from './manage-modifier/manage-modifier.component';
import { AddModifierGroupComponent } from './add-modifier-group/add-modifier-group.component';
import { AddCustomerGroupComponent } from './add-customer-group/add-customer-group.component';
import { AddAlternativeComponent } from './add-alternative/add-alternative.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MatSliderModule } from '@angular/material/slider';
import { UpdateBillingComponent } from './update-billing/update-billing.component';
import { AddonsComponent } from './addons/addons.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { MatTableModule } from '@angular/material/table';
import { DemoMaterialModule } from '../material-module';

import { MatPaginatorModule } from '@angular/material/paginator';

import { EditSalesTaxComponent } from './edit-sales-tax/edit-sales-tax.component';
import { AddModifierComponent } from './add-modifier/add-modifier.component';

import { EditModifierComponent } from './edit-modifier/edit-modifier.component';
import { EditReasonComponent } from './edit-reason/edit-reason.component';
import { EditModifyReasonComponent } from './edit-modify-reason/edit-modify-reason.component';
import { EditSurchargeComponent } from './edit-surcharge/edit-surcharge.component';
import { EditComboSectionComponent } from './edit-combo-section/edit-combo-section.component';
import { EditOrderDiscountComponent } from './edit-order-discount/edit-order-discount.component';
import { EditMenuCategoryComponent } from './edit-menu-category/edit-menu-category.component';
import { EditModifierGroupComponent } from './edit-modifier-group/edit-modifier-group.component';
import { AddComboComponent } from './add-combo/add-combo.component';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component';
import { InventorySetupComponent } from './inventory-setup/inventory-setup.component';
import { RecipesComponent } from './recipes/recipes.component';
import { FinishedGoodsComponent } from './finished-goods/finished-goods.component';
import { SubRecipesComponent } from './sub-recipes/sub-recipes.component';
import { IngredientCategoryComponent } from './ingredient-category/ingredient-category.component';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { GlobalItemPreferenceComponent } from './global-item-preference/global-item-preference.component';
import { InventoryGlobalSettingsComponent } from './inventory-global-settings/inventory-global-settings.component';
import { InventorySettingsComponent } from './inventory-settings/inventory-settings.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { UploadIngredientComponent } from './upload-ingredient/upload-ingredient.component';
import { AddFinishedGoodsComponent } from './add-finished-goods/add-finished-goods.component';
import { AddIngredientCategoryComponent } from './add-ingredient-category/add-ingredient-category.component';
import { AddMeasurementUnitComponent } from './add-measurement-unit/add-measurement-unit.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { EditIngredientCategoryComponent } from './edit-ingredient-category/edit-ingredient-category.component';
import { EditMeasurementUnitsComponent } from './edit-measurement-units/edit-measurement-units.component';
import { EditSupplierComponent } from './edit-supplier/edit-supplier.component';
import { EditIngredientComponent } from './edit-ingredient/edit-ingredient.component';
import { AddSubrecipesComponent } from './add-subrecipes/add-subrecipes.component';
import { EditFinishedGoodsComponent } from './edit-finished-goods/edit-finished-goods.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { EditSubrecipesComponent } from './edit-subrecipes/edit-subrecipes.component';
import { EditItemDiscountComponent } from './edit-item-discount/edit-item-discount.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditCustomerGroupComponent } from './edit-customer-group/edit-customer-group.component';
import { EditStaffRoleComponent } from './edit-staff-role/edit-staff-role.component';
import { PrinterSettingsComponent } from './printer-settings/printer-settings.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuCategoryComponent } from './menu-category/menu-category.component';
import { EditDeliveryAreaComponent } from './edit-delivery-area/edit-delivery-area.component';
import { NewTemplateComponent } from './new-template/new-template.component';
import { CopyMenuComponent } from './menu-setup/copy-menu/copy-menu.component';
import { AddPrinterComponent } from './add-printer/add-printer.component';
import { LoyaltyComponent } from './loyalty/loyalty.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { ReportsComponent } from './reports/reports.component';
import { SalesReportItemDetailsComponent } from './sales-report-item-details/sales-report-item-details.component';
import { ItemWiseReportComponent } from './item-wise-report/item-wise-report.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DriversListComponent } from './drivers-list/drivers-list.component';
import { EditDriverComponent } from './edit-driver/edit-driver.component';
import { DeliveryDriverManagerComponent } from './delivery-driver-manager/delivery-driver-manager.component';
import { DeliveryShowDetailsComponent } from './delivery-show-details/delivery-show-details.component';
import { DeliveryShowDriverDetailsComponent } from './delivery-show-driver-details/delivery-show-driver-details.component';
import { SelectDriverComponent } from './select-driver/select-driver.component';
import { DeliveryDashboardComponent } from './delivery-dashboard/delivery-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CustomersComponent } from './customers/customers.component';
import { EditCustomerSetupComponent } from './edit-customer-setup/edit-customer-setup.component';
import { OnlineMenuComponent } from './online-menu/online-menu.component';
import { CategoryHeaderComponent } from './category-header/category-header.component';
import { BannersComponent } from './banners/banners.component';
import { AddCategoryHeaderComponent } from './add-category-header/add-category-header.component';
import { AddBannersComponent } from './add-banners/add-banners.component';
import { EditBannersComponent } from './edit-banners/edit-banners.component';
import { EditCategoryHeaderComponent } from './edit-category-header/edit-category-header.component';
import { ShowCommissionDetailsComponent } from './show-commission-details/show-commission-details.component';
import { AdsManagerComponent } from './ads-manager/ads-manager.component';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { OnlineOrderComponent } from './online-order/online-order.component';
import { SectionHeadsComponent } from './section-heads/section-heads.component';
import { AddSectionHeadsComponent } from './add-section-heads/add-section-heads.component';
import { MapProductsComponent } from './map-products/map-products.component';
import { EditSectionHeadsComponent } from './edit-section-heads/edit-section-heads.component';
import { ItemWiseDiscountComponent } from './item-wise-discount/item-wise-discount.component';
import { OnlineDeliveryManagerComponent } from './online-delivery-manager/online-delivery-manager.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { DeliveryEntitiesComponent } from './delivery-entities/delivery-entities.component';
import { AddDeliveryEntitiesComponent } from './add-delivery-entities/add-delivery-entities.component';
import { EditDeliveryEntitiesComponent } from './edit-delivery-entities/edit-delivery-entities.component';
import { UnpaidOrderReportComponent } from './unpaid-order-report/unpaid-order-report.component';
import { UnpaidCustomerReportComponent } from './unpaid-customer-report/unpaid-customer-report.component';
import { CommercialInvoiceComponent } from './commercial-invoice/commercial-invoice.component';
import { CommercialInvoicePaymentDialogComponent } from './commercial-invoice-payment-dialog/commercial-invoice-payment-dialog.component';
import { CommercialInvoiceReportComponent } from './commercial-invoice-report/commercial-invoice-report.component';
import { CommercialInvoiceDetailComponent } from './commercial-invoice-detail/commercial-invoice-detail.component';
import { CategoryScheduleComponent } from './category-schedule/category-schedule.component';
import { AddCategoryScheduleComponent } from './add-category-schedule/add-category-schedule.component';
import { EditCategoryScheduleComponent } from './edit-category-schedule/edit-category-schedule.component';
import { OnlineDeliveryChargeComponent } from './online-delivery-charge/online-delivery-charge.component';
import { CouponComponent } from './coupon/coupon.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';
import { OnlineSettingsComponent } from './online-settings/online-settings.component';
import { UtensilsComponent } from './utensils/utensils.component';
import { AddEditUtensilsComponent } from './add-edit-utensils/add-edit-utensils.component';
import { SocialMediaEntitiesComponent } from './social-media-entities/social-media-entities.component';
import { AddSocialMediaEntitiesComponent } from './add-social-media-entities/add-social-media-entities.component';
import { PosSettingsComponent } from './pos-settings/pos-settings.component';
import { OnlineOtherSettingsComponent } from './online-other-settings/online-other-settings.component';
import { PushNotificationSettingsComponent } from './push-notification-settings/push-notification-settings.component';
import { VoidReportComponent } from './void-report/void-report.component';
import { AdminPerformanceDetailsComponent } from './admin-performance-details/admin-performance-details.component';
import { StaffPointsComponent } from './staff-points/staff-points.component';
import { DriverSettlementComponent } from './driver-settlement/driver-settlement.component';
import { QrcodeMenuComponent } from './qrcode-menu/qrcode-menu.component';
import { SmtpSettingsComponent } from './smtp-settings/smtp-settings.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SmsGatewayComponent } from './sms-gateway/sms-gateway.component';
import { SmsSettingsComponent } from './sms-settings/sms-settings.component';
import { EditSmsGatewayComponent } from './edit-sms-gateway/edit-sms-gateway.component';
import { DriverCashSettlementComponent } from './driver-cash-settlement/driver-cash-settlement.component';
import { DriverOrderSettlementComponent } from './driver-order-settlement/driver-order-settlement.component';
import { UnpaidReportComponent } from './unpaid-report/unpaid-report.component';
import { DeliveryReportComponent } from './delivery-report/delivery-report.component';
import { AdvaneDiscountComponent } from './advane-discount/advane-discount.component';
import { AddAdvaneDiscountComponent } from './add-advane-discount/add-advane-discount.component';
import { ShowOnWebBranchesComponent } from './show-on-web-branches/show-on-web-branches.component';
import { AdvancePromotionsDetailComponent } from './advance-promotions-detail/advance-promotions-detail.component';
import { SendPushNotificationComponent } from './send-push-notification/send-push-notification.component';
import { SendPushNotificationDialogComponent } from './send-push-notification-dialog/send-push-notification-dialog.component';
import { ItemSalesReportComponent } from './item-sales-report/item-sales-report.component';
import { PaymentTypeReportComponent } from './payment-type-report/payment-type-report.component';
import { CategoryWiseReportComponent } from './category-wise-report/category-wise-report.component';
import { DiscountsReportComponent } from './discounts-report/discounts-report.component';
import { ExportPdfReportComponent } from './export-pdf-report/export-pdf-report.component';
import { ExportCategoryPdfComponent } from './export-category-pdf/export-category-pdf.component';
import { ExportDiscountComponent } from './export-discount/export-discount.component';
import { DriverPoolKeyComponent } from './driver-pool-key/driver-pool-key.component';
import { DeleteMenuComponent } from './menu-setup/delete-menu/delete-menu.component';
import { UpdatedSalesReportDetailComponent } from './updated-sales-report-detail/updated-sales-report-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CategoryDeleteConfirmationComponent } from './category-delete-confirmation/category-delete-confirmation.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { SubrecipeEditComponent } from './subrecipe-edit/subrecipe-edit.component';
import { FinishedgoodEditComponent } from './finishedgood-edit/finishedgood-edit.component';
import { ItemNoteSeggestionComponent } from './item-note-seggestion/item-note-seggestion.component';
import { AddItemNoteSeggestionComponent } from './add-item-note-seggestion/add-item-note-seggestion.component';
import { EditItemNoteSeggestionComponent } from './edit-item-note-seggestion/edit-item-note-seggestion.component';
import { QrcodeOrderComponent } from './qrcode-order/qrcode-order.component';
import { MapUserPrinterComponent } from './map-user-printer/map-user-printer.component';
import { TaxSubstituteComponent } from './tax-substitute/tax-substitute.component';
import { FoodCostCalculatorComponent } from './food-cost-calculator/food-cost-calculator.component';
import { NgxPrintModule } from 'ngx-print';
import { UtilitiesComponent } from './utilities/utilities.component';
import { AddUtilitiesComponent } from './add-utilities/add-utilities.component';
import { LoyaltyGroupComponent } from './loyalty-group/loyalty-group.component';
import { AddLoyaltyGroupComponent } from './add-loyalty-group/add-loyalty-group.component';
import { MapLoyaltyGroupComponent } from './map-loyalty-group/map-loyalty-group.component';
import { LoyaltyCouponsComponent } from './loyalty-coupons/loyalty-coupons.component';
import { AddLoyaltyCouponsComponent } from './add-loyalty-coupons/add-loyalty-coupons.component';
import { DeleteInventoryItemComponent } from './delete-inventory-item/delete-inventory-item.component';
import { RefundReportComponent } from './refund-report/refund-report.component';
import { ItemPricePlanComponent } from './item-price-plan/item-price-plan.component';
import { ItemAddPricePlanComponent } from './item-add-price-plan/item-add-price-plan.component';
import { OrderDiscountReportComponent } from './order-discount-report/order-discount-report.component';
import { ItemDiscountReportComponent } from './item-discount-report/item-discount-report.component';
import { DiscountOrderDetailsComponent } from './discount-order-details/discount-order-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    SetupComponent,
    LocationComponent,
    EditLocationComponent,
    GeneralDetailsComponent,
    MenuManagementComponent,
    SurchargesDiscountsComponent,
    TaxRatesComponent,
    InnerMenuComponent,
    LocationStaffComponent,
    DiningComponent,
    PrintersComponent,
    DeliverySettingsComponent,
    SelfOrderingComponent,
    StaffComponent,
    AddSurchargeComponent,
    AddLocationComponent,
    AddOrderDiscountComponent,
    AddItemDiscountComponent,
    AddSalesTaxComponent,
    AddDiningComponent,
    DeliveryAreaComponent,
    DeliveryManagerComponent,
    AddDeliveryAreaComponent,
    UploadDeliveryAreaComponent,
    MenuSetupComponent,
    EditMenuItemComponent,
    AddMenuItemComponent,
    UploadMenuComponent,
    AddMenuCategoryComponent,
    ManageMenuComponent,
    AddGroupComponent,
    StaffEditComponent,
    StaffHistoryComponent,
    AddNewStaffComponent,
    AddNewStaffRoleComponent,
    GlobalSettingsComponent,
    OrderCancellationComponent,
    OrderModifyReasonsComponent,
    ComboSectionsComponent,
    SupervisorPasswordComponent,
    PaymentMethodsComponent,
    ReferalsComponent,
    ModifierListComponent,
    ModifierGroupComponent,
    CustomerGroupComponent,
    CrmAddressLabelsComponent,
    OthersComponent,
    AlternateLanguageComponent,
    PartnerIntegrationsComponent,
    PartnerAccountComponent,
    AddReasonComponent,
    AddModifyReasonComponent,
    AddComboSectionComponent,
    AddReferalComponent,
    ManageModifierComponent,
    AddModifierGroupComponent,
    AddCustomerGroupComponent,
    AddAlternativeComponent,
    AddPaymentComponent,
    MyAccountComponent,
    UpdateBillingComponent,
    AddonsComponent,
    EditPaymentComponent,
    EditSalesTaxComponent,
    AddModifierComponent,
    EditModifierComponent,
    EditReasonComponent,
    EditModifyReasonComponent,
    EditSurchargeComponent,
    EditComboSectionComponent,
    EditOrderDiscountComponent,
    EditMenuCategoryComponent,
    EditModifierGroupComponent,
    AddComboComponent,
    EditTenantComponent,
    InventorySetupComponent,
    RecipesComponent,
    FinishedGoodsComponent,
    SubRecipesComponent,
    IngredientCategoryComponent,
    MeasurementUnitsComponent,
    SuppliersComponent,
    GlobalItemPreferenceComponent,
    InventoryGlobalSettingsComponent,
    InventorySettingsComponent,
    EditRecipeComponent,
    AddIngredientComponent,
    UploadIngredientComponent,
    AddFinishedGoodsComponent,
    AddIngredientCategoryComponent,
    AddMeasurementUnitComponent,
    AddSupplierComponent,
    EditIngredientCategoryComponent,
    EditMeasurementUnitsComponent,
    EditSupplierComponent,
    EditIngredientComponent,
    AddSubrecipesComponent,
    EditFinishedGoodsComponent,
    IngredientComponent,
    EditSubrecipesComponent,
    EditItemDiscountComponent,
    AddRecipeComponent,
    EditCustomerGroupComponent,
    EditStaffRoleComponent,
    PrinterSettingsComponent,
    MenuHeaderComponent,
    MenuCategoryComponent,
    EditDeliveryAreaComponent,
    NewTemplateComponent,
    CopyMenuComponent,
    AddPrinterComponent,
    LoyaltyComponent,
    SalesReportComponent,
    ReportsComponent,
    SalesReportItemDetailsComponent,
    ItemWiseReportComponent,
    DriversListComponent,
    EditDriverComponent,
    DeliveryDriverManagerComponent,
    DeliveryShowDetailsComponent,
    DeliveryShowDriverDetailsComponent,
    SelectDriverComponent,
    DeliveryDashboardComponent,
    CustomersComponent,
    EditCustomerSetupComponent,
    OnlineMenuComponent,
    CategoryHeaderComponent,
    BannersComponent,
    AddCategoryHeaderComponent,
    AddBannersComponent,
    EditBannersComponent,
    EditCategoryHeaderComponent,
    ShowCommissionDetailsComponent,
    AdsManagerComponent,
    OwnerDashboardComponent,
    OnlineOrderComponent,
    SectionHeadsComponent,
    AddSectionHeadsComponent,
    MapProductsComponent,
    EditSectionHeadsComponent,
    ItemWiseDiscountComponent,
    OnlineDeliveryManagerComponent,
    ProfileUpdateComponent,
    DeliveryEntitiesComponent,
    AddDeliveryEntitiesComponent,
    EditDeliveryEntitiesComponent,
    UnpaidOrderReportComponent,
    UnpaidCustomerReportComponent,
    CommercialInvoiceComponent,
    CommercialInvoicePaymentDialogComponent,
    CommercialInvoiceReportComponent,
    CommercialInvoiceDetailComponent,
    CategoryScheduleComponent,
    AddCategoryScheduleComponent,
    EditCategoryScheduleComponent,
    OnlineDeliveryChargeComponent,
    CouponComponent,
    AddCouponComponent,
    EditCouponComponent,
    OnlineSettingsComponent,
    UtensilsComponent,
    AddEditUtensilsComponent,
    SocialMediaEntitiesComponent,
    AddSocialMediaEntitiesComponent,
    PosSettingsComponent,
    OnlineOtherSettingsComponent,
    PushNotificationSettingsComponent,
    VoidReportComponent,
    AdminPerformanceDetailsComponent,
    StaffPointsComponent,
    DriverSettlementComponent,
    QrcodeMenuComponent,
    SmtpSettingsComponent,
    SmsGatewayComponent,
    SmsSettingsComponent,
    EditSmsGatewayComponent,
    DriverCashSettlementComponent,
    DriverOrderSettlementComponent,
    UnpaidReportComponent,
    DeliveryReportComponent,
    AdvaneDiscountComponent,
    AddAdvaneDiscountComponent,
    ShowOnWebBranchesComponent,
    AdvancePromotionsDetailComponent,
    SendPushNotificationComponent,
    SendPushNotificationDialogComponent,
    ItemSalesReportComponent,
    PaymentTypeReportComponent,
    CategoryWiseReportComponent,
    DiscountsReportComponent,
    ExportPdfReportComponent,
    ExportCategoryPdfComponent,
    ExportDiscountComponent,
    DriverPoolKeyComponent,
    DeleteMenuComponent,
    UpdatedSalesReportDetailComponent,
    CategoryDeleteConfirmationComponent,
    IngredientEditComponent,
    SubrecipeEditComponent,
    FinishedgoodEditComponent,
    ItemNoteSeggestionComponent,
    AddItemNoteSeggestionComponent,
    EditItemNoteSeggestionComponent,
    QrcodeOrderComponent,
    MapUserPrinterComponent,
    TaxSubstituteComponent,
    UtilitiesComponent,
    AddUtilitiesComponent,
    FoodCostCalculatorComponent,
    LoyaltyGroupComponent,
    AddLoyaltyGroupComponent,
    MapLoyaltyGroupComponent,
    LoyaltyCouponsComponent,
    AddLoyaltyCouponsComponent,
    DeleteInventoryItemComponent,
    RefundReportComponent,
    ItemPricePlanComponent,
    ItemAddPricePlanComponent,
    OrderDiscountReportComponent,
    ItemDiscountReportComponent,
    DiscountOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    SharedModule,
    MatTabsModule,
    MatDialogModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatExpansionModule,
    CdkAccordionModule,
    DemoMaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatFormFieldModule,
    MatSelectModule,
    NgApexchartsModule,
    QRCodeModule,
    DragDropModule,
    NgxPrintModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    ImageCropperModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class SetupModule { }
