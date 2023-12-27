import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMenuItemComponent } from './add-menu-item/add-menu-item.component';
import { AddonsComponent } from './addons/addons.component';
import { AlternateLanguageComponent } from './alternate-language/alternate-language.component';
import { ComboSectionsComponent } from './combo-sections/combo-sections.component';
import { CrmAddressLabelsComponent } from './crm-address-labels/crm-address-labels.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { DeliveryAreaComponent } from './delivery-area/delivery-area.component';
import { DeliveryManagerComponent } from './delivery-manager/delivery-manager.component';
import { DeliverySettingsComponent } from './delivery-settings/delivery-settings.component';
import { DiningComponent } from './dining/dining.component';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { EditMenuItemComponent } from './edit-menu-item/edit-menu-item.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { GlobalSettingsComponent } from './global-settings/global-settings.component';
import { InnerMenuComponent } from './inner-menu/inner-menu.component';
import { LocationStaffComponent } from './location-staff/location-staff.component';
import { LocationComponent } from './location/location.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { MenuSetupComponent } from './menu-setup/menu-setup.component';
import { ModifierGroupComponent } from './modifier-group/modifier-group.component';
import { ModifierListComponent } from './modifier-list/modifier-list.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderCancellationComponent } from './order-cancellation/order-cancellation.component';
import { OrderModifyReasonsComponent } from './order-modify-reasons/order-modify-reasons.component';
import { OthersComponent } from './others/others.component';
import { PartnerAccountComponent } from './partner-account/partner-account.component';
import { PartnerIntegrationsComponent } from './partner-integrations/partner-integrations.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { PrintersComponent } from './printers/printers.component';
import { PrinterSettingsComponent } from './printer-settings/printer-settings.component';
import { ReferalsComponent } from './referals/referals.component';
import { SelfOrderingComponent } from './self-ordering/self-ordering.component';
import { SetupComponent } from './setup.component';
import { StaffComponent } from './staff/staff.component';
import { SupervisorPasswordComponent } from './supervisor-password/supervisor-password.component';
import { SurchargesDiscountsComponent } from './surcharges-discounts/surcharges-discounts.component';
import { TaxRatesComponent } from './tax-rates/tax-rates.component';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component'
import { InventorySetupComponent } from './inventory-setup/inventory-setup.component';
import { RecipesComponent } from './recipes/recipes.component';
import { FinishedGoodsComponent } from './finished-goods/finished-goods.component';
import { SubRecipesComponent } from './sub-recipes/sub-recipes.component';
import { InventorySettingsComponent } from './inventory-settings/inventory-settings.component';
import { IngredientCategoryComponent } from './ingredient-category/ingredient-category.component';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { GlobalItemPreferenceComponent } from './global-item-preference/global-item-preference.component';
import { InventoryGlobalSettingsComponent } from './inventory-global-settings/inventory-global-settings.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';
import { UploadComponent } from '../upload/upload.component';
import { AddFinishedGoodsComponent } from './add-finished-goods/add-finished-goods.component';
import { EditIngredientComponent } from './edit-ingredient/edit-ingredient.component';
import { EditFinishedGoodsComponent } from './edit-finished-goods/edit-finished-goods.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { AddSubrecipesComponent } from './add-subrecipes/add-subrecipes.component';
import { EditSubrecipesComponent } from './edit-subrecipes/edit-subrecipes.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { MenuHeaderComponent } from './menu-header/menu-header.component';
import { MenuCategoryComponent } from './menu-category/menu-category.component';
import { NewTemplateComponent } from './new-template/new-template.component';
import { CopyMenuComponent } from './menu-setup/copy-menu/copy-menu.component';
import { LoyaltyComponent } from './loyalty/loyalty.component';
import { ReportsComponent } from './reports/reports.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { ItemWiseReportComponent } from './item-wise-report/item-wise-report.component';
import { DriversListComponent } from './drivers-list/drivers-list.component';
import { DeliveryDriverManagerComponent } from './delivery-driver-manager/delivery-driver-manager.component';
import { DeliveryDashboardComponent } from './delivery-dashboard/delivery-dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { OnlineMenuComponent } from './online-menu/online-menu.component';
import { CategoryHeaderComponent } from './category-header/category-header.component';
import { BannersComponent } from './banners/banners.component';
import { AdsManagerComponent } from './ads-manager/ads-manager.component';
import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { OnlineOrderComponent } from './online-order/online-order.component';
import { SectionHeadsComponent } from './section-heads/section-heads.component';
import { ItemWiseDiscountComponent } from './item-wise-discount/item-wise-discount.component';
import { OnlineDeliveryManagerComponent } from './online-delivery-manager/online-delivery-manager.component';
import { DeliveryEntitiesComponent } from './delivery-entities/delivery-entities.component';
import { UnpaidOrderReportComponent } from './unpaid-order-report/unpaid-order-report.component';
import { UnpaidCustomerReportComponent } from './unpaid-customer-report/unpaid-customer-report.component';
import { CommercialInvoiceComponent } from './commercial-invoice/commercial-invoice.component';
import { CommercialInvoiceReportComponent } from './commercial-invoice-report/commercial-invoice-report.component';
import { CategoryScheduleComponent } from './category-schedule/category-schedule.component';
import { OnlineDeliveryChargeComponent } from './online-delivery-charge/online-delivery-charge.component';
import { CouponComponent } from './coupon/coupon.component';
import { OnlineSettingsComponent } from './online-settings/online-settings.component';
import { UtensilsComponent } from './utensils/utensils.component';
import { SocialMediaEntitiesComponent } from './social-media-entities/social-media-entities.component';
import { PosSettingsComponent } from './pos-settings/pos-settings.component';
import { OnlineOtherSettingsComponent } from './online-other-settings/online-other-settings.component';
import { PushNotificationSettingsComponent } from './push-notification-settings/push-notification-settings.component';
import { VoidReportComponent } from './void-report/void-report.component';
import { AdminPerformanceDetailsComponent } from './admin-performance-details/admin-performance-details.component';
import { StaffPointsComponent } from './staff-points/staff-points.component';
import { SmtpSettingsComponent } from './smtp-settings/smtp-settings.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeMenuComponent } from '../qr-code-menu/qr-code-menu.component';
import { QrcodeMenuComponent } from './qrcode-menu/qrcode-menu.component';
import { SmsGatewayComponent } from './sms-gateway/sms-gateway.component';
import { UnpaidReportComponent } from './unpaid-report/unpaid-report.component';
import { DeliveryReportComponent } from './delivery-report/delivery-report.component';
import { AdvaneDiscountComponent } from './advane-discount/advane-discount.component';
import { ShowOnWebBranchesComponent } from './show-on-web-branches/show-on-web-branches.component';
import { SendPushNotificationComponent } from './send-push-notification/send-push-notification.component';
import { ItemSalesReportComponent } from './item-sales-report/item-sales-report.component';
import { PaymentTypeReportComponent } from './payment-type-report/payment-type-report.component';
import { CategoryWiseReportComponent } from './category-wise-report/category-wise-report.component';
import { DiscountsReportComponent } from './discounts-report/discounts-report.component';
import { DriverPoolKeyComponent } from './driver-pool-key/driver-pool-key.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { SubrecipeEditComponent } from './subrecipe-edit/subrecipe-edit.component';
import { FinishedgoodEditComponent } from './finishedgood-edit/finishedgood-edit.component';
import { ItemNoteSeggestionComponent } from './item-note-seggestion/item-note-seggestion.component';
import { QrcodeOrderComponent } from './qrcode-order/qrcode-order.component';
import { FoodCostCalculatorComponent } from './food-cost-calculator/food-cost-calculator.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { LoyaltyGroupComponent } from './loyalty-group/loyalty-group.component';
import { LoyaltyCouponsComponent } from './loyalty-coupons/loyalty-coupons.component';
import { RefundReportComponent } from './refund-report/refund-report.component';
import { ItemPricePlanComponent } from './item-price-plan/item-price-plan.component';
import { ItemAddPricePlanComponent } from './item-add-price-plan/item-add-price-plan.component';
import { OrderDiscountReportComponent } from './order-discount-report/order-discount-report.component';
import { ItemDiscountReportComponent } from './item-discount-report/item-discount-report.component';

