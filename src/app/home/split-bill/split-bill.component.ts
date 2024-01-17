import { indexOf } from 'lodash';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { SplitBillPaymentComponent } from '../split-bill-payment/split-bill-payment.component';

@Component({
  selector: 'app-split-bill',
  templateUrl: './split-bill.component.html',
  styleUrls: ['./split-bill.component.scss'],
})
export class SplitBillComponent implements OnInit {
  orderRecords: any = [];
  items: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  effectedTax: any = [];
  taxArray: any = [];
  targetArrays: any = [];
  editFlag: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SplitBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { editData: any },
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.httpService
      .get('orderByNumber/1/' + this.data.editData.order.order_number, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.orderRecords = result.data[0];
          this.items = this.orderRecords.order.items;
          this.taxArray = this.orderRecords.order.applied_tax[0];
          this.getSplitItems();
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  getSplitItems() {
    this.httpService
      .get('split-bill/' + this.data.editData.order_id, false)
      .subscribe((result) => {
        if (result.status == 200) {
          this.targetArrays = result.data.map(
            (item: { bill: any }) => item.bill
          );
          if (this.targetArrays.length > 0) {
            this.editFlag = true;
            this.items = [];
          }
        } else {
          this.snackBService.openSnackBar(result.message, 'Close');
        }
      });
  }

  modifiercheck(modifierList: any) {
    let flag = false;
    for (let list of modifierList) {
      if (list.status) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Handles the drop event for drag-and-drop functionality.
   *
   * @param event - The drag-and-drop event containing information about the drop operation.
   * @param item - The item being dragged. This is used to prevent drag-and-drop if the item is already paid.
   *               If the item is null or does not contain payments, it is eligible for transfer.
   */
  drop(event: CdkDragDrop<string[]>, item: any): void {
    // Check if the drop is within the same container
    if (event.previousContainer === event.container) {
      // Reorder items within the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Check if the item is eligible for transfer based on payment status
      if (item == null || !item?.payments) {
        // Transfer item from the source container to the destination container
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        // Display a notification if attempting to transfer an already paid item
        this.snackBService.openSnackBar(
          'Cannot transfer an item that is already paid',
          'Close'
        );
      }
    }

    // Manually detect changes to ensure view is updated after the drop operation
    this.cdr.detectChanges();
  }

  /**
   * Deletes a bill from the targetArrays based on the specified index, but only if the bill is empty.
   *
   * @param index - The index of the bill to be deleted from the targetArrays array.
   */
  deleteBill(index: any): void {
    // Check if the bill at the specified index is empty
    if (this.targetArrays[index].items.length <= 0) {
      // Remove the bill from the targetArrays array
      this.targetArrays.splice(index, 1);
    } else {
      // Display a notification if the bill is not empty and cannot be deleted
      this.snackBService.openSnackBar(
        'Unable to delete, please move items from the bill',
        'Close'
      );
    }
  }

  /**
   * Adds a new bill to the targetArrays array based on the orderRecords data.
   * Initializes the bill with an empty items array and sets the cart details such as discount, surcharge, applied tax, subTotal, and Total.
   * Detects changes in the component's view after adding a new bill.
   * Logs the orderRecords for debugging purposes.
   */
  addBill(): void {
    // Create a new bill and push it to the targetArrays array
    this.targetArrays.push({
      items: [],
      cart: {
        discount: this.orderRecords.order.discount,
        surcharge:
          this.orderRecords.order.surcharge.length > 0
            ? {
                name: this.orderRecords.order.surcharge[0].name,
                rate: this.orderRecords.order.surcharge[0].rate,
                type: this.orderRecords.order.surcharge[0].type,
                value: 0.0,
              }
            : [],
        applied_tax: this.orderRecords.order.applied_tax[0],
        subTotal: 0.0,
        Total: 0.0,
      },
    });

    // Manually detect changes to ensure view is updated after adding a new bill
    this.cdr.detectChanges();
  }

  /**
   * Calculates the subTotal and updates cart details for a given set of items.
   *
   * @param items - The set of items for which the subTotal and cart details need to be calculated.
   * @returns - The calculated subTotal value.
   */
  subTotal(items: any): string {
    // Find the index of the items within the targetArrays
    let index = this.targetArrays.indexOf(items);

    // Initialize a temporary variable to accumulate the total value of items
    let temp: any = 0.0;

    // Iterate through each item and accumulate the total value
    for (let i = 0; i < items?.items?.length; i++) {
      temp += parseFloat(items?.items[i]?.total);
    }

    // Retrieve the cart details for the corresponding items
    let cart: any = this.targetArrays[index].cart;

    // Check if there are items in the set
    if (items?.items?.length > 0) {
      // Update subTotal value
      cart.subTotal = temp.toFixed(2);

      // Update applied_tax details
      cart.applied_tax.effected_price = (
        parseFloat(temp) *
        (parseFloat(cart.applied_tax.rate) / 100)
      ).toFixed(2);
      cart.applied_tax.tax_split?.forEach((obj: any) => {
        obj.effected_price = (
          parseFloat(temp) *
          (parseFloat(obj.rate) / 100)
        ).toFixed(2);
      });

      // Update surcharge value based on type (percentage or value)
      if (cart.surcharge?.type == 'percentage') {
        cart.surcharge.value = (
          parseFloat(temp) *
          (parseFloat(cart.surcharge.rate) / 100)
        ).toFixed(2);
      } else if (cart.surcharge?.type == 'value') {
        cart.surcharge.value =
          this.targetArrays[index].items.length > 0
            ? (
                parseFloat(cart.surcharge.rate) / this.targetArrays.length
              ).toFixed(2)
            : 0.0;
      }

      // Update discount value based on type (percentage or value)
      if (cart.discount?.discount_type == 'percentage') {
        cart.discount.effected_value = (
          parseFloat(temp) *
          (parseFloat(cart.discount.rate) / 100)
        ).toFixed(2);
      } else if (cart.discount?.discount_type == 'value') {
        cart.discount.effected_value =
          this.targetArrays[index].items.length > 0
            ? (
                parseFloat(cart.discount.rate) / this.targetArrays.length
              ).toFixed(2)
            : 0.0;
      }

      // Calculate the Total value by considering applied_tax, surcharge, and discount
      cart.Total = (
        parseFloat(temp) +
        parseFloat(
          cart.applied_tax?.effected_price && cart.applied_tax.type == 0
            ? cart.applied_tax?.effected_price
            : 0
        ) +
        parseFloat(cart.surcharge?.value ? cart.surcharge?.value : 0) -
        parseFloat(
          cart.discount?.effected_value ? cart.discount?.effected_value : 0
        )
      ).toFixed(2);
    } else {
      // If there are no items, set Total to 0.0
      cart.Total = 0.0;
    }

    // Return the calculated subTotal value
    return temp.toFixed(2);
  }

  /**
   * Updates the order by splitting bills and making a server request to 'split-bill' endpoint.
   * Validates conditions to ensure there is more than one bill and all bills have items before initiating the update.
   * If successful, displays a success message, otherwise displays an error message.
   */
  updateOrder(): void {
    // Check if there is more than one bill and all bills have items
    const allItemsExist = this.targetArrays.every(
      (target: { items: string | any[] }) => target.items.length > 0
    );

    if (this.targetArrays.length > 1 && allItemsExist) {
      // Check if there are no items in the main bill
      if (this.items.length <= 0) {
        // Check if all bills have payments
        let flag: any = this.targetArrays.every(
          (item: { payments: any }) => item.payments !== undefined
        );

        // Prepare the request body
        let body = {
          bills: this.targetArrays,
          order_id: this.orderRecords.order_id,
          payment_status: flag == true ? 1 : 0,
        };

        // Make a POST request to the 'split-bill' endpoint
        this.httpService.post('split-bill', body).subscribe((result) => {
          if (result.status == 200) {
            // Display a success message and close the operation
            this.snackBService.openSnackBar(result.message, 'Close');
            this.close();
          } else {
            // Display an error message
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
      } else {
        // Display a message if there are remaining items in the main bill
        this.snackBService.openSnackBar(
          'Please split all items from the main bill',
          'Close'
        );
      }
    } else {
      // Display a message if there is not more than one bill
      this.snackBService.openSnackBar('Please add more than one bill', 'Close');
    }
  }

  /**
   * Initiates the payment process for a specific bill by opening the SplitBillPaymentComponent dialog.
   * Validates that there are no remaining items in the main bill before allowing payment.
   *
   * @param amount - The total amount to be paid for the selected bill.
   * @param index - The index of the targetArrays array corresponding to the bill for which payment is being made.
   */
  makePayment(amount: any, index: any): void {
    // Check if there are no remaining items in the main bill
    if (this.items.length <= 0) {
      // Open the SplitBillPaymentComponent dialog to facilitate the payment process
      const dialogRef = this.dialog.open(SplitBillPaymentComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Total: amount,
        },
      });

      // Subscribe to the dialog's result after it is closed
      dialogRef.afterClosed().subscribe((result) => {
        // Update the payments property of the selected bill with the payment result
        if (result) {
          this.targetArrays[index].payments = result;
        }
      });
    } else {
      // Display a message if there are remaining items in the main bill
      this.snackBService.openSnackBar(
        'Please split all items from the main bill to proceed with payment',
        'Close'
      );
    }
  }
}
