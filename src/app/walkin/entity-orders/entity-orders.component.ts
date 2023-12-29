import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { DetailComponent } from '../detail/detail.component';
import { LocalStorage } from '../../_services/localstore.service';
import { PaymentDialogComponent } from 'src/app/home/payment-dialog/payment-dialog.component';
import { DataService } from 'src/app/_services/data.service';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import _ from 'lodash';
import { ShowDetailsComponent } from 'src/app/dinein/show-details/show-details.component';
import { ShowCrmDetailsComponent } from 'src/app/crm/show-crm-details/show-crm-details.component';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SelectDriverComponent } from 'src/app/setup/select-driver/select-driver.component';
import { EntityOrdersCancellationComponent } from 'src/app/entity-orders-cancellation/entity-orders-cancellation.component';
import { LabelPrintComponent } from 'src/app/home/label-print/label-print.component';
import { InvoiceKotPrintComponent } from 'src/app/home/invoice-kot-print/invoice-kot-print.component';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { Subscription } from 'rxjs';
import { IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-entity-orders',
  templateUrl: './entity-orders.component.html',
  styleUrls: ['./entity-orders.component.scss'],
})
export class EntityOrdersComponent implements OnInit {
  @ViewChild('Searchitem') searchItemInput!: ElementRef;
  orderRecords: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  order_cancel_permission = this.localservice.get('order_cancel_permission');
  today = new Date().toDateString();
  totalOrdersAmount: any = 0.0;
  totalUnpaid: any = 0.0;
  staff = this.localservice.get('user1');
  public url: string = this.router.url;
  orderNumber: any;
  branch_id = this.localservice.get('branch_id');
  sum = 0;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  currentPage: number = 1;
  date_current_page: any = 1;
  last_page: number = 1;
  totalCount: any;
  customPreLoader: boolean = false;
  branch_settings: any = this.localservice.get('branch_settings');
  printOffline: any = this.localservice.get('printOffline');
  accept_payment: any = this.localservice.get('accept_payment');
  tabActive: any;
  entityRecords: any;
  entitySelected: any;
  entityName: any;
  dineInMessage: string = 'DineInListener';
  orderListMessage: string = 'OrderListListener';
  orderType: any;
  subscription!: Subscription;
  constructor(
    private printMqtt: PrintMqttService,
    private snackBService: SnackBarService,
    private dataservice: DataService,
    public localservice: LocalStorage,
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private readonly newOrderMqtt: NewOrderService
  ) {}

