import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { GroupedItemComponent } from '../home/add-groupeditem/grouped-item/grouped-item.component';
import { ComboItemComponent } from '../home/combo-item/combo-item.component';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  UntypedFormControl,
} from '@angular/forms';
import { AddDiscountComponent } from '../home/add-discount/add-discount.component';
import { AddNotesComponent } from '../home/add-notes/add-notes.component';
import { EditItemComponent } from '../home/edit-item/edit-item.component';
import { DataService } from '../_services/data.service';
import { PaymentDialogComponent } from '../home/payment-dialog/payment-dialog.component';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '../_services/localstore.service';
import { VoidOrderComponent } from '../home/void-order/void-order.component';
import { ModifyReasonComponent } from '../home/modify-reason/modify-reason.component';
import { Observable } from 'rxjs';
import { CrmOrderConfirmationComponent } from '../home/crm-order-confirmation/crm-order-confirmation.component';
import { Constants } from 'src/constants';
import * as moment from 'moment';
import { PrintMqttService } from '../_services/mqtt/print-mqtt.service';
import { ConfirmationDialogService } from '../_services/confirmation-dialog.service';
import packageversion from '../../../package.json';
import { AddSurchargeComponent } from '../home/add-surcharge/add-surcharge.component';
import { AddItemComponent } from '../home/add-item/add-item.component';
import { DateService } from '../home/date.service';
import { AdvancePaymentComponent } from './advance-payment/advance-payment.component';
import { OpenSaleNotificationComponent } from '../home/open-sale-notification/open-sale-notification.component';
@Component({
  selector: 'app-party-orders',
  templateUrl: './party-orders.component.html',
  styleUrls: ['./party-orders.component.scss'],
})
export class PartyOrdersComponent implements OnInit {
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
  public url: string = this.router.url;
  public id: string = this.route.snapshot.params.id;
  // public order_no: string = this.route.snapshot.params.id;
  newOrderFlag: boolean = false; // for creating new order
  editOrderFlag: boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  branchName = this.localservice.get('branchname');
  branch_id = this.localservice.get('branch_id');
  staff = this.localservice.get('user1');
  entity_Id: any;
  imageBasePath = this.constant.imageBasePath;
  branchrecords: any = [];
  crmRecords: any = []; // for getting CRM in records(using getdata)
  crm_branch_id: any;
  time$: Observable<any>;
  customer_id: any;
  invalidFlag: boolean = false;
  public appVersion: string = packageversion.version;
  crm_branchnameSelected: any;
  crm_customer_mob_no: any;
  party_date: any;
  table_id: any = null;
  confirmOrderFlag: boolean = false;
  advancePaid: any;
  deliveryAddress: any;
  invalidQuantityPrize: boolean = false;
  paxNo = new UntypedFormControl({ value: '', disabled: false });
  constructor(
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
  }

