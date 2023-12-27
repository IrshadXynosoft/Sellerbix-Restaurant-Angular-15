import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';


@Component({
  selector: 'app-daybook-summary',
  templateUrl: './daybook-summary.component.html',
  styleUrls: ['./daybook-summary.component.scss']
})
export class DaybookSummaryComponent implements OnInit {

  currency_symbol = localStorage.getItem('currency_symbol');
  public daybookForm!: UntypedFormGroup;
  daybookRecords: any;
  businessdayRecords: any = [];
  selectedBusinessday: any;
  payments: any = []
  closing_bal: any;
  creditTotal = 0.00;
  debitTotal = 0.00;
  opening_bal: any;
  receipts: any = [];
  itemDiscount: any = [];
  orderDiscount: any = [];
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBuisnessday()
    // this.daybookRecords= {
    //   "business_day": "2023-09-30",
    //   "date": "2023-10-03 17:35:47",
    //   "branch": "Zest Arabia",
    //   "sale_summary": [
    //     {
    //       "name": "Void",
    //       "count": 0,
    //       "total": 0
    //     },
    //     {
    //       "name": "Un Paid",
    //       "count": 1,
    //       "total": 0
    //     },
    //     {
    //       "name": "Paid",
    //       "count": 2,
    //       "total": 2731.2999999999997
    //     },
    //     {
    //       "name": "Refund",
    //       "count": 1,
    //       "total": 440
    //     },
    //     {
    //       "name": "Total Sale Orders",
    //       "count": 2,
    //       "total": 2731.2999999999997
    //     },
    //     {
    //       "name": "Total Items Sold",
    //       "count": 9,
    //       "total": 2842.3999999999996
    //     }
    //   ],
    //   "staff_orders": [
    //     {
    //       "name": "Admin",
    //       "count": 3
    //     }
    //   ],
    //   "waiter_orders": [
    //     {
    //       "name": "Aljinas",
    //       "count": 3
    //     }
    //   ],
    //   "entity_order": [
    //     {
    //       "name": "Call Center",
    //       "count": 0
    //     },
    //     {
    //       "name": "Dine In",
    //       "count": 0
    //     },
    //     {
    //       "name": "E-Order",
    //       "count": 0
    //     },
    //     {
    //       "name": "Kiosk",
    //       "count": 0
    //     },
    //     {
    //       "name": "Mobile",
    //       "count": 0
    //     },
    //     {
    //       "name": "POS",
    //       "count": 0
    //     },
    //     {
    //       "name": "Self Ordering",
    //       "count": 0
    //     },
    //     {
    //       "name": "Soonu",
    //       "count": 0
    //     },
    //     {
    //       "name": "swiggy",
    //       "count": 0
    //     },
    //     {
    //       "name": "Take Away",
    //       "count": 0
    //     },
    //     {
    //       "name": "Thalabath",
    //       "count": 0
    //     },
    //     {
    //       "name": "Walk In",
    //       "count": 3
    //     },
    //     {
    //       "name": "Zomato",
    //       "count": 0
    //     }
    //   ],
    //   "collection_summary": [
    //     {
    //       "name": "Sub Total",
    //       "sign": null,
    //       "amount": "2883.00"
    //     },
    //     {
    //       "name": "Surcharge",
    //       "sign": "+",
    //       "amount": "0.00"
    //     },
    //     {
    //       "name": "Tax",
    //       "sign": "+",
    //       "amount": "288.30"
    //     },
    //     {
    //       "name": "Tips",
    //       "sign": "+",
    //       "amount": "0.00"
    //     },
    //     {
    //       "name": "Discounts",
    //       "sign": "-",
    //       "amount": "0.00"
    //     },
    //     {
    //       "name": "Partial Payment Balance",
    //       "sign": "-",
    //       "amount": "0.00"
    //     },
    //     {
    //       "name": "Refund",
    //       "sign": "-",
    //       "amount": "0.00"
    //     },
    //     {
    //       "name": "Total Collections",
    //       "sign": "null",
    //       "amount": "3171.30"
    //     }
    //   ],
    //   "receipts_summary": [
    //     {
    //       "name": "Card",
    //       "amount": 22
    //     },
    //     {
    //       "name": "Cash",
    //       "amount": 540
    //     },
    //     {
    //       "name": "COD",
    //       "amount": 2609.2999999999997
    //     },
    //     {
    //       "name": "Credit",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Free",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Loyalty",
    //       "amount": 0
    //     }
    //   ],
    //   "receipts": [
    //     {
    //       "name": "one",
    //       "amount": 0
    //     },
    //     {
    //       "name": " Total collections",
    //       "amount": "3171.30"
    //     }
    //   ],
    //   "payments_summary": [
    //     {
    //       "name": "Card",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Cash",
    //       "amount": 0
    //     },
    //     {
    //       "name": "COD",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Credit",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Free",
    //       "amount": 0
    //     },
    //     {
    //       "name": "Loyalty",
    //       "amount": 0
    //     }
    //   ],
    //   "payments": [
    //     {
    //       "name": "new",
    //       "amount": 0
    //     }
    //   ]
    // }
  }


  onBuildForm() {
    this.daybookForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
    })
  }

  filterReport(event: any) {
    this.selectedBusinessday = event.target.value;
    this.generateReport();
  }
  getBuisnessday() {
    this.httpService.get('businessdays')
      .subscribe(result => {
        if (result.status == 200) {
          this.businessdayRecords = result.data;
        }
        else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      })
  }

  generateReport() {
    if (this.daybookForm.value['searchBy']) {
      let body = {
        business_day_id: this.selectedBusinessday
      }
      this.httpService.post('daybook-summary', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.daybookRecords = result.data;
            // this.creditTotal = result.data.credits ? result.data.credits.toFixed(2) : 0.00;
            // this.debitTotal = result.data.debits ? result.data.debits.toFixed(2) : 0.00;
            // this.opening_bal = result.data.opening_balance ? result.data.opening_balance.toFixed(2) : 0.00;
            // this.receipts = result.data.receipts;
            // this.payments = result.data.payments;
            // this.itemDiscount = result.data.item_discount;
            // this.orderDiscount = result.data.order_discount;
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close");
          }
        })
    }
    else {
      this.snackBService.openSnackBar("Select business day to generate report", "Close")
    }
  }

  back() {
    this.router.navigate(['accounts/accountsreport'])
  }
  arrayDataCheck(orders: any) {
    let flag = false;
    orders.forEach((obj: any) => {
      if (parseFloat(obj.amount) != 0) {
        flag = true;
      }
    });
    return flag;
  }
}


