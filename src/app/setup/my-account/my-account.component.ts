import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import _ from 'lodash';
import moment from 'moment';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { UpdateBillingComponent } from '../update-billing/update-billing.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  menuList: any = []
  menus: any = []
  regDetails: any;
  regDate: any;
  expDate: any;
  yearlyTotalSum: any = 0.00;
  dateRemaining: any;
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private dialogService: ConfirmationDialogService, private snackBService: SnackBarService, private httpService: HttpServiceService, private localService: LocalStorage, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getMenuList();
    this.menuStatusCheck()
  }

  getMenuList() {
    this.menus = []
    this.httpService
      .get('branch-menu')
      .subscribe(async (result) => {
        if (result.status == 200) {
          this.menus = result.data;
          this.regDetails = result.data.reg_details;
          this.regDate = this.regDetails.registered_date;
          this.expDate = this.regDetails.expiry_date;
          let diffDate: any;
          diffDate = moment(this.expDate).diff(moment(this.regDate), 'days')
          if (diffDate <= 30) {
            this.dateRemaining = diffDate + ' day'
          }
          else {
            this.dateRemaining = moment(this.expDate).diff(moment(this.regDate), 'months') + ' month'
          }
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  menuStatusCheck() {
    this.menuList = [];
    this.yearlyTotalSum = 0.00;
    this.httpService
      .get('branch-menus')
      .subscribe(async (result) => {
        if (result.status == 200) {
          result.data.branch_menus.forEach((obj2: any) => {
            this.menuList.push({ 'menu_id': obj2.menu_id, 'status': obj2.status, 'name': obj2.menu.name, 'price_monthly': obj2.menu.price_monthly, 'price_yearly': obj2.menu.price_yearly })
          });
          // this.menus.forEach((obj: any) => {
          //   var b = _.find(this.menuList, ['menu_id', obj.id]);
          //   if (_.isObject(b)) {
          //     console.log('exists')
          //   } else {
          //     console.log('insert new')
          //     this.menuList.push({ 'menu_id': obj.id, 'status': false, 'name': obj.name, 'price_monthly': obj.price_monthly, 'price_yearly': obj.price_yearly })
          //   }
          // });
          this.menuList.forEach((element: any) => {
            if (element.status == 1 || element.status == true) {
              this.yearlyTotalSum += parseFloat(element.price_yearly);
            }
          });
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  totalSumCheck(e: any, price: any, index: any) {
    if (e.checked) {
      this.yearlyTotalSum += parseFloat(price);
      this.menuList[index].status = true;
    }
    else {
      this.yearlyTotalSum -= parseFloat(price);
      this.menuList[index].status = false;
    }
  }

  back() {
    this.router.navigate(['setup'])
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  updateBilling(): void {
    const dialogRef = this.dialog.open(UpdateBillingComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  paymentHistory() {
    // const dialogRef = this.dialog.open(MyAccountPaymentHistoryComponent, {
    //   width: '500px',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  save() {
    let body = {
      'branch_menus': this.menuList,
      'total': this.yearlyTotalSum
    }
    if (this.yearlyTotalSum > 0) {
      const options = {
        title: 'Checkout',
        message: 'Are you sure to continue with payment amount  ' + this.currency_symbol + ' ' + this.yearlyTotalSum.toFixed(2) + ' ?',
        cancelText: 'NO',
        confirmText: 'YES'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.httpService
            .post('branch-menus', body)
            .subscribe(async (result) => {
              if (result.status == 200) {
                this.getMenuList();
                this.menuStatusCheck()
              } else {
                this.snackBService.openSnackBar(result.message, "Close")
              }
            });
        }
      })
    }
    else {
      this.snackBService.openSnackBar("Please select atleast one menu for payment", "Close")
    }
  }

}