  ngOnInit(): void {
    this.getEntity();
    this.getOrderdetails(this.currentPage);
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * Unsubscribes from any active subscriptions to prevent memory leaks.
   *
   * @returns void
   */
  ngOnDestroy(): void {
    // Unsubscribe from any active subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
  }

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * Subscribes to a topic or performs any necessary actions related to the view initialization.
   *
   * @returns void
   */
  ngAfterViewInit(): void {
    // Perform actions related to the view initialization, such as subscribing to a topic
    this.subscribeToTopic();
  }

  /**
   * Subscribes to a specific topic using the newOrderMqtt service.
   * Listens for incoming MQTT messages on the specified topic and triggers the getOrderdetails function upon message reception.
   *
   * @returns void
   */
  subscribeToTopic(): void {
    // Subscribe to the specified topic using the newOrderMqtt service
    this.subscription = this.newOrderMqtt
      .topic(this.orderListMessage)
      .subscribe((data: IMqttMessage) => {
        // Trigger the getOrderdetails function upon receiving an MQTT message
        this.getOrderdetails(1);
      });
  }

  /**
   * Publishes a message to the specified MQTT topic for Dine-In display.
   * Sends the 'dinein' data to the topic using the newOrderMqtt service.
   *
   * @returns void
   */
  publishOrderDineIn(): void {
    // Prepare the data for the MQTT message
    let data = 'dinein';

    // Publish the message to the specified topic using the newOrderMqtt service
    this.newOrderMqtt
      .publish(this.dineInMessage, data)
      .subscribe((data: any) => {});
  }

  /**
   * Opens a dialog to display details of the given order and performs actions based on the user's interactions.
   *
   * @param order - The order for which details are to be displayed.
   * @returns void
   */
  details(order: any): void {
    if (order.entity_id == 1) {
      // Open the DetailComponent dialog for entity_id 1
      const dialogRef = this.dialog.open(DetailComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil') {
          // Perform actions for 'utensil' operation, updating order records
          this.updateOrderRecords(
            result.data.id ? result.data.id : result.data.order_id,
            result.data
          );
        } else if (result?.operation == 'void') {
          // Perform actions for 'void' operation, removing order from order records
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    } else if (order.entity_id == 2) {
      // Open the ShowDetailsComponent dialog for entity_id 2
      const dialogRef = this.dialog.open(ShowDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil') {
          // Perform actions for 'utensil' operation, updating order records
          this.updateOrderRecords(result.data.order_id, result.data);
        } else if (result?.operation == 'void') {
          // Perform actions for 'void' operation, removing order from order records
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    } else {
      // Prepare data for ShowCrmDetailsComponent dialog
      let Data = {
        locationDetails: order.order.address,
        customer_id: order.order.customer_id,
        customer_contact_no: order.order.crm_contact_no,
        customer_name: order.order.customer_name,
      };

      // Open the ShowCrmDetailsComponent dialog for other entity_id values
      const dialogRef = this.dialog.open(ShowCrmDetailsComponent, {
        width: '75%',
        maxHeight: '100%',
        data: {
          Orders: order,
          customerData: Data,
          pickup: order.order.store_pickup,
          utensilCrmflag: false,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.operation == 'utensil' || result?.operation == 'ready') {
          // Perform actions for 'utensil' or 'ready' operation, updating order records
          this.updateOrderRecords(result.data.order_id, result.data);
        } else if (result?.operation == 'void') {
          // Perform actions for 'void' operation, removing order from order records
          var index = _.findIndex(this.orderRecords, { order_id: result.data });
          this.orderRecords.splice(index, 1);
        }
      });
    }
  }

  /**
   * Handles the scroll-down event by incrementing the current page number and fetching more orders based on the active tab.
   *
   * @param ev - The scroll event object.
   * @returns void
   */
  onScrollDown(ev: any): void {
    // Increment the current page number
    this.currentPage = this.currentPage + 1;

    // Check if there are more pages to fetch
    if (this.currentPage <= this.last_page) {
      // Fetch more orders based on the active tab
      if (this.tabActive == 'Running') {
        this.runningOrders(this.currentPage);
      } else if (this.tabActive == 'All') {
        this.getOrderdetails(this.currentPage);
      } else if (this.tabActive == 'Completed') {
        this.completedOrders(this.currentPage);
      } else if (this.tabActive == 'Void') {
        this.voidOrders(this.currentPage);
      } else if (this.tabActive == 'Refund') {
        this.refundOrders(this.currentPage);
      } else if (this.tabActive == 'Entity') {
        this.entityOrders(
          this.entitySelected,
          this.entityName,
          this.orderType,
          this.currentPage
        );
      }

      // Set the scroll direction to 'down'
      this.direction = 'down';
    }
  }

  /**
   * Updates the order records by replacing the order with the specified order_id with new data.
   *
   * @param order_id - The unique identifier of the order to be updated.
   * @param data - The new data to replace the existing order data.
   * @returns void
   */
  updateOrderRecords(order_id: any, data: any): void {
    // Find the index of the order in the orderRecords array using _.findIndex
    var index = _.findIndex(this.orderRecords, { order_id: order_id });

    // Replace the order at the found index with the new data using native splice
    this.orderRecords.splice(index, 1, data);
  }

  /**
   * Opens a dialog to select a driver for the given order, triggering actions based on the user's interactions.
   *
   * @param orders - The order for which a driver needs to be selected.
   * @returns void
   */
  orderReady(orders: any): void {
    // Open the SelectDriverComponent dialog to select a driver for the order
    const dialogRef = this.dialog.open(SelectDriverComponent, {
      width: '100%',
      data: {
        driverRecords: [],
        order_id: orders.order_id,
        driver_id: orders.driver_order.driver_order_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Perform actions if a result is returned from the dialog
      if (result) {
        // Update order records with the selected driver result
        this.updateOrderRecords(result.order_id, result);
      }
    });
  }

  dayCheck(day: any) {
    let newDate = moment(day).format('DD-MM-YYYY');
    return newDate;
  }

  getTotal(orders: any) {
    let total: any = '-';
    if (orders.order.Total) {
      total = orders.order.Total;
    }
    return orders.amount != 'Not Paid' ? orders.amount.toFixed(2) : total;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  getEntity() {
    this.httpService.get('entities').subscribe((result) => {
      if (result.status == 200) {
        this.entityRecords = result.data;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  /**
   * Fetches order details for all entities, updating the orderRecords array and related properties.
   *
   * @param page_number - The page number of the orders to fetch.
   * @returns void
   */
  getOrderdetails(page_number: number): void {
    // Set the active tab to 'All'
    this.tabActive = 'All';

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Make a request to the server to get order details for all entities
    this.httpService
      .get('all-entities-order-list?page=' + page_number)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Log an error message if the request is not successful
          console.log('Error');
        }
      });
  }

  /**
   * Fetches order details for a specific entity, updating the orderRecords array and related properties.
   *
   * @param id - The unique identifier of the entity.
   * @param name - The name of the entity.
   * @param type - The type of order (applicable for specific entities).
   * @param page_number - The page number of the orders to fetch.
   * @returns void
   */
  entityOrders(id: any, name: any, type: any, page_number: number): void {
    // Set the active tab to 'Entity'
    this.tabActive = 'Entity';

    // Update entity-related properties
    this.entitySelected = id;
    this.entityName = name;
    this.orderType = type;

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Create the request body based on the entity and order type
    let body: any = {
      entity_id: this.entitySelected,
    };
    if (parseInt(this.entitySelected) == 3) {
      body = {
        order_type: type,
      };
    }

    // Make a POST request to the server to get filtered order details for the entity
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Log an error message if the request is not successful
          console.log('Error');
        }
      });
  }

  /**
   * Fetches running order details, updating the orderRecords array and related properties.
   *
   * @param page_number - The page number of the running orders to fetch.
   * @returns void
   */
  runningOrders(page_number: number): void {
    // Clear the search item input value
    this.searchItemInput.nativeElement.value = '';

    // Set the active tab to 'Running'
    this.tabActive = 'Running';

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Create the request body for running orders
    let body = {
      status: 1,
    };

    // Make a POST request to the server to get filtered running order details
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Display a snack bar with the server response message if the request fails
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  /**
   * Fetches completed order details, updating the orderRecords array and related properties.
   *
   * @param page_number - The page number of the completed orders to fetch.
   * @returns void
   */
  completedOrders(page_number: number): void {
    // Set the active tab to 'Completed'
    this.tabActive = 'Completed';

    // Clear the search item input value
    this.searchItemInput.nativeElement.value = '';

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Create the request body for completed orders
    let body = {
      status: 2,
    };

    // Make a POST request to the server to get filtered completed order details
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Display a snack bar with the server response message if the request fails
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  /**
   * Fetches voided order details, updating the orderRecords array and related properties.
   *
   * @param page_number - The page number of the voided orders to fetch.
   * @returns void
   */
  voidOrders(page_number: number): void {
    // Set the active tab to 'Void'
    this.tabActive = 'Void';

    // Clear the search item input value
    this.searchItemInput.nativeElement.value = '';

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Create the request body for voided orders
    let body = {
      status: 4,
    };

    // Make a POST request to the server to get filtered voided order details
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Display a snack bar with the server response message if the request fails
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  /**
   * Fetches refunded order details, updating the orderRecords array and related properties.
   *
   * @param page_number - The page number of the refunded orders to fetch.
   * @returns void
   */
  refundOrders(page_number: number): void {
    // Set the active tab to 'Refund'
    this.tabActive = 'Refund';

    // Clear the search item input value
    this.searchItemInput.nativeElement.value = '';

    // Initialize variables for amount and unpaid
    let amount = 0.0;
    let unpaid = 0.0;

    // Display the custom pre-loader
    this.customPreLoader = true;

    // Create the request body for refunded orders
    let body = {
      status: 6,
    };

    // Make a POST request to the server to get filtered refunded order details
    this.httpService
      .post('filtered-order-list?page=' + page_number, body)
      .subscribe((result) => {
        // Check if the request is successful (status code 200)
        if (result.status == 200) {
          // Hide the custom pre-loader
          this.customPreLoader = false;

          // Update pagination-related properties
          this.sum = result.data.per_page;
          this.currentPage = result.data.current_page;
          this.last_page = result.data.last_page;
          this.totalCount = result.data.total;

          // Update the orderRecords array based on the page number
          if (page_number == 1) {
            this.orderRecords = result.data.data;
          } else {
            result.data.data.forEach((obj: any) => {
              this.orderRecords.push(obj);
            });
          }

          // Calculate total orders amount and total unpaid amount
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status != 0) {
              amount += parseFloat(obj.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              unpaid += parseFloat(obj.order.Total);
              this.totalUnpaid = unpaid.toFixed(2);
            }
          });
          // Reverse the orderRecords array if needed
          // this.orderRecords.reverse();
        } else {
          // Display a snack bar with the server response message if the request fails
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  /**
   * Initiates the payment process for the given order, displaying a payment dialog.
   * Updates the order records and publishes a Dine-In order if applicable.
   *
   * @param order - The order object to process payment for.
   * @returns void
   */
  payOrder(order: any): void {
    // Check if the order has a Cart property
    if (order.order.Cart) {
      // Open a payment dialog for processing payment
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Cart: order.order.Cart,
          orderId: order.order_id,
          invoiceId: order.invoice_id,
          customerid: order.order.customer_id,
          entityid: order.entity_id,
          url: this.url,
          customer_details: order.invoice?.customer_details?.phone_number
            ? order.invoice?.customer_details
            : order.order.customer_details,
        },
      });

      // Subscribe to the dialog's closed event
      dialogRef.afterClosed().subscribe((result) => {
        // Check if a result is returned
        if (result) {
          // Update the order records with the payment result
          this.updateOrderRecords(result[0].order_id, result[0]);

          // Publish a Dine-In order if the entity is '2' (adjust as needed)
          if (order.entity_id == '2') {
            this.publishOrderDineIn();
          }
        }
      });
    } else {
      // If the order does not have a Cart property, navigate to the walk-in page
      this.dataservice.setData('editData', order);
      this.router.navigate(['home/walkin/' + order.order.order_number]);
    }
  }

  /**
   * Searches for orders based on the provided key (order number).
   * Updates the displayed order records based on the search results.
   * Calculates and updates total order amounts and unpaid amounts.
   *
   * @param key - The order number or search key.
   * @returns void
   */
  searchOrder(key: any): void {
    // Check if the key length is greater than 2
    if (key.length > 2) {
      // Set the orderNumber property to the provided key
      this.orderNumber = key;

      // Reset the orderRecords array
      this.orderRecords = [];

      // Initialize variables for amount calculations
      let amount = 0.0;
      let unpaid = 0.0;
      let notinvoiced = 0.0;

      // Reset total amounts
      this.totalOrdersAmount = null;
      this.totalUnpaid = null;

      // Make a request to retrieve orders by order number
      this.httpService.get('orderByNumber/1/' + key).subscribe((result) => {
        if (result.status == 200) {
          // Update the orderRecords with the search results
          this.orderRecords = result.data;

          // Iterate through the orderRecords to calculate amounts
          this.orderRecords.forEach((obj: any) => {
            if (obj.payment_status == 1) {
              // Calculate total orders amount for paid orders
              amount += parseFloat(obj.invoice_json?.amount);
              this.totalOrdersAmount = amount.toFixed(2);
            } else {
              if (obj.invoice_json != 'Not Paid') {
                // Calculate unpaid amount for partially paid orders
                unpaid +=
                  unpaid +
                  (parseFloat(obj.invoice_json?.amount) -
                    parseFloat(obj.invoice_json?.amount_received));
              } else {
                // Calculate not invoiced amount for unpaid orders
                notinvoiced += parseFloat(obj.order_json.Total);
              }
              // Calculate total unpaid amount
              this.totalUnpaid = (unpaid + notinvoiced).toFixed(2);
            }
          });
        } else {
          // Display a snack bar with the server response message
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
    } else if (key.length == '') {
      // Reset orderNumber property if the key length is empty
      this.orderNumber = null;

      // Retrieve and display all orders if the key is empty
      this.getOrderdetails(1);
    }
  }

  /**
   * Initiates the reprinting process for the specified order.
   * Generates and prints an invoice receipt for the order.
   * Utilizes MQTT for printer communication and handles offline printing if enabled.
   *
   * @param Orders - The order details for which the reprint is requested.
   * @returns void
   */
  reprint(Orders: any): void {
    // Retrieve the offline printing configuration from local storage
    this.printOffline = this.localservice.get('printOffline');

    // Check if offline printing is disabled or not configured
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      // Make a request to generate and retrieve the invoice receipt
      this.httpService
        .get('receipt/' + Orders.order_id + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            // Display a success snack bar message for invoice receipt generation
            this.snackBService.openSnackBar(
              'Invoice Receipt Generated Successfully!',
              'Close'
            );

            // Iterate through the generated receipt data
            result.data.forEach((obj: any) => {
              // Check printer availability using MQTT
              let print = this.printMqtt.checkPrinterAvailablity(obj);

              // If the printer is available
              if (print.status) {
                // Publish the print data to the printer using MQTT
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});

                // Check if the entity is for dine-in and publish the order for dine-in display
                if (Orders.entity_id == '2') {
                  this.publishOrderDineIn();
                }
              } else {
                // Display a snack bar with the printer availability message
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            // Display an error snack bar message if the request fails
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      // If offline printing is enabled, make a request for offline printing
      this.httpService
        .get('offline-print/' + Orders.order_id + '/0')
        .subscribe((result) => {
          if (result.status == 200) {
            // Open a dialog to display the offline printed invoice
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            // Subscribe to the dialog's afterClosed event
            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  /**
   * Initiates the reprinting process for the Kitchen Order Ticket (KOT) of the specified order.
   * Generates and prints a KOT receipt for the order.
   * Utilizes MQTT for printer communication and handles offline printing if enabled.
   *
   * @param Orders - The order details for which the KOT reprint is requested.
   * @returns void
   */
  KOTreprint(Orders: any): void {
    // Retrieve the offline printing configuration from local storage
    this.printOffline = this.localservice.get('printOffline');

    // Check if offline printing is disabled or not configured
    if (
      this.printOffline == null ||
      this.printOffline == undefined ||
      this.printOffline == false
    ) {
      // Make a request to generate and retrieve the KOT receipt
      this.httpService
        .get('receipt/' + Orders.order_id + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            // Display a success snack bar message for KOT receipt generation
            this.snackBService.openSnackBar(
              'KOT Receipt Generated Successfully!',
              'Close'
            );

            // Iterate through the generated receipt data
            result.data.forEach((obj: any) => {
              // Check printer availability using MQTT
              let print = this.printMqtt.checkPrinterAvailablity(obj);

              // If the printer is available
              if (print.status) {
                // Publish the print data to the printer using MQTT
                this.printMqtt
                  .publish('print', print.printObj)
                  .subscribe((data: any) => {});
              } else {
                // Display a snack bar with the printer availability message
                this.snackBService.openSnackBar(print.message, 'Close');
              }
            });
          } else {
            // Display an error snack bar message if the request fails
            this.snackBService.openSnackBar('Error!', 'Close');
          }
        });
    } else {
      // If offline printing is enabled, make a request for offline printing
      this.httpService
        .get('offline-print/' + Orders.order_id + '/1')
        .subscribe((result) => {
          if (result.status == 200) {
            // Open a dialog to display the offline printed KOT
            const dialogRef = this.dialog.open(InvoiceKotPrintComponent, {
              width: '9cm',
              data: { printData: result.data },
            });

            // Subscribe to the dialog's afterClosed event
            dialogRef.afterClosed().subscribe((result) => {});
          }
        });
    }
  }

  /**
   * Initiates the label printing process for the specified order.
   * Retrieves label print data from the server and displays it in a dialog.
   *
   * @param Orders - The order details for which label printing is requested.
   * @returns void
   */
  labelPrint(Orders: any): void {
    // Make a request to retrieve label print data for the specified order
    this.httpService
      .get('label-print/' + Orders.order_id)
      .subscribe((result) => {
        if (result.status == 200) {
          // Check if label specifications are available
          if (result.data.length > 0) {
            // Open a dialog to display the label print data
            const dialogRef = this.dialog.open(LabelPrintComponent, {
              width: '350px',
              data: { printData: result.data },
            });

            // Subscribe to the dialog's afterClosed event
            dialogRef.afterClosed().subscribe((result) => {});
          } else {
            // Display a snack bar message if no label specifications are available
            this.snackBService.openSnackBar('No specifications added', 'Close');
          }
        } else {
          // Display a snack bar with the server response message if the request fails
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  /**
   * Opens a dialog for handling order rejection. If the order is rejected, the corresponding record is removed from the order records.
   *
   * @param Orders - The order details for which rejection is requested.
   * @returns void
   */
  rejectOrder(Orders: any): void {
    // Open a dialog for handling order rejection
    const dialogRef = this.dialog.open(EntityOrdersCancellationComponent, {
      width: '500px',
      data: {
        order_id: Orders.order_id,
        payment_status: Orders.payment_status,
      },
    });

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Find the index of the rejected order in the order records
        var index = _.findIndex(this.orderRecords, { order_id: result });

        // Remove the rejected order from the order records
        this.orderRecords.splice(index, 1);
      }
    });
  }

  /**
   * Reloads the order records by resetting the current page to 1 and calling the ngOnInit method.
   *
   * @returns void
   */
  reload(): void {
    // Clear the existing order records
    this.orderRecords = [];

    // Reset the current page to 1
    this.currentPage = 1;

    // Call the ngOnInit method to reload the order records
    this.ngOnInit();
  }
}
