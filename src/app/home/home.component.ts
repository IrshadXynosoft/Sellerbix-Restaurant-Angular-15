import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddItemComponent } from './add-item/add-item.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { GroupedItemComponent } from './add-groupeditem/grouped-item/grouped-item.component';
import { ComboItemComponent } from './combo-item/combo-item.component';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AddDiscountComponent } from './add-discount/add-discount.component';
import { AddNotesComponent } from './add-notes/add-notes.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DataService } from '../_services/data.service';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '../_services/localstore.service';
import { VoidOrderComponent } from './void-order/void-order.component';
import { ModifyReasonComponent } from './modify-reason/modify-reason.component';
import { Observable, Subscription } from 'rxjs';
import { CrmOrderConfirmationComponent } from './crm-order-confirmation/crm-order-confirmation.component';
import { Constants } from 'src/constants';
import { DateService } from './date.service';
import * as moment from 'moment';
import { PrintMqttService } from '../_services/mqtt/print-mqtt.service';
import { ConfirmationDialogService } from '../_services/confirmation-dialog.service';
import packageversion from '../../../package.json';
import { AddSurchargeComponent } from './add-surcharge/add-surcharge.component';
import { OpenSaleNotificationComponent } from './open-sale-notification/open-sale-notification.component';
import { UtensilsComponent } from './utensils/utensils.component';
import { LabelPrintComponent } from './label-print/label-print.component';
import { InvoiceKotPrintComponent } from './invoice-kot-print/invoice-kot-print.component';
import { SubscriptionStatusDialogComponent } from './subscription-status-dialog/subscription-status-dialog.component';
import { KotMqttService } from '../_services/mqtt/kot-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { CustomerLoyaltyCouponsComponent } from './customer-loyalty-coupons/customer-loyalty-coupons.component';
import { SelectWaiterComponent } from './select-waiter/select-waiter.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { NewOrderService } from '../_services/mqtt/new-order-mqtt.service';
import { ChangeTaxComponent } from './change-tax/change-tax.component';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  SelectedItems: any = [];
  Cart: any = [];
  flagCartItem = false;
  flagCartPayment = false;
  classactive: any;
  CategoryItems: any = [];
  CategoryRecords: any = [];
  modifierRecords: any = [];
  groupedItemRecords: any = [];
  editModifierData: any = [];
  selectedDiscount: any = {};
  tempSurcharges = [];
  public paymentForm!: UntypedFormGroup;
  notes: any;
  item_note: any = [];
  orderDiscountFlag = false; // for disabling order discount button if it is true
  itemDiscountFlag = false; // for disabling item discount button if it is true
  orderID = null;
  invoiceID = null;
  orderNumber = null;
  surchargearray: any = [];
  taxarray = [];
  effectedSurcharge: any = [];
  effectedTax: any = [];
  walkinEditRecords: any = [];
  // public url:string = this.route.snapshot.url.join('');
  public url: string = this.router.url;
  public id: string = this.route.snapshot.params.id;
  public table_id: string = this.route.snapshot.params.table_id;
  // public order_no: string = this.route.snapshot.params.crm_Orderno;
  // public custom_entity_name: string = this.route.snapshot.params.custom_entity_name;
  public custom_entity_id: string = this.route.snapshot.params.custom_entity_id;
  dineinFlag: boolean = false; // for adding new dinein order
  editdineinFlag: boolean = false; // for editing dinein order
  crmFlag: boolean = false; // for adding crm order
  editcrmFlag: boolean = false; // for editing crm order
  pickupFlag: boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  branchName = this.localservice.get('branchname');
  branch_id = this.localservice.get('branch_id');
  staff = this.localservice.get('user1');
  branch_settings: any = this.localservice.get('branch_settings');
  entity_Id: any;
  imageBasePath = this.constant.imageBasePath;
  branchrecords: any = [];
  crmRecords: any = []; // for getting CRM in records(using getdata)
  crm_branch_id: any;
  time$: Observable<any>;
  // loyality_points:any={};
  customer_id: any = null;
  invalidFlag: boolean = false;
  dineinReservation: any = {};
  public appVersion: string = packageversion.version;
  crm_branchnameSelected: any;
  crm_customer_mob_no: any;
  advancePaid: any;
  showPrintFlag: boolean = false;
  entity_order_no: any;
  customerRecords: any = {};
  inventory_status: any;
  invalidQuantityPrize: boolean = false;
  messageType: any = 'kot';
  dineInMessage: string = 'DineInListener';
  orderListMessage: string = 'OrderListListener';
  messageForMenuStatus: any = 'menuStatus';
  utensil_status: any =
    this.localservice.get('utensil_status') != undefined
      ? this.localservice.get('utensil_status')
      : 'false';
  printOffline: any = this.localservice.get('printOffline');
  subscriptionStatus: any = this.localservice.get('subscriptionStatus');
  subscriptionForMenuStatus!: Subscription;
  audio: any;
  accept_payment: any = this.localservice.get('accept_payment');
  showCoupon: any = this.localservice.get('loyalty_coupon');
  couponSelected: any; //for loyalty coupon;
  tableName: any;
  waiterChoosen = new UntypedFormControl(
    { value: '', disabled: false },
    Validators.required
  );
  waiterRecords: any = [];
  paxNo = new UntypedFormControl({ value: '', disabled: false });
  assignWaiter: any = this.localservice.get('branch_settings')?.assign_waiter;
  selectedWaiter: any;
  merged_order_ids: any = [];
  party_date: any;
  disabledFlag: any = false; // used to disable place order or modify button when one time clicked
  @ViewChild('Searchitem') Searchitem!: ElementRef<HTMLInputElement>;
  constructor(
    private readonly kotMqtt: KotMqttService,
    private dialogService: ConfirmationDialogService,
    private printMqtt: PrintMqttService,
    private dateService: DateService,
    private constant: Constants,
    private localservice: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private snackBService: SnackBarService,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private dataservice: DataService,
    private readonly newOrderMqtt: NewOrderService,
    private datePipe: DatePipe,
  ) {
    this.time$ = this.dateService.getDate();
    this.tableName = this.dataservice.getData('tableName');
  }
  ngOnInit(): void {
    this.taxGet();
    this.audio = new Audio();
    this.audio.src = 'assets/audio/driver.wav';
    this.url = this.router.url;
    this.onBuildPaymentForm();
    this.checkOpenSaleStatus();
    this.routerCheck();
    this.getMenuCategory();
    this.getWaiters();
    this.getBranch();
    this.getSubscriptionStatus();
  }

  ngAfterViewInit(): void {
    this.subscribeToTopicForMenuStatus();
    this.Searchitem.nativeElement.focus();
  }

  onBuildPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      name: null,
      phone_number: [null, Validators.pattern('^([0-9]{6,13})$')],
    });
  }

  /**
   * Validates a phone number input based on a specific pattern.
   * The pattern allows 6 to 13 digits.
   *
   * @param input - The phone number to be validated.
   */
  phonenumberValidCheck(input: any) {
    if (input.match('^([0-9]{6,13})$')) {
      this.invalidFlag = false;
    } else {
      this.invalidFlag = true;
      if (input == '') {
        this.invalidFlag = false;
      }
    }
  }

  getWaiters() {
    this.httpService
      .get('waiters/' + this.branch_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.waiterRecords = result.data;
        } else {
          console.log('Error');
        }
      });
  }

  /**
   * This method subscribes to a topic for menu status changes and performs actions accordingly.
   */
  subscribeToTopicForMenuStatus() {
    this.subscriptionForMenuStatus = this.kotMqtt
      .topic(this.messageForMenuStatus)
      .subscribe((data: IMqttMessage) => {
        this.refreshMenu();
        this.audio.load();
        this.audio.play();
        this.snackBService.openSnackBar('Menu Status Changed', 'Close');
      });
  }

  getBranch() {
    this.httpService.get('branch').subscribe((result) => {
      if (result.status == 200) {
        this.branchrecords = result.data.tenant_branches;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Checks the subscription status and performs actions based on the result.
   */
  getSubscriptionStatus() {
    if (this.subscriptionStatus != false) {
      this.httpService.get('subscription-status').subscribe((result) => {
        if (result.status == 200) {
          if (result.data.flag == 1 || result.data.flag == 2) {
            const dialogRef = this.dialog.open(
              SubscriptionStatusDialogComponent,
              {
                disableClose: true,
                width: '500px',
                data: {
                  result: result.data,
                },
              }
            );
            dialogRef.afterClosed().subscribe((result) => {});
          } else if (result.data.flag == 3) {
            let message: any = result.data.msg;
            this.localservice.store('subscriptionExpiredMessage', message);
            this.router.navigate(['subscription-expired']);
          }
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.dataservice.setData('merged_order_ids', null);
    this.subscriptionForMenuStatus.unsubscribe();
  }

  /**
   * Checks the current URL path and performs actions accordingly.
   * This function is typically called during the initialization phase.
   */
  routerCheck() {
    if (this.url == '/home/walkin') {
      this.entity_Id = '1';
    } else if (this.url == '/home/dinein/' + this.table_id) {
      this.dineinFlag = true;
      this.entity_Id = '2';
      if (this.dataservice.getData('merged_order_ids')) {
        this.walkinEditRecords = this.dataservice.getData('editData');
        this.merged_order_ids = this.dataservice.getData('merged_order_ids');
        this.SelectedItems = this.walkinEditRecords;
        this.flagCartItem = true;
        this.Cart.tax = this.calculateTax();
        setTimeout(() => {
          this.updateSubTotal();
        }, 700);
      }
    } else if (
      this.url ==
      '/home/dinein/' + this.table_id + '/' + 'reservation'
    ) {
      this.dineinFlag = true;
      this.entity_Id = '2';
      this.dineinReservation = this.dataservice.getData('reservationdetails');
      this.customer_id = this.dineinReservation.customer_id;
      this.paymentForm.patchValue({
        name: this.dineinReservation.customer_name,
        phone_number: this.dineinReservation.contact_no,
      });
      if (this.dineinReservation.contact_no) {
        this.paymentForm.disable();
      }
    } else if (this.url == '/home/crm/new_order') {
      this.SelectedItems = [];
      this.crmFlag = true;
      this.entity_Id = '3';
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.locationDetails.branch_id;
      this.crm_branchnameSelected = this.crmRecords.locationDetails.branch_name;
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      if (this.crm_customer_mob_no) {
        this.paymentForm.disable();
      }
    } else if (this.url == '/home/crm/entity/' + this.custom_entity_id) {
      this.SelectedItems = [];
      this.crmFlag = true;
      this.pickupFlag = true;
      this.entity_Id = '3';
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.entity_order_no = this.dataservice.getData('CustomEntityOrderNO');
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.locationDetails.branch_id;
      this.crm_branchnameSelected = this.crmRecords.locationDetails.branch_name;
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      if (this.crm_customer_mob_no) {
        this.paymentForm.disable();
      }
    } else if (this.url == '/home/crm/pickup/new_order') {
      this.SelectedItems = [];
      this.crmFlag = true;
      this.pickupFlag = true;
      this.entity_Id = '3';
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.locationDetails.branch_id;
      this.crm_branchnameSelected = this.crmRecords.locationDetails.branch_name;
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      if (this.crm_customer_mob_no) {
        this.paymentForm.disable();
      }
    } else if (this.url == '/home/party_orders/confirm_order') {
      this.SelectedItems = [];
      this.entity_Id = '8';
      this.flagCartItem = true;
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.paxNo.setValue(
        this.crmRecords.party_details.pax_no
          ? this.crmRecords.party_details.pax_no
          : null
      );
      this.SelectedItems = this.dataservice.getData('editData');
      this.advancePaid = this.dataservice.getData('advancepayment')
        ? this.dataservice.getData('advancepayment')
        : null;
      this.Cart.tax = this.calculateTax();
      setTimeout(() => {
        this.updateSubTotal();
      }, 700);
      this.party_date = this.crmRecords.party_details.date;
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.party_details.branch_id;
      this.crm_branchnameSelected = this.crmRecords.party_details.branch_name;
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      this.paymentForm.disable();
      console.log(this.entity_Id);
      
    }
  }

  /**
   * Checks the status of the daybook sale and displays a notification if it is closed.
   * If the daybook sale is closed, a popup is shown with relevant information.
   * If the API request fails or returns a non-200 status, an error message is displayed.
   */
  checkOpenSaleStatus() {
    this.httpService.get('check-businessday-status').subscribe((result) => {
      if (result.status == 200) {
        if (result.data.business_day_status != 'open') {
          const dialogRef = this.dialog.open(OpenSaleNotificationComponent, {
            disableClose: true,
            width: '500px',
            data: {
              openingBalance: result.data.opening_bal,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {});
        }
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Opens a dialog to display and select surcharges.
   * The dialog is implemented using the `AddSurchargeComponent`.
   * After the dialog is closed, updates the surcharge array and recalculates the subtotal.
   */
  getSurcharges() {
    const dialogRef = this.dialog.open(AddSurchargeComponent, {
      width: '800px',
      data: {
        entity_id: this.entity_Id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.surchargearray = result;
        this.updateSubTotal();
      }
    });
  }

  /**
   * Opens a dialog to display and select loyalty coupons based on the provided phone number.
   * The dialog is implemented using the `CustomerLoyaltyCouponsComponent`.
   * After the dialog is closed, updates the selected coupon and recalculates the subtotal.
   * Displays a snack bar message if no phone number is provided in the payment form.
   */
  getLoyaltyCoupons() {
    if (this.paymentForm.value['phone_number']) {
      const dialogRef = this.dialog.open(CustomerLoyaltyCouponsComponent, {
        width: '800px',
        data: {
          contact_no: this.paymentForm.value['phone_number'],
          order_value: this.Cart.amount,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.couponSelected = result;
          this.updateSubTotal();
        }
      });
    } else {
      this.snackBService.openSnackBar('Please Enter Phone Number', 'Close');
    }
  }

  /**
   * Fetches tax information from the server using an HTTP GET request.
   * Updates the local 'taxarray' with the received tax data.
   * Displays a snack bar message if the server response indicates an error.
   */
  taxGet() {
    this.httpService.get('tax').subscribe((result) => {
      if (result.status == 200) {
        this.taxarray = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Retrieves menu categories based on the entity ID and branch ID.
   * If the categories are not cached locally, makes an HTTP request to fetch them from the server.
   * Caches the fetched categories locally for future use.
   * Displays a snack bar message if the server response indicates an error.
   */
  getMenuCategory(): void {
    // Create a unique key for storing/retrieving menu items in local storage
    let entityKey = 'menuItem' + this.entity_Id;

    // Attempt to retrieve menu items from local storage
    let menuItem = this.localservice.get(entityKey);

    // Check if menu items are not available locally
    if (menuItem == null) {
      // Make an HTTP GET request to fetch menu items from the server
      this.httpService
        .get(
          'menu-items/' +
            this.branch_id +
            '/' +
            (this.entity_Id == 8 ? 3 : this.entity_Id)
        )
        .subscribe((result) => {
          // Check if the request was successful (status code 200)
          if (result.status == 200) {
            // Update 'CategoryRecords' with the fetched menu items
            this.CategoryRecords = result.data;

            // Cache the fetched menu items locally
            this.localservice.store(entityKey, this.CategoryRecords);

            // Add a default category for ALL items
            this.CategoryRecords.unshift({
              category_id: -1,
              category_name: 'ALL',
              colour: '#0778',
            });

            // Trigger a method to handle category change (e.g., loading items from the selected category)
            this.OnCategoryChange(this.CategoryRecords[0]);
          } else {
            // Display an error message using the SnackBar service if the API request fails
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      // Use locally cached menu items
      this.CategoryRecords = menuItem;

      // Add a default category for ALL items
      this.CategoryRecords.unshift({
        category_id: -1,
        category_name: 'ALL',
        colour: '#0778',
      });

      // Trigger a method to handle category change (e.g., loading items from the selected category)
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  /**
   * Handles the change of menu category and updates the displayed items accordingly.
   * Sets the active category for styling purposes.
   *
   * @param items - The selected menu category.
   */
  OnCategoryChange(items: any): void {
    // Set the active category for styling purposes
    this.classactive = items.category_id;

    // Check if the selected category is 'ALL'
    if (items.category_id == -1) {
      this.CategoryItems = [];

      // Iterate through all categories and their items, adding each item to 'CategoryItems'
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            this.CategoryItems.push(obj2);
          });
        }
      });
    }
    // Check if the selected category is a special category (e.g., 'Quick Items')
    else if (items.category_id == 0) {
      this.CategoryItems = [];

      // Iterate through all categories and their items, adding each quick item to 'CategoryItems'
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            if (obj2.is_quick_item == 1) this.CategoryItems.push(obj2);
          });
        }
      });
    }
    // Handle other categories
    else {
      // Check if the selected category has items and update 'CategoryItems' accordingly
      if (items.item) this.CategoryItems = items.item;
      else this.CategoryItems = [];
    }
  }

  /**
   * Opens a dialog to select utensils using the 'UtensilsComponent'.
   * After the dialog is closed, adds the selected utensils to the cart as grouped items.
   */
  getUtensils(): void {
    // Open a dialog to select utensils
    const dialogRef = this.dialog.open(UtensilsComponent, {
      width: '800px',
      maxHeight: '600px',
    });

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe((result) => {
      // Check if a result is returned from the dialog
      if (result) {
        // Add the selected utensils to the cart as grouped items (type 2)
        this.addToCart(result, 2);
      }
    });
  }

  /**
   * Determines the text to be displayed on the action button based on the current order context.
   * If an order ID is present, returns 'Modify Order'.
   * If there are merged order IDs, returns 'Merge Order'.
   * Otherwise, returns 'Place Order'.
   *
   * @returns The text for the action button.
   */
  showBtnName(): string {
    // Check if there are merged order IDs
    if (this.merged_order_ids.length > 0) {
      return 'Merge Order';
    } else {
      // Return 'Place Order' if neither condition is met
      return 'Place Order';
    }
  }

  /**
   * Places an order with the selected items and customer details.
   * Validates the order and displays appropriate messages in case of errors.
   * Performs actions based on the order context such as modifying, merging, or placing a new order.
   */
  placeOrder(): void {
    // Set a flag to disable the button temporarily
    this.disabledFlag = true;

    // Check if the mobile number is valid
    if (!this.invalidFlag) {
      // Check if any selected item has a quantity less than 1
      let zeroFlag = false;
      this.SelectedItems.forEach((obj: any) => {
        if (obj.qty < 1) {
          zeroFlag = true;
        }
      });

      // Check if there are no quantity or prize errors
      if (!zeroFlag && !this.invalidQuantityPrize) {
        // Get the current date and time for order details
        let date = moment();
        let todayDate = date.format('YYYY-MM-DD');
        let currentTime = date.format('HH:mm:ss');
        let randomOrderNo =
          date.format('YYYY:DD:MM') + '_' + date.format('hh:mm:ss');

        // Prepare the order body
        let body = {
          // Order details
          notes: this.notes,
          order_number: !this.route.snapshot.params.id
            ? 'ORD_' + randomOrderNo
            : this.route.snapshot.params.id,
          items: this.SelectedItems,
          entity_id: this.custom_entity_id
            ? this.custom_entity_id
            : this.entity_Id,
          Total: this.Cart.amount,
          table_id: this.route.snapshot.params.table_id
            ? this.route.snapshot.params.table_id
            : null,
          customer_id: this.crmFlag
            ? this.crmRecords.customer_id
            : this.customer_id,
          // Customer details for CRM
          customer_name: this.crmFlag ? this.crmRecords.customer_name : null,
          address_id: this.crmFlag ? this.crmRecords.locationDetails.id : null,
          crm_contact_no: this.crmFlag ? this.crm_customer_mob_no : null,
          address:
            this.crmFlag || this.crmRecords?.party_details?.order_type == 3
              ? {
                  branch_id: this.crm_branch_id,
                  branch_name: this.crm_branchnameSelected,
                  building_or_villa: this.crmRecords.locationDetails
                    ?.building_or_villa
                    ? this.crmRecords.locationDetails?.building_or_villa
                    : null,
                  country_id: this.crmRecords.locationDetails?.country_id
                    ? this.crmRecords.locationDetails.country_id
                    : null,
                  country_name: this.crmRecords.locationDetails?.country_name
                    ? this.crmRecords.locationDetails?.country_name
                    : null,
                  id: this.crmRecords.locationDetails?.id
                    ? this.crmRecords.locationDetails?.id
                    : null,
                  street: this.crmRecords.locationDetails?.street
                    ? this.crmRecords.locationDetails?.street
                    : null,
                }
              : null,
          branch_id: this.crmFlag ? this.crm_branch_id : this.branch_id,
          branch_name: this.crmFlag ? this.crm_branchnameSelected : null,
          kitchen_status: 'new',
          ref_number: null,
          store_pickup:
            this.url == '/home/crm/pickup/new_order' ||
            this.url == '/home/crm/pickup/edit_order/' + this.id
              ? true
              : false,
          current_time: currentTime,
          current_date: todayDate,
          customer_details: {
            name: this.paymentForm.value['name'],
            phone_number: this.paymentForm.value['phone_number'],
          },
          // CRM reservation details
          reservation_id:
            this.dineinReservation != 'undefined'
              ? this.dineinReservation.reservation_id
              : null,
          // Order mode based on context
          order_mode:
            this.dineinReservation != 'undefined' ||
            this.url == '/home/party_orders/modify_order/' + this.id ||
            this.url == '/home/party_orders/confirm_order'
              ? 1
              : null,
          // Selected loyalty coupon
          loyalty_coupon: this.couponSelected ? this.couponSelected : null,
          // Cart details
          Cart: {
            Items: this.SelectedItems,
            amount: this.Cart.amount,
            discount: this.Cart.discount,
            otherCharge: this.Cart.otherCharge,
            subTotal: this.Cart.subTotal,
            tax: this.effectedTax[0]?.effected_price
              ? this.effectedTax[0]?.effected_price
              : 0.0,
            loyalty_coupon: this.couponSelected ? this.couponSelected : null,
          },
          // Discount and surcharge details
          discount: this.selectedDiscount,
          surcharge: this.surchargearray,
          discount_selected: this.Cart.discount ? this.Cart.discount : null,
          surcharge_selected: this.Cart.otherCharge
            ? this.Cart.otherCharge
            : null,
          applied_surcharge: this.effectedSurcharge
            ? this.effectedSurcharge
            : [],
          // Tax details
          tax_selected: this.effectedTax[0]?.effected_price
            ? this.effectedTax[0]?.effected_price
            : 0.0,
          tax_array: this.taxarray ? this.taxarray : [],
          applied_tax: this.effectedTax ? this.effectedTax : [],
          print_bill: true,
          entity_order_no: this.entity_order_no ? this.entity_order_no : null,
          table_name: this.tableName,
          // Waiter assignment
          assign_to: this.waiterChoosen.value
            ? {
                id: this.waiterChoosen.value.id,
                name: this.waiterChoosen.value.name,
              }
            : null,
          // Pax number for party orders
          pax_no: this.paxNo.value ? this.paxNo.value : null,
          // Merged order IDs for order merging
          merged_order_ids: this.merged_order_ids
            ? this.merged_order_ids
            : null,
          party_date: this.party_date,
          bulk_order_id: this.crmRecords.id ? this.crmRecords.id : null,
          // Order type for CRM
          order_type: this.crmRecords.party_details?.order_type
            ? this.crmRecords.party_details?.order_type
            : null,
          // Advance paid for party orders
          advance_paid: this.advancePaid,
        };

        // Check if the current context involves a new CRM order
        if (
          this.url == '/home/crm/new_order' ||
          this.url == '/home/crm/pickup/new_order' ||
          this.url == '/home/crm/entity/' + this.custom_entity_id
        ) {
          // Set flags for cart views
          this.flagCartPayment = false;
          this.flagCartItem = true;

          // Open a confirmation dialog for CRM orders
          const dialogRef = this.dialog.open(CrmOrderConfirmationComponent, {
            disableClose: true,
            width: '60%',
            data: {
              orderno: this.id,
              url: this.url,
              items: this.SelectedItems,
              total: this.Cart.amount,
              customerDetails: this.crmRecords,
              customEntityFlag: this.custom_entity_id ? true : false,
              Cart: this.Cart,
            },
          });

          // Subscribe to the dialog's afterClosed event
          dialogRef.afterClosed().subscribe((result) => {
            if (result == true || result == false) {
              const print_bill = result;

              // Make an HTTP POST request to place the order
              this.httpService.post('orders', body).subscribe((result) => {
                if (result.status == 200) {
                  this.disabledFlag = false;
                  this.customer_id = result.data.customer_id;
                  this.orderID = result.data.id;
                  this.snackBService.openSnackBar(
                    'Order Placed Successfully',
                    'Close'
                  );
                  this.showPrintFlag = true;
                  this.customerRecords = this.paymentForm.value;
                  this.paymentForm.reset();
                  this.publishOrderNew();
                  this.printKOTorInvoice(result.data.receipt);
                  if (print_bill == true) {
                    this.invoiceReprint();
                  }
                  this.publishOrderForOrderList();
                  this.router.navigate(['callcenter']);
                } else {
                  this.snackBService.openSnackBar('Error', 'Close');
                }
              });
            }
          });
        } else {
          // Check if the current context involves merged orders
          if (this.merged_order_ids.length > 0) {
            body.print_bill = false;
          }

          // Make an HTTP POST request to place the order
          this.httpService.post('orders', body).subscribe((result) => {
            if (result.status == 200) {
              this.disabledFlag = false;
              this.orderID = result.data.id;
              this.snackBService.openSnackBar(
                'Order Placed Successfully!!',
                'Close'
              );
              this.showPrintFlag = true;
              this.customer_id = result.data.customer_id;
              this.publishOrderForOrderList();
              this.customerRecords = this.paymentForm.value;
              this.paymentForm.reset();
              this.publishOrderNew();

              // Publish order for dine-in context
              if (this.entity_Id == '2') {
                this.publishOrderDineIn();
              }

              // Print KOT or invoice
              this.printKOTorInvoice(result.data.receipt);

              // Show order details
              this.showOrderDetails(result.data);
            } else {
              this.snackBService.openSnackBar('Error', 'Close');
            }
          });
        }
      } else {
        this.snackBService.openSnackBar('Invalid Quantity or Prize', 'Close');
      }
    } else {
      this.snackBService.openSnackBar('Invalid mobile number', 'Close');
    }
  }

  /**
   * Checks if a waiter has been chosen or if waiter assignment is not required.
   * If valid, proceeds to place the order by calling the 'placeOrder' function.
   * If not valid, displays a snackbar indicating the need to choose a waiter.
   */
  checkWaiterChoosed(): void {
    // Check if a waiter has been chosen or waiter assignment is not required
    if (this.waiterChoosen.valid || this.assignWaiter == false) {
      // Proceed to place the order
      this.placeOrder();
    } else {
      // Display a snackbar indicating the need to choose a waiter
      this.snackBService.openSnackBar('Please choose a waiter', 'Close');
    }
  }

  itemTime() {
    const currenttime = new Date();
    return this.datePipe.transform(currenttime, 'H:mm');
  }

  /**
   * Publishes a new order event using MQTT for KOT (Kitchen Order Ticket) display.
   * Sends the message 'new' to the specified MQTT topic.
   */
  publishOrderNew() {
    //mqtt call for kot display
    let data = 'new';
    this.kotMqtt.publish(this.messageType, data).subscribe((data: any) => {});
  }

  /**
   * Publishes an MQTT message for order list display.
   * This method sends an MQTT message to display the order list.
   * @returns {void}
   */
  publishOrderForOrderList() {
    //mqtt call for orderlist display
    let data = 'orderlist';
    this.newOrderMqtt
      .publish(this.orderListMessage, data)
      .subscribe((data: any) => {});
  }

  /**
   * Publishes an MQTT message for dine-in order display.
   * This method sends an MQTT message to display dine-in orders.
   * @returns {void}
   */
  publishOrderDineIn() {
    //mqtt call for dinein display
    let data = 'dinein';
    this.newOrderMqtt
      .publish(this.dineInMessage, data)
      .subscribe((data: any) => {});
  }

  /**
   * Opens a dialog to display order details using the 'OrderDetailsComponent'.
   * Handles the dialog's afterClosed event to take actions based on the result.
   *
   * @param orders - The order details to be displayed.
   */
  showOrderDetails(orders: any): void {
    // Open a dialog to display order details
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      disableClose: true,
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orders,
      },
    });

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe((result) => {
      // Take actions based on the result from the dialog
      if (result == 'closed') {
        // Close the current order and initiate a new order
        this.newOrder();
      }
    });
  }

  /**
   * Initiates a new order by resetting relevant variables and components.
   * Resets selected items, flags, discounts, order details, and form values.
   * Navigates to specific routes based on the current context.
   */
  newOrder() {
    this.SelectedItems = [];
    this.flagCartPayment = false;
    this.flagCartItem = false;
    this.selectedDiscount = {};
    this.orderDiscountFlag = false;
    this.itemDiscountFlag = false;
    this.orderID = null;
    this.notes = null;
    this.surchargearray = [];
    this.effectedSurcharge = [];
    this.showPrintFlag = false;
    this.couponSelected = null;
    this.waiterChoosen.setValue('');
    this.paxNo.setValue('');
    this.paymentForm.reset();
    this.disabledFlag = false;
    if (
      this.url == '/home/dinein/' + this.table_id ||
      this.url == '/home/dinein/' + this.table_id + '/' + 'reservation'
    ) {
      this.router.navigate(['dinein']);
    } else if (
      this.url == '/home/party_orders/modify_order/' + this.id ||
      this.url == '/home/party_orders/confirm_order'
    ) {
      this.router.navigate(['walkin/entity-orders']);
    } else {
      this.taxGet();
    }
  }

  /**
   * Opens a dialog to void/cancel an order using the 'VoidOrderComponent'.
   * Passes the order ID as data to the dialog.
   * Handles the dialog's afterClosed event for any necessary actions.
   */
  voidOrder() {
    const dialogRef = this.dialog.open(VoidOrderComponent, {
      width: '600px',
      data: {
        orderid: this.orderID,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * Checks if an item has modifiers, grouped items, or is a combo item,
   * and opens the respective dialog for user interaction.
   * Adds the selected items to the cart based on the user's choices.
   *
   * @param items - The item details to be checked and processed.
   */
  checkforModifier(items: any): void {
    if (items.modifier_group) {
      // Open a dialog to add modifiers to the item
      const dialogRef = this.dialog.open(AddItemComponent, {
        width: '800px',
        data: {
          item: items.item_id,
          modifier_group: items.modifier_group,
          item_name: items.item_name,
          operation: '1', // for add
        },
      });

      // Subscribe to the dialog's afterClosed event
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.modifierRecords = result;
          // Add the item to the cart after selecting modifiers
          this.addToCart(items, 1);
        }
      });
    } else if (items.item_type == 2) {
      // Open a dialog for grouped items
      const dialogRef = this.dialog.open(GroupedItemComponent, {
        width: '500px',
        data: {
          groupedItems: items.group_item,
          name: items.item_name,
          price: items.default_price,
        },
      });

      // Subscribe to the dialog's afterClosed event
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Check if the grouped item has modifiers
          let comboResult = result;
          if (comboResult.modifier_group) {
            // Open a dialog to add modifiers to the grouped item
            const dialogRef = this.dialog.open(AddItemComponent, {
              width: '800px',
              data: {
                item: comboResult.item_id,
                modifier_group: comboResult.modifier_group,
                item_name: comboResult.item_name,
                operation: '1', // for add
              },
            });

            // Subscribe to the dialog's afterClosed event
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.modifierRecords = result;
                // Add the grouped item to the cart after selecting modifiers
                this.addToCart(comboResult, 1);
              }
            });
          } else {
            // Add the grouped item to the cart without modifiers
            this.addToCart(comboResult, 2); // type 2 is accepted as grouped menu
          }
        }
      });
    } else if (items.item_type == 3) {
      // Open a dialog for combo items
      const dialogRef = this.dialog.open(ComboItemComponent, {
        width: '500px',
        data: {
          comboItems: items,
        },
      });

      // Subscribe to the dialog's afterClosed event
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Add the combo item to the cart after user selection
          this.addToCart(result, 1);
        }
      });
    } else {
      // Add the regular menu item to the cart (with or without modifiers)
      this.addToCart(items, 1); // type 1 is a regular menu item
    }
  }

  /**
   * Filters items based on a given key (search term).
   * If a key is provided, it filters items whose names or codes include the key.
   * If no key is provided, it resets the items to the original category items.
   *
   * @param key - The search term to filter items.
   */
  filterItems(key: any): void {
    if (key) {
      // Check if there are items in the current category
      if (this.CategoryItems.length < 1) {
        // If no items, reset to the original category items
        this.OnCategoryChange(this.CategoryRecords[0]);
      }

      // Filter items based on the provided key
      const filteredItems = this.CategoryItems.filter(function (obj: any) {
        return (
          obj.item_name.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          obj.item_code.toLocaleLowerCase().includes(key.toLocaleLowerCase())
        );
      });

      // Update the category items with the filtered items
      this.CategoryItems = filteredItems;
    } else {
      // If no key is provided, reset to the original category items
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  /**
   * Adds an item to the shopping cart based on the item type.
   *
   * @param items - The item details to be added to the cart.
   * @param type - The type of item (1 for regular menu, 2 for grouped menu).
   */
  addToCart(items: any, type: any) {
    //type 1 is  Regularmenu with or without modifiers & type 2 accept as grouped menu
    this.Searchitem.nativeElement.focus();
    this.flagCartItem = true;
    this.flagCartPayment = false;
    this.showPrintFlag = false;
    if (type == 1) {
      // var found = this.SelectedItems.find(function (obj: any) {
      //   return obj.id == items.item_id;
      // });

      // if (
      //   found &&  !this.SelectedItems[this.SelectedItems.indexOf(found)].modifiers
      // ) {
      //   this.quantityPlus(this.SelectedItems.indexOf(found));
      // } else {
      if (items.modifier_group) {
        let itemSelected = {
          id: items.item_id,
          name: items.item_name,
          sec_name: items.item_sec_name,
          qty: 1,
          price: parseFloat(items.default_price).toFixed(2),
          orginal_price: parseFloat(items.default_price).toFixed(2),
          total_fordiscount: this.updatePriceWithModifiers(
            items.default_price,
            this.modifierRecords
          ),
          item_discount_id: null,
          note: null,
          description: items.description,
          kitchen_status: 'new',
          total: this.updatePriceWithModifiers(
            items.default_price,
            this.modifierRecords
          ),
          modifiers: this.modifierRecords,
          modify_reason_id: null,
          inventory_status: null,
          order_status: 'new',
          is_utensil: false,
          is_editable: items.is_editable,
          difference_qty: 0,
          time: this.itemTime(),
        };
        this.SelectedItems.push(itemSelected);
        this.modifierRecords = [];
      } else {
        let itemSelected = {
          id: items.item_id,
          name: items.item_name,
          sec_name: items.item_sec_name,
          qty: 1,
          item_discount_id: null,
          note: null,
          description: items.description,
          kitchen_status: 'new',
          price: parseFloat(items.default_price).toFixed(2),
          orginal_price: parseFloat(items.default_price).toFixed(2),
          total: parseFloat(items.default_price).toFixed(2),
          total_fordiscount: parseFloat(items.default_price).toFixed(2),
          modify_reason_id: null,
          inventory_status: null,
          order_status: 'new',
          is_utensil: false,
          is_editable: items.is_editable,
          difference_qty: 0,
          time: this.itemTime(),
        };
        this.SelectedItems.push(itemSelected);
      }
      // }
      this.Cart.Items = this.SelectedItems;
      this.flagCartItem = true;
      this.updateSubTotal();
    }
    if (type == 2) {
      if (items.is_utensil) {
        var found = this.SelectedItems.find(function (obj: any) {
          return obj.id == items.id && obj.is_utensil;
        });
      } else {
        var found = this.SelectedItems.find(function (obj: any) {
          return obj.id == items.id && !obj.is_utensil;
        });
      }
      // if (found) {
      //   this.quantityPlus(this.SelectedItems.indexOf(found));
      // } else {
      let itemSelected = {
        id: items.item_id,
        name: items.item_name,
        sec_name: items.item_sec_name,
        qty: 1,
        price: parseFloat(items.price).toFixed(2),
        orginal_price: parseFloat(items.price).toFixed(2),
        total: parseFloat(items.price).toFixed(2),
        item_discount_id: null,
        note: null,
        description: items.description,
        kitchen_status: 'new',
        total_fordiscount: parseFloat(items.price).toFixed(2),
        modify_reason_id: null,
        inventory_status: null,
        order_status: 'new',
        is_utensil: items.is_utensil ? true : false,
        is_return: false,
        is_editable: items.is_editable,
        difference_qty: 0,
        time: this.itemTime(),
      };
      this.SelectedItems.push(itemSelected);
      // }
      this.Cart.Items = this.SelectedItems;
      this.flagCartItem = true;
      this.updateSubTotal();
    }
  }

  /**
   * Checks if the modifier list has at least one modifier with a status set to true.
   *
   * @param modifierlist - The list of modifiers to be checked.
   * @returns True if there is at least one modifier with status set to true, otherwise false.
   */
  checkForValidTree(modifierlist: any) {
    let statusTrueCnt = _.filter(modifierlist.list, function (ls) {
      if (ls.status) return ls;
    }).length;
    if (statusTrueCnt > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the total price for a selected item based on its quantity and unit price.
   *
   * @param index - The index of the selected item in the list of selected items.
   */
  updatePrice(index: any): void {
    if (this.SelectedItems.length > 0) {
      // Calculate the total price for the selected item
      this.SelectedItems[index].total = (
        parseFloat(this.SelectedItems[index].qty) *
        parseFloat(this.SelectedItems[index].price)
      ).toFixed(2);
      // Update the overall subtotal
      this.updateSubTotal();
    }
  }

  /**
   * Calculates the total price for an item with modifiers.
   *
   * @param locationprice - The base price of the item.
   * @param modifiers - The list of modifiers with their rates and quantities.
   * @returns The total price of the item considering modifiers.
   */
  updatePriceWithModifiers(locationprice: any, modifiers: any): string {
    let total = 0.0;
    // Iterate through each modifier and calculate the total price
    modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          // Add the contribution of each modifier to the total
          total +=
            parseFloat(obj1.rate) *
            parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1);
        }
      });
    });
    // Return the total price including modifiers, formatted to two decimal places
    return (parseFloat(locationprice) + total).toFixed(2);
  }

  /**
   * Checks and updates the total price for an item based on its quantity and price.
   *
   * @param items - The item information including quantity, price, and modifiers.
   * @param index - The index of the item in the list.
   */
  checkForItemprice(items: any, index: any): void {
    this.invalidQuantityPrize = false;

    // Check if the price is greater than 0, and if the price and quantity are valid numeric values
    if (
      items.price > 0 &&
      items.price.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$') &&
      items.qty > 0
    ) {
      // Check if the item has modifiers and update the total accordingly
      if (items.modifiers) {
        this.updateTotalWithModifiers(index);
      } else {
        // Update the total price without modifiers
        this.updatePrice(index);
      }
    } else {
      // Set the flag for invalid quantity or price
      this.invalidQuantityPrize = true;
      this.snackBService.openSnackBar('Invalid Quantity or Prize', 'Close');
    }
  }

  /**
   * Updates the total price for an item considering its modifiers.
   *
   * @param index - The index of the item in the list.
   */
  updateTotalWithModifiers(index: any): void {
    let total = 0.0;

    // Iterate through modifiers and calculate the total based on selected modifiers
    this.SelectedItems[index].modifiers?.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total +=
            parseFloat(obj1.rate) *
            parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1);
        }
      });
    });

    // Update the total price considering quantity and modifiers
    this.SelectedItems[index].total = (
      parseFloat(this.SelectedItems[index].qty) *
      (parseFloat(this.SelectedItems[index].price) + total)
    ).toFixed(2);
    // Update the overall subtotal
    this.updateSubTotal();
  }

  /**
   * Deletes the order-level discount from the selected items.
   * Resets the order-level discount and updates the overall subtotal.
   */
  deleteOrderdiscount() {
    this.selectedDiscount = {};
    this.itemDiscountFlag = false;
    this.updateSubTotal();
  }

  /**
   * Deletes all surcharges from the selected items.
   * Resets the surcharge array and updates the overall subtotal.
   */
  deleteSurcharge() {
    this.surchargearray = [];
    this.updateSubTotal();
  }

  /**
   * Deletes the selected coupon from the order.
   * Resets the coupon selected and updates the overall subtotal.
   */
  deleteCoupon() {
    this.couponSelected = null;
    this.updateSubTotal();
  }

  /**
   * Asynchronously updates the overall subtotal of the order.
   * Calculates and sets the subtotal, tax, surcharge, discount, loyalty coupon, and total amount.
   * If an advance payment is made, deducts it from the total amount.
   * Adjusts the final amount based on applied discounts or loyalty coupons.
   */
  async updateSubTotal(): Promise<void> {
    // Initialize the temporary variable for subtotal calculation
    let temp = 0.0;

    // Calculate the subtotal based on selected items
    for (let i = 0; i < this.SelectedItems.length; i++) {
      temp += parseFloat(this.SelectedItems[i].total);
    }

    // Set the subtotal in the Cart
    this.Cart.subTotal = temp.toFixed(2);

    // Calculate and set the tax, surcharge, discount, loyalty coupon, and total amount
    this.Cart.tax = (await this.calculateTax()).toFixed(2);
    this.Cart.otherCharge = (await this.calculateSurcharge()).toFixed(2);
    this.Cart.discount = (await this.calculateDiscount()).toFixed(2);
    this.Cart.loyaltyCoupon = this.couponSelected
      ? this.couponSelected.applied_discount?.toFixed(2)
      : 0.0;

    // Calculate the total amount
    this.Cart.amount = (
      parseFloat(this.Cart.subTotal) +
      parseFloat(this.Cart.tax) +
      parseFloat(this.Cart.otherCharge) -
      parseFloat(this.Cart.discount)
    ).toFixed(2);

    // Deduct advance payment, if made
    if (this.advancePaid) {
      this.Cart.amount = (
        parseFloat(this.Cart.amount) - parseFloat(this.advancePaid)
      ).toFixed(2);
    }

    // Adjust the final amount based on applied discounts or loyalty coupons
    if (this.couponSelected?.applied_discount) {
      this.Cart.amount = (
        parseFloat(this.Cart.amount) - parseFloat(this.Cart.loyaltyCoupon)
      ).toFixed(2);
    }
  }

  /**
   * Asynchronously calculates the discount based on the selected discount type and rate.
   * Handles different discount scenarios, such as value-based or percentage-based discounts.
   * Validates and adjusts the discount amount accordingly.
   * @returns {Promise<number>} - The calculated discount amount.
   */
  async calculateDiscount() {
    // Initialize the discount variable
    let discount = 0.0;

    // Get the subtotal from the Cart
    let subtotal = parseFloat(this.Cart.subTotal);

    // Check if a discount type is selected
    if (this.selectedDiscount.discount_type) {
      // Handle value-based discounts
      if (this.selectedDiscount.discount_type === 'value') {
        // Add the value-based discount to the total discount
        discount += parseFloat(this.selectedDiscount.rate);

        // Validate the discount amount
        if (discount > subtotal) {
          this.snackBService.openSnackBar(
            'Invalid Discount,Please choose another one.',
            'Close'
          );

          // Reset the selected discount if it exceeds the subtotal
          this.deleteOrderdiscount();
        }
      } else {
        // Handle percentage-based discounts
        if (this.selectedDiscount.is_discount_on_total_amount) {
          // Calculate discount based on the total amount, including tax and surcharge
          discount +=
            (subtotal +
              (await this.calculateTax()) +
              (await this.calculateSurcharge())) *
            (parseFloat(this.selectedDiscount.rate) / 100);
        } else {
          // Calculate discount based on the subtotal
          discount += subtotal * (parseFloat(this.selectedDiscount.rate) / 100);
          // Validate the discount amount
          if (discount > subtotal) {
            this.snackBService.openSnackBar(
              'Invalid Discount,Please choose another one.',
              'Close'
            );
            // Reset the selected discount if it exceeds the subtotal
            this.deleteOrderdiscount();
          }
        }
        // Set the calculated discount amount in the selected discount object
        this.selectedDiscount.effected_value = discount.toFixed(2);
      }
    }
    // Return the calculated discount amount
    return discount;
  }
  /**
   * Asynchronous function to calculate taxes based on the provided tax rates and subtotal.
   *
   * @returns {number} A promise resolving to the calculated total tax.
   */
  async calculateTax() {
    let tax = 0.0;
    this.effectedTax = [];
    let subtotal: any = parseFloat(this.Cart.subTotal);
    if (this.taxarray.length > 0) {
      this.taxarray.forEach((obj: any) => {
        if (obj.is_default == 1) {
          // if (obj.type == 1) {
          //   let calculatedTax = (
          //     subtotal *
          //     (parseFloat(obj.rate) / 100)
          //   ).toFixed(2);
          //   this.Cart.subTotal = (
          //     parseFloat(this.Cart.subTotal) - parseFloat(calculatedTax)
          //   ).toFixed(2);
          //   subtotal = parseFloat(this.Cart.subTotal).toFixed(2);
          // }
          let type = obj.type == 1 ? 'Inclusive' : 'Exclusive';
          if (parseFloat(obj.type) == 1) {
            tax = 0;
          } else {
            tax += subtotal * (parseFloat(obj.rate) / 100);
          }
          let tempArray: any = {
            name: 'Tax (' + obj.tax_name + ' @' + obj.rate + '% ' + type + ')',
            id: obj.id,
            effected_price: (subtotal * (parseFloat(obj.rate) / 100)).toFixed(
              2
            ),
            rate: obj.rate,
            type: obj.type,
            tax_split: [],
          };
          obj.tax_split.forEach((element: any) => {
            let split: any = {
              name: element.name + ' (@' + element.rate + '%)',
              rate: element.rate,
              effected_price: (
                parseFloat(this.Cart.subTotal) *
                (parseFloat(element.rate) / 100)
              ).toFixed(2),
            };
            tempArray.tax_split.push(split);
          });
          this.effectedTax.push(tempArray);
        }
      });
    }
    return tax;
  }

  /**
   * Asynchronous function to calculate other charges (surcharges) based on the provided surcharge rates and subtotal.
   *
   * @returns {number} A promise resolving to the calculated total surcharge.
   */
  async calculateSurcharge() {
    let otherCharge = 0.0;
    this.effectedSurcharge = [];
    let subTotal = this.Cart.subTotal;
    if (this.surchargearray) {
      this.surchargearray.forEach((obj: any) => {
        if (obj.status == 1 && obj.type == 'value') {
          otherCharge += parseFloat(obj.rate);
          let tempArray = {
            name: obj.name,
            id: obj.id,
            effected_price: parseFloat(obj.rate).toFixed(2),
          };
          this.effectedSurcharge.push(tempArray);
        } else if (obj.status == 1 && obj.type == 'percentage') {
          let percentageSurcharge = (
            parseFloat(subTotal) *
            (parseFloat(obj.rate) / 100)
          ).toFixed(2);
          otherCharge = otherCharge + parseFloat(percentageSurcharge);
          let tempArray = {
            name: obj.name,
            id: obj.id,
            effected_price: (
              parseFloat(subTotal) *
              (parseFloat(obj.rate) / 100)
            ).toFixed(2),
          };
          this.effectedSurcharge.push(tempArray);
        }
      });
    }
    return otherCharge;
  }

  /**
   * Increment the quantity of a selected item in the cart.
   *
   * @param {number} index - The index of the selected item in the cart.
   */
  quantityPlus(index: number): void {
    // Check if the selected item has modifiers
    if (this.SelectedItems[index].modifiers) {
      // Increment the quantity and update total with modifiers
      this.SelectedItems[index].qty++;
      this.updateTotalWithModifiers(index);
    } else {
      // Increment the quantity and update price
      this.SelectedItems[index].qty++;
      this.updatePrice(index);
    }
  }

  /**
   * Handle quantity input change for a selected item in the cart.
   *
   * @param {number} quantity - The new quantity input value.
   * @param {number} index - The index of the selected item in the cart.
   */
  qtyInputChange(quantity: any, index: any) {
    this.invalidQuantityPrize = false;
    if (
      quantity > 0 &&
      quantity.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$') &&
      this.SelectedItems[index].price > 0
    ) {
      if (this.SelectedItems[index].modifiers) {
        this.updateTotalWithModifiers(index);
      } else {
        this.updatePrice(index);
      }
    } else {
      this.invalidQuantityPrize = true;
      this.snackBService.openSnackBar('Invalid Quantity or Prize', 'Close');
    }
  }

  /**
   * Handle quantity decrease for a selected item in the cart.
   *
   * @param {number} quantity - The current quantity of the selected item.
   * @param {number} index - The index of the selected item in the cart.
   */
  quantityMinus(quantity: any, index: any) {
    if (quantity > 1) {
      if (this.SelectedItems[index].modifiers) {
        this.SelectedItems[index].qty--;
        this.updateTotalWithModifiers(index);
      } else {
        this.SelectedItems[index].qty--;
        this.updatePrice(index);
      }
    }
  }

  /**
   * Delete a selected item from the cart.
   *
   * @param {number} index - The index of the selected item in the cart.
   */
  deleteCartItem(index: number): void {
    // Remove the item from the cart
    this.SelectedItems.splice(index, 1);
    this.checkForItemDiscountApply();
    this.updateSubTotal();
    if (this.SelectedItems.length <= 0) {
      this.flagCartItem = false;
      this.surchargearray = [];
    }
  }

  /**
   * Open a dialog to add a discount to the order.
   * After the dialog is closed, it updates the selected discount, subtotal, and sets the itemDiscountFlag.
   *
   * @remarks
   * This function opens the `AddDiscountComponent` dialog with a width of '800px'.
   * The dialog collects information about the discount, and upon closure, the result is obtained.
   * If a discount is selected (result is truthy), it updates the `selectedDiscount`, recalculates the subtotal,
   * and sets the `itemDiscountFlag` to true.
   *
   * @see AddDiscountComponent - The component responsible for capturing discount details.
   *
   */
  addDiscount(): void {
    const dialogRef = this.dialog.open(AddDiscountComponent, {
      width: '800px',
      data: {
        entity_id: this.entity_Id,
      },
    });

    // Subscribe to the result of the dialog after it's closed
    dialogRef.afterClosed().subscribe((result) => {
      // Check if a discount was selected (result is truthy)
      if (result) {
        // Update the selected discount
        this.selectedDiscount = result;

        // Recalculate the subtotal
        this.updateSubTotal();

        // Set the itemDiscountFlag to true
        this.itemDiscountFlag = true;
      }
    });
  }

  /**
   * Open a dialog to change the tax settings for the order.
   * After the dialog is closed, it updates the taxarray and recalculates the subtotal.
   *
   * @remarks
   * This function opens the `ChangeTaxComponent` dialog with a width of '800px'.
   * The dialog allows users to modify tax settings, and upon closure, the result is obtained.
   * If tax settings are modified (result is truthy), it updates the `taxarray` and recalculates the subtotal.
   *
   * @see ChangeTaxComponent - The component responsible for capturing tax setting changes.
   *
   */
  changeTax(): void {
    const dialogRef = this.dialog.open(ChangeTaxComponent, {
      width: '800px',
    });

    // Subscribe to the result of the dialog after it's closed
    dialogRef.afterClosed().subscribe((result) => {
      // Check if tax settings were modified (result is truthy)
      if (result) {
        // Update the taxarray with the modified tax settings
        this.taxarray = result;

        // Recalculate the subtotal
        this.updateSubTotal();
      }
    });
  }

  /**
   * Open a dialog to add or edit notes for the order.
   * After the dialog is closed, it updates the notes with the entered or modified content.
   *
   * @remarks
   * This function opens the `AddNotesComponent` dialog with a width of '500px'.
   * The dialog allows users to add or edit notes for the order, and upon closure, the result is obtained.
   * If notes are modified or added (result is truthy), it updates the `notes` variable with the entered or modified content.
   *
   * @see AddNotesComponent - The component responsible for capturing notes.
   *
   */
  addNotes(): void {
    // Open a dialog to add or edit notes
    const dialogRef = this.dialog.open(AddNotesComponent, {
      width: '500px',
      // Pass the current notes as initial data to the dialog
      data: {
        note: this.notes,
      },
    });

    // Subscribe to the result of the dialog after it's closed
    dialogRef.afterClosed().subscribe((result) => {
      // Check if notes were modified or added (result is truthy)
      if (result) {
        // Update the notes with the entered or modified content
        this.notes = result;
      }
    });
  }

  /**
   * Open a dialog for editing a selected item in the order.
   *
   * @param {object} selecteditem - The selected item to be edited.
   * @param {number} index - The index of the selected item in the order.
   */
  editItem(selecteditem: any, index: number): void {
    // Set data in the data service for the selected item, index, and order discount flag
    this.dataservice.setData('selectedMenuItem', selecteditem);
    this.dataservice.setData('selectedMenuItemIndex', index);
    this.dataservice.setData('orderdiscountflag', this.orderDiscountFlag);

    // Check if the selected item has modifiers and set modifier data if available
    if (selecteditem.modifiers) {
      this.setEditModifierData(selecteditem);
    }

    // Open a dialog for editing the selected item
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '800px',
      disableClose: true,
      data: {
        item: selecteditem,
        itemdiscountflag: this.itemDiscountFlag,
        editModifierData: this.editModifierData,
        editItemIndex: index,
        entity_id: this.entity_Id,
      },
    });

    // Subscribe to the dialog's closed event to handle the result
    dialogRef.afterClosed().subscribe((result) => {
      // Set discount and item note based on the dialog result
      this.setDiscount();
      this.item_note = result;
      // Check and apply item discounts if applicable
      this.checkForItemDiscountApply();
    });
  }

  checkForItemDiscountApply() {
    // for making orderDiscount button enabling when item discount removed
    this.SelectedItems.forEach((obj: any) => {
      if (obj.item_discount_id == null) {
        this.orderDiscountFlag = false;
      } else {
        this.orderDiscountFlag = true;
      }
    });
  }

  /**
   * Set data for editing modifiers of a selected item.
   *
   * @param {object} selecteditem - The selected item with modifiers to be edited.
   */
  setEditModifierData(selecteditem: any): void {
    // Initialize the data structure to hold modifier information for editing
    let selectedmodifier = {
      item_name: selecteditem.name,
      modifier_group: [] as any,
    };

    // Iterate through the modifiers of the selected item
    selecteditem.modifiers.forEach((obj: any) => {
      // Initialize data for a modifier group
      let items = {
        modifier_group_name: obj.name,
        can_add_multiple: obj.can_add_multiple,
        max_qty: obj.max_qty,
        min_qty: obj.min_qty,
        modifier_group_id: obj.id,
        modifier_list: [] as any,
      };

      // Iterate through the list of modifiers in the group
      obj.list.forEach((list: any) => {
        // Initialize data for a modifier in the group
        let list_data = {
          item_id: list.id,
          item_name: list.modifier_list,
          item_price: list.rate,
          status: list.status,
          list_qty: list.list_qty,
        };

        // Add the modifier data to the modifier list
        items.modifier_list.push(list_data);
      });

      // Add the modifier group data to the selectedmodifier data structure
      selectedmodifier.modifier_group.push(items);
    });

    // Set the editModifierData with the prepared modifier data
    this.editModifierData = selectedmodifier;
  }

  /**
   * Apply discounts and update the selected menu item or its modifiers.
   * If an updated menu item is available, replace the original menu item with the updated one.
   * If no updated menu item is available, calculate and update the total price based on modifiers or regular price.
   */
  setDiscount(): void {
    // Retrieve the updated menu item and selected menu item index from the data service
    let updatedMenuItem = this.dataservice.getData('updatedMenuItem');
    let selectedMenuItemIndex = this.dataservice.getData(
      'selectedMenuItemIndex'
    );

    // Check if an updated menu item is available
    if (updatedMenuItem != null || updatedMenuItem != undefined) {
      // Replace the original menu item with the updated one
      this.SelectedItems[selectedMenuItemIndex] = updatedMenuItem;

      // Clear the updatedMenuItem data in the data service
      this.dataservice.setData('updatedMenuItem', null);

      // Update the subtotal after applying the discount
      this.updateSubTotal();
    } else {
      // Check if the selected menu item has modifiers
      if (this.SelectedItems[selectedMenuItemIndex].modifiers) {
        // Update the total price considering modifiers
        this.updateTotalWithModifiers(selectedMenuItemIndex);
      } else {
        // Update the total price using regular price
        this.updatePrice(selectedMenuItemIndex);
      }
    }
  }

  /**
   * Print Kitchen Order (KOT) or Invoice for the specified data using MQTT.
   *
   * @param data - An array containing the information to be printed for each item.
   * Each element of the array should have the necessary details for printing.
   * For example, it may include item names, quantities, prices, etc.
   */
  printKOTorInvoice(data: any): void {
    // Iterate over each element in the data array
    data.forEach((obj: any) => {
      // Check printer availability using the printMqtt service
      let print = this.printMqtt.checkPrinterAvailablity(obj);

      // If the printer is available, publish the print data via MQTT
      if (print.status) {
        this.printMqtt
          .publish('print', print.printObj)
          .subscribe((data: any) => {
            // Handle the result of the print operation if needed
          });
      } else {
        // If the printer is not available, display a snack bar message with the error
        this.snackBService.openSnackBar(print.message, 'Close');
      }
    });
  }

  /**
   * Print Kitchen Order (KOT) receipt or invoice based on the orderID using MQTT.
   * This function first checks whether offline printing is enabled or disabled.
   * If offline printing is disabled, it sends a request to the server to generate
   * the KOT receipt and then prints it using MQTT. If offline printing is enabled,
   * it retrieves the print data from the server and opens a dialog to display the
   * printable content.
   */
  kotPrint(): void {
    // Check if offline printing is disabled
    this.printOffline = this.localservice.get('printOffline');

    if (!this.printOffline) {
      // Request the KOT receipt data from the server
      this.httpService
        .get('receipt/' + this.orderID + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            // Display a success message
            this.snackBService.openSnackBar(
              'KOT Receipt Generated Successfully!',
              'Close'
            );

            // Iterate over each KOT item and print it using MQTT
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj);
              if (print.status) {
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});
              } else {
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            // Display an error message if the request fails
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      // If offline printing is enabled, request print data from the server
      this.httpService
        .get('offline-print/' + this.orderID + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            // Open a dialog to display the printable content
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {
              // Handle any actions after the dialog is closed, if needed
            });
          }
        });
    }
  }

  /**
   * Print labels for items in the order using a label printer.
   * It sends a request to the server to retrieve label print data
   * based on the orderID. If label print specifications are available,
   * it opens a dialog to display the label print content.
   */
  labelPrint(): void {
    // Request label print data from the server based on the orderID
    this.httpService.get('label-print/' + this.orderID).subscribe((result) => {
      if (result.status == 200) {
        // Check if label print specifications are available
        if (result.data.length > 0) {
          // Open a dialog to display the label print content
          const dialogRef = this.dialog.open(LabelPrintComponent, {
            width: '350px',
            data: { printData: result.data },
          });

          dialogRef.afterClosed().subscribe((result) => {
            // Handle any actions after the dialog is closed, if needed
          });
        } else {
          // Display a message if no label print specifications are available
          this.snackBService.openSnackBar('No specifications added', 'Close');
        }
      } else {
        // Display an error message if the request fails
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Reprint the invoice receipt for the order. It checks if offline printing
   * is enabled and sends a request to the server to retrieve invoice receipt
   * data based on the orderID. If offline printing is disabled, it opens a
   * dialog to display the invoice receipt content. If offline printing is enabled,
   * it sends the invoice receipt data to the available printers using MQTT.
   */
  invoiceReprint(): void {
    // Check if offline printing is enabled
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      // Request invoice receipt data from the server based on the orderID
      this.httpService
        .get('receipt/' + this.orderID + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            // Display a success message if the invoice receipt is generated
            this.snackBService.openSnackBar(
              'Invoice Receipt Generated Successfully!',
              'Close'
            );

            // Iterate through the invoice receipt data and send it to available printers using MQTT
            result.data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj);
              if (print.status) {
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});
              } else {
                // Display an error message if printing is not available
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            // Display an error message if the request fails
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      // Request offline invoice receipt data from the server based on the orderID
      this.httpService
        .get('offline-print/' + this.orderID + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            // Open a dialog to display the offline invoice receipt content
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {
              // Handle any actions after the dialog is closed, if needed
            });
          }
        });
    }
  }

  /**
   * Navigate to the specified page using the Angular Router.
   * If the provided page is 'delivery_settings', it navigates to the 'setup/delivery_settings' route.
   * For other pages, it navigates to the route corresponding to the provided page.
   *
   * @param page - The target page or route to navigate to.
   *               If 'delivery_settings', it navigates to 'setup/delivery_settings'.
   *               Otherwise, it navigates to the route corresponding to the provided page.
   */
  gotoPage(page: any): void {
    if (page === 'delivery_settings') {
      // Navigate to the 'setup/delivery_settings' route
      this.router.navigate(['setup/delivery_settings']);
    } else {
      // Navigate to the route corresponding to the provided page
      this.router.navigate([page]);
    }
  }

  /**
   * Refresh the menu items for the specified branch and entity by making an HTTP request.
   * Update the local storage with the latest menu items and trigger a category change event.
   */
  refreshMenu(): void {
    // Create a unique key for storing menu items in local storage
    let entityKey = 'menuItem' + this.entity_Id;

    // Make an HTTP request to fetch the latest menu items for the specified branch and entity
    this.httpService
      .get('menu-items/' + this.branch_id + '/' + this.entity_Id)
      .subscribe((result) => {
        // Check if the request was successful (status code 200)
        if (result.status == 200) {
          // Update the CategoryRecords with the latest menu items
          this.CategoryRecords = result.data;

          // Store the updated menu items in local storage using the unique entityKey
          this.localservice.store(entityKey, this.CategoryRecords);

          // Add a default category ("ALL") to the beginning of the CategoryRecords array
          this.CategoryRecords.unshift({
            category_id: -1,
            category_name: 'ALL',
            colour: '#0778',
          });

          // Trigger a category change event with the first category in the updated list
          this.OnCategoryChange(this.CategoryRecords[0]);
        } else {
          // If the request fails, remove the menu items from local storage
          this.localservice.remove(entityKey);

          // Display a snack bar message with the error result
          this.snackBService.openSnackBar(result.message, 'close');
        }
      });
  }
}
