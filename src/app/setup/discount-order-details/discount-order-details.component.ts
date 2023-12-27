import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

export interface itemReport {
  id: number;
  name: any;
  discounts: any;
  amount: any;
}

@Component({
  selector: 'app-discount-order-details',
  templateUrl: './discount-order-details.component.html',
  styleUrls: ['./discount-order-details.component.scss']
})
export class DiscountOrderDetailsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  public displayedColumns: string[] = ['order','entity', 'date', 'discount', 'amount'];
  public dataSource = new MatTableDataSource<itemReport>();
  staff = this.localservice.get('user1');
  customPreLoader: boolean = false;
  orderRecords:any=[]
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(
    public dialog: MatDialog,
    public httpService: HttpServiceService,
    private snackBService: SnackBarService,
    public dialogRef: MatDialogRef<DiscountOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { operation: any,data:any },
    private localservice: LocalStorage,
    private dataservice: DataService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    let data={
      orderIds : this.data.data
    }
   if(this.data.operation == 'order'){
    this.httpService
    .post('order-discount-report-by-id' , data,false)
    .subscribe((result) => {
      if (result.status == 200) {
        this.customPreLoader = true;
        this.dataSource.data = [];
        const order_data: any = [];
        result.data.forEach((element: any) => {
            let objData = {
              order_number: element.order_number,
              date: element.date,
              time: element.time,
              amount: parseFloat(element.amount).toFixed(2),
              discount: parseFloat(element.discount).toFixed(2),
              entity : element.entity?.name
            };
            order_data.push(objData);
        });
        this.dataSource.data = order_data as itemReport[];
        this.customPreLoader = false;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
   }
   else {
    this.httpService
    .post('item-discount-report-by-id' , data,false)
    .subscribe((result) => {
      if (result.status == 200) {
        this.customPreLoader = true;
        this.dataSource.data = [];
        const order_data: any = [];
        result.data.forEach((element: any) => {
            let objData = {
              order_number: element.order_number,
              date: element.date,
              time: element.time,
              amount: parseFloat(element.amount).toFixed(2),
              discount: parseFloat(element.discount).toFixed(2),
              entity : element.entity?.name
            };
            order_data.push(objData);
        });
        this.dataSource.data = order_data as itemReport[];
        this.customPreLoader = false;
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
   }
  }

  close() {
    this.dialogRef.close()
  }

  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }
  dateCheck(date: any) {
    let newDate = moment(new Date(date)).format("DD-MM-YYYY");
    return newDate
  }
}
