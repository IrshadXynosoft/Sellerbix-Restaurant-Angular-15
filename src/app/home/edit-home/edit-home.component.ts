import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import moment from 'moment';
import { IMqttMessage } from 'ngx-mqtt';
import { Observable, Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { ModificationService } from 'src/app/_services/modification.service';
import { KotMqttService } from 'src/app/_services/mqtt/kot-mqtt.service';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';
import Swal from 'sweetalert2';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { GroupedItemComponent } from '../add-groupeditem/grouped-item/grouped-item.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { AddSurchargeComponent } from '../add-surcharge/add-surcharge.component';
import { ChangeTaxComponent } from '../change-tax/change-tax.component';
import { ComboItemComponent } from '../combo-item/combo-item.component';
import { CrmOrderConfirmationComponent } from '../crm-order-confirmation/crm-order-confirmation.component';
import { CustomerLoyaltyCouponsComponent } from '../customer-loyalty-coupons/customer-loyalty-coupons.component';
import { DateService } from '../date.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { InvoiceKotPrintComponent } from '../invoice-kot-print/invoice-kot-print.component';
import { LabelPrintComponent } from '../label-print/label-print.component';
import { ModifyReasonComponent } from '../modify-reason/modify-reason.component';
import { OpenSaleNotificationComponent } from '../open-sale-notification/open-sale-notification.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { SplitBillComponent } from '../split-bill/split-bill.component';
import { SubscriptionStatusDialogComponent } from '../subscription-status-dialog/subscription-status-dialog.component';
import { UtensilsComponent } from '../utensils/utensils.component';
import { VoidOrderComponent } from '../void-order/void-order.component';
import packageversion from '../../../../package.json';

@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.scss'],
})
export class EditHomeComponent implements OnInit {
  SelectedItems: any = [];
  Cart: any = [];
  flagCartItem = false;
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
  // crm_branch_id: any;
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
    private modificationService: ModificationService
  ) {
    this.time$ = this.dateService.getDate();
  }
  ngOnInit(): void {
    this.taxGet();
    this.getEditItems();
    this.audio = new Audio();
    this.audio.src = 'assets/audio/driver.wav';
    this.url = this.router.url;
    this.onBuildPaymentForm();
    this.checkOpenSaleStatus();
    this.getWaiters();
    this.getBranch();
    this.getSubscriptionStatus();
  }

  /**
   * Checks for unsaved changes using the modification service and prompts the user
   * with a confirmation dialog if changes are detected.
   *
   * @returns {Promise<boolean>} Resolves to true if deactivation is allowed, false otherwise.
   */
  async canDeactivate(): Promise<boolean> {
    // Check for unsaved changes
    if (this.modificationService.getModifiedFlag()) {
      // Display a confirmation dialog
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Please modify the order.',
        icon: 'question',
        showCancelButton: false,
      });
      // Do not allow deactivation if there are unsaved changes
      return false;
    }
    // Allow deactivation if there are no unsaved changes
    return true;
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
   * Validates a phone number input to ensure it consists of 6 to 13 numeric digits.
   *
   * @param {any} input - The phone number to be validated.
   * @returns {void}
   */
  phonenumberValidCheck(input: any): void {
    if (input.match('^([0-9]{6,13})$')) {
      this.invalidFlag = false;
    } else {
      this.invalidFlag = true;
      if (input === '') this.invalidFlag = false;
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
   * Subscribes to a topic for menu status changes and performs associated actions.
   *
   * @returns {void}
   */
  subscribeToTopicForMenuStatus(): void {
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
   * If the subscription status check is allowed, it triggers an HTTP request to
   * fetch the status and handles the response accordingly.
   *
   * @returns {void}
   */
  getSubscriptionStatus(): void {
    // Check if the subscription status check is allowed
    if (this.subscriptionStatus !== false) {
      // Trigger an HTTP request to fetch the subscription status
      this.httpService.get('subscription-status').subscribe((result) => {
        // Check if the HTTP request was successful
        if (result.status == 200) {
          // Subscription status flags 1 and 2 trigger a dialog
          if (result.data.flag == 1 || result.data.flag == 2) {
            // Open a dialog to display subscription status details
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

            // Subscribe to the dialog's afterClosed event
            dialogRef.afterClosed().subscribe(() => {});
          } else if (result.data.flag == 3) {
            // Subscription status flag 3 indicates an expired subscription
            let message: any = result.data.msg;

            // Store the subscription expired message and navigate to the relevant route
            this.localservice.store('subscriptionExpiredMessage', message);
            this.router.navigate(['subscription-expired']);
          }
        } else {
          // Display a snack bar with an error message for non-successful HTTP requests
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
    }
  }

  /**
   * Angular lifecycle hook called when the component is about to be destroyed.
   * Performs cleanup tasks such as resetting data and unsubscribing from subscriptions.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    // Reset merged order IDs data in the data service
    this.dataservice.setData('merged_order_ids', null);

    // Unsubscribe from the menu status subscription to prevent memory leaks
    this.subscriptionForMenuStatus.unsubscribe();
  }

  /**
   * Fetches and sets data for editing an order based on the provided order ID.
   * Performs an HTTP request to retrieve order details and updates the component's state.
   *
   * @returns {void}
   */
  getEditItems(): void {
    // Trigger an HTTP request to fetch order details for editing
    this.httpService.get('orderByNumber/1/' + this.id).subscribe((result) => {
      // Check if the HTTP request was successful
      if (result.status == 200) {
        // Reset the selected items array
        this.SelectedItems = [];

        // Update component state with fetched order details
        this.walkinEditRecords = result.data[0];
        this.entity_Id = this.walkinEditRecords.entity_id;
        this.editdineinFlag = this.entity_Id == 2 ? true : false;
        this.crmFlag = this.entity_Id == 3 ? true : false;
        this.pickupFlag = this.walkinEditRecords.order.store_pickup
          ? true
          : false;

        // Set selected discount based on order details
        this.selectedDiscount = this.walkinEditRecords?.order.discount?.id
          ? this.walkinEditRecords?.order.discount
          : {};

        // Set surcharge and tax arrays based on order details
        this.surchargearray = this.walkinEditRecords?.order.surcharge
          ? this.walkinEditRecords?.order.surcharge
          : [];
        this.taxarray = this.walkinEditRecords.order.tax_array
          ? this.walkinEditRecords.order.tax_array
          : [];

        // Set selected items and other relevant details
        this.flagCartItem = true;
        this.SelectedItems = this.walkinEditRecords.order.items;
        this.couponSelected = this.walkinEditRecords.order?.loyalty_coupon
          ? this.walkinEditRecords.order?.loyalty_coupon
          : null;

        // Set payment form values based on customer details
        this.paymentForm.patchValue({
          name: this.walkinEditRecords.order.customer_details?.name,
          phone_number:
            this.walkinEditRecords.order.customer_details?.phone_number,
        });

        // Update the subtotal and disable the payment form if a phone number exists
        this.updateSubTotal();
        if (this.walkinEditRecords.order.customer_details?.phone_number) {
          this.paymentForm.disable();
        }

        // Set various order-related identifiers
        this.orderID = this.walkinEditRecords.order_id
          ? this.walkinEditRecords.order_id
          : this.walkinEditRecords.id;
        this.invoiceID = this.walkinEditRecords.invoice_id;
        this.orderNumber = this.walkinEditRecords.order_number;

        // Set waiter and pax information
        this.waiterChoosen.setValue(
          this.walkinEditRecords.order.assign_to
            ? this.walkinEditRecords.order.assign_to
            : ''
        );
        this.selectedWaiter = parseInt(this.waiterChoosen.value.id);
        this.paxNo.setValue(
          this.walkinEditRecords.order.pax_no
            ? this.walkinEditRecords.order.pax_no
            : ''
        );

        // Set notes, advance paid, table name, and other order details
        this.notes = this.walkinEditRecords.notes;
        this.advancePaid = this.walkinEditRecords.order.advance_paid
          ? this.walkinEditRecords.order.advance_paid
          : null;
        this.tableName = this.walkinEditRecords.order?.table_name;

        // Prepare CRM data for further processing
        let Data = {
          customer_id: this.walkinEditRecords.order.customer_id,
          customer_contact_no:
            this.walkinEditRecords.order.customer_details.phone_number,
          customer_name: this.walkinEditRecords.order.customer_details.name,
          locationDetails: this.walkinEditRecords.order.address
            ? {
                branch_id: this.walkinEditRecords.order.branch_id,
                branch_name: this.walkinEditRecords.order.branch_name,
                id: this.walkinEditRecords.order.address.id,
                country_id: this.walkinEditRecords.order.address.country_id,
                building_or_villa:
                  this.walkinEditRecords.order.address.building_or_villa,
                country_name: this.walkinEditRecords.order.address.country_name,
                street: this.walkinEditRecords.order.address.street,
              }
            : {
                branch_id: this.walkinEditRecords.order.branch_id,
                branch_name: this.walkinEditRecords.order.branch_name,
              },
        };
        this.crmRecords = Data;
        this.entity_order_no = this.walkinEditRecords.order.entity_order_no;
        this.crm_customer_mob_no =
          this.walkinEditRecords.order.customer_details?.phone_number;
        this.crm_branchnameSelected =
          this.walkinEditRecords.order.address?.branch_name;

        // Fetch menu categories after updating the state
        this.getMenuCategory();
      } else {
        // Display a snack bar with an error message for non-successful HTTP requests
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Checks the status of the business day and opens a notification dialog if the business day is not 'open'.
   * Performs an HTTP request to retrieve business day status and opening balance.
   *
   * @returns {void}
   */
  checkOpenSaleStatus(): void {
    // Trigger an HTTP request to check the status of the business day
    this.httpService.get('check-businessday-status').subscribe((result) => {
      // Check if the HTTP request was successful
      if (result.status == 200) {
        // Check if the business day status is not 'open'
        if (result.data.business_day_status != 'open') {
          // Open a notification dialog for non-open business day status
          const dialogRef = this.dialog.open(OpenSaleNotificationComponent, {
            disableClose: true,
            width: '500px',
            data: {
              openingBalance: result.data.opening_bal,
            },
          });

          // Subscribe to the afterClosed event of the dialog
          dialogRef.afterClosed().subscribe(() => {});
        }
      } else {
        // Display a snack bar with an error message for non-successful HTTP requests
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Navigates to the 'move-table' route and sets the orderId in the data service.
   *
   * @returns {void}
   */
  moveTable(): void {
    // Set orderId in the data service for reference during table movement
    this.dataservice.setData('orderId', this.orderID);

    // Navigate to the 'move-table' route
    this.router.navigate(['dinein/move-table']);
  }

  /**
   * Opens the 'AddSurchargeComponent' dialog to manage and apply surcharges.
   * Updates the surcharge array and triggers a subtotal update if changes are made.
   *
   * @returns {void}
   */
  getSurcharges(): void {
    // Open the 'AddSurchargeComponent' dialog
    const dialogRef = this.dialog.open(AddSurchargeComponent, {
      width: '800px',
      data: {
        entity_id: this.entity_Id,
      },
    });

    // Subscribe to the afterClosed event of the dialog
    dialogRef.afterClosed().subscribe((result) => {
      // Check if a result is received (changes made in the dialog)
      if (result) {
        // Update the surcharge array with the result
        this.surchargearray = result;

        // Trigger an update of the subtotal
        this.updateSubTotal();
      }
    });
  }

  /**
   * Opens the 'CustomerLoyaltyCouponsComponent' dialog to select and apply loyalty coupons.
   * Updates the selected coupon and triggers a subtotal update if changes are made.
   * Displays a snack bar message if no phone number is entered in the payment form.
   *
   * @returns {void}
   */
  getLoyaltyCoupons(): void {
    // Check if a phone number is entered in the payment form
    if (this.paymentForm.value['phone_number']) {
      // Open the 'CustomerLoyaltyCouponsComponent' dialog
      const dialogRef = this.dialog.open(CustomerLoyaltyCouponsComponent, {
        width: '800px',
        data: {
          contact_no: this.paymentForm.value['phone_number'],
          order_value: this.Cart.amount,
        },
      });

      // Subscribe to the afterClosed event of the dialog
      dialogRef.afterClosed().subscribe((result) => {
        // Check if a result is received (changes made in the dialog)
        if (result) {
          // Update the selected coupon with the result
          this.couponSelected = result;

          // Trigger an update of the subtotal
          this.updateSubTotal();
        }
      });
    } else {
      // Display a snack bar message if no phone number is entered
      this.snackBService.openSnackBar('Please Enter Phone Number', 'Close');
    }
  }

  /**
   * Fetches tax information from the server using an HTTP request.
   * Updates the component's taxarray with the received data.
   * Displays a snack bar message in case of a non-successful HTTP request.
   *
   * @returns {void}
   */
  taxGet(): void {
    // Trigger an HTTP request to fetch tax information
    this.httpService.get('tax').subscribe((result) => {
      // Check if the HTTP request was successful
      if (result.status == 200) {
        // Update the component's taxarray with the received data
        this.taxarray = result.data;
      } else {
        // Display a snack bar message for non-successful HTTP requests
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Retrieves menu categories from local storage or the server using an HTTP request.
   * Updates the component's CategoryRecords with the received data.
   * Displays a snack bar message in case of a non-successful HTTP request.
   *
   * @returns {void}
   */
  getMenuCategory(): void {
    // Create a unique key for storing/retrieving menu items based on the entity_Id
    let entityKey = 'menuItem' + this.entity_Id;

    // Attempt to retrieve menu items from local storage
    let menuItem = this.localservice.get(entityKey);

    // Check if menu items are not stored locally
    if (menuItem == null) {
      // Trigger an HTTP request to fetch menu items
      this.httpService
        .get(
          'menu-items/' +
            this.branch_id +
            '/' +
            (this.entity_Id == 8 ? 3 : this.entity_Id)
        )
        .subscribe((result) => {
          // Check if the HTTP request was successful
          if (result.status == 200) {
            // Update the component's CategoryRecords with the received data
            this.CategoryRecords = result.data;

            // Store the fetched menu items locally for future use
            this.localservice.store(entityKey, this.CategoryRecords);

            // Add a default 'ALL' category at the beginning of the CategoryRecords array
            this.CategoryRecords.unshift({
              category_id: -1,
              category_name: 'ALL',
              colour: '#0778',
            });

            // Trigger the OnCategoryChange method with the first category
            this.OnCategoryChange(this.CategoryRecords[0]);
          } else {
            // Display a snack bar message for non-successful HTTP requests
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      // Use the locally stored menu items
      this.CategoryRecords = menuItem;

      // Add a default 'ALL' category at the beginning of the CategoryRecords array
      this.CategoryRecords.unshift({
        category_id: -1,
        category_name: 'ALL',
        colour: '#0778',
      });

      // Trigger the OnCategoryChange method with the first category
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  /**
   * Handles the change in selected menu category.
   * Updates the classactive property with the selected category's id.
   * Populates the CategoryItems array based on the selected category.
   *
   * @param {any} items - The selected menu category.
   * @returns {void}
   */
  OnCategoryChange(items: any): void {
    // Update the classactive property with the selected category's id
    this.classactive = items.category_id;

    // Check if the selected category is 'ALL'
    if (items.category_id == -1) {
      // Reset CategoryItems and aggregate items from all categories
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            this.CategoryItems.push(obj2);
          });
        }
      });
    } else if (items.category_id == 0) {
      // Reset CategoryItems and include only quick items from all categories
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            if (obj2.is_quick_item == 1) this.CategoryItems.push(obj2);
          });
        }
      });
    } else {
      // Set CategoryItems based on the selected category
      if (items.item) this.CategoryItems = items.item;
      else this.CategoryItems = [];
    }
  }

  /**
   * Opens the 'UtensilsComponent' dialog to select utensils.
   * Processes the result from the dialog and adds selected utensils to the cart as grouped menu items.
   *
   * @returns {void}
   */
  getUtensils(): void {
    // Open the 'UtensilsComponent' dialog
    const dialogRef = this.dialog.open(UtensilsComponent, {
      width: '800px',
      maxHeight: '600px',
    });

    // Subscribe to the afterClosed event of the dialog
    dialogRef.afterClosed().subscribe((result) => {
      // Check if a result is received (utensils are selected)
      if (result) {
        // Add selected utensils to the cart as grouped menu items (type 2)
        this.addToCart(result, 2);
      }
    });
  }

  placeOrder() {
    this.disabledFlag = true;
    if (!this.invalidFlag) {
      let zeroFlag = false;
      this.SelectedItems.forEach((obj: any) => {
        if (obj.qty < 1) {
          zeroFlag = true;
        }
      });
      if (!zeroFlag && !this.invalidQuantityPrize) {
        let date = moment();
        let todayDate = date.format('YYYY-MM-DD');
        let currentTime = date.format('HH:MM:SS');
        let randomOrderNo =
          date.format('YYYY:DD:MM') + '_' + date.format('hh:mm:ss');
        // this.flagCartItem = false;
        let user = this.dataservice.getData('user');
        let body = {
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
          customer_name: this.crmFlag ? this.crmRecords.customer_name : null,
          address_id: this.crmFlag ? this.crmRecords.locationDetails.id : null,
          crm_contact_no: this.crmFlag ? this.crm_customer_mob_no : null,
          address:
            this.crmFlag || this.crmRecords?.party_details?.order_type == 3
              ? {
                  branch_id: this.branch_id,
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
          branch_id: this.branch_id,
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
          reservation_id:
            this.dineinReservation != 'undefined'
              ? this.dineinReservation.reservation_id
              : null,
          order_mode:
            this.dineinReservation != 'undefined' ||
            this.url == '/home/party_orders/modify_order/' + this.id ||
            this.url == '/home/party_orders/confirm_order'
              ? 1
              : null,
          loyalty_coupon: this.couponSelected ? this.couponSelected : null,
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
          discount: this.selectedDiscount,
          surcharge: this.surchargearray,
          discount_selected: this.Cart.discount ? this.Cart.discount : null,
          surcharge_selected: this.Cart.otherCharge
            ? this.Cart.otherCharge
            : null,
          applied_surcharge: this.effectedSurcharge
            ? this.effectedSurcharge
            : [],
          tax_selected: this.effectedTax[0]?.effected_price
            ? this.effectedTax[0]?.effected_price
            : 0.0,
          tax_array: this.taxarray ? this.taxarray : [],
          applied_tax: this.effectedTax ? this.effectedTax : [],
          print_bill: true,
          entity_order_no: this.entity_order_no ? this.entity_order_no : null,
          table_name: this.tableName,
          assign_to: this.waiterChoosen.value
            ? {
                id: this.waiterChoosen.value.id,
                name: this.waiterChoosen.value.name,
              }
            : null,
          pax_no: this.paxNo.value ? this.paxNo.value : null,
          merged_order_ids: this.merged_order_ids
            ? this.merged_order_ids
            : null,
          party_date: this.party_date,
          bulk_order_id: this.crmRecords.id ? this.crmRecords.id : null,
          order_type: this.crmRecords.party_details?.order_type
            ? this.crmRecords.party_details?.order_type
            : null,
          advance_paid: this.advancePaid,
        };
        if (
          this.url == '/home/crm/edit_order/' + this.id ||
          this.url == '/home/crm/pickup/edit_order/' + this.id
        ) {
          this.flagCartItem = true;
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
          dialogRef.afterClosed().subscribe((result) => {
            if (result == true || result == false) {
              let body = {
                notes: this.notes,
                order_number: !this.route.snapshot.params.id
                  ? randomOrderNo
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
                customer_name: this.crmFlag
                  ? this.crmRecords.customer_name
                  : null,
                address_id: this.crmFlag
                  ? this.crmRecords.locationDetails.id
                  : null,
                address: this.crmFlag
                  ? {
                      branch_id: this.branch_id,
                      branch_name: this.crm_branchnameSelected,
                      building_or_villa:
                        this.crmRecords.locationDetails.building_or_villa,
                      country_id: this.crmRecords.locationDetails.country_id,
                      country_name:
                        this.crmRecords.locationDetails.country_name,
                      id: this.crmRecords.locationDetails.id,
                      street: this.crmRecords.locationDetails.street,
                    }
                  : null,
                branch_name: this.crmFlag ? this.crm_branchnameSelected : null,
                store_pickup:
                  this.url == '/home/crm/pickup/new_order' ||
                  this.url == '/home/crm/pickup/edit_order/' + this.id
                    ? true
                    : false,
                order_id: this.orderID,
                crm_contact_no: this.crmFlag ? this.crm_customer_mob_no : null,
                kitchen_status: 'new',
                ref_number: null,
                branch_id: this.branch_id,
                current_time: currentTime,
                current_date: todayDate,
                customer_details: {
                  name: this.paymentForm.value['name'],
                  phone_number: this.paymentForm.value['phone_number'],
                },
                Cart: {
                  Items: this.SelectedItems,
                  amount: this.Cart.amount,
                  discount: this.Cart.discount,
                  otherCharge: this.Cart.otherCharge,
                  subTotal: this.Cart.subTotal,
                  tax: this.effectedTax[0]?.effected_price
                    ? this.effectedTax[0]?.effected_price
                    : 0.0,
                  loyalty_coupon: this.couponSelected
                    ? this.couponSelected
                    : null,
                },
                loyalty_coupon: this.couponSelected
                  ? this.couponSelected
                  : null,
                discount: this.selectedDiscount,
                surcharge: this.surchargearray,
                discount_selected: this.Cart.discount
                  ? this.Cart.discount
                  : null,
                surcharge_selected: this.Cart.otherCharge
                  ? this.Cart.otherCharge
                  : null,
                tax_selected: this.effectedTax[0]?.effected_price
                  ? this.effectedTax[0]?.effected_price
                  : 0.0,
                tax_array: this.taxarray ? this.taxarray : [],
                applied_surcharge: this.effectedSurcharge
                  ? this.effectedSurcharge
                  : [],
                applied_tax: this.effectedTax ? this.effectedTax : [],
                entity_order_no: this.entity_order_no
                  ? this.entity_order_no
                  : null,
                print_bill: true,
                table_name: this.tableName,
                assign_to: this.waiterChoosen.value
                  ? {
                      id: this.waiterChoosen.value.id,
                      name: this.waiterChoosen.value.name,
                    }
                  : null,
                pax_no: this.paxNo.value ? this.paxNo.value : null,
                merged_order_ids: this.merged_order_ids
                  ? this.merged_order_ids
                  : null,
              };
              this.httpService
                .put('orders/' + this.orderID, body)
                .subscribe((result) => {
                  if (result.status == 200) {
                    this.disabledFlag = false;
                    this.orderID = result.data.id;
                    this.publishOrderForOrderList();
                    this.snackBService.openSnackBar(
                      'Order Updated Successfully',
                      'Close'
                    );
                    this.modificationService.setModifiedFlag(false);
                    this.showPrintFlag = true;
                    this.publishOrderNew();
                    this.printKOTorInvoice(result.data.receipt);
                    this.router.navigate(['callcenter']);
                  } else {
                    this.snackBService.openSnackBar('Error', 'Close');
                  }
                });
            }
          });
        } else {
          this.httpService
            .put('orders/' + this.orderID, body)
            .subscribe((result) => {
              if (result.status == 200) {
                this.disabledFlag = false;
                this.publishOrderForOrderList();
                this.orderID = result.data.id;
                this.snackBService.openSnackBar(
                  'Order Updated Successfully',
                  'Close'
                );
                this.modificationService.setModifiedFlag(false);
                this.showPrintFlag = true;
                this.publishOrderNew();
                if (this.entity_Id == '2') {
                  this.publishOrderDineIn();
                }
                this.printKOTorInvoice(result.data.receipt);
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
   * Checks if a waiter is chosen before placing the order.
   * If a waiter is chosen or the assignment of a waiter is not required, proceeds to place the order.
   * Otherwise, displays a snack bar message indicating the need to choose a waiter.
   */
  checkWaiterChoosed() {
    // Check if a waiter is chosen and the waiterChoosen form control is valid
    if (this.waiterChoosen.valid || this.assignWaiter == false) {
      // If a waiter is chosen or waiter assignment is not required, proceed to place the order
      this.placeOrder();
    } else {
      // If a waiter is not chosen and waiter assignment is required, display a snack bar message
      this.snackBService.openSnackBar('Please choose a waiter', 'Close');
    }
  }

  /**
   * Retrieves the current time and formats it using the Angular DatePipe.
   * @returns A string representing the current time in the 'H:mm' format.
   */
  itemTime(): string {
    // Get the current time
    const currentTime = new Date();

    // Use the Angular DatePipe to format the current time as 'H:mm'
    return this.datePipe.transform(currentTime, 'H:mm') || '';
  }

  /**
   * Publishes a message to the MQTT broker for KOT display.
   * @description This function sends a 'new' message to the specified MQTT topic for KOT display.
   * @returns An observable indicating the success or failure of the MQTT publishing process.
   */
  publishOrderNew(): Observable<any> {
    // Prepare the data for the MQTT message
    let data = 'new';

    // Publish the message to the KOT MQTT topic
    return this.kotMqtt.publish(this.messageType, data);
  }

  /**
   * Publishes a message to the MQTT broker for the order list display.
   * @description This function sends an 'orderlist' message to the specified MQTT topic for the order list display.
   * @returns An observable indicating the success or failure of the MQTT publishing process.
   */
  publishOrderForOrderList(): Observable<any> {
    // Prepare the data for the MQTT message
    let data = 'orderlist';

    // Publish the message to the order list MQTT topic
    return this.newOrderMqtt.publish(this.orderListMessage, data);
  }

  /**
   * Publishes a message to the MQTT broker for dine-in display.
   * @description This function sends a 'dinein' message to the specified MQTT topic for dine-in display.
   * @returns An observable indicating the success or failure of the MQTT publishing process.
   */
  publishOrderDineIn(): Observable<any> {
    // Prepare the data for the MQTT message
    let data = 'dinein';

    // Publish the message to the dine-in MQTT topic
    return this.newOrderMqtt.publish(this.dineInMessage, data);
  }

  /**
   * Opens a dialog to display detailed information about an order.
   * @description This function opens a dialog using Angular Material Dialog, presenting detailed information
   * about the specified order. The dialog allows users to interact with the order details and take actions
   * such as closing the dialog, placing a new order, or modifying the existing order.
   * @param orders - The order details to be displayed in the dialog.
   * @returns An observable that emits the result of the dialog after it has been closed.
   */
  showOrderDetails(orders: any): Observable<any> {
    // Open a dialog to display order details
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      disableClose: true,
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orders,
      },
    });

    // Subscribe to the dialog's afterClosed event to handle the result
    dialogRef.afterClosed().subscribe((result) => {
      // Handle different outcomes based on the result
      if (result == 'closed') {
        // User closed the dialog, trigger a new order
        this.newOrder();
      } else if (result == 'modify') {
        // User chose to modify the order, trigger a component initialization
        this.ngOnInit();
      }
    });

    // Return an observable that emits the result of the dialog after it has been closed
    return dialogRef.afterClosed();
  }

  newOrder() {
    this.SelectedItems = [];
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
    if (this.url == '/home/dinein/' + this.table_id + '/' + this.id) {
      this.router.navigate(['dinein']);
    } else if (this.url == '/home/walkin/' + this.id) {
      this.router.navigate(['home/walkin']);
    } else if (
      this.url == '/home/party_orders/modify_order/' + this.id ||
      this.url == '/home/party_orders/confirm_order'
    ) {
      this.router.navigate(['walkin/entity-orders']);
    } else {
      this.taxGet();
    }
  }

  voidOrder() {
    // Open a dialog for voiding the order
    const dialogRef = this.dialog.open(VoidOrderComponent, {
      width: '600px',
      data: {
        orderid: this.orderID, // Pass the order ID as data to the dialog
      },
    });

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe((result) => {
      // The logic to be executed after the dialog is closed
      // You may handle the result if needed
    });
  }

  checkforModifier(items: any) {
    if (items.modifier_group) {
      // Open a dialog for adding items with modifiers
      const dialogRef = this.dialog.open(AddItemComponent, {
        width: '800px',
        data: {
          item: items.item_id,
          modifier_group: items.modifier_group,
          item_name: items.item_name,
          operation: '1', //for add
        },
      });

      // Subscribe to the dialog's afterClosed event
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.modifierRecords = result;
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
          let comboResult = result;
          if (comboResult.modifier_group) {
            // Open a dialog for adding items with modifiers for grouped items
            const dialogRef = this.dialog.open(AddItemComponent, {
              width: '800px',
              data: {
                item: comboResult.item_id,
                modifier_group: comboResult.modifier_group,
                item_name: comboResult.item_name,
                operation: '1', //for add
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.modifierRecords = result;
                this.addToCart(comboResult, 1);
              }
            });
          } else {
            this.addToCart(comboResult, 2); //type 2 accepted as grouped menu
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
          this.addToCart(result, 1);
        }
      });
    } else {
      this.addToCart(items, 1); //type 1 is Regular menu with or without modifiers
    }
  }

  filterItems(key: any) {
    if (key) {
      // Check if CategoryItems is empty and set it to the items of the first category
      if (this.CategoryItems.length < 1) {
        this.OnCategoryChange(this.CategoryRecords[0]);
      }

      // Filter items based on key (case-insensitive matching for item_name or item_code)
      var filterItems = this.CategoryItems.filter(function (obj: any) {
        return (
          obj.item_name.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          obj.item_code.toLocaleLowerCase().includes(key.toLocaleLowerCase())
        );
      });

      // Update CategoryItems with the filtered items
      this.CategoryItems = filterItems;
    } else {
      // If no key is provided, reset CategoryItems to the items of the first category
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  /**
   * Adds items to the shopping cart based on the specified type.
   *
   * @param items - The items to be added to the cart.
   * @param type - The type of items being added to the cart. Accepts either 1 or 2.
   *   - Type 1: Regular menu items with or without modifiers.
   *   - Type 2: Grouped menu items.
   *
   * @returns void
   */
  addToCart(items: any, type: any): void {
    this.Searchitem.nativeElement.focus();
    this.flagCartItem = true;
    this.showPrintFlag = false;

    if (type == 1) {
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

      this.Cart.Items = this.SelectedItems;
      this.flagCartItem = true;
      this.updateSubTotal();
    }
  }

  /**
   * Checks if there is at least one modifier in the provided list with a status of true.
   *
   * @param modifierlist - The list of modifiers to be checked.
   * @returns {boolean} - Returns true if at least one modifier has a status of true, otherwise returns false.
   */
  checkForValidTree(modifierlist: any): boolean {
    // Count the number of modifiers with a status of true
    let statusTrueCnt = _.filter(modifierlist.list, function (ls) {
      if (ls.status) return ls;
    }).length;

    // Return true if at least one modifier has a status of true, otherwise return false
    if (statusTrueCnt > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the total price of the selected item at the specified index based on its quantity and unit price.
   *
   * @param index - The index of the item in the selected items list to be updated.
   * @returns void
   */
  updatePrice(index: any): void {
    if (this.SelectedItems.length > 0) {
      // Calculate and update the total price of the selected item
      this.SelectedItems[index].total = (
        parseFloat(this.SelectedItems[index].qty) *
        parseFloat(this.SelectedItems[index].price)
      ).toFixed(2);
    }

    // Update the subtotal after modifying the item's total price
    this.updateSubTotal();
  }

  /**
   * Calculates and returns the total price of an item considering the base price and modifiers.
   *
   * @param locationprice - The base price of the item.
   * @param modifiers - The list of modifiers associated with the item.
   * @returns  - The total price of the item with modifiers, formatted to two decimal places.
   */
  updatePriceWithModifiers(locationprice: any, modifiers: any) {
    let total = 0.0;
    modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total +=
            parseFloat(obj1.rate) *
            parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1);
        }
      });
    });
    return (parseFloat(locationprice) + total).toFixed(2);
  }

  checkForItemprice(items: any, index: any) {
    this.invalidQuantityPrize = false;
    if (
      items.price > 0 &&
      items.price.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$') &&
      items.qty > 0
    ) {
      if (items.modifiers) {
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
   * Updates the total price of the selected item at the specified index, considering both the base price and modifiers.
   *
   * @param index - The index of the item in the selected items list to be updated.
   * @returns void
   */
  updateTotalWithModifiers(index: any): void {
    let total = 0.0;

    // Iterate through each modifier and its associated list for the selected item
    this.SelectedItems[index].modifiers?.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        // Check if the modifier is selected (status is true)
        if (obj1.status) {
          // Calculate the total based on the rate and quantity of the modifier
          total +=
            parseFloat(obj1.rate) *
            parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1);
        }
      });
    });

    // Calculate and update the total price of the selected item with modifiers
    this.SelectedItems[index].total = (
      parseFloat(this.SelectedItems[index].qty) *
      (parseFloat(this.SelectedItems[index].price) + total)
    ).toFixed(2);

    // Update the subtotal after modifying the item's total price
    this.updateSubTotal();
  }

  deleteOrderdiscount() {
    this.selectedDiscount = {};
    this.itemDiscountFlag = false;
    this.updateSubTotal();
  }

  deleteSurcharge() {
    this.surchargearray = [];
    this.updateSubTotal();
  }
  deleteCoupon() {
    this.couponSelected = null;
    this.updateSubTotal();
  }

  /**
   * Updates the subtotal and other relevant values in the shopping cart.
   *
   * @returns {Promise<void>} - A promise resolving when the update is complete.
   */
  async updateSubTotal(): Promise<void> {
    let temp = 0.0;

    // Calculate the subtotal by summing the total prices of all selected items
    for (let i = 0; i < this.SelectedItems.length; i++) {
      temp += parseFloat(this.SelectedItems[i].total);
    }

    // Update cart values
    this.Cart.subTotal = temp.toFixed(2);
    this.Cart.tax = (await this.calculateTax()).toFixed(2);
    this.Cart.otherCharge = (await this.calculateSurcharge()).toFixed(2);
    this.Cart.discount = (await this.calculateDiscount()).toFixed(2);
    this.Cart.loyaltyCoupon = this.couponSelected
      ? this.couponSelected.applied_discount?.toFixed(2)
      : '0.0';

    // Calculate the total amount considering tax, surcharge, and discounts
    this.Cart.amount = (
      parseFloat(this.Cart.subTotal) +
      parseFloat(this.Cart.tax) +
      parseFloat(this.Cart.otherCharge) -
      parseFloat(this.Cart.discount)
    ).toFixed(2);

    // Adjust the total amount if advance payment is made
    if (this.advancePaid) {
      this.Cart.amount = (
        parseFloat(this.Cart.amount) - parseFloat(this.advancePaid)
      ).toFixed(2);
    }

    // Deduct the loyalty coupon amount from the total amount
    if (this.couponSelected?.applied_discount) {
      this.Cart.amount = (
        parseFloat(this.Cart.amount) - parseFloat(this.Cart.loyaltyCoupon)
      ).toFixed(2);
    }
  }

  async calculateDiscount() {
    let discount = 0.0;
    let subtotal = parseFloat(this.Cart.subTotal);
    if (this.selectedDiscount.discount_type) {
      if (this.selectedDiscount.discount_type == 'value') {
        discount += parseFloat(this.selectedDiscount.rate);
        if (discount > subtotal) {
          this.snackBService.openSnackBar(
            'Invalid Discount,Please choose another one.',
            'Close'
          );
          this.deleteOrderdiscount();
        }
      } else {
        if (this.selectedDiscount.is_discount_on_total_amount) {
          discount +=
            (subtotal +
              (await this.calculateTax()) +
              (await this.calculateSurcharge())) *
            (parseFloat(this.selectedDiscount.rate) / 100);
        } else {
          discount += subtotal * (parseFloat(this.selectedDiscount.rate) / 100);
          if (discount > subtotal) {
            this.snackBService.openSnackBar(
              'Invalid Discount,Please choose another one.',
              'Close'
            );
            this.deleteOrderdiscount();
          }
        }
      }
      this.selectedDiscount.effected_value = discount.toFixed(2);
    }
    return discount;
  }

  /**
   * Calculates and returns the total tax amount based on the effective tax rates.
   *
   * @returns {Promise<number>} - A promise resolving to the total tax amount.
   */
  async calculateTax(): Promise<number> {
    let tax = 0.0;
    this.effectedTax = [];
    let subtotal: any = parseFloat(this.Cart.subTotal);

    // Check if there are any taxes defined
    if (this.taxarray.length > 0) {
      // Iterate through each tax definition
      this.taxarray.forEach((obj: any) => {
        if (obj.is_default == 1) {
          let type = obj.type == 1 ? 'Inclusive' : 'Exclusive';

          // Calculate tax based on tax type
          if (parseFloat(obj.type) == 1) {
            tax = 0;
          } else {
            tax += subtotal * (parseFloat(obj.rate) / 100);
          }

          // Prepare data for affected tax details
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

          // Iterate through each tax split and calculate affected price
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

          // Add the calculated tax details to the affected tax array
          this.effectedTax.push(tempArray);
        }
      });
    }

    return tax;
  }

  /**
   * Calculates and returns the total surcharge amount based on the effective surcharge rates.
   *
   * @returns {Promise<number>} - A promise resolving to the total surcharge amount.
   */
  async calculateSurcharge(): Promise<number> {
    let otherCharge = 0.0;
    this.effectedSurcharge = [];
    let subTotal = this.Cart.subTotal;

    // Check if surcharges are defined
    if (this.surchargearray) {
      // Iterate through each surcharge definition
      this.surchargearray.forEach((obj: any) => {
        // Check if the surcharge is active and has a value type
        if (obj.status == 1 && obj.type == 'value') {
          // Add the surcharge amount to the total
          otherCharge += parseFloat(obj.rate);

          // Prepare data for affected surcharge details
          let tempArray = {
            name: obj.name,
            id: obj.id,
            effected_price: parseFloat(obj.rate).toFixed(2),
          };
          this.effectedSurcharge.push(tempArray);
        } else if (obj.status == 1 && obj.type == 'percentage') {
          // Calculate percentage surcharge and add it to the total
          let percentageSurcharge = (
            parseFloat(subTotal) *
            (parseFloat(obj.rate) / 100)
          ).toFixed(2);
          otherCharge = otherCharge + parseFloat(percentageSurcharge);

          // Prepare data for affected surcharge details
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

  quantityPlus(index: any) {
    if (this.SelectedItems[index].modifiers) {
      if (
        this.SelectedItems[index].order_status == 'old' ||
        this.SelectedItems[index].order_status == 'updated'
      ) {
        this.httpService
          .get('inventory-status/' + this.SelectedItems[index].id)
          .subscribe((result) => {
            if (result.status == 200) {
              // code needs to be changed as function
              if (
                result.data.inventory_status ||
                this.branch_settings?.order_modify_popup == 1
              ) {
                const dialogRef = this.dialog.open(ModifyReasonComponent, {
                  width: '500px',
                  data: {
                    item: this.SelectedItems[index],
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.SelectedItems[index].difference_qty =
                      parseInt(result.data?.quantity) -
                      parseInt(this.SelectedItems[index].old_qty);
                    this.SelectedItems[index].qty = result.data.quantity;
                    if (
                      parseInt(this.SelectedItems[index].qty) ==
                      parseInt(this.SelectedItems[index].old_qty)
                    ) {
                      this.SelectedItems[index].order_status = 'old';
                    } else {
                      this.SelectedItems[index].time = this.itemTime();
                      this.SelectedItems[index].order_status = 'updated';
                    }
                    this.updateTotalWithModifiers(index);
                  }
                });
              } else {
                this.SelectedItems[index].qty++;
                this.SelectedItems[index].difference_qty =
                  parseInt(this.SelectedItems[index].qty) -
                  parseInt(this.SelectedItems[index].old_qty);
                if (
                  parseInt(this.SelectedItems[index].qty) ==
                  parseInt(this.SelectedItems[index].old_qty)
                ) {
                  this.SelectedItems[index].order_status = 'old';
                } else {
                  this.SelectedItems[index].time = this.itemTime();
                  this.SelectedItems[index].order_status = 'updated';
                }
                this.updateTotalWithModifiers(index);
              }
            }
          });
      } else {
        this.SelectedItems[index].qty++;
        this.updateTotalWithModifiers(index);
      }
    } else {
      if (
        this.SelectedItems[index].order_status == 'old' ||
        this.SelectedItems[index].order_status == 'updated'
      ) {
        this.httpService
          .get('inventory-status/' + this.SelectedItems[index].id)
          .subscribe((result) => {
            if (result.status == 200) {
              if (
                result.data.inventory_status ||
                this.branch_settings?.order_modify_popup == 1
              ) {
                const dialogRef = this.dialog.open(ModifyReasonComponent, {
                  width: '500px',
                  data: {
                    item: this.SelectedItems[index],
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.SelectedItems[index].difference_qty =
                      parseInt(result.data.quantity) -
                      parseInt(this.SelectedItems[index].old_qty);
                    this.SelectedItems[index].qty = result.data.quantity;
                    if (
                      parseInt(this.SelectedItems[index].qty) ==
                      parseInt(this.SelectedItems[index].old_qty)
                    ) {
                      this.SelectedItems[index].order_status = 'old';
                    } else {
                      this.SelectedItems[index].time = this.itemTime();
                      this.SelectedItems[index].order_status = 'updated';
                    }
                    this.updatePrice(index);
                  }
                });
              } else {
                this.SelectedItems[index].qty++;
                this.SelectedItems[index].difference_qty =
                  parseInt(this.SelectedItems[index].qty) -
                  parseInt(this.SelectedItems[index].old_qty);
                console.log(
                  'tempQty :' + this.SelectedItems[index].old_qty,
                  'selectedqty: ' + this.SelectedItems[index].qty,
                  'diffQty :' + this.SelectedItems[index].difference_qty
                );
                if (
                  parseInt(this.SelectedItems[index].qty) ==
                  parseInt(this.SelectedItems[index].old_qty)
                ) {
                  this.SelectedItems[index].order_status = 'old';
                } else {
                  this.SelectedItems[index].time = this.itemTime();
                  this.SelectedItems[index].order_status = 'updated';
                }
                this.updatePrice(index);
              }
            }
          });
      } else {
        this.SelectedItems[index].qty++;
        this.updatePrice(index);
      }
    }
  }

  qtyInputChange(quantity: any, index: any) {
    this.invalidQuantityPrize = false;
    if (
      quantity > 0 &&
      quantity.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$') &&
      this.SelectedItems[index].price > 0
    ) {
      if (this.SelectedItems[index].modifiers) {
        if (
          this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated'
        ) {
          const dialogRef = this.dialog.open(ModifyReasonComponent, {
            width: '500px',
            data: {
              item: this.SelectedItems[index],
              action: 'minus',
              qty: quantity,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result?.isModified == true) {
              this.SelectedItems[index].difference_qty =
                parseInt(result.data.quantity) -
                parseInt(this.SelectedItems[index].old_qty);
              this.SelectedItems[index].qty = result.data.quantity;
              if (
                parseInt(this.SelectedItems[index].qty) ==
                parseInt(this.SelectedItems[index].old_qty)
              ) {
                this.SelectedItems[index].order_status = 'old';
              } else {
                this.SelectedItems[index].time = this.itemTime();
                this.SelectedItems[index].order_status = 'updated';
              }
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updateTotalWithModifiers(index);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].difference_qty =
                parseInt(result.data.quantity) -
                parseInt(this.SelectedItems[index].old_qty);
              this.SelectedItems[index].qty = result.data.quantity;
              if (
                parseInt(this.SelectedItems[index].qty) ==
                parseInt(this.SelectedItems[index].old_qty)
              ) {
                this.SelectedItems[index].order_status = 'old';
              } else {
                this.SelectedItems[index].time = this.itemTime();
                this.SelectedItems[index].order_status = 'updated';
              }
              this.updateTotalWithModifiers(index);
            }
          });
        } else {
          this.updateTotalWithModifiers(index);
        }
      } else {
        if (
          this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated'
        ) {
          const dialogRef = this.dialog.open(ModifyReasonComponent, {
            width: '500px',
            data: {
              item: this.SelectedItems[index],
              action: 'minus',
              qty: quantity,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result?.isModified == true) {
              this.SelectedItems[index].difference_qty =
                parseInt(result.data.quantity) -
                parseInt(this.SelectedItems[index].old_qty);
              this.SelectedItems[index].qty = result.data.quantity;
              if (
                parseInt(this.SelectedItems[index].qty) ==
                parseInt(this.SelectedItems[index].old_qty)
              ) {
                this.SelectedItems[index].order_status = 'old';
              } else {
                this.SelectedItems[index].time = this.itemTime();
                this.SelectedItems[index].order_status = 'updated';
              }
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updatePrice(index);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].difference_qty =
                parseInt(result.data.quantity) -
                parseInt(this.SelectedItems[index].old_qty);
              this.SelectedItems[index].qty = result.data.quantity;
              if (
                parseInt(this.SelectedItems[index].qty) ==
                parseInt(this.SelectedItems[index].old_qty)
              ) {
                this.SelectedItems[index].order_status = 'old';
              } else {
                this.SelectedItems[index].time = this.itemTime();
                this.SelectedItems[index].order_status = 'updated';
              }
              this.updatePrice(index);
            }
          });
        } else {
          this.updatePrice(index);
        }
      }
    } else {
      this.invalidQuantityPrize = true;
      this.snackBService.openSnackBar('Invalid Quantity or Prize', 'Close');
    }
  }

  quantityMinus(quantity: any, index: any) {
    if (quantity > 1) {
      if (this.SelectedItems[index].modifiers) {
        if (
          this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated'
        ) {
          this.httpService
            .get('inventory-status/' + this.SelectedItems[index].id)
            .subscribe((result) => {
              if (result.status == 200) {
                if (
                  result.data.inventory_status ||
                  this.branch_settings?.order_modify_popup == 1
                ) {
                  const dialogRef = this.dialog.open(ModifyReasonComponent, {
                    width: '500px',
                    data: {
                      item: this.SelectedItems[index],
                      action: 'minus',
                      qty: quantity,
                      orderid: this.orderID,
                    },
                  });
                  dialogRef.afterClosed().subscribe((result) => {
                    if (result?.isModified == true) {
                      this.SelectedItems[index].difference_qty =
                        parseInt(result.data.quantity) -
                        parseInt(this.SelectedItems[index].old_qty);
                      this.SelectedItems[index].qty = result.data.quantity;
                      if (
                        parseInt(this.SelectedItems[index].qty) ==
                        parseInt(this.SelectedItems[index].old_qty)
                      ) {
                        this.SelectedItems[index].order_status = 'old';
                      } else {
                        let date = moment();
                        this.SelectedItems[index].time =
                          date.format('HH:MM:SS');
                        this.SelectedItems[index].order_status = 'updated';
                      }
                      this.SelectedItems[index].modify_reason_id =
                        result.data.reason;
                      this.SelectedItems[index].inventory_status =
                        result.data.inventory_status;
                      this.updateTotalWithModifiers(index);
                    } else if (result?.isModified == false) {
                      this.SelectedItems[index].difference_qty =
                        parseInt(result.data.quantity) -
                        parseInt(this.SelectedItems[index].old_qty);
                      this.SelectedItems[index].qty = result.data.quantity;
                      if (
                        parseInt(this.SelectedItems[index].qty) ==
                        parseInt(this.SelectedItems[index].old_qty)
                      ) {
                        this.SelectedItems[index].order_status = 'old';
                      } else {
                        let date = moment();
                        this.SelectedItems[index].time =
                          date.format('HH:MM:SS');
                        this.SelectedItems[index].order_status = 'updated';
                      }
                      this.updateTotalWithModifiers(index);
                    }
                  });
                } else {
                  this.SelectedItems[index].qty--;
                  this.SelectedItems[index].difference_qty =
                    parseInt(this.SelectedItems[index].qty) -
                    parseInt(this.SelectedItems[index].old_qty);
                  if (
                    parseInt(this.SelectedItems[index].qty) ==
                    parseInt(this.SelectedItems[index].old_qty)
                  ) {
                    this.SelectedItems[index].order_status = 'old';
                  } else {
                    this.SelectedItems[index].time = this.itemTime();
                    this.SelectedItems[index].order_status = 'updated';
                  }
                  this.updateTotalWithModifiers(index);
                }
              }
            });
        } else {
          this.SelectedItems[index].qty--;
          this.updateTotalWithModifiers(index);
        }
      } else {
        if (
          this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated'
        ) {
          this.httpService
            .get('inventory-status/' + this.SelectedItems[index].id)
            .subscribe((result) => {
              if (result.status == 200) {
                if (
                  result.data.inventory_status ||
                  this.branch_settings?.order_modify_popup == 1
                ) {
                  const dialogRef = this.dialog.open(ModifyReasonComponent, {
                    width: '500px',
                    data: {
                      item: this.SelectedItems[index],
                      action: 'minus',
                      qty: quantity,
                      orderid: this.orderID,
                    },
                  });
                  dialogRef.afterClosed().subscribe((result) => {
                    if (result?.isModified == true) {
                      this.SelectedItems[index].difference_qty =
                        parseInt(result.data.quantity) -
                        parseInt(this.SelectedItems[index].old_qty);
                      this.SelectedItems[index].qty = result.data.quantity;
                      if (
                        parseInt(this.SelectedItems[index].qty) ==
                        parseInt(this.SelectedItems[index].old_qty)
                      ) {
                        this.SelectedItems[index].order_status = 'old';
                      } else {
                        let date = moment();
                        this.SelectedItems[index].time =
                          date.format('HH:MM:SS');
                        this.SelectedItems[index].order_status = 'updated';
                      }
                      this.SelectedItems[index].modify_reason_id =
                        result.data.reason;
                      this.SelectedItems[index].inventory_status =
                        result.data.inventory_status;
                      this.updatePrice(index);
                    } else if (result?.isModified == false) {
                      this.SelectedItems[index].difference_qty =
                        parseInt(result.data.quantity) -
                        parseInt(this.SelectedItems[index].old_qty);
                      this.SelectedItems[index].qty = result.data.quantity;
                      if (
                        parseInt(this.SelectedItems[index].qty) ==
                        parseInt(this.SelectedItems[index].old_qty)
                      ) {
                        this.SelectedItems[index].order_status = 'old';
                      } else {
                        let date = moment();
                        this.SelectedItems[index].time =
                          date.format('HH:MM:SS');
                        this.SelectedItems[index].order_status = 'updated';
                      }
                      this.updatePrice(index);
                    }
                  });
                } else {
                  this.SelectedItems[index].qty--;
                  this.SelectedItems[index].difference_qty =
                    parseInt(this.SelectedItems[index].qty) -
                    parseInt(this.SelectedItems[index].old_qty);
                  if (
                    parseInt(this.SelectedItems[index].qty) ==
                    parseInt(this.SelectedItems[index].old_qty)
                  ) {
                    this.SelectedItems[index].order_status = 'old';
                  } else {
                    this.SelectedItems[index].time = this.itemTime();
                    this.SelectedItems[index].order_status = 'updated';
                  }
                  this.updatePrice(index);
                }
              }
            });
        } else {
          this.SelectedItems[index].qty--;
          this.updatePrice(index);
        }
      }
    }
  }

  /**
   * Deletes the selected item from the shopping cart at the specified index.
   * Performs necessary actions based on the item's order status.
   *
   * @param index - The index of the item in the selected items list to be deleted.
   * @returns void
   */
  deleteCartItem(index: any): void {
    // Check if the selected item has an 'old' order status
    if (this.SelectedItems[index].order_status == 'old') {
      // Check if there are multiple items in the cart
      if (this.SelectedItems.length > 1) {
        // Fetch inventory status for the item from the server
        this.httpService
          .get('inventory-status/' + this.SelectedItems[index].id)
          .subscribe((result) => {
            if (result.status == 200) {
              // Check if the item has inventory status or order modify popup is enabled in branch settings
              if (
                result.data.inventory_status ||
                this.branch_settings?.order_modify_popup == 1
              ) {
                // Open a dialog for confirming the deletion of the item
                const dialogRef = this.dialog.open(VoidOrderComponent, {
                  width: '600px',
                  data: {
                    index: index,
                    orderid: this.orderID,
                    item: this.SelectedItems[index],
                    action: 'removeitem',
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    // Set modified flag, remove the item, and update the subtotal
                    this.modificationService.setModifiedFlag(true);
                    this.SelectedItems.splice(index, 1);
                    this.updateSubTotal();
                  }
                });
              } else {
                // Prepare data for deleting the item
                let body = {
                  index: index,
                  qty: this.SelectedItems[index].qty,
                  item_id: this.SelectedItems[index].id,
                  modify_reason_id: null,
                  inventory_status: null,
                  branch_id: this.branch_id,
                  order_id: this.orderID,
                };

                // Call the function to delete the item
                this.deleteLineItem(body);

                // Remove the item and update the subtotal
                this.SelectedItems.splice(index, 1);
                this.checkForItemDiscountApply();
                this.updateSubTotal();

                // Check if there are no items left in the cart and update flags
                if (this.SelectedItems.length <= 0) {
                  this.flagCartItem = false;
                  this.surchargearray = [];
                }
              }
            }
          });
      } else {
        // If there is only one item, void the entire order
        this.voidOrder();
      }
    } else {
      // If the item has a non-'old' order status, simply remove it from the cart
      this.SelectedItems.splice(index, 1);
      this.checkForItemDiscountApply();
      this.updateSubTotal();

      // Check if there are no items left in the cart and update flags
      if (this.SelectedItems.length <= 0) {
        this.flagCartItem = false;
        this.surchargearray = [];
      }
    }
  }

  deleteLineItem(body: any) {
    //this api calls when modify popup is not there without modify reson
    this.httpService.post('delete-order-item', body).subscribe((result) => {
      if (result.status == 200) {
        this.modificationService.setModifiedFlag(true);
      } else {
        console.log('Error');
      }
    });
  }

  addDiscount() {
    const dialogRef = this.dialog.open(AddDiscountComponent, {
      width: '800px',
      data: {
        entity_id: this.entity_Id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedDiscount = result;
        this.updateSubTotal();
        this.itemDiscountFlag = true;
      }
    });
  }

  changeTax() {
    const dialogRef = this.dialog.open(ChangeTaxComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taxarray = result;
        this.updateSubTotal();
      }
    });
  }

  addNotes() {
    const dialogRef = this.dialog.open(AddNotesComponent, {
      width: '500px',
      data: {
        note: this.notes,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notes = result;
      }
    });
  }

  /**
   * Opens a dialog for editing the selected item, providing necessary data to the dialog component.
   *
   * @param selecteditem - The selected item to be edited.
   * @param index - The index of the selected item in the cart.
   * @returns void
   */
  editItem(selecteditem: any, index: any): void {
    // Set data for the selected item, its index, and order discount flag
    this.dataservice.setData('selectedMenuItem', selecteditem);
    this.dataservice.setData('selectedMenuItemIndex', index);
    this.dataservice.setData('orderdiscountflag', this.orderDiscountFlag);

    // Check if the selected item has modifiers and set modifier edit data if applicable
    if (selecteditem.modifiers) {
      this.setEditModifierData(selecteditem);
    }

    // Open the dialog for editing the item
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

    // Subscribe to the result of the dialog after it is closed
    dialogRef.afterClosed().subscribe((result) => {
      // Set discount, update item note, and check for item discount application
      this.setDiscount();
      this.item_note = result;
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
   * Sets the data for editing modifiers of the selected item, providing necessary information for the dialog.
   *
   * @param selecteditem - The selected item for which modifiers are being edited.
   * @returns void
   */
  setEditModifierData(selecteditem: any): void {
    let selectedmodifier = {
      item_name: selecteditem.name,
      modifier_group: [] as any,
    };

    // Iterate through each modifier group of the selected item
    selecteditem.modifiers.forEach((obj: any) => {
      let items = {
        modifier_group_name: obj.name,
        can_add_multiple: obj.can_add_multiple,
        max_qty: obj.max_qty,
        min_qty: obj.min_qty,
        modifier_group_id: obj.id,
        modifier_list: [] as any,
      };

      // Iterate through each modifier in the modifier group
      obj.list.forEach((list: any) => {
        // Prepare data for the modifier list
        let list_data = {
          item_id: list.id,
          item_name: list.modifier_list,
          item_price: list.rate,
          status: list.status,
          list_qty: list.list_qty,
        };

        // Add the modifier list data to the modifier group
        items.modifier_list.push(list_data);
      });

      // Add the modifier group data to the selected modifiers
      selectedmodifier.modifier_group.push(items);
    });

    // Set the edit modifier data for the selected item
    this.editModifierData = selectedmodifier;
  }

  /**
   * Sets the discount for the selected item based on updated data received from the dialog.
   * Updates the selected item in the cart and triggers the recalculation of the subtotal.
   *
   * @returns void
   */
  setDiscount(): void {
    // Get updated item data from the data service
    let updatedMenuItem = this.dataservice.getData('updatedMenuItem');
    let selectedMenuItemIndex = this.dataservice.getData(
      'selectedMenuItemIndex'
    );

    // Check if there is updated item data
    if (updatedMenuItem != null || updatedMenuItem != undefined) {
      // Update the selected item in the cart with the updated data
      this.SelectedItems[selectedMenuItemIndex] = updatedMenuItem;

      // Clear the stored updated item data in the data service
      this.dataservice.setData('updatedMenuItem', null);

      // Update the subtotal after modifying the item
      this.updateSubTotal();
    } else {
      // Check if the selected item has modifiers and update total with modifiers, otherwise update price
      if (this.SelectedItems[selectedMenuItemIndex].modifiers) {
        this.updateTotalWithModifiers(selectedMenuItemIndex);
      } else {
        this.updatePrice(selectedMenuItemIndex);
      }
    }
  }

  printKOTorInvoice(data: any) {
    data.forEach((obj: any) => {
      let print = this.printMqtt.checkPrinterAvailablity(obj);
      if (print.status) {
        this.printMqtt
          .publish('print', print.printObj)
          .subscribe((data: any) => {});
      } else {
        this.snackBService.openSnackBar(print.message, 'Close');
      }
    });
  }

  kotPrint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.orderID + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Kot Receipt Generated Successfully!',
              'Close'
            );
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
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      this.httpService
        .get('offline-print/' + this.orderID + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  labelPrint() {
    this.httpService.get('label-print/' + this.orderID).subscribe((result) => {
      if (result.status == 200) {
        if (result.data.length > 0) {
          const dialogRef = this.dialog.open(LabelPrintComponent, {
            width: '350px',
            data: { printData: result.data },
          });

          dialogRef.afterClosed().subscribe((result) => {});
        } else {
          this.snackBService.openSnackBar('No specifications added', 'Close');
        }
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  invoiceReprint() {
    this.printOffline = this.localservice.get('printOffline');
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      this.httpService
        .get('receipt/' + this.orderID + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(
              'Invoice Receipt Generated Successfully!',
              'Close'
            );
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
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      this.httpService
        .get('offline-print/' + this.orderID + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  gotoPage(page: any) {
    if (page == 'delivery_settings') {
      this.router.navigate(['setup/delivery_settings']);
    } else {
      this.router.navigate([page]);
    }
  }

  splitBill() {
    const dialogRef = this.dialog.open(SplitBillComponent, {
      // maxWidth: '100vw',
      width: '90%',
      // panelClass: 'full-screen-modal',
      data: {
        editData: this.walkinEditRecords,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  /**
   * Refreshes the menu items for the current branch and entity by making a request to the server.
   * Updates the local storage with the retrieved menu items and triggers the update of the displayed categories.
   *
   * @returns void
   */
  refreshMenu(): void {
    // Construct the key for storing menu items in local storage
    let entityKey = 'menuItem' + this.entity_Id;

    // Make a request to the server to retrieve updated menu items
    this.httpService
      .get('menu-items/' + this.branch_id + '/' + this.entity_Id)
      .subscribe((result) => {
        if (result.status == 200) {
          // Update the CategoryRecords with the retrieved menu items
          this.CategoryRecords = result.data;

          // Store the updated menu items in local storage
          this.localservice.store(entityKey, this.CategoryRecords);

          // Add a placeholder category for displaying all items
          this.CategoryRecords.unshift({
            category_id: -1,
            category_name: 'ALL',
            colour: '#0778',
          });

          // Trigger the update of displayed categories with the first category
          this.OnCategoryChange(this.CategoryRecords[0]);
        } else {
          // Remove the menu items from local storage if the request fails
          this.localservice.remove(entityKey);

          // Display a snack bar with the server response message
          this.snackBService.openSnackBar(result.message, 'close');
        }
      });
  }
}
