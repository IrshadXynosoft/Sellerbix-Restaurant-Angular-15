import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-split-bill-payment',
  templateUrl: './split-bill-payment.component.html',
  styleUrls: ['./split-bill-payment.component.scss']
})
export class SplitBillPaymentComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  paymentMethods: any = [];
  public paymentForm!: UntypedFormGroup;
  balance: any;
  balanceFlag = false;   //to show balance
  paymentAddFlag = false;   // if true it will calls the payment api , after showing balance
  paymentArray: any = [];
  calculatedLoyaltyPrice: any = 0.00;
  multiPaymentFlag = false;  //for multiple payment methods for a single amount
  public numericExpression = "^[+]?[0-9]\\d*(\\.\\d{1,2})?$"
  loyalty_flag: boolean = false;
  public url: string = this.router.url;
  balanceReturnFlag: boolean = false;
  // credit_flag: boolean = false;
  tipPaymentType:any;
  tipInput = new UntypedFormControl(0,[Validators.required, Validators.pattern(this.numericExpression)]);
  constructor(private dialogService: ConfirmationDialogService, private printMqtt: PrintMqttService, private router: Router, private route: ActivatedRoute, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: { Total: any, orderId: any, invoiceId: any, customerid: any, entityid: any, customer_details: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<PaymentDialogComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getPaymentMethod();
    this.onBuildPaymentForm();
    this.paymentForm.patchValue({
      amount: this.data.Total
    })
    this.getOrderdetails();
    console.log(this.data);
  }

  onBuildPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      amount: [null, Validators.compose([Validators.required, Validators.pattern(this.numericExpression)])],
      payment_type: [{
        id: null,
        name: null
      }],
    })
  }

  close() {
    this.dialogRef.close();
  }

  paymentArraySum() {
    // let sum: any = _.sumBy(this.paymentArray, ('amount'));
    let sum = 0.00;
    this.paymentArray.forEach((obj: any) => {
      sum += parseFloat(obj.amount);
    });
    // console.log(sum);
    return sum;
  }

  checkForbalanceReturn(amount: any) {
    let sum = 0.00;
    if (amount > 0)
      sum = (this.paymentArraySum() + parseFloat(amount)) > parseFloat(this.data.Total) ? (this.paymentArraySum() + parseFloat(amount)) - this.data.Total : 0.00
    // console.log(sum);
    return sum.toFixed(2)
  }

  paymentButtonClick(payment: any) {
    this.paymentForm.value['payment_type'] = {
      id: payment.id,
      name: payment.name
    }
    if (payment.reference == 1) {
      if (this.data.customer_details.phone_number) {
        this.paymentArray = [];
        // this.credit_flag = true;
        this.multiPaymentFlag = true;
        this.paymentArray.push({
          'amount': this.data.Total,
          'payment_name': this.paymentForm.value['payment_type'].name,
          'payment_id': this.paymentForm.value['payment_type'].id
        });
        this.paymentForm.patchValue({
          amount: '0.00',
        })
        this.paymentForm.disable()
      }
      else {
        const dialogRef = this.dialog.open(CustomerDetailsComponent, {
          // disableClose: true,
          width: '40%',
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.data.customer_details = result;
            this.paymentArray = [];
            // this.credit_flag = true;
            this.multiPaymentFlag = true;
            this.paymentArray.push({
              'amount': this.data.Total,
              'payment_name': this.paymentForm.value['payment_type'].name,
              'payment_id': this.paymentForm.value['payment_type'].id
            });
            this.paymentForm.patchValue({
              amount: '0.00',
            })
            this.paymentForm.disable()
          }
        });
      }
    }
    else {
      // this.credit_flag = false;
      if (this.data.Total == 0 && payment.is_freeable == 1) {
        this.paymentArray = [];
        this.multiPaymentFlag = true;
        this.paymentArray.push({
          'amount': this.data.Total,
          'payment_name': this.paymentForm.value['payment_type'].name,
          'payment_id': this.paymentForm.value['payment_type'].id
        });
        this.paymentForm.patchValue({
          amount: '0.00',
        })
        this.paymentForm.disable()
      }
      else {
        this.addpayment()
      }
    }
  }

  getClass(payment: any) {
    if (payment.id == 3 && this.calculatedLoyaltyPrice == 0.00 || payment.is_freeable == 1 && this.data.Total != 0.00) {
      return "disabled"
    }
    else if (payment.reference == 1) {
      var found = this.paymentArray.find(function (obj: any) {
        return obj.payment_id == payment.id;
      });
      if (found) {
        return "credit-card my-checkfield-selected"
      }
      else {
        return "credit-card"
      }
    }
    else {
      var found = this.paymentArray.find(function (obj: any) {
        return obj.payment_id == payment.id;
      });
      if (found) {
        return "payment-card my-checkfield-selected"
      }
      else {
        return "payment-card"
      }
    }
  }

  addpayment() {
    let flag = false;
    // for Checking loyalty points
    if (this.paymentForm.value['payment_type'].id == 3) {
      if (this.calculatedLoyaltyPrice != 0.00) {
        if (this.paymentArray.length > 0) {
          flag = true;
          this.paymentArray.forEach((obj: any) => {
            if (obj.payment_id == 3) {
              this.snackBService.openSnackBar("Loyalty already Added", "Close")
              flag = false;
            }
          })
        }
        else {
          flag = true;
        }
        if (flag && (parseFloat(this.data.Total) > parseFloat(this.calculatedLoyaltyPrice))) {
          this.loyalty_flag = true;
          this.multiPaymentFlag = true;
          if (this.paymentForm.value['amount'] != 0 && this.paymentForm.valid) {
            this.paymentArray.push({
              'amount': this.calculatedLoyaltyPrice,
              'payment_name': this.paymentForm.value['payment_type'].name,
              'payment_id': this.paymentForm.value['payment_type'].id
            });
          }
          this.multiPaymentFlag = true;
          let amountTotal = 0.00;
          this.paymentArray.forEach((obj: any) => {
            amountTotal += parseFloat(obj.amount);
          });
          this.paymentForm.patchValue({
            amount: (parseFloat(this.data.Total) - amountTotal).toFixed(2),
          })
        }
        else {
          this.snackBService.openSnackBar("Sorry ,Cannot Add points", "Close")
        }
      }
      else {
        this.snackBService.openSnackBar("Sorry, There is no points now", "Close")
      }
    }
    else {
      if (this.paymentForm.value['amount']) {
        if (!this.paymentAddFlag) {
          if (this.paymentForm.value['payment_type'].id != 3) {
            if (this.paymentForm.value['amount'] != 0 && this.paymentForm.valid) {
              this.paymentForm.value['amount'] = parseFloat(this.paymentForm.value['amount']).toFixed(2)
              if (this.paymentArray.length > 0) {
                this.paymentArray.push({
                  'amount': this.paymentForm.value['amount'],
                  'payment_name': this.paymentForm.value['payment_type'].name,
                  'payment_id': this.paymentForm.value['payment_type'].id,
                  'balance_return_amount': this.checkForbalanceReturn(this.paymentForm.value['amount'])
                });
              }
              else {
                this.paymentArray.push({
                  'amount': this.paymentForm.value['amount'],
                  'payment_name': this.paymentForm.value['payment_type'].name,
                  'payment_id': this.paymentForm.value['payment_type'].id,
                  'balance_return_amount': parseFloat(this.paymentForm.value['amount']) > parseFloat(this.data.Total) ? parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Total) : 0.00
                });
              }
            }
          }
          this.multiPaymentFlag = true;
        }
        let tempFlag = false;
        let amountTotal = 0.00;
        let balancetopay = 0.00;
        this.paymentArray.forEach((obj: any) => {
          amountTotal += parseFloat(obj.amount);
          balancetopay = parseFloat(this.data.Total) - amountTotal
        });
        if (amountTotal > this.data.Total) {
          this.paymentForm.patchValue({
            amount: '0'
          })
        }
        else {
          this.paymentForm.patchValue({
            amount: (balancetopay).toFixed(2)
          })
        }
        if (this.paymentForm.value['amount'] == 0 && (amountTotal == this.data.Total || amountTotal > this.data.Total)) {
          this.paymentForm.disable()
        }
        else {
          this.paymentForm.enable()
        }
      }
      else {
        this.snackBService.openSnackBar("Please add amount", "close")
      }
    }
  }

  confirmOrder() {
    if (this.paymentArray.length > 0 && this.paymentForm.value['amount']) {
      let amountRecieved = 0.00;
      this.paymentArray.forEach((obj: any) => {
        amountRecieved += parseFloat(obj.amount)
      });
      // console.log(amountRecieved);
      let date = moment();
      let todayDate = date.format('YYYY-MM-DD');
      let currentTime = date.format('hh:mm:ss');
      if (amountRecieved == parseFloat(this.data.Total)) {
        let body = {
          'amount': this.data.Total,
          'payment_types': this.paymentArray,
          'amount_received': (amountRecieved).toFixed(2),
          'tip_amount': this.tipInput.value ? parseFloat(this.tipInput.value).toFixed(2) : 0,
          'balance_amount' : (parseFloat(this.balance) - parseFloat(this.tipInput.value)) >= 0 ? (parseFloat(this.balance) - parseFloat(this.tipInput.value)).toFixed(2) : 0,
          'current_time': currentTime,
          'current_date': todayDate,
          'loyalty_flag': this.loyalty_flag,
          'loyalty_price': this.loyalty_flag ? this.calculatedLoyaltyPrice : null,
          'payment_status': 1,
          'credit_flag': this.creditChecking(),
        }
        this.dialogRef.close(body)
      }
      else if (amountRecieved > this.data.Total) {
        this.balance = (amountRecieved - this.data.Total).toFixed(2)
        this.tipInput.setValue(this.balance)
        this.balanceFlag = true;
      }
    }
    else {
      this.snackBService.openSnackBar("Please add amount and payment type", "Close")
    }
  }

  removeAmount(index: any) {
    if (this.paymentArray[index].payment_id == 3) {
      this.loyalty_flag = false;
    }
    this.paymentArray.splice(index, 1);
    let amountTotal = 0.00;
    let balancetopay = 0.00;
    this.paymentArray.forEach((obj: any) => {
      amountTotal += parseFloat(obj.amount);
      balancetopay = parseFloat(this.data.Total) - amountTotal
    });
    if (amountTotal == 0) {
      this.paymentForm.patchValue({
        amount: this.data.Total
      })
    }
    else if (amountTotal > this.data.Total) {
      this.paymentForm.patchValue({
        amount: '0'
      })
    }
    else {
      this.paymentForm.patchValue({
        amount: (balancetopay).toFixed(2)
      })
    }
    if (this.paymentForm.value['amount'] == 0) {
      this.paymentForm.disable()
    }
    else {
      this.paymentForm.enable()
    }
  }

  creditChecking() {
    var found = this.paymentArray.find(function (obj: any) {
      return obj.payment_id == 5;
    });
    if (found) {
      return true;
    }
    else {
      return false;
    }
  }

  tipRecieved(type:any) {
    if(this.tipInput.valid) {
      this.tipPaymentType = type;
      this.paymentBalance()
    }
    else{
      this.snackBService.openSnackBar("Invalid Input","Close")
    }
  }

  paymentBalance() {
    this.paymentAddFlag = true;
    // this.balanceReturnFlag = false;
    let amountRecieved = 0.00;
    this.paymentArray.forEach((obj: any) => {
      amountRecieved += parseFloat(obj.amount)
    });
    let date = moment();
    let todayDate = date.format('YYYY-MM-DD');
    let currentTime = date.format('hh:mm:ss');
    let body = {
      'amount': this.data.Total,
      'payment_types': this.paymentArray,
      'amount_received': (amountRecieved).toFixed(2),
      'tip_amount': this.tipInput.value ? parseFloat(this.tipInput.value).toFixed(2) : 0,
      'balance_amount' : (parseFloat(this.balance) - parseFloat(this.tipInput.value)) >= 0 ? (parseFloat(this.balance) - parseFloat(this.tipInput.value)).toFixed(2) : 0,
      'current_time': currentTime,
      'current_date': todayDate,
      'loyalty_flag': this.loyalty_flag,
      'loyalty_price': this.loyalty_flag ? this.calculatedLoyaltyPrice : null,
      'payment_status': 1,
      'credit_flag': this.creditChecking(),
      'tip_payment_type' : this.tipPaymentType
    }
      this.dialogRef.close(body)
  }

  paymentReturn() {
    if(this.tipInput.valid){
      this.paymentAddFlag = true;
      // this.balanceReturnFlag = true;
      this.tipInput.setValue(0)
      let amountRecieved = 0.00;
      this.paymentArray.forEach((obj: any) => {
        amountRecieved += parseFloat(obj.amount)
      });
      let date = moment();
      let todayDate = date.format('YYYY-MM-DD');
      let currentTime = date.format('hh:mm:ss');
      let body = {
        'amount': this.data.Total,
        'payment_types': this.paymentArray,
        'amount_received': (amountRecieved).toFixed(2),
        'tip_amount': this.tipInput.value ? parseFloat(this.tipInput.value).toFixed(2) :0,
        'balance_amount' : (parseFloat(this.balance) - parseFloat(this.tipInput.value)) >= 0 ? (parseFloat(this.balance) - parseFloat(this.tipInput.value)).toFixed(2) : 0,
        'current_time': currentTime,
        'current_date': todayDate,
        'loyalty_flag': this.loyalty_flag,
        'loyalty_price': this.loyalty_flag ? this.calculatedLoyaltyPrice : null,
        'payment_status': 1,
        'credit_flag': this.creditChecking(),
      }
      this.dialogRef.close(body)

    }
    else{
      this.snackBService.openSnackBar("Invalid Input","Close")
    }
  }

  getPaymentMethod() {
    this.httpService.get('payment-type', false)
      .subscribe(result => {
        if (result.status == 200) {
          this.paymentMethods = result.data.payment_types;
        } else {
          console.log("Error");
        }
      });
  }

  getOrderdetails() {
    this.httpService.get('order-customer/' + this.data.orderId, false)
      .subscribe(result => {
        if (result.status == 200) {
          result.data.customer_details != null ? this.calculatedLoyaltyPrice = (parseFloat(result.data.customer_details.loyalty_point) * parseFloat(result.data.point_to_price)).toFixed(2) : this.calculatedLoyaltyPrice = 0.00;
        } else {
          console.log("Error");
        }
      });
  }

  printKOTorInvoice(data: any) {
    data.printData.forEach((obj: any) => {
      let print = this.printMqtt.checkPrinterAvailablity(obj)
      if (print.status) {
        this.printMqtt.publish('print', print.printObj)
          .subscribe((data: any) => {
          });
      }
      else {
        this.snackBService.openSnackBar(print.message, "Close");
      }
    })
  }

}