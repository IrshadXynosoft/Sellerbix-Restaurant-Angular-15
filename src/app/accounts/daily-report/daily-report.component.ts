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
import { DailyReportDetailComponent } from '../daily-report-detail/daily-report-detail.component';

export interface Report {
  id: number;
  entity_name: any;
  order_count: any;
  order_value: any;
  total_discount: any;
}

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'entity_name', 'order_count', 'order_value', 'total_discount', 'button'];
  public dataSource = new MatTableDataSource<Report>();
  public daybookForm!: UntypedFormGroup;
  dailyRecords: any = [];
  businessdayRecords: any = [];
  selectedBusinessday: any;
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder, public dialog: MatDialog, private localservice: LocalStorage) {
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBuisnessday();
    this.generateReport();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBuildForm() {
    this.daybookForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
    })
  }

  filterReport(event: any) {
    this.selectedBusinessday = event.target.value;
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

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Daily_Report', sheet: 'daily_report' });
  }

  generateReport() {

    let body = {
      business_day_id: this.selectedBusinessday
    }
    const data: any = [];
    this.httpService.post('daily-report', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.dailyRecords = result.data;

          this.dailyRecords.forEach((obj: any) => {
            let objData = {
              id: obj.entity_id,
              entity_name: obj.entity_name ? obj.entity_name : '--',
              order_count: obj.order_count,
              order_value: obj.order_value.toFixed(2),
              total_discount: obj.total_discount.toFixed(2),
              take_away_count:obj.entity_id==3?obj.take_away.count:'-',
              take_away_amount:obj.entity_id==3?obj.take_away.amount.toFixed(2):'-',
              take_away_total_discount:obj.entity_id==3?obj.take_away.total_discount.toFixed(2):'-',
              delivery_count:obj.entity_id==3?obj.delivery.count:'-',
              delivery_amount:obj.entity_id==3?obj.delivery.amount.toFixed(2):'-',
              delivery_total_discount:obj.entity_id==3?obj.delivery.total_discount.toFixed(2):'-',
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
  viewData(entity_id: any) {
    var found = this.dailyRecords.find(function (obj: any) {
      return obj.entity_id == entity_id;
    });

    if (found) {
      const dialogRef = this.dialog.open(DailyReportDetailComponent, {
        width: '1500px',
        data: {
          details: found
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.generateReport();
      });
    }

  }
  back() {
    this.router.navigate(['accounts/accountsreport'])
  }
}

