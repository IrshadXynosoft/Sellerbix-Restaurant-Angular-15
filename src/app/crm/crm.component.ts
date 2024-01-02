import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from '../_services/confirmation-dialog.service';
import { DataService } from '../_services/data.service';
import { HttpServiceService } from '../_services/http-service.service';
import { SnackBarService } from '../_services/snack-bar.service';
import { AddAddressComponent } from './add-address/add-address.component';
import { AddNotesCrmComponent } from './add-notes-crm/add-notes-crm.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ShowCrmDetailsComponent } from './show-crm-details/show-crm-details.component';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { MatPaginator } from '@angular/material/paginator';
import { NotesListComponent } from './notes-list/notes-list.component';
import { TableReservationComponent } from './table-reservation/table-reservation.component';
import { PartyOrdersComponent } from './party-orders/party-orders.component';
import { LocalStorage } from '../_services/localstore.service';
import { Constants } from 'src/constants';
import { EditCustomerSetupComponent } from '../setup/edit-customer-setup/edit-customer-setup.component';
import { take } from 'lodash';
import { CustomEntityDialogComponent } from './custom-entity-dialog/custom-entity-dialog.component';
import { PaymentDialogComponent } from '../home/payment-dialog/payment-dialog.component';
import { CommercialInvoiceDetailComponent } from '../setup/commercial-invoice-detail/commercial-invoice-detail.component';
import { CommercialInvoicePaymentDialogComponent } from '../setup/commercial-invoice-payment-dialog/commercial-invoice-payment-dialog.component';
import { PrintMqttService } from '../_services/mqtt/print-mqtt.service';
import { DetailComponent } from '../walkin/detail/detail.component';
import { ShowDetailsComponent } from '../dinein/show-details/show-details.component';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
})
export class CrmComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @ViewChild('contactNumber', { static: false }) contactNumber!: ElementRef;

  customerArray: any = [];
  customerData = new UntypedFormControl();
  customer_filteredOptions: Observable<any[]> | undefined;
  list_options: any = [];
  customerDataList: any = [];
  isCustomerSelected: boolean;
  customerDetails: any = [];
  showNotexistDialog: boolean;
  isShowCustomerData: boolean;
  addressList: any = [];
  notesList: any = [];
  customerId: any;
  runningOrders: any = [];
  pastOrders: any = [];
  reservations: any = [];
  bulkOrders: any = [];
  customerInsights: any = [];
  locationIdforPlaceOreder: any;
  locationdetails: any = {};
  isLocationSelected: boolean = false;
  flag: boolean = true;
  searchedContactNumber: any;
  contactNumberErrorMessage: any;
  tenant_logo: any;
  isLogoImage: any;
  logoBasePath: boolean = false;
  currency_symbol = localStorage.getItem('currency_symbol');
  partyOrderDeliveryFlag: boolean = false;
  deliveryCount: any = null;
  takeAwayCount: any = null;
  bulkOrderCount: any = null;
  reservationCount: any = null;
  branch_id: any;
  warningMessage: boolean = false;
  customEntities: any = [];
  unpaidOrders: any = [];
  commercialInvoices: any = [];
  amount_received: any = 0.0;
  paymentArray: any = [];
  viewOrdersFlag: boolean = false;
  public url: string = this.router.url;
  constructor(
    private printMqtt: PrintMqttService,
    private constant: Constants,
    private dataservice: DataService,
    private localservice: LocalStorage,
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute
  ) {
    this.isCustomerSelected = false;
    this.showNotexistDialog = false;
    this.isShowCustomerData = false;
    this.tenant_logo =
      this.constant.imageBasePath + this.localservice.get('tenant_logo');
    this.isLogoImage = this.localservice.get('tenant_logo') ? true : false;
    this.branch_id = this.localservice.get('branch_id');
    // this.logoBasePath=this.constant.imageBasePath;
  }

  ngOnInit(): void {
    this.getOrderCount();
    this.checkStatus();
    this.getCustomEntities();
    this.customer_filteredOptions = this.customerData.valueChanges.pipe(
      startWith(''),
      map((value) => this._filtercustomerlist(value))
    );
    if (this.route.snapshot.params.customer_id) {
      this.isCustomerSelected = true;
      this.isShowCustomerData = true;
      this.customerSelected(this.route.snapshot.params.customer_id);
      this.viewCusomerDetails(this.route.snapshot.params.customer_id);
    }
  }

  ngAfterViewInit(): void {
    this.contactNumber.nativeElement.focus();
  }
  getOrderCount() {
    this.httpService
      .get('customer-home-data/' + this.branch_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.deliveryCount = result.data.delivery;
          this.takeAwayCount = result.data.pickup;
          this.bulkOrderCount = result.data.bulk_order;
          this.reservationCount = result.data.reservation;
        } else {
          console.log('Error while fetching customer details');
        }
      });
  }

  getCustomEntities() {
    this.httpService.get('tenant-entities', false).subscribe((result) => {
      if (result.status == 200) {
        this.customEntities = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  viewOrders() {
    this.viewOrdersFlag = true;
    this.getCustomerPastOrders(this.customerId);
    this.getCommercialInvoices();
  }
  private _filtercustomerlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    const results = this.list_options.filter(
      (option: any) =>
        option.contact_no.toString().toLowerCase().includes(filterValue) ||
        option.name.toString().toLowerCase().includes(filterValue)
    );
    return results.length
      ? results
      : [{ id: 0, contact_no: 'Not found, add as a new customer' }];
  }

  checkStatus() {
    this.httpService
      .get('check-businessday-status', false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.warningMessage =
            result.data.message_status == 'false' ? false : true;
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  createNew() {
    if (parseInt(this.searchedContactNumber)) {
      this.router.navigate([
        'callcenter/CreateNewCustomer/' + this.searchedContactNumber,
      ]);
    } else {
      this.router.navigate(['callcenter/CreateNewCustomer']);
    }
  }

  addAddress(id: any): void {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: '700px',
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.customerId) {
        this.viewCusomerDetails(this.customerId);
      }
    });
  }

  addNote(): void {
    const dialogRef = this.dialog.open(AddNotesCrmComponent, {
      width: '500px',
      data: { id: this.customerDetails[0].id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.customerId) {
        this.viewCusomerDetails(this.customerId);
      }
    });
  }
  viewNotes(): void {
    const dialogRef = this.dialog.open(NotesListComponent, {
      width: '500px',
      data: { notes: this.notesList },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.customerId) {
        this.viewCusomerDetails(this.customerId);
      }
    });
  }

  backspaceEvent() {
    this.customerData.setValue('');
    this.isCustomerSelected = false;
    this.isShowCustomerData = false;
  }

  showDetails(orderData: any): void {
    if (orderData.entity_id == 1) {
      const dialogRef = this.dialog.open(DetailComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: orderData,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.viewCusomerDetails(this.customerId);
      });
    } else if (orderData.entity_id == 2) {
      const dialogRef = this.dialog.open(ShowDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: orderData,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.viewCusomerDetails(this.customerId);
      });
    } else {
      let Data = {
        locationDetails: orderData.order.address,
        customer_id: orderData.order.customer_id,
        customer_contact_no: this.customerDetails.contact_no,
        customer_name: this.customerDetails.name,
      };
      const dialogRef = this.dialog.open(ShowCrmDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: orderData,
          customerData: Data,
          pickup: orderData.order.store_pickup,
          utensilCrmflag: true,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.viewCusomerDetails(this.customerId);
      });
    }
  }

  showcommercialDetails(orderDetails: any, amount_received: any) {
    const dialogRef = this.dialog.open(CommercialInvoiceDetailComponent, {
      width: '70%',
      maxHeight: '100%',
      data: {
        Orders: orderDetails,
        flag: 'view',
        amount_received: amount_received,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  payInvoice(element: any) {
    let amount =
      parseFloat(element.amount) - parseFloat(element.amount_received);
    const dialogRef = this.dialog.open(
      CommercialInvoicePaymentDialogComponent,
      {
        disableClose: true,
        width: '500px',
        data: {
          Cart: {
            amount: amount.toFixed(2),
          },
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result[0]?.amount) {
        this.amount_received = 0.0;
        this.paymentArray = result;
        this.paymentArray.forEach((obj: any) => {
          this.amount_received += parseFloat(obj.amount);
        });
        this.generateInvoice(element);
      } else if (result != 'close') {
        this.payLater(element);
      }
    });
  }

  generateInvoice(element: any) {
    let amount =
      parseFloat(element.amount) - parseFloat(element.amount_received);
    let postData = {
      customer_id: element.customer_id,
      amount: amount,
      payment_types: this.paymentArray,
      amount_received: this.amount_received,
      commercial_invoice_id: element.id,
    };
    this.httpService
      .post('pay-commercial-invoice', postData)
      .subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Commercial Invoice Generated Successfully',
            'Close'
          );
          this.viewCusomerDetails(this.customerId);
          this.getCommercialInvoices();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  payLater(element: any) {
    let amount =
      parseFloat(element.amount) - parseFloat(element.amount_received);
    let postData = {
      customer_id: element.customer_id,
      amount: amount,
      payment_types: [],
      amount_received: 0.0,
      commercial_invoice_id: element.id,
    };
    this.httpService
      .post('pay-commercial-invoice', postData)
      .subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar('Invoice added as paylater', 'Close');
          // this.router.navigate(['callcenter'])
          this.viewCusomerDetails(this.customerId);
          this.getCommercialInvoices();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  editInvoice(
    orderDetails: any,
    id: any,
    customer_id: any,
    amount_received: any
  ): void {
    const dialogRef = this.dialog.open(CommercialInvoiceDetailComponent, {
      width: '70%',
      data: {
        Orders: orderDetails,
        flag: 'edit',
        commercial_invoice_id: id,
        customer_id: customer_id,
        amount_received: amount_received,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'updated') {
        this.viewCusomerDetails(this.customerId);
        this.getCommercialInvoices();
      }
    });
  }

  printInvoice(id: any) {
    this.httpService
      .get('print-commercial-invoice/' + id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(
            'Invoice printed successfully',
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
  }

  dueAmountCheck(item: any) {
    let amount = 0.0;
    if (item.payment_status == 1) {
      amount =
        parseFloat(item.order.Total) - parseFloat(item.invoice.amount_received);
      return amount.toFixed(2);
    } else {
      return item.order.Total;
    }
  }

  noDetailsFound() {
    this.router.navigate(['callcenter/notFound']);
  }

  searchContactNumber(contactNumber: any) {
    this.isCustomerSelected = false;
    this.isShowCustomerData = false;
    this.searchedContactNumber = contactNumber;

    if (contactNumber.length > 2) {
      this.httpService
        .get('getCustomerBysearch/' + contactNumber)
        .subscribe((result) => {
          if (result.status == 200) {
            this.customerArray = [];
            if (result.data.length > 0) {
              this.customerArray = result.data;
            } else {
              this.customerArray.push({
                id: 0,
                contact_no: 'Not found',
                name: 'Add as a new customer',
              });
            }
          } else {
            console.log('Error while fetching customer details');
          }
        });
    } else {
      this.customerArray = [];
    }
  }

  customerSelected(id: any) {
    this.isShowCustomerData = false;
    if (id == 0) {
      this.showNotexistDialog = true;
    } else if (id > 0) {
      this.customerId = id;
      this.showNotexistDialog = false;
      this.isCustomerSelected = true;
      this.customerDataList = [];
      this.customerArray.forEach((obj: any) => {
        if (obj.id == id) {
          if (obj.customer_delivery_location) {
            let objData = {
              id: obj.id,
              name: obj.name,
              building_or_villa:
                obj.customer_delivery_location[0].building_or_villa,
              contact_no: obj.contact_no,
              nearest_landmark:
                obj.customer_delivery_location[0]?.nearest_landmark,
              delivery_area:
                obj.customer_delivery_location[0]?.delivery_area_name,
              street: obj.customer_delivery_location[0]?.street,
              branch_name: obj.customer_delivery_location[0]?.branch_name,
              country_name: obj.customer_delivery_location[0]?.country_name,
            };
            this.customerDataList.push(objData);
          } else {
            let objData = {
              id: obj.id,
              name: obj.name,
              contact_no: obj.contact_no,
            };
            this.customerDataList.push(objData);
          }
        }
      });
      this.viewCusomerDetails(id);
    }
  }

  getCommercialInvoices() {
    this.httpService
      .get('customer-commercial-invoice/' + this.customerId)
      .subscribe((result) => {
        if (result.status == 200) {
          this.commercialInvoices = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  editCustomer(id: any): void {
    const dialogRef = this.dialog.open(EditCustomerSetupComponent, {
      width: '500px',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.customerId) {
        this.viewCusomerDetails(this.customerId);
      }
    });
  }

  commercialInvoice() {
    this.router.navigate(['setup/CommercialInvoice/' + this.customerId]);
  }

  makePayment(orderData: any) {
    console.log(orderData);
    if (orderData.order.Cart) {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: orderData.order.Cart,
          orderId: orderData.order_id,
          invoiceId: orderData.invoice_id,
          customerid: orderData.order.customer_id,
          entityid: orderData.order.entity_id,
          url: this.url,
          customer_details: orderData.order.customer_details,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.viewCusomerDetails(this.customerId);
        }
      });
    } else {
      let Data = {
        locationDetails: orderData.order.address
          ? orderData.order.address
          : {
              id: orderData.order.address_id,
              branch_id: orderData.order.branch_id,
              branch_name: orderData.branch_name,
            },
        customer_id: orderData.order.customer_id,
        customer_contact_no: orderData.order.crm_contact_no
          ? orderData.order.crm_contact_no
          : orderData.order.customer_details.phone_number,
        customer_name: orderData.order.customer_name,
      };
      this.dataservice.setData('Crmdetails', Data);
      this.dataservice.setData('editData', orderData);
      if (orderData.order.store_pickup) {
        this.router.navigate([
          'home/crm/pickup/edit_order/' + orderData.order_number,
        ]);
      } else {
        this.router.navigate(['home/crm/edit_order/' + orderData.order_number]);
      }
    }
  }

  viewCusomerDetails(id: any) {
    this.isCustomerSelected = true;
    this.customerDetails = [];
    this.httpService.get('customer/' + id, false).subscribe((result) => {
      this.list_options = [];
      if (result.status == 200) {
        this.isShowCustomerData = true;
        this.customerDetails.push(result.data[0]);
        this.addressList = result.data[0].customer_delivery_location;
        this.notesList = result.data[0].customer_note;
        this.getCustomerInsights(id);
      } else {
        console.log('Error in id customer');
      }
    });
  }

  getCustomerPastOrders(id: any) {
    this.httpService
      .get('orders-by-customer/' + id)
      .subscribe((result) => {
        if (result.status == 200) {
          let customerOrders = result.data;
          this.pastOrders = [];
          this.runningOrders = [];
          this.reservations = [];
          this.bulkOrders = [];
          this.unpaidOrders = [];
          customerOrders.orders.forEach((element: any) => {
            if (element.status == 1) {
              this.runningOrders.push(element);
            }
            if (element.payment_status == 0) {
              this.unpaidOrders.push(element);
            }
            if (element.status == 2) {
              this.pastOrders.push(element);
            }
          });
          this.reservations = customerOrders.reservations;
          this.bulkOrders = customerOrders.bulk_orders;
        } else {
          console.log('Error in orders-by-customer');
        }
      });
  }

  getCustomerInsights(id: any) {
    this.httpService
      .get('customer-insight/' + id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.customerInsights = result.data;
          this.customerInsights.unpaid_amount = result.data.unpaid_amount;
        } else {
          console.log('Error in customer-insight');
        }
      });
  }
  editAddress(address_id: any): void {
    const dialogRef = this.dialog.open(EditCustomerComponent, {
      width: '1200px',
      data: { addres_id: address_id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.customerId) {
        this.viewCusomerDetails(this.customerId);
      }
    });
    // let customer_id=this.customerDetails[0].id;
    // this.router.navigate(['callcenter/EditCustomer/'+address_id+'/'+customer_id])
  }
  storePickup() {
    // const dialogRef = this.dialog.open(StorePickupComponent, {
    //   width: '700px',
    //   data: { 'contact_no': this.customerDetails[0].contact_no }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // if (result) {
    let locationdetails = {
      branch_id: this.localservice.get('branch_id'),
      branch_name: this.localservice.get('branchname'),
    };
    let Data = {
      locationDetails: locationdetails,
      customer_id: this.customerDetails[0].id,
      customer_contact_no: this.customerDetails[0].contact_no,
      customer_name: this.customerDetails[0].name,
    };
    this.dataservice.setData('Crmdetails', Data);
    this.router.navigate(['home/crm/pickup/new_order']);
    // }
    // else if (this.customerId) {
    //   this.viewCusomerDetails(this.customerId)
    // }
    // });
  }

  b2bCustomer() {
    const dialogRef = this.dialog.open(CustomEntityDialogComponent, {
      width: '450px',
      data: {
        entity: 'B2B',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataservice.setData('CustomEntityOrderNO', result);
        let obj: any = {
          id: this.customerDetails[0].price_plan_id,
          name: this.customerDetails[0].price_plan,
        };
        this.storePickup();
        this.dataservice.setData('pricePlan', obj);
        this.router.navigate(['home/b-b/newOrder']);
      }
    });
  }

  deleteAddress(id: any, name: any) {
    const options = {
      title: 'Delete Customer Group',
      message: 'Delete ' + name + '?',
      cancelText: 'NO',
      confirmText: 'YES',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.httpService
          .delete('customer-delivery-location' + '/' + id)
          .subscribe((result) => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(
                'Deleted Successfully!!',
                'Close'
              );
              this.viewCusomerDetails(this.customerId);
            } else {
              this.snackBService.openSnackBar(result.message, 'Close');
              console.log('Error in delete customer-delivery-location');
            }
          });
      }
    });
  }
  locationSelected(event: any, address: any) {
    if (event.checked) {
      this.isLocationSelected = true;
      this.flag = true;
      this.locationIdforPlaceOreder = address.id;
      this.locationdetails = {
        id: address.id,
        country_id: address.country_id,
        building_or_villa: address.building_or_villa,
        country_name: address.country_name,
        street: address.street,
        delivery_area: address.delivery_area,
        branch_name: address.branch_name,
        branch_id: address.branch_id,
      };
      if (this.partyOrderDeliveryFlag) {
        let customerDataForPlaceOrder = {
          locationDetails: this.locationdetails,
        };
        this.dataservice.setData('Address', customerDataForPlaceOrder);
        this.router.navigate(['party_orders/new_order']);
      }
    } else {
      this.isLocationSelected = false;
    }
  }
  placeNewOrder() {
    if (this.isLocationSelected) {
      this.isLocationSelected = false;
      let customerDataForPlaceOrder = {
        locationDetails: this.locationdetails,
        customer_id: this.customerDetails[0].id,
        customer_contact_no: this.customerDetails[0].contact_no,
        customer_name: this.customerDetails[0].name,
      };
      this.dataservice.setData('Crmdetails', customerDataForPlaceOrder);
      this.router.navigate(['home/crm/new_order']);
    } else {
      this.flag = false;
    }
  }

  entityPlaceNewOrder(entity: any) {
    const dialogRef = this.dialog.open(CustomEntityDialogComponent, {
      width: '450px',
      data: {
        entity: entity.name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let locationdetails = {
          branch_id: this.localservice.get('branch_id'),
          branch_name: this.localservice.get('branchname'),
        };
        let Data = {
          locationDetails: locationdetails,
          customer_id: this.customerDetails[0].id,
          customer_contact_no: this.customerDetails[0].contact_no,
          customer_name: this.customerDetails[0].name
            ? this.customerDetails[0].name
            : null,
        };
        this.dataservice.setData('CustomEntityOrderNO', result);
        this.dataservice.setData('Crmdetails', Data);
        this.router.navigate(['home/crm/entity/' + entity.id]);
      }
    });
  }

  tableReservation() {
    const dialogRef = this.dialog.open(TableReservationComponent, {
      width: '500px',
      data: {
        customer_id: this.customerDetails[0].id,
        customer_contact_no: this.customerDetails[0].contact_no,
        customer_name: this.customerDetails[0].name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.viewCusomerDetails(this.customerId);
    });
  }
  partyOrders() {
    let Data = {
      customer_id: this.customerDetails[0].id,
      customer_contact_no: this.customerDetails[0].contact_no,
      customer_name: this.customerDetails[0].name,
      party_details: [],
    };
    const dialogRef = this.dialog.open(PartyOrdersComponent, {
      width: '800px',
      data: {
        arrayData: Data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.partyOrderDeliveryFlag = true;
        if (this.isLocationSelected) {
          this.flag = false;
          this.router.navigate(['party_orders/new_order']);
        }
      }
    });
  }
}
