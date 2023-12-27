import { Component, OnInit } from '@angular/core';
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
import { KotMqttService } from 'src/app/_services/mqtt/kot-mqtt.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Constants } from 'src/constants';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { GroupedItemComponent } from '../add-groupeditem/grouped-item/grouped-item.component';
import { AddItemComponent } from '../add-item/add-item.component';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { AddSurchargeComponent } from '../add-surcharge/add-surcharge.component';
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
import { SubscriptionStatusDialogComponent } from '../subscription-status-dialog/subscription-status-dialog.component';
import { UtensilsComponent } from '../utensils/utensils.component';
import { VoidOrderComponent } from '../void-order/void-order.component';
import packageversion from '../../../../package.json';
import { ChangeTaxComponent } from '../change-tax/change-tax.component';

@Component({
  selector: 'app-b-b-home',
  templateUrl: './b-b-home.component.html',
  styleUrls: ['./b-b-home.component.scss'],
})
export class BBHomeComponent implements OnInit {
  div1: boolean = true;
  div2: boolean = true;
  div3: boolean = true;
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
  public table_id: string = this.route.snapshot.params.table_id;
  public order_no: string = this.route.snapshot.params.order_no;
  // public custom_entity_name: string = this.route.snapshot.params.custom_entity_name;
  public custom_entity_id: string = this.route.snapshot.params.custom_entity_id;
  newOrderFlag: boolean = false; // for creating new order ,false will accept as edit
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
  pricePlan: any;
  disabledFlag: any = false; // used to disable place order or modify button when one time clicked
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
    private dataservice: DataService
  ) {
    this.time$ = this.dateService.getDate();
    this.tableName = this.dataservice.getData('tableName');
  }
  ngOnInit(): void {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/driver.wav';
    this.url = this.router.url;
    this.onBuildPaymentForm();
    this.checkOpenSaleStatus();
    this.routerCheck();
    this.getMenuCategory();
    this.getWaiters();
    this.taxGet();
    this.getBranch();
    this.getSubscriptionStatus();
  }

  ngAfterViewInit(): void {
    this.subscribeToTopicForMenuStatus();
  }

  onBuildPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      name: null,
      phone_number: [null, Validators.pattern('^([0-9]{6,13})$')],
    });
  }

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

  // ngOnDestroy(): void {
  //   this.dataservice.setData('discount', undefined);
  //   this.dataservice.setData('editData', null);
  //   this.dataservice.setData('surcharge', undefined);
  //   this.dataservice.setData('reservationdetails', null);
  //   this.dataservice.setData('advancepayment', null);
  //   this.dataservice.setData('Crmdetails', null);
  //   this.dataservice.setData('CustomEntityOrderNO', null);
  //   this.dataservice.setData('tableName', null)
  // }

  routerCheck() {
    if (this.url == '/home/b-b/newOrder') {
      this.SelectedItems = [];
      this.crmFlag = true;
      this.newOrderFlag = true;
      this.entity_Id = '9';
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.pricePlan = this.dataservice.getData('pricePlan');
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branchnameSelected = this.crmRecords.locationDetails.branch_name;
      this.entity_order_no = this.dataservice.getData('CustomEntityOrderNO');
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      this.paymentForm.disable();
    } else if (this.url == '/home/b-b/editOrder/' + this.order_no) {
      this.crmFlag = true;
      this.pricePlan = this.dataservice.getData('pricePlan');
      this.entity_Id = '9';
      this.getEditItems();
    }
  }

  getEditItems() {
    this.httpService
      .get('orderByNumber/1/' + this.order_no)
      .subscribe((result) => {
        if (result.status == 200) {
          this.SelectedItems = [];
          this.walkinEditRecords = result.data[0];
          this.selectedDiscount = this.walkinEditRecords?.order.discount?.id
            ? this.walkinEditRecords?.order.discount
            : {};
          this.surchargearray = this.walkinEditRecords?.order.surcharge
            ? this.walkinEditRecords?.order.surcharge
            : [];
          this.taxarray = this.walkinEditRecords.order.tax_array
            ? this.walkinEditRecords.order.tax_array
            : [];
          this.flagCartItem = true;
          this.SelectedItems = this.walkinEditRecords.order.items;
          this.couponSelected = this.walkinEditRecords.order?.loyalty_coupon
            ? this.walkinEditRecords.order?.loyalty_coupon
            : null;
          this.paymentForm.patchValue({
            name: this.walkinEditRecords.order.customer_details?.name,
            phone_number:
              this.walkinEditRecords.order.customer_details?.phone_number,
          });
          this.updateSubTotal();
          if (this.walkinEditRecords.order.customer_details?.phone_number) {
            this.paymentForm.disable();
          }
          this.orderID = this.walkinEditRecords.order_id
            ? this.walkinEditRecords.order_id
            : this.walkinEditRecords.id;
          this.invoiceID = this.walkinEditRecords.invoice_id;
          this.orderNumber = this.walkinEditRecords.order_number;
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
          this.notes = this.walkinEditRecords.notes;
          this.advancePaid = this.walkinEditRecords.order.advance_paid
            ? this.walkinEditRecords.order.advance_paid
            : null;
          this.tableName = this.walkinEditRecords.order?.table_name;
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
                  country_name:
                    this.walkinEditRecords.order.address.country_name,
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
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

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

  // splitTable() {
  //   this.router.navigate(["home/dinein/" + this.table_id]);
  // }

  moveTable() {
    this.dataservice.setData('orderId', this.orderID);
    this.router.navigate(['dinein/move-table']);
  }

  getSurcharges() {
    const dialogRef = this.dialog.open(AddSurchargeComponent, {
      width: '600px',
      maxHeight: '600px',
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

  // getWaiter() {
  //   const dialogRef = this.dialog.open(SelectWaiterComponent, {
  //     width: '500px',
  //     data: {
  //       id: this.waiterId
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.waiterId = result.id,
  //         this.waiterName = result.name
  //     }
  //   });
  // }

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

  taxGet() {
    this.httpService.get('tax').subscribe((result) => {
      if (result.status == 200) {
        this.taxarray = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  getMenuCategory() {
    let entityKey = 'menuItem' + this.entity_Id;
    let menuItem = this.localservice.get(entityKey);
    if (menuItem == null) {
      this.httpService
        .get(
          'menu-items-by-priority/' + this.branch_id + '/' + this.pricePlan?.id
        )
        .subscribe((result) => {
          if (result.status == 200) {
            this.CategoryRecords = result.data;
            this.localservice.store(entityKey, this.CategoryRecords);
            // this.CategoryRecords.unshift({ 'category_id': 0, 'category_name': 'Quick Items', 'colour': '#0777' })
            this.CategoryRecords.unshift({
              category_id: -1,
              category_name: 'ALL',
              colour: '#0778',
            });
            this.OnCategoryChange(this.CategoryRecords[0]);
          } else {
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
    } else {
      this.CategoryRecords = menuItem;
      this.CategoryRecords.unshift({
        category_id: -1,
        category_name: 'ALL',
        colour: '#0778',
      });
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  OnCategoryChange(items: any) {
    this.classactive = items.category_id;
    if (items.category_id == -1) {
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            this.CategoryItems.push(obj2);
          });
        }
      });
    } else if (items.category_id == 0) {
      this.CategoryItems = [];
      this.CategoryRecords.forEach((obj: any) => {
        if (obj.item) {
          obj.item.forEach((obj2: any) => {
            if (obj2.is_quick_item == 1) this.CategoryItems.push(obj2);
          });
        }
      });
    } else {
      if (items.item) this.CategoryItems = items.item;
      else this.CategoryItems = [];
    }
  }

  getUtensils() {
    const dialogRef = this.dialog.open(UtensilsComponent, {
      width: '800px',
      maxHeight: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addToCart(result, 2); //type 2 accept as grouped menu
      }
    });
  }

  // OnBranchChange(id: any, name: any) {
  //   this.crm_branch_id = id;
  //   this.crm_branchnameSelected = name;
  // }

  // cancelOrder() {
  //   this.flagCartItem = false;
  //   this.SelectedItems = [];
  //   this.selectedDiscount = {};
  //   this.orderDiscountFlag = false;
  //   this.itemDiscountFlag = false;
  // }

  confirmOrder() {
    this.flagCartItem = false;
    this.flagCartPayment = true;
  }

  showBtnName() {
    if (this.orderID) {
      return 'Modify Order';
    } else {
      return 'Place Order';
    }
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
        // this.flagCartPayment = true;
        let user = this.dataservice.getData('user');
        let body = {
          notes: this.notes,
          order_number: !this.route.snapshot.params.order_no
            ? 'ORD_' + randomOrderNo
            : this.route.snapshot.params.order_no,
          items: this.SelectedItems,
          entity_id: this.entity_Id,
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
          address: this.crmFlag
            ? {
                branch_id: this.branch_id,
                branch_name: this.crm_branchnameSelected,
                building_or_villa:
                  this.crmRecords.locationDetails.building_or_villa,
                country_id: this.crmRecords.locationDetails.country_id,
                country_name: this.crmRecords.locationDetails.country_name,
                id: this.crmRecords.locationDetails.id,
                street: this.crmRecords.locationDetails.street,
              }
            : null,
          branch_id: this.branch_id,
          branch_name: this.crmFlag ? this.crm_branchnameSelected : null,
          kitchen_status: 'new',
          ref_number: null,
          store_pickup: false,
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
            this.dineinReservation != 'undefined'
              ? this.dineinReservation.order_mode
              : null,
          loyalty_coupon: this.couponSelected ? this.couponSelected : null,
          Cart: {
            Items: this.SelectedItems,
            amount: this.Cart.amount,
            discount: this.Cart.discount,
            otherCharge: this.Cart.otherCharge,
            subTotal: this.Cart.subTotal,
            tax: this.Cart.tax,
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
          tax_selected: this.Cart.tax ? this.Cart.tax : null,
          tax_array: this.taxarray ? this.taxarray : [],
          applied_tax: this.effectedTax ? this.effectedTax : [],
          print_bill: true,
          entity_order_no: this.entity_order_no,
          table_name: this.tableName,
          assign_to: this.waiterChoosen.value
            ? {
                id: this.waiterChoosen.value.id,
                name: this.waiterChoosen.value.name,
              }
            : null,
          pax_no: this.paxNo.value ? this.paxNo.value : null,
          price_plan_id: this.pricePlan?.id,
          price_plan_name: this.pricePlan?.name,
        };
        if (this.url == '/home/b-b/newOrder' && !this.orderID) {
          this.httpService.post('orders', body).subscribe((result) => {
            if (result.status == 200) {
              this.orderID = result.data.id;
              this.disabledFlag = false;
              this.snackBService.openSnackBar(
                'Order Placed Successfully!!',
                'Close'
              );
              this.showPrintFlag = true;
              this.customer_id = result.data.customer_id;
              this.customerRecords = this.paymentForm.value;
              this.paymentForm.reset();
              this.publishOrder();
              this.printKOTorInvoice(result.data.receipt);
              // this.loyality_points=result.data;
              // this.makePayment('add'); // old
              this.showOrderDetails(result.data);
            } else {
              this.snackBService.openSnackBar('Error', 'Close');
            }
          });
        } else {
          this.httpService
            .put('orders/' + this.orderID, body)
            .subscribe((result) => {
              if (result.status == 200) {
                this.orderID = result.data.id;
                this.disabledFlag = false;
                this.snackBService.openSnackBar(
                  'Order Updated Successfully',
                  'Close'
                );
                this.showPrintFlag = true;
                this.publishOrder();
                this.printKOTorInvoice(result.data.receipt);
                // this.makePayment('add');
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

  checkWaiterChoosed() {
    if (this.waiterChoosen.valid || this.assignWaiter == false) {
      this.placeOrder();
    } else {
      // const options = {
      //   title: 'Are you sure',
      //   message: 'Continue without selecting waiter ?',
      //   cancelText: 'NO',
      //   confirmText: 'YES'
      // };
      // this.dialogService.open(options);
      // this.dialogService.confirmed().subscribe(confirmed => {
      //   if (confirmed) {
      //     this.placeOrder()
      //   }
      // })
      this.snackBService.openSnackBar('Please choose a waiter', 'Close');
    }
  }

  publishOrder() {
    console.log('publishing...');
    let data = 'new';
    this.kotMqtt.publish(this.messageType, data).subscribe((data: any) => {});
  }

  makePayment(operation: any) {
    // if (operation == "edit") {
    this.checkWaiterChoosed();
    // }
    // old
    // else {
    //   if (this.accept_payment == 'true') {
    //     const dialogRef = this.dialog.open(PaymentDialogComponent, {
    //       disableClose: true,
    //       width: '500px',
    //       data: {
    //         Cart: this.Cart,
    //         orderId: this.orderID,
    //         invoiceId: this.walkinEditRecords.invoice_id,
    //         customerid: this.customer_id,
    //         entityid: this.entity_Id,
    //         customer_details: this.customerRecords
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //       if (result) {
    //         this.newOrder()
    //       }
    //     });
    //   }
    // }
  }

  // new
  showOrderDetails(orders: any) {
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      disableClose: true,
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orders,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'closed') {
        this.newOrder();
      }
    });
  }

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
    this.router.navigate(['callcenter']);
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
  
  voidOrder() {
    const dialogRef = this.dialog.open(VoidOrderComponent, {
      width: '600px',
      data: {
        orderid: this.orderID,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  checkforModifier(items: any) {
    if (items.modifier_group) {
      const dialogRef = this.dialog.open(AddItemComponent, {
        width: '800px',
        data: {
          item: items.item_id,
          modifier_group: items.modifier_group,
          item_name: items.item_name,
          operation: '1', //for add
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.modifierRecords = result;
          this.addToCart(items, 1);
        }
      });
    } else if (items.item_type == 2) {
      const dialogRef = this.dialog.open(GroupedItemComponent, {
        width: '500px',
        data: {
          groupedItems: items.group_item,
          name: items.item_name,
          price: items.default_price,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //  To check wheather the item contains modifiers or not
          let comboResult = result;
          if (comboResult.modifier_group) {
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
            this.addToCart(comboResult, 2); //type 2 accept as grouped menu
          }
        }
      });
    } else if (items.item_type == 3) {
      const dialogRef = this.dialog.open(ComboItemComponent, {
        width: '500px',
        data: {
          comboItems: items,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.addToCart(result, 1);
        }
      });
    } else {
      this.addToCart(items, 1); //type 1 is  Regularmenu with or without modifiers
    }
  }

  filterItems(key: any) {
    if (key) {
      if (this.CategoryItems.length < 1) {
        this.OnCategoryChange(this.CategoryRecords[0]);
      }
      var filterItems = this.CategoryItems.filter(function (obj: any) {
        return (
          obj.item_name.toLocaleLowerCase().includes(key.toLocaleLowerCase()) ||
          obj.item_code.toLocaleLowerCase().includes(key.toLocaleLowerCase())
        );
      });
      this.CategoryItems = filterItems;
    } else {
      this.OnCategoryChange(this.CategoryRecords[0]);
    }
  }

  addToCart(items: any, type: any) {
    //type 1 is  Regularmenu with or without modifiers & type 2 accept as grouped menu
    this.flagCartItem = true;
    this.flagCartPayment = false;
    this.showPrintFlag = false;
    if (type == 1) {
      var found = this.SelectedItems.find(function (obj: any) {
        return obj.id == items.item_id;
      });

      if (
        found &&
        !this.SelectedItems[this.SelectedItems.indexOf(found)].modifiers
      ) {
        this.quantityPlus(this.SelectedItems.indexOf(found));
      } else {
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
          };
          this.SelectedItems.push(itemSelected);
        }
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
      if (found) {
        this.quantityPlus(this.SelectedItems.indexOf(found));
      } else {
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
        };
        this.SelectedItems.push(itemSelected);
      }
      this.Cart.Items = this.SelectedItems;
      this.flagCartItem = true;
      this.updateSubTotal();
    }
  }

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

  div1Function() {
    this.div1 = true;
    this.div2 = true;
    this.div3 = false;
  }

  div2Function() {
    this.div2 = true;
    this.div1 = false;
    this.div3 = true;
  }

  div3Function() {
    this.div3 = true;
    this.div2 = true;
    this.div1 = false;
  }

  updatePrice(index: any) {
    if (this.SelectedItems.length > 0)
      this.SelectedItems[index].total = (
        parseFloat(this.SelectedItems[index].qty) *
        parseFloat(this.SelectedItems[index].price)
      ).toFixed(2);
    this.updateSubTotal();
  }

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

  updateTotalWithModifiers(index: any) {
    let total = 0.0;
    this.SelectedItems[index].modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total +=
            parseFloat(obj1.rate) *
            parseFloat(obj1.list_qty && obj1.list_qty > 0 ? obj1.list_qty : 1);
        }
      });
    });
    this.SelectedItems[index].total = (
      parseFloat(this.SelectedItems[index].qty) *
      (parseFloat(this.SelectedItems[index].price) + total)
    ).toFixed(2);
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

  async updateSubTotal() {
    // setTimeout(() => {
    let temp = 0.0;
    for (let i = 0; i < this.SelectedItems.length; i++) {
      temp += parseFloat(this.SelectedItems[i].total);
    }
    this.Cart.subTotal = temp.toFixed(2);
    this.Cart.tax = (await this.calculateTax()).toFixed(2);
    this.Cart.otherCharge = (await this.calculateSurcharge()).toFixed(2);
    this.Cart.discount = (await this.calculateDiscount()).toFixed(2);
    this.Cart.loyaltyCoupon = this.couponSelected
      ? this.couponSelected.applied_discount?.toFixed(2)
      : 0.0;
    this.Cart.amount = (
      parseFloat(this.Cart.subTotal) +
      parseFloat(this.Cart.tax) +
      parseFloat(this.Cart.otherCharge) -
      parseFloat(this.Cart.discount)
    ).toFixed(2);
    if (this.advancePaid) {
      this.Cart.amount = (
        parseFloat(this.Cart.subTotal) +
        parseFloat(this.Cart.tax) +
        parseFloat(this.Cart.otherCharge) -
        parseFloat(this.Cart.discount) -
        parseFloat(this.advancePaid)
      ).toFixed(2);
    }
    if (this.couponSelected?.applied_discount) {
      this.Cart.amount = (
        parseFloat(this.Cart.amount) - parseFloat(this.Cart.loyaltyCoupon)
      ).toFixed(2);
    }
    // }, 950);
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

  async calculateTax() {
    let tax = 0.0;
    this.effectedTax = [];
    let subtotal: any = parseFloat(this.Cart.subTotal);
    if (this.taxarray.length > 0) {
      this.taxarray.forEach((obj: any) => {
        if (obj.is_default == 1) {
          if (obj.type == 1) {
            let calculatedTax = (
              subtotal *
              (parseFloat(obj.rate) / 100)
            ).toFixed(2);
            this.Cart.subTotal = (
              parseFloat(this.Cart.subTotal) - parseFloat(calculatedTax)
            ).toFixed(2);
            subtotal = parseFloat(this.Cart.subTotal).toFixed(2);
          }
          tax += subtotal * (parseFloat(obj.rate) / 100);
          let tempArray: any = {
            name: obj.tax_name,
            id: obj.id,
            effected_price: (subtotal * (parseFloat(obj.rate) / 100)).toFixed(
              2
            ),
            tax_split: [],
          };
          obj.tax_split.forEach((element: any) => {
            let split: any = {
              name: element.name,
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

  // splitTaxShowen(tax: any) {
  //   let splitRate: any;
  //   splitRate = (parseFloat(this.Cart.subTotal) * (parseFloat(tax.rate) / 100)).toFixed(2);
  //   return splitRate
  // }

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

  quantityPlus(index: any) {
    if (this.SelectedItems[index].modifiers) {
      if (
        !this.newOrderFlag &&
        (this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated')
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
        !this.newOrderFlag &&
        (this.SelectedItems[index].order_status == 'old' ||
          this.SelectedItems[index].order_status == 'updated')
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

  // getInventoryStatus(item_id: any) {
  //   this.httpService.get('inventory-status/' + item_id)
  //     .subscribe(result => {
  //       if (result.status == 200) {
  //         this.inventory_status = result.data.inventory_status;
  //         console.log(this.inventory_status);
  //       }
  //     });
  // }

  qtyInputChange(quantity: any, index: any) {
    this.invalidQuantityPrize = false;
    if (
      quantity > 0 &&
      quantity.match('^[+]?[0-9]\\d*(\\.\\d{1,2})?$') &&
      this.SelectedItems[index].price > 0
    ) {
      if (this.SelectedItems[index].modifiers) {
        if (
          !this.newOrderFlag &&
          (this.SelectedItems[index].order_status == 'old' ||
            this.SelectedItems[index].order_status == 'updated')
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
          !this.newOrderFlag &&
          (this.SelectedItems[index].order_status == 'old' ||
            this.SelectedItems[index].order_status == 'updated')
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
          !this.newOrderFlag &&
          (this.SelectedItems[index].order_status == 'old' ||
            this.SelectedItems[index].order_status == 'updated')
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
          !this.newOrderFlag &&
          (this.SelectedItems[index].order_status == 'old' ||
            this.SelectedItems[index].order_status == 'updated')
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

  deleteCartItem(index: any) {
    if (!this.newOrderFlag && this.SelectedItems[index].order_status == 'old') {
      if (this.SelectedItems.length > 1) {
        this.httpService
          .get('inventory-status/' + this.SelectedItems[index].id)
          .subscribe((result) => {
            if (result.status == 200) {
              if (
                result.data.inventory_status ||
                this.branch_settings?.order_modify_popup == 1
              ) {
                const dialogRef = this.dialog.open(VoidOrderComponent, {
                  width: '600px',
                  data: {
                    orderid: this.orderID,
                    item: this.SelectedItems[index],
                    action: 'removeitem',
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.SelectedItems.splice(index, 1);
                    this.updateSubTotal();
                  }
                });
              } else {
                this.SelectedItems.splice(index, 1);
                this.checkForItemDiscountApply();
                this.updateSubTotal();
                if (this.SelectedItems.length <= 0) {
                  this.flagCartItem = false;
                  this.surchargearray = [];
                }
              }
            }
          });
      } else {
        this.voidOrder();
      }
    } else {
      this.SelectedItems.splice(index, 1);
      this.checkForItemDiscountApply();
      this.updateSubTotal();
      if (this.SelectedItems.length <= 0) {
        this.flagCartItem = false;
        this.surchargearray = [];
      }
    }
  }

  addDiscount() {
    const dialogRef = this.dialog.open(AddDiscountComponent, {
      width: '500px',
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

  editItem(selecteditem: any, index: any) {
    this.dataservice.setData('selectedMenuItem', selecteditem);
    this.dataservice.setData('selectedMenuItemIndex', index);
    this.dataservice.setData('orderdiscountflag', this.orderDiscountFlag);
    if (selecteditem.modifiers) {
      this.setEditModifierData(selecteditem);
    }
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
    // dialogRef.backdropClick().subscribe(result => {
    //   this.setDiscount();
    //   this.setUpdatedModifier();
    //   this.checkForItemDiscountApply();
    // }); //old

    dialogRef.afterClosed().subscribe((result) => {
      this.setDiscount();
      // this.setUpdatedModifier();
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

  setEditModifierData(selecteditem: any) {
    let selectedmodifier = {
      item_name: selecteditem.name,
      modifier_group: [] as any,
    };
    selecteditem.modifiers.forEach((obj: any) => {
      let items = {
        modifier_group_name: obj.name,
        can_add_multiple: obj.can_add_multiple,
        max_qty: obj.max_qty,
        min_qty: obj.min_qty,
        modifier_group_id: obj.id,
        modifier_list: [] as any,
      };
      obj.list.forEach((list: any) => {
        let list_data = {
          item_id: list.id,
          item_name: list.modifier_list,
          item_price: list.rate,
          status: list.status,
          list_qty: list.list_qty,
        };
        items.modifier_list.push(list_data);
      });
      selectedmodifier.modifier_group.push(items);
    });
    this.editModifierData = selectedmodifier;
  }

  setDiscount() {
    let updatedMenuItem = this.dataservice.getData('updatedMenuItem');
    console.log(updatedMenuItem);

    let selectedMenuItemIndex = this.dataservice.getData(
      'selectedMenuItemIndex'
    );
    if (updatedMenuItem != null || updatedMenuItem != undefined) {
      this.SelectedItems[selectedMenuItemIndex] = updatedMenuItem;
      this.dataservice.setData('updatedMenuItem', null);
      this.updateSubTotal();
    } else {
      if (this.SelectedItems[selectedMenuItemIndex].modifiers) {
        this.updateTotalWithModifiers(selectedMenuItemIndex);
      } else {
        this.updatePrice(selectedMenuItemIndex);
      }
    }
  }

  // setUpdatedModifier() {
  //   let updatedModifierData = this.dataservice.getData('updatedModifierData');
  //   let updatedModifierIndex = this.dataservice.getData('updatedModifierIndex');

  //   if (updatedModifierData != null || updatedModifierData != undefined) {
  //     this.SelectedItems[updatedModifierIndex].modifiers = updatedModifierData;
  //     this.updateTotalWithModifiers(updatedModifierIndex);
  //   }
  // }

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

  refreshMenu() {
    let entityKey = 'menuItem' + this.entity_Id;
    this.httpService
      .get('menu-items/' + this.branch_id + '/' + this.entity_Id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.CategoryRecords = result.data;
          this.localservice.store(entityKey, this.CategoryRecords);
          this.CategoryRecords.unshift({
            category_id: -1,
            category_name: 'ALL',
            colour: '#0778',
          });
          this.OnCategoryChange(this.CategoryRecords[0]);
        } else {
          this.localservice.remove(entityKey);
          this.snackBService.openSnackBar(result.message, 'close');
        }
      });
  }
}