  ngOnInit(): void {
    this.url = this.router.url;
    this.onBuildPaymentForm();
    this.checkOpenSaleStatus();
    this.routerCheck();
    this.getMenuCategory();
    // this.taxGet();
    this.getBranch();
    this.refreshMenu();
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
  getBranch() {
    this.httpService.get('branch').subscribe((result) => {
      if (result.status == 200) {
        this.branchrecords = result.data.tenant_branches;
      } else {
        console.log('Error');
      }
    });
  }

  routerCheck() {
    if (this.url == '/party_orders/new_order') {
      this.newOrderFlag = true;
      this.SelectedItems = [];
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.deliveryAddress = this.dataservice.getData('Address')
        ? this.dataservice.getData('Address')
        : null;
      this.entity_Id =
        this.crmRecords.party_details.order_type == 4
          ? 3
          : this.crmRecords.party_details.order_type;
      this.party_date = this.crmRecords.party_details.date;
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.party_details.branch_id;
      this.table_id = this.dataservice.getData('tableid');
      this.crm_branchnameSelected = this.crmRecords.party_details.branch_name;
      this.paxNo.setValue(this.crmRecords.party_details.pax_no ? this.crmRecords.party_details.pax_no : null)
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      this.paymentForm.disable();
    } else if (this.url == '/party_orders/edit_order') {
      this.editOrderFlag = true;
      this.SelectedItems = [];
      this.flagCartItem = true;
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.SelectedItems = this.dataservice.getData('editData');
      this.deliveryAddress = this.dataservice.getData('Address')
        ? this.dataservice.getData('Address')
        : null;
      this.entity_Id =
        this.crmRecords.party_details.order_type == 4
          ? 3
          : this.crmRecords.party_details.order_type;
      this.advancePaid = this.dataservice.getData('advancepayment')
        ? this.dataservice.getData('advancepayment')
        : null;
      this.updateSubTotal();
      this.paxNo.setValue(this.crmRecords.party_details.pax_no ? this.crmRecords.party_details.pax_no : null)
      this.party_date = this.crmRecords.party_details.date;
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.party_details.branch_id;
      this.crm_branchnameSelected = this.crmRecords.party_details.branch_name;
      this.table_id = this.dataservice.getData('tableid');
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      this.paymentForm.disable();
    } else if (this.url == '/party_orders/confirm_order') {
      this.editOrderFlag = true;
      this.confirmOrderFlag = true;
      this.SelectedItems = [];
      this.flagCartItem = true;
      this.crmRecords = this.dataservice.getData('Crmdetails');
      this.SelectedItems = this.dataservice.getData('editData');
      this.deliveryAddress = this.dataservice.getData('Address')
        ? this.dataservice.getData('Address')
        : null;
      this.entity_Id =
        this.crmRecords.party_details.order_type == 4
          ? 3
          : this.crmRecords.party_details.order_type;
      this.advancePaid = this.dataservice.getData('advancepayment')
        ? this.dataservice.getData('advancepayment')
        : null;
      this.updateSubTotal();
      this.party_date = this.crmRecords.party_details.date;
      this.crm_customer_mob_no = this.crmRecords.customer_contact_no;
      this.crm_branch_id = this.crmRecords.party_details.branch_id;
      this.crm_branchnameSelected = this.crmRecords.party_details.branch_name;
      this.table_id = this.dataservice.getData('tableid');
      this.paymentForm.patchValue({
        name: this.crmRecords.customer_name,
        phone_number: this.crm_customer_mob_no,
      });
      this.paymentForm.disable();
    }
  }

  // getSurcharges() {
  //   const dialogRef = this.dialog.open(AddSurchargeComponent, {
  //     width: '600px',
  //     data: {
  //       entity_id: this.entity_Id
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.surchargearray = result;
  //       this.updateSubTotal()
  //     }
  //   });
  // }
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

  // taxGet() {
  //   this.httpService.get('tax')
  //     .subscribe(result => {
  //       if (result.status == 200) {
  //         this.taxarray = result.data;
  //       } else {
  //         console.log("Error");
  //       }
  //     });
  // }

  getMenuCategory() {
    this.httpService
      .get('menu-items/' + this.branch_id + '/' + this.entity_Id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.CategoryRecords = result.data;
          // this.CategoryRecords.unshift({ 'category_id': 0, 'category_name': 'Quick Items', 'colour': '#0777' })
          this.CategoryRecords.unshift({
            category_id: -1,
            category_name: 'ALL',
            colour: '#0778',
          });
          this.OnCategoryChange(this.CategoryRecords[0]);
        } else {
          console.log('Error');
        }
      });
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

  OnBranchChange(id: any, name: any) {
    this.crm_branch_id = id;
    this.crm_branchnameSelected = name;
  }

  cancelOrder() {
    this.flagCartItem = false;
    this.SelectedItems = [];
    this.selectedDiscount = {};
  }

