import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';

@Component({
  selector: 'app-commercial-invoice-payment-dialog',
  templateUrl: './commercial-invoice-payment-dialog.component.html',
  styleUrls: ['./commercial-invoice-payment-dialog.component.scss']
})
export class CommercialInvoicePaymentDialogComponent implements OnInit {

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
  walletBalance: any = 0.00;
  wallet_flag: boolean = false;
  totalWalletamount = 0.00;
  add_to_wallet_amt: any;
  invalidWalletFlag: boolean = false;
  print_bill: boolean = false;
  constructor(private dialogService: ConfirmationDialogService, private printMqtt: PrintMqttService, private router: Router, private route: ActivatedRoute, private snackBService: SnackBarService, private formBuilder: UntypedFormBuilder, @Inject(MAT_DIALOG_DATA) public data: { Cart: any, orderId: any, invoiceId: any, customerid: any, entityid: any, url: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<CommercialInvoicePaymentDialogComponent>, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getPaymentMethod();
    this.onBuildPaymentForm();
    this.paymentForm.patchValue({
      amount: this.data.Cart.amount
    })
    this.getOrderdetails();
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
    this.dialogRef.close("close");
  }

  payLater() {
    this.dialogRef.close("paylater");
  }

  paymentButtonClick(id: any, name: any) {
    this.paymentForm.value['payment_type'] = {
      id: id,
      name: name
    }
    this.addpayment()
  }

  getClass(payment: any) {
    if (payment.id == 3 && this.calculatedLoyaltyPrice == 0.00 || payment.reference == 1) {
      return "disabled"
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

  // confirmWithPrint() {
  //   this.print_bill = true;
  //   this.confirmOrder();
  // }

  confirmOrder() {
    if (this.paymentArray.length > 0 && this.paymentForm.value['amount']) {
      this.dialogRef.close(this.paymentArray)
    }
    else {
      this.snackBService.openSnackBar("Please add amount and payment type", "Close")
    }
  }

  addpayment() {
    let flag = false;
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
        if (flag && (parseFloat(this.data.Cart.amount) > parseFloat(this.calculatedLoyaltyPrice))) {
          this.loyalty_flag = true;
          this.multiPaymentFlag = true;
          this.paymentArray.push({
            'amount': this.calculatedLoyaltyPrice,
            'payment_name': this.paymentForm.value['payment_type'].name,
            'payment_id': this.paymentForm.value['payment_type'].id
          });
          this.multiPaymentFlag = true;
          let amountTotal = 0.00;
          this.paymentArray.forEach((obj: any) => {
            amountTotal += parseFloat(obj.amount);
          });
          this.paymentForm.patchValue({
            amount: (parseFloat(this.data.Cart.amount) - amountTotal).toFixed(2),
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
      let date = moment();
      let todayDate = date.format('YYYY-MM-DD');
      let currentTime = date.format('hh:mm:ss');
      if (this.paymentForm.value['amount']) {
        if (!this.paymentAddFlag) {
          if (this.paymentForm.value['payment_type'].id != 3) {
            // if (this.paymentForm.value['payment_type'].id == 5) {
            //   if (this.paymentForm.value['amount'] <= this.walletBalance) {
            //     this.walletBalance -= this.paymentForm.value['amount']
            //     this.wallet_flag = true;
            //     this.invalidWalletFlag = false;
            //     if (this.paymentForm.value['amount'] != 0) {
            //       if (parseFloat(this.paymentForm.value['amount']) <= parseFloat(this.data.Cart.amount)) {
            //         this.paymentArray.push({
            //           'amount': this.paymentForm.value['amount'],
            //           'payment_name': this.paymentForm.value['payment_type'].name,
            //           'payment_id': this.paymentForm.value['payment_type'].id
            //         });
            //       }
            //     }
            //   }
            //   else {
            //     this.snackBService.openSnackBar("Not enough balance", "Close");
            //     this.invalidWalletFlag = true;
            //   }
            // }
            // else {
            this.invalidWalletFlag = false;
            if (this.paymentForm.value['amount'] != 0) {
              if (parseFloat(this.paymentForm.value['amount']) <= parseFloat(this.data.Cart.amount)) {
                if (this.paymentArray.length > 0) {
                  let tempamount = 0.00;
                  this.paymentArray.forEach((obj: any) => {
                    tempamount += parseFloat(obj.amount);
                  });
                  if (tempamount + parseFloat(this.paymentForm.value['amount']) <= parseFloat(this.data.Cart.amount)) {
                    this.paymentArray.push({
                      'amount': this.paymentForm.value['amount'],
                      'payment_name': this.paymentForm.value['payment_type'].name,
                      'payment_id': this.paymentForm.value['payment_type'].id
                    });
                  }
                }
                else {
                  this.paymentArray.push({
                    'amount': this.paymentForm.value['amount'],
                    'payment_name': this.paymentForm.value['payment_type'].name,
                    'payment_id': this.paymentForm.value['payment_type'].id
                  });
                }
              }
            }
            // }
          }
          if (this.paymentForm.value['amount'] < this.data.Cart.amount) {
            this.multiPaymentFlag = true;
            // this.paymentForm.patchValue({
            //   amount: parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Cart.amount)
            // })
          }
          if ((parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Cart.amount)) == 0) {
            this.multiPaymentFlag = true;
            this.paymentForm.patchValue({
              amount: parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Cart.amount)
            })
          }
        }
        if (!this.multiPaymentFlag) {
          if (this.paymentAddFlag) {
            this.balanceFlag = false;
            let amountRecieved = 0.00;
            this.paymentArray.forEach((obj: any) => {
              amountRecieved += parseFloat(obj.amount)
            });


            if (!this.invalidWalletFlag) {
              this.dialogRef.close(this.paymentArray);
            }
            else {
              this.snackBService.openSnackBar("Not enough balance", "Close");
            }
            this.paymentAddFlag = false;
          }
          else if ((parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Cart.amount)) > 0) {
            if (this.paymentForm.value['payment_type'].id == 5) {
              if (this.paymentForm.value['amount'] > this.walletBalance) {
                this.invalidWalletFlag = true;
                this.snackBService.openSnackBar("Not enough balance", "Close");
              }
              else {
                this.invalidWalletFlag = false;
              }
            }
            else {
              // this.balance = (parseFloat(this.paymentForm.value['amount']) - parseFloat(this.data.Cart.amount)).toFixed(2);
              // this.balanceFlag = true;
              // this.invalidWalletFlag = false;
              this.snackBService.openSnackBar("Invalid Amount", "Close");
              this.paymentForm.value['amount'] = 0.00;
            }
          }
          else {
            this.multiPaymentFlag = true;
          }
        }
        else {
          let tempFlag = false;
          let amountTotal = 0.00;
          let balancetopay = 0.00;
          this.paymentArray.forEach((obj: any) => {
            amountTotal += parseFloat(obj.amount);
            balancetopay = parseFloat(this.data.Cart.amount) - amountTotal
          });
          if (amountTotal <= parseFloat(this.data.Cart.amount)) {
            this.paymentForm.patchValue({
              amount: (balancetopay).toFixed(2)
            })
          }
          if (amountTotal == this.data.Cart.amount)
            tempFlag = true;
          else if (amountTotal > this.data.Cart.amount) {
            // this.balance = (amountTotal - this.data.Cart.amount).toFixed(2)
            // this.balanceFlag = true;
            this.snackBService.openSnackBar("Invalid Entry", "Close");
          }
          if (this.paymentAddFlag) {
            if (!this.invalidWalletFlag) {
              this.dialogRef.close(this.paymentArray);
            }
            else {
              this.snackBService.openSnackBar("Not enough balance", "Close");

            }
          }
        }
      }
      else {
        this.snackBService.openSnackBar("Please add amount", "close")
      }
    }
    if (this.paymentForm.value['amount'] == 0) {
      this.paymentForm.disable()
    }
    else {
      this.paymentForm.enable()
    }
  }

  getUsedWalletAmt() {
    let temp = 0.00;
    this.paymentArray.forEach((obj: any) => {
      if (obj.payment_id == 5) {
        temp += parseFloat(obj.amount)
      }
    });
    return temp;
  }
  removeAmount(index: any) {
    if (this.paymentArray[index].payment_id == 3) {
      this.loyalty_flag = false;
    }
    if (this.paymentArray[index].payment_id == 5) {
      this.walletBalance += parseFloat(this.paymentArray[index].amount)

    }
    this.paymentArray.splice(index, 1);
    if (this.getUsedWalletAmt() == 0) {
      this.wallet_flag = false;
    }
    let amountTotal = 0.00;
    let balancetopay = 0.00;
    this.paymentArray.forEach((obj: any) => {
      amountTotal += parseFloat(obj.amount);
      balancetopay = parseFloat(this.data.Cart.amount) - amountTotal
    });
    if (amountTotal == 0) {
      this.paymentForm.patchValue({
        amount: this.data.Cart.amount
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



  paymentBalance() {
    this.paymentAddFlag = true;
    this.balanceReturnFlag = false;
    this.addpayment();
  }

  paymentReturn() {
    this.paymentAddFlag = true;
    this.balanceReturnFlag = true;
    this.addpayment();
  }

  addtowallet() {
    this.paymentAddFlag = true;
    this.balanceReturnFlag = false;
    this.add_to_wallet_amt = this.balance;
    this.addpayment()
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
          this.walletBalance = result.data.customer_details?.wallet;
        } else {
          console.log("Error");
        }
      });
  }

  printKOTorInvoice(data: any) {

    // data.forEach((obj:any) => {
    if (this.data.entityid == 1) {
      if (data[0].canPrint && data[0].printObj.lineItems.length == 1) {
        const options = {
          title: 'Print',
          message: 'Do you want to print the invoice?',
          cancelText: 'NO',
          confirmText: 'YES'
        };
        this.dialogService.open(options);
        this.dialogService.confirmed().subscribe(confirmed => {
          if (confirmed) {
            data.forEach((obj: any) => {
              let print = this.printMqtt.checkPrinterAvailablity(obj)
              if (print.status) {
                this.printMqtt.publish('print', print.printObj)
                  .subscribe((data: any) => {
                  });
              }
              else {
                this.snackBService.openSnackBar(print.message, "Close")
              }
            });
            if (this.url != "/home/walkin") {
              this.router.navigate(["walkin/orders"]);
            }
          }
          else {
            if (this.url != "/home/walkin") {
              this.router.navigate(["walkin/orders"]);
            }
          }
        })
      }
      else {
        data.forEach((obj: any) => {
          let print = this.printMqtt.checkPrinterAvailablity(obj);
          if (print.status) {
            this.printMqtt.publish('print', print.printObj)
              .subscribe((data: any) => {
              });
          }
          else {
            this.snackBService.openSnackBar(print.message, "Close")
          }
        })
        if (this.url != "/home/walkin") {
          this.router.navigate(["walkin/orders"]);
        }
      }
    }
    else {
      data.forEach((obj: any) => {
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
    // });
  }

}

