import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import moment from 'moment';


export interface ReportDetail {
  id: number;
  order_no: any;
  invoice_no: any;
  entity_orde_no: any;
  entity_name: any;
  location: any;
  staff: any;
  date: any;
  time: any;
  sub_total: any;
  amount: any;
  payment_type: any;
}
@Component({
  selector: 'app-daily-report-detail',
  templateUrl: './daily-report-detail.component.html',
  styleUrls: ['./daily-report-detail.component.scss']
})
export class DailyReportDetailComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  currency_symbol = localStorage.getItem('currency_symbol');
  order_no: any;
  entity_order_no: any;
  entity_name: any;
  location: any;
  staff: any;
  date: any;
  time: any;
  sub_total: any;
  amount: any;
  payment_type: any;
  totalAmount:any;
  public displayedColumns: string[] = ['index', 'order_no', 'entity_order_no', 'entity_name', 'location', 'staff', 'date', 'time', 'sub_total', 'amount'];
  public dataSource = new MatTableDataSource<ReportDetail>();

  dailyRecords: any = [];

  constructor(private router: Router,
    public dialogRef: MatDialogRef<DailyReportDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { details: any },
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dailyRecords = this.data.details;
    this.totalAmount = this.dailyRecords.order_value.toFixed(2)
    this.getData()
  }
  getData() {
    const data: any = [];
    this.dailyRecords.orders.forEach((obj: any) => {
      let callcenterType:any;
      if(obj.order_type==0)
        callcenterType='Delivery'
       else if(obj.order_type==1)
        callcenterType='Take Away'
      
      let objData = {
        order_no: obj.order_number,
        entity_order_no: obj.order_json.entity_order_no ? obj.order_json.entity_order_no : '--',
        entity_name:callcenterType?obj.entity_name+'( '+callcenterType+' )':obj.entity_name,
        location: obj.branch_name,
        staff: obj.staff_name ? obj.staff_name : '--',
        date: this.dayCheck(obj.date),
        time: this.timeCheck(obj.time),
        sub_total: obj.order_json.Cart.discount,
        amount: obj.order_json.Total
      }
      data.push(objData)
    });

    this.dataSource.data = data as ReportDetail[];
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }

  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Daily_Report', sheet: 'daily_report' });
  }
  close() {
    this.dialogRef.close();
  }


}


