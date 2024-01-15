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

  drop(event: CdkDragDrop<string[]>, item: any) {
    // here 2nd argument item is used to prevent drag and grop if already paid. value will be null from main aray and if payments done it will contain payments object
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (item == null || !item?.payments) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
      else{
        this.snackBService.openSnackBar("Cannot transfer an item that is already paid","Close")
      }
    }
    this.cdr.detectChanges();
    console.log(this.taxArray);
    
  }

  deleteBill(index: any) {
    if (this.targetArrays[index].items.length <= 0) {
      this.targetArrays.splice(index, 1);
    } else {
      this.snackBService.openSnackBar(
        'Unable to delete,Please move items from bill',
        'Close'
      );
    }
  }

  addBill() {
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
    this.cdr.detectChanges();
    console.log(this.orderRecords);
  }

  subTotal(items: any) {
    // These fn is used for calculating child tables calculation(ie,subtotal,tax etc)
    let index = this.targetArrays.indexOf(items);
    let temp: any = 0.0;
    for (let i = 0; i < items?.items?.length; i++) {
      temp += parseFloat(items?.items[i]?.total);
    }
    let cart: any = this.targetArrays[index].cart;
    if (items?.items?.length > 0) {
      cart.subTotal = temp.toFixed(2);
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
      cart.Total = 0.0;
    }
    return temp.toFixed(2);
  }

  // calculateTax(tax: any, items: any) {
  //   let taxValue = 0.0;
  //   let subtotal: any = this.subTotal(items);
  //   taxValue = parseFloat(subtotal) * (parseFloat(tax.rate) / 100);
  //   return taxValue.toFixed(2);
  // }

  // claculateTotal(items: any) {
  //   let total: any = 0.0;
  //   if (items.length > 0) {
  //     let taxValue: any = 0.0;
  //     let subtotal: any = this.subTotal(items);
  //     taxValue = parseFloat(subtotal) * (parseFloat(this.taxArray.rate) / 100);
  //     if (this.taxArray.type == 1) {
  //       total = subtotal;
  //     } else {
  //       total = (parseFloat(taxValue) + parseFloat(subtotal)).toFixed(2);
  //     }
  //   }
  //   return total;
  // }

  updateOrder() {
    const allItemsExist = this.targetArrays.every(
      (target: { items: string | any[] }) => target.items.length > 0
    );
    if (this.targetArrays.length > 1 && allItemsExist) {
      if (this.items.length <= 0) {
        let flag: any = this.targetArrays.every(
          (item: { payments: any }) => item.payments !== undefined
        );
        let body = {
          bills: this.targetArrays,
          order_id: this.orderRecords.order_id,
          payment_status: flag == true ? 1 : 0,
        };
        this.httpService.post('split-bill', body).subscribe((result) => {
          if (result.status == 200) {
            this.snackBService.openSnackBar(result.message, 'Close');
            this.close();
          } else {
            this.snackBService.openSnackBar(result.message, 'Close');
          }
        });
      } else {
        this.snackBService.openSnackBar(
          'Please split all items from main bill',
          'Close'
        );
      }
    } else {
      this.snackBService.openSnackBar('Please Add more than one bill', 'Close');
    }
  }

  makePayment(amount: any, index: any) {
    if (this.items.length <= 0) {
      const dialogRef = this.dialog.open(SplitBillPaymentComponent, {
        disableClose: true,
        width: '500px',
        data: {
          Total: amount,
          // orderId: this.orderID,
          // invoiceId: this.walkinEditRecords.invoice_id,
          // customerid: this.customer_id,
          // entityid: this.entity_Id,
          // customer_details: this.customerRecords,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.targetArrays[index].payments = result;
        }
      });
    } else {
      this.snackBService.openSnackBar(
        'Please split all items from main bill to proceed with payment',
        'Close'
      );
    }
  }
}