  // confirmOrder() {
  //   this.flagCartItem = false;
  //   this.flagCartPayment = true;
  // }
  makePayment() {
    if (this.Cart.amount == 0) {
      this.snackBService.openSnackBar('Amount Already Paid', 'Close');
      this.router.navigate(['party_orders/new_order/list']);
    } else {
      if (
        this.url == '/party_orders/new_order' ||
        this.url == '/party_orders/edit_order'
      ) {
        const dialogRef = this.dialog.open(AdvancePaymentComponent, {
          disableClose: true,
          width: '500px',
          data: {
            Cart: this.Cart,
            orderId: this.orderID,
            invoiceId: this.walkinEditRecords.invoice_id,
            customerid: this.customer_id,
            entityid: this.entity_Id,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result == 'Payment Done') {
            this.SelectedItems = [];
            this.flagCartItem = false;
            this.flagCartPayment = false;
            // if (this.url== "/party_orders/confirm_order") {
            //   this.router.navigate(["party_orders/new_order/list"]);
            // }
          }
        });
      } else {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          disableClose: true,
          width: '500px',
          data: {
            Cart: this.Cart,
            orderId: this.orderID,
            invoiceId: this.walkinEditRecords.invoice_id,
            customerid: this.customer_id,
            entityid: this.entity_Id,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.SelectedItems = [];
            this.flagCartItem = false;
            this.flagCartPayment = false;
            // if (this.url== "/party_orders/confirm_order") {
            //   this.router.navigate(["party_orders/new_order/list"]);
            // }
          }
        });
      }
    }
  }

  confirmOrder() {
    if (
      this.crmRecords.party_details.order_type == 2 &&
      this.table_id == null
    ) {
      this.router.navigate(['callcenter/available-tables']);
    } else {
      this.placeOrder();
    }
  }

  placeOrder() {
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
        let currentTime = date.format('hh:mm:ss');
        let randomOrderNo =
          date.format('YYYY:DD:MM') + '_' + date.format('hh:mm:ss');
        this.flagCartItem = false;
        this.flagCartPayment = true;
        let user = this.dataservice.getData('user');
        let body = {
          notes: this.notes,
          order_number: !this.route.snapshot.params.id
            ? 'ORD_' + randomOrderNo
            : this.route.snapshot.params.id,
          items: this.SelectedItems,
          entity_id:
            this.crmRecords.party_details.order_type == 4 ? 3 : this.entity_Id,
          Total: this.Cart.amount,
          table_id: this.table_id ? this.table_id : null,
          customer_id: this.crmRecords.customer_id,
          bulk_order_id: this.crmRecords.id ? this.crmRecords.id : null,
          customer_name: this.crmRecords.customer_name,
          // address_id: this.crm_branch_id,
          // crm_contact_no: this.crm_customer_mob_no,
          branch_id: this.crm_branch_id,
          branch_name: this.crm_branchnameSelected,
          kitchen_status: 'new',
          ref_number: null,
          current_time: currentTime,
          current_date: todayDate,
          customer_details: {
            name: this.paymentForm.value['name'],
            phone_number: this.paymentForm.value['phone_number'],
          },
          reservation_id: null,
          date: this.party_date,
          event: this.crmRecords.party_details.event,
          order_type: this.crmRecords.party_details.order_type,
          order_mode: 'Party Order',
          store_pickup:
            this.crmRecords.party_details.order_type == 4 ? true : false,
          Cart: {
            Items: this.SelectedItems,
            amount: this.Cart.amount,
            discount: this.Cart.discount,
            otherCharge: this.Cart.otherCharge,
            subTotal: this.Cart.subTotal,
            tax: this.Cart.tax,
          },
          address: this.deliveryAddress
            ? {
                building_or_villa:
                  this.deliveryAddress.locationDetails.building_or_villa,
                country_id: this.deliveryAddress.locationDetails.country_id,
                country_name: this.deliveryAddress.locationDetails.country_name,
                id: this.deliveryAddress.locationDetails.id,
                street: this.deliveryAddress.locationDetails.street,
              }
            : null,
          advance_paid: this.advancePaid,
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
          pax_no: this.paxNo.value ? this.paxNo.value : null,
        };
        if (this.url == '/party_orders/new_order') {
          this.httpService.post('bulk-order', body).subscribe((result) => {
            if (result.status == 200) {
              this.customer_id = result.data.customer_id;
              this.snackBService.openSnackBar(
                'Order Placed Successfully',
                'Close'
              );
              this.orderID = result.data.id;
              // this.router.navigate(["party_orders/new_order/list"]);
            } else {
              this.snackBService.openSnackBar('Error', 'Close');
            }
          });
        } else if (this.url == '/party_orders/edit_order') {
          this.httpService
            .put('bulk-order/' + this.crmRecords.id, body)
            .subscribe((result) => {
              if (result.status == 200) {
                this.customer_id = result.data.customer_id;
                this.snackBService.openSnackBar(
                  'Order Updated Successfully',
                  'Close'
                );
                this.orderID = result.data.id;
                // this.router.navigate(["party_orders/new_order/list"]);
              } else {
                this.snackBService.openSnackBar('Error', 'Close');
              }
            });
        } else if (this.url == '/party_orders/confirm_order') {
          this.httpService.post('orders', body).subscribe((result) => {
            if (result.status == 200) {
              this.orderID = result.data.id;
              this.snackBService.openSnackBar(
                'Order Confirmed Successfully',
                'Close'
              );
              this.makePayment();
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

  dateChange(value: any) {
    this.party_date = value;
  }

  neworder() {
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
    this.paymentForm.reset();
    this.router.navigate(['callcenter']);
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
    if (type == 1) {
      let found = this.SelectedItems.find(function (obj: any) {
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
          };
          this.SelectedItems.push(itemSelected);
        }
      }
      this.Cart.Items = this.SelectedItems;
      this.flagCartItem = true;
      this.updateSubTotal();
    }
    if (type == 2) {
      var found = this.SelectedItems.find(function (obj: any) {
        return obj.id == items.id;
      });
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
      this.SelectedItems[index].total =
        this.SelectedItems[index].qty * this.SelectedItems[index].price;
    this.updateSubTotal();
  }

  updatePriceWithModifiers(locationprice: any, modifiers: any) {
    let total = 0.0;
    modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total += parseFloat(obj1.rate);
        }
      });
    });
    return (parseFloat(locationprice) + total).toFixed(2);
  }

  updateTotalWithModifiers(index: any) {
    let total = 0.0;
    this.SelectedItems[index].modifiers.forEach((obj: any) => {
      obj.list.forEach((obj1: any) => {
        if (obj1.status) {
          total += parseFloat(obj1.rate);
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

  updateSubTotal() {
    setTimeout(() => {
      let temp = 0.0;
      for (let i = 0; i < this.SelectedItems.length; i++) {
        temp += parseFloat(this.SelectedItems[i].total);
      }
      this.Cart.subTotal = temp.toFixed(2);
      this.Cart.tax = this.calculateTax().toFixed(2);
      this.Cart.otherCharge = this.calculateSurcharge().toFixed(2);
      this.Cart.discount = this.calculateDiscount().toFixed(2);
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
    }, 500);
  }

  calculateDiscount() {
    let discount = 0.0;
    let subtotal = parseFloat(this.Cart.subTotal);
    if (this.selectedDiscount.discount_type) {
      if (this.selectedDiscount.discount_type == 'value') {
        discount += parseFloat(this.selectedDiscount.rate);
      } else {
        if (this.selectedDiscount.is_discount_on_total_amount) {
          discount +=
            (subtotal + this.calculateTax() + this.calculateSurcharge()) *
            (parseFloat(this.selectedDiscount.rate) / 100);
        } else {
          discount += subtotal * (parseFloat(this.selectedDiscount.rate) / 100);
        }
      }
    }
    if (discount > subtotal) {
      this.snackBService.openSnackBar(
        'Invalid Discount,Please choose another one.',
        'Close'
      );
      this.deleteOrderdiscount();
    }
    return discount;
  }

  calculateTax() {
    let tax = 0.0;
    this.effectedTax = [];
    let subtotal = parseFloat(this.Cart.subTotal);
    if (this.taxarray.length > 0) {
      this.taxarray.forEach((obj: any) => {
        if (obj.is_default == 1) {
          tax += subtotal * (parseFloat(obj.rate) / 100);
          let tempArray = {
            name: obj.tax_name,
            id: obj.id,
            effected_price: (subtotal * (parseFloat(obj.rate) / 100)).toFixed(
              2
            ),
          };
          this.effectedTax.push(tempArray);
        }
      });
    }
    return tax;
  }

  calculateSurcharge() {
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
        this.SelectedItems[index].order_status == 'old'
      ) {
        const dialogRef = this.dialog.open(ModifyReasonComponent, {
          width: '500px',
          data: {
            item: this.SelectedItems[index],
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.SelectedItems[index].qty = result.data.quantity;
            this.updateTotalWithModifiers(index);
          }
        });
      } else {
        this.SelectedItems[index].qty++;
        this.updateTotalWithModifiers(index);
      }
    } else {
      if (
        !this.newOrderFlag &&
        this.SelectedItems[index].order_status == 'old'
      ) {
        const dialogRef = this.dialog.open(ModifyReasonComponent, {
          width: '500px',
          data: {
            item: this.SelectedItems[index],
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.SelectedItems[index].qty = result.data.quantity;
            this.updatePrice(index);
          }
        });
      } else {
        this.SelectedItems[index].qty++;
        this.updatePrice(index);
      }
    }
  }

  qtyInputChange(quantity: any, index: any) {
    if (quantity > 0) {
      if (this.SelectedItems[index].modifiers) {
        if (
          !this.newOrderFlag &&
          this.SelectedItems[index].order_status == 'old'
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
              this.SelectedItems[index].qty = result.data.quantity;
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updateTotalWithModifiers(index);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].qty = result.data.quantity;
              this.updateTotalWithModifiers(index);
            }
          });
        } else {
          this.updateTotalWithModifiers(index);
        }
      } else {
        if (
          !this.newOrderFlag &&
          this.SelectedItems[index].order_status == 'old'
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
              this.SelectedItems[index].qty = result.data.quantity;
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updatePrice(index);
              console.log(this.SelectedItems[index]);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].qty = result.data.quantity;
              this.updatePrice(index);
              console.log(this.SelectedItems[index]);
            }
          });
        } else {
          this.updatePrice(index);
        }
      }
    } else {
      this.snackBService.openSnackBar('Quantity cannot be Zero', 'Close');
    }
  }

  quantityMinus(quantity: any, index: any) {
    if (quantity > 1) {
      if (this.SelectedItems[index].modifiers) {
        if (
          !this.newOrderFlag &&
          this.SelectedItems[index].order_status == 'old'
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
              this.SelectedItems[index].qty = result.data.quantity;
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updateTotalWithModifiers(index);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].qty = result.data.quantity;
              this.updateTotalWithModifiers(index);
            }
          });
        } else {
          this.SelectedItems[index].qty--;
          this.updateTotalWithModifiers(index);
        }
      } else {
        if (
          !this.newOrderFlag &&
          this.SelectedItems[index].order_status == 'old'
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
              this.SelectedItems[index].qty = result.data.quantity;
              this.SelectedItems[index].modify_reason_id = result.data.reason;
              this.SelectedItems[index].inventory_status =
                result.data.inventory_status;
              this.updatePrice(index);
            } else if (result?.isModified == false) {
              this.SelectedItems[index].qty = result.data.quantity;
              this.updatePrice(index);
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
      width: '500px',
      data: {
        item: selecteditem,
        itemdiscountflag: this.itemDiscountFlag,
        editModifierData: this.editModifierData,
        editItemIndex: index,
        entity_id: this.entity_Id,
      },
    });

    dialogRef.backdropClick().subscribe((result) => {
      this.setDiscount();
      this.setUpdatedModifier();
      this.checkForItemDiscountApply();
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.setDiscount();
      this.setUpdatedModifier();
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
        };
        items.modifier_list.push(list_data);
      });
      selectedmodifier.modifier_group.push(items);
    });
    this.editModifierData = selectedmodifier;
  }

  setDiscount() {
    let updatedMenuItem = this.dataservice.getData('updatedMenuItem');
    let selectedMenuItemIndex = this.dataservice.getData(
      'selectedMenuItemIndex'
    );
    if (updatedMenuItem != null || updatedMenuItem != undefined) {
      this.SelectedItems[selectedMenuItemIndex] = updatedMenuItem;
      this.dataservice.getData('selectedMenuItemIndex');
      this.orderDiscountFlag = true;
      this.updateSubTotal();
    }
  }

  setUpdatedModifier() {
    let updatedModifierData = this.dataservice.getData('updatedModifierData');
    let updatedModifierIndex = this.dataservice.getData('updatedModifierIndex');
    if (updatedModifierData != null || updatedModifierData != undefined) {
      this.SelectedItems[updatedModifierIndex].modifiers = updatedModifierData;
      this.updateTotalWithModifiers(updatedModifierIndex);
    }
  }

  gotoPage(page: any) {
    if (page == 'delivery') {
      this.router.navigate([
        'setup/location/' + this.branch_id + '/delivery/deliveryManager',
      ]);
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
          console.log('Error');
        }
      });
  }
}
