import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export interface Settlement {
  id: number;
  order_number: any;
  commission_type: any;
  commission_value: any;
  date_time: any;
  amount: any;
  checked: any;

}
@Component({
  selector: 'app-driver-cash-settlement',
  templateUrl: './driver-cash-settlement.component.html',
  styleUrls: ['./driver-cash-settlement.component.scss']
})
export class DriverCashSettlementComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['checkbox', 'index', 'order_number', 'commission_type', 'commission_value', 'date_time', 'amount', 'button'];
  public dataSource = new MatTableDataSource<Settlement>();
  public settlementForm!: UntypedFormGroup;
  records: any = [];
  allnotsettleFlag: boolean = false;
  settled_array: any = [];
  currency_symbol = localStorage.getItem('currency_symbol');
  all_checked: boolean = false;
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  totalAmount: any = 0.00;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private formBuilder: UntypedFormBuilder, private dialogService: ConfirmationDialogService, private snackBService: SnackBarService, private httpService: HttpServiceService, @Inject(MAT_DIALOG_DATA) public data: { driverId: any }, public dialogRef: MatDialogRef<DriverCashSettlementComponent>) { }

  ngOnInit(): void {
    this.onBuildForm();
    this.getDetails();
  }
  onBuildForm() {
    this.settlementForm = this.formBuilder.group({
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])]
    }, { validator: this.dateLessThan('fromDate', 'toDate') });
  }
  dateLessThan(from: string, to: string) {
    return (group: UntypedFormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "From date should be less than To date"
        };
      }
      return {};
    }
  }
  close() {
    this.dialogRef.close();
  }
  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
  }
  getDetails() {
    this.records = [];
    this.httpService.post('driver-commissions', { driver_id: this.data.driverId }, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.records = result.data.earnings_history
          const data: any = [];

          this.records.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              order_number: obj.order.order_number,
              commission_type: obj.driver.commision_type == 0 ? "Value" : "Percentage",
              commission_value: obj.driver.commision_value,
              date_time: this.timeCheck(obj.created_at),
              amount: obj.earning_value.toFixed(2)
            }
            data.push(objData)
          });
          this.dataSource.data = data as Settlement[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }
  getsettlementDataByFilter() {
    this.records = [];
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.settlementForm.value['fromDate'] && this.settlementForm.value['toDate']) {
        postParams = {
          driver_id: this.data.driverId,
          date_from: this.settlementForm.value['fromDate'],
          date_to: this.settlementForm.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.settlementForm.value['date']) {
        postParams = {
          driver_id: this.data.driverId,
          specify_date: true,
          date: this.settlementForm.value['date'],
        }
      }
    }
    if (postParams) {
      const data: any = [];
      this.dataSource.data = data as Settlement[];
      this.httpService.post('driver-commissions', postParams, false)
        .subscribe(result => {
          if (result.status == 200) {
            this.records = result.data.earnings_history
            this.records.forEach((obj: any) => {
              let objData = {
                id: obj.id,
                order_number: obj.order.order_number,
                commission_type: obj.driver.commision_type == 0 ? "Value" : "Percentage",
                commission_value: obj.driver.commision_value,
                date_time: this.timeCheck(obj.created_at),
                amount: obj.earning_value.toFixed(2)
              }
              data.push(objData)
            });
            this.dataSource.data = data as Settlement[];
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date ', "Close")
    }
  }
  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true
      this.searchBySpecificDate = false

    }
    else if (searchbyId == 2) {
      this.searchBySpecificDate = true
      this.searchByPeriod = false
    }

  }
  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    let newDate = moment(time).format("DD-MM-YYYY");
    return newDate + ' ' + newTime;
  }
  checkall(event: any) {
    if (event.target.checked) {

      const data: any = [];

      this.records.forEach((obj: any) => {
        let objData = {
          id: obj.id,
          order_number: obj.order.order_number,
          commission_type: obj.driver.commision_type == 0 ? "Value" : "Percentage",
          commission_value: obj.driver.commision_value,
          date_time: this.timeCheck(obj.created_at),
          amount: obj.earning_value.toFixed(2),
          checked: true
        }
        data.push(objData)
        this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.earning_value)).toFixed(2)
        this.settled_array.push(obj.id)
      });
      this.dataSource.data = data as Settlement[];

      //  this.records.forEach((element:any) => {
      //   element.checked=true;
      //   this.totalAmount=(parseFloat(this.totalAmount)+parseFloat(element.earning_value)).toFixed(2)
      //    this.settled_array.push(element.id)
      //  });
    }
    else {
      const data: any = [];

      this.records.forEach((obj: any) => {
        let objData = {
          id: obj.id,
          order_number: obj.order.order_number,
          commission_type: obj.driver.commision_type == 0 ? "Value" : "Percentage",
          commission_value: obj.driver.commision_value,
          date_time: this.timeCheck(obj.created_at),
          amount: obj.earning_value.toFixed(2),
          checked: false
        }
        data.push(objData)
        this.totalAmount = 0.00
        this.settled_array = [];
      });
      this.dataSource.data = data as Settlement[];
      // this.records.forEach((element:any) => {
      //   element.checked=false;
      //  });

    }


  }

  selectedForSettlement(event: any, id: any, i: any) {

    if (event.target.checked) {
      this.settled_array.push(id)
      i.checked = true;
      this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(i.amount)).toFixed(2)
    }
    else {
      i.checked = false;
      this.totalAmount = (parseFloat(this.totalAmount) - parseFloat(i.amount)).toFixed(2)
      var found = this.settled_array.find(function (obj: any) {
        return obj == id;
      });
      if (found) {
        this.settled_array.splice(this.settled_array.indexOf(found), 1);
      }
    }

  }

  settle(id: any) {
    const options = {
      title: 'Settle',
      message: 'Are you sure to settle this Order ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.get('commission-settle/' + id, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Commision amount settled successfully", "Close");
              this.close();
            } else {
              this.snackBService.openSnackBar(result.message, "Close")
            }
          });
      }
    });
  }

  settleAll() {
    const options = {
      title: 'Settle',
      message: 'Are you sure to settle all Orders ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.post('commission-settle-all', { settled_ids: this.settled_array, driver_id: this.data.driverId }, false)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("All invoices settled successfully", "Close");
              this.settled_array = [];
              this.close();
            } else {
              this.snackBService.openSnackBar(result.message, "Close")
            }
          });
      }
    });
  }

}
