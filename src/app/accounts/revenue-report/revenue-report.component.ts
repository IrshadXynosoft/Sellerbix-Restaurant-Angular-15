import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { LocalStorage } from 'src/app/_services/localstore.service';
import moment from 'moment';
import { formatDate } from '@angular/common';
export interface Report {
  id: number;
  entity_name: any;
  order_count: any;
  order_value: any;
  total_discount: any;
}
@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.scss']
})
export class RevenueReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'order_no', 'amount', 'received_amount'];
  public dataSource = new MatTableDataSource<Report>();
  public daybookForm!: UntypedFormGroup;
  revenueRecords: any = [];
  businessdayRecords: any = [];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  todayDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.generateReport();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.daybookForm = this.formBuilder.group({
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      date: [''],
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

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
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

  searchby(event: any) {
    let searchbyId = event.target.value;
    if (searchbyId == 1) {
      this.searchByPeriod = true
      this.searchBySpecificDate = false

    } else if (searchbyId == 0) {

      this.searchByPeriod = false
      this.searchBySpecificDate = false

    }
    else if (searchbyId == 2) {
      this.searchBySpecificDate = true
      this.searchByPeriod = false
    }

  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Daily_Report', sheet: 'daily_report' });
  }

  generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.daybookForm.value['fromDate'] && this.daybookForm.value['toDate']) {
        postParams = {
          date_from: this.daybookForm.value['fromDate'],
          date_to: this.daybookForm.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.daybookForm.value['date']) {
        postParams = {
          specify_date: true,
          date: this.daybookForm.value['date'],
        }
      }
    }
    else {
      postParams = {
        current_date: true
      }
    }
    const data: any = [];
    if (postParams) {
      this.httpService.post('revenue-report', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.revenueRecords = result.data;

            this.revenueRecords.orders?.forEach((obj: any) => {
              let objData = {
                order_no: obj.order_number,
                received_amount: obj.received_amount,
                amount: obj.amount,
              }
              data.push(objData)
            });
            this.dataSource.data = data as Report[];
          }
          else {
            this.dataSource.data = data as Report[];
            this.snackBService.openSnackBar(result.message, "Close");
          }
        })
    }

  }
  // viewData(entity_id: any) {
  //   var found = this.revenueRecords.find(function (obj: any) {
  //     return obj.entity_id == entity_id;
  //   });

  //   if (found) {
  //     const dialogRef = this.dialog.open(DailyReportDetailComponent, {
  //       width: '1500px',
  //       data: {
  //         details: found
  //       }
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       this.generateReport();
  //     });
  //   }

  // }
  back() {
    this.router.navigate(['accounts/accountsreport'])
  }
}