const routes: Routes = [
  {
    path: '',
    component: SetupComponent
  },
  {
    path: 'location',
    component: LocationComponent
  },
  {
    path: 'globalSettings/entities',
    component: DeliveryEntitiesComponent
  },
  {
    path: 'globalSettings/showBranchOnWeb',
    component: ShowOnWebBranchesComponent
  },
  {
    path: 'globalSettings/utilities',
    component: UtilitiesComponent
  },

  {
    path: 'editLocation',
    component: EditLocationComponent
  },
  {
    path: ':id/editLocation',
    component: EditLocationComponent
  },
  {
    path: 'staff',
    component: StaffComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'reports/salesReport',
    component: SalesReportComponent
  },
  {
    path: 'reports/paymentReport',
    component: PaymentTypeReportComponent
  },
  {
    path: 'reports/itemWiseReport',
    component: ItemWiseReportComponent
  },
  {
    path: 'reports/discounts',
    component: DiscountsReportComponent
  },
  {
    path: 'reports/discounts/item',
    component: ItemDiscountReportComponent
  },
  {
    path: 'reports/discounts/order',
    component: OrderDiscountReportComponent
  },
  {
    path: 'reports/itemWiseSalesReport',
    component: ItemSalesReportComponent
  },

  {
    path: 'reports/catWiseReport',
    component: CategoryWiseReportComponent
  },
  {
    path: 'reports/CommercialInvoiceReport',
    component: CommercialInvoiceReportComponent
  },
  {
    path: 'reports/unPaidCustomerReport',
    component: UnpaidOrderReportComponent
  },
  {
    path: 'reports/unPaidOrderReport',
    component: UnpaidReportComponent
  },
  {
    path: 'reports/voidReport',
    component: VoidReportComponent
  },
   {
    path: 'reports/refundReport',
    component: RefundReportComponent
  },
  
  {
    path: 'CommercialInvoice/:customer_id',
    component: CommercialInvoiceComponent
  },
  {
    path: 'reports/unPaidCustomerReport/:customer_id',
    component: UnpaidCustomerReportComponent
  },
  {
    path: 'globalSettings',
    component: GlobalSettingsComponent
  },
  {
    path: 'myAccount',
    component: MyAccountComponent
  },
  {
    path: 'addons',
    component: AddonsComponent
  },
  {
    path: 'location/:id/online',
    component: OnlineMenuComponent
  },
  {
    path: 'location/:id/online/category',
    component: CategoryHeaderComponent
  },
  {
    path: 'location/:id/online/banners',
    component: BannersComponent
  },
  {
    path: 'location/:id/online/pushNotification',
    component: SendPushNotificationComponent
  },
  {
    path: 'location/:id/online/sectonHeads',
    component: SectionHeadsComponent
  },
  {
    path: 'location/:id/online/socialMediaEntities',
    component: SocialMediaEntitiesComponent
  },
  {
    path: 'location/:id/online/settings',
    component: OnlineOtherSettingsComponent
  },
  {
    path: 'location/:id/online/itemWiseDiscount',
    component: ItemWiseDiscountComponent
  },
  {
    path: 'location/:id/online/coupons',
    component: CouponComponent
  },
  {
    path: 'location/:id/online/onlineSettings',
    component: OnlineSettingsComponent
  },
  {
    path: 'location/:id/online/advanceDiscount',
    component: AdvaneDiscountComponent
  },

  {
    path: 'location/:id/online/deliveryCharge',
    component: OnlineDeliveryChargeComponent
  },
  {
    path: 'location/:id/online/onlineDeliveryManager',
    component: OnlineDeliveryManagerComponent
  },
  {
    path: 'location/:id/settings',
    component: OthersComponent
  },
  {
    path: 'location/:id/loyaltyGroup',
    component: LoyaltyGroupComponent
  },
  {
    path: 'location/:id/loyaltyCoupon',
    component: LoyaltyCouponsComponent
  },
  {
    path: 'location/:id/settings/pos',
    component: PosSettingsComponent
  },
  {
    path: 'location/:id/settings/push-notifications',
    component: PushNotificationSettingsComponent
  },
  {
    path: 'addons/loyalty',
    component: LoyaltyComponent
  },
  {
    path: 'addons/adsManager',
    component: AdsManagerComponent
  },
  {
    path: 'addons/ownerDashboard',
    component: OwnerDashboardComponent
  },
  {
    path: 'addons/onlineOrder',
    component: OnlineOrderComponent
  },
  {
    path: 'addons/qrcodeMenu',
    component: QrcodeMenuComponent
  },
  {
    path: 'addons/qrcodeOrder',
    component: QrcodeOrderComponent
  },
  {
    path: 'addons/smtpSettings',
    component: SmtpSettingsComponent
  },
  {
    path: 'addons/SmsGateway',
    component: SmsGatewayComponent
  },
  {
    path: 'addons/driverPool',
    component: DriverPoolKeyComponent
  },
  {
    path: 'partner',
    component: PartnerIntegrationsComponent
  },
  {
    path: 'staff_summary',
    component: AdminPerformanceDetailsComponent
  },
  {
    path: 'addons/staffpoints',
    component: StaffPointsComponent
  },
  {
    path: 'partner/account',
    component: PartnerAccountComponent
  },
  {
    path: 'location/:id/generalDetails',
    component: GeneralDetailsComponent
  },
  {
    path: 'location/:id/menuManagement',
    component: MenuManagementComponent
  },
  {
    path: 'location/:id/menuManagement/subchargesDiscount',
    component: SurchargesDiscountsComponent
  },
  {
    path: 'location/:id/menuManagement/menuInner',
    component: InnerMenuComponent
  },
  {
    path: 'location/:id/menuManagement/taxRates',
    component: TaxRatesComponent
  },
  {
    path: 'location/:id/menuManagement/utensils',
    component: UtensilsComponent
  },
  {
    path: 'location/:id/menuManagement/itemNote',
    component: ItemNoteSeggestionComponent
  },
  {
    path: 'location/:id/staff',
    component: LocationStaffComponent
  },
  {
    path: 'location/:id/dining',
    component: DiningComponent
  },
  {
    path: 'location/:id/selfOrdering',
    component: SelfOrderingComponent
  },
  {
    path: 'location/:id/customers',
    component: CustomersComponent
  },

  {
    path: 'location/:id/printers',
    component: PrintersComponent
  },
  {
    path: 'location/:id/printers/settings',
    component: PrinterSettingsComponent
  },
  {
    path: 'delivery_settings',
    component: DeliverySettingsComponent
  },
  {
    path: 'delivery_settings/report',
    component: DeliveryReportComponent
  },
  {
    path: 'delivery_settings/area',
    component: DeliveryAreaComponent
  },
  {
    path: 'addons/manager',
    component: DeliveryManagerComponent
  },
  {
    path: 'menuSetup',
    component: MenuHeaderComponent
    //component:MenuSetupComponent
  },
  {
    path: 'menuHeader/menuCategory',
    component: MenuCategoryComponent
    //component:MenuSetupComponent
  },
  {
    path: 'menuHeader/menu',
    //component:MenuHeaderComponent
    component: MenuSetupComponent
  },
  {
    path: 'menuHeader/categorySchedule',
    component: CategoryScheduleComponent
  },
  {
    path: 'menuSetup/addNewMenuItem',
    component: AddMenuItemComponent
  },
  {
    path: 'menuSetup/editmenuItem',
    component: EditMenuItemComponent
  },
  {
    path: 'menuSetup/editmenuItem/:id',
    component: EditMenuItemComponent
  },
  {
    path: 'globalSettings/orderCancellation',
    component: OrderCancellationComponent
  },
  {
    path: 'globalSettings/orderModify',
    component: OrderModifyReasonsComponent
  },
  {
    path: 'globalSettings/comboSections',
    component: ComboSectionsComponent
  },
  {
    path: 'globalSettings/passwords',
    component: SupervisorPasswordComponent
  },
  {
    path: 'globalSettings/payment',
    component: PaymentMethodsComponent
  },
  {
    path: 'globalSettings/referals',
    component: ReferalsComponent
  },
  {
    path: 'menuHeader/modifierList',
    component: ModifierListComponent
  },
  {
    path: 'menuHeader/modifierGroup',
    component: ModifierGroupComponent
  },
  {
    path: 'globalSettings/customerGroup',
    component: CustomerGroupComponent
  },
  {
    path: 'globalSettings/crm',
    component: CrmAddressLabelsComponent
  },
  // {
  //   path: 'globalSettings/others',
  //   component:OthersComponent
  // },
  // {
  //   path: 'globalSettings/others/pos',
  //   component:PosSettingsComponent
  // },
  // {
  //   path: 'globalSettings/others/online',
  //   component:OnlineOtherSettingsComponent
  // },
  // {
  //   path: 'globalSettings/others/push-notifications',
  //   component:PushNotificationSettingsComponent
  // },
  {
    path: 'globalSettings/alternativelanguages',
    component: AlternateLanguageComponent
  },
  {
    path: 'editTenant/:id',
    component: EditTenantComponent
  },
  {
    path: 'inventorySetup',
    component: InventorySetupComponent
  },
  {
    path: 'inventorySetup/recipes',
    component: RecipesComponent
  },
  {
    path: 'inventorySetup/recipes/foodCostCalculator/:recipe_id/:type',
    component: FoodCostCalculatorComponent
  },
  {
    path: 'inventorySetup/finishedGoods',
    component: FinishedGoodsComponent
  },
  {
    path: 'inventorySetup/subrecipes',
    component: SubRecipesComponent
  },
  {
    path: 'inventorySetup/ingredients',
    component: IngredientComponent
  },

  {
    path: 'inventorySetup/settings',
    component: InventorySettingsComponent
  },
  {
    path: 'inventorySetup/ingredientCategory',
    component: IngredientCategoryComponent
  },
  {
    path: 'inventorySetup/mesurementUnits',
    component: MeasurementUnitsComponent
  },
  {
    path: 'inventorySetup/suppliers',
    component: SuppliersComponent
  },
  {
    path: 'inventorySetup/itemPreferences',
    component: GlobalItemPreferenceComponent
  },
  {
    path: 'inventorySetup/inventoryGlobal',
    component: InventoryGlobalSettingsComponent
  },
  {
    path: 'inventorySetup/recipes/edit/:id/:item/:type',
    component: EditRecipeComponent
  }, {
    path: 'inventorySetup/recipes/add/:id/:name/:price/:type',
    component: AddRecipeComponent
  },
  {
    path: 'inventorySetup/subrecipes/add',
    component: AddSubrecipesComponent
  },
  {
    path: 'inventorySetup/ingredient/add',
    component: AddIngredientComponent
  },
  // {
  //   path: 'inventorySetup/ingredient/edit',
  //   component:EditIngredientComponent
  // },
  {
    path: 'inventorySetup/ingredient/edit/:id',
    component: IngredientEditComponent

  },
  {
    path: 'inventorySetup/subrecipes/upload',
    component: UploadComponent
  },
  {
    path: 'inventorySetup/finishedGoods/add',
    component: AddFinishedGoodsComponent
  },
  {
    path: 'inventorySetup/finishedGoods/edit/:id',
    component: FinishedgoodEditComponent
  },
  {
    path: 'inventorySetup/subrecipes/edit/:id',
    component: SubrecipeEditComponent
  },
  {
    path: 'printers/:id/newtemplate',
    component: NewTemplateComponent
  },
  {
    path: 'printers/:id/editTemplate/:editid',
    component: NewTemplateComponent
  },
  {
    path: 'copyMenu/:id',
    component: CopyMenuComponent
  },
  {
    path: 'delivery_settings/driversList',
    component: DriversListComponent
  },
  {
    path: 'delivery_settings/deliveryManager',
    component: DeliveryDriverManagerComponent
  },
  {
    path: 'delivery_settings/deliveryDashboard',
    component: DeliveryDashboardComponent
  },
  {
    path: 'location/:id/menuManagement/pricePlan',
    component: ItemPricePlanComponent
  },
  {
    path: 'location/:id/menuManagement/pricePlan/addPricePlan',
    component: ItemAddPricePlanComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
