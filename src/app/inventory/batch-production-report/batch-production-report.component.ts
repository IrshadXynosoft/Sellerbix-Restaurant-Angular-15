import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddHistoryComponent } from '../add-history/add-history.component';
import { BatchProductionReportDetailComponent } from '../batch-production-report-detail/batch-production-report-detail.component';
import moment from 'moment';
export interface BatchList {
  id: number;
  process_no: any
  name: any;
  staff: any;
  location: any;
}
@Component({
  selector: 'app-batch-production-report',
  templateUrl: './batch-production-report.component.html',
  styleUrls: ['./batch-production-report.component.scss']
})
export class BatchProductionReportComponent implements OnInit {

  @ViewChild("batchTable", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'process_no', 'process_date', 'staff', 'location', 'button'];
  public dataSource = new MatTableDataSource<BatchList>();
  public generatePurchaseOrderReport!: UntypedFormGroup;
  data: any;
  branch_id: any;
  branch_name: any;
  branchRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
  staffRecords: any = []
  public generateReportForm!: UntypedFormGroup;
  processeddata: any = [];
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private httpService: HttpServiceService, 
    private snackBService: SnackBarService, 
   private formBuilder: UntypedFormBuilder, 
    public dialog: MatDialog, 
    private localService: LocalStorage
    ) {
    this.branch_id = this.localService.get('branch_id')
    this.branch_name = this.localService.get('branchname')
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();
    this.getStaff();
  }

  getStaff() {
    this.httpService.get('get-staff-by-location/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.staffRecords = result.data.staffs;

        } else {
          console.log("Error");
        }
      });
  }
  onBuildForm() {
    this.generateReportForm = this.formBuilder.group({
      staff: ['0'],
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      branch_id: [this.branch_id],
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
  viewBatchProcess(item: any) {
 
      const dialogRef = this.dialog.open(BatchProductionReportDetailComponent, {
        width: '900px', data: { 'id': item.id }
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    
  }
  findDateDiff(dateSent: any) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));

  }


  getBranch() {
    this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id'))
      .subscribe(result => {
        if (result.status == 200) {
          this.branchRecords = result.data.tenant_branches;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }





  generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.generateReportForm.value['fromDate'] && this.generateReportForm.value['toDate']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          staff_id: this.generateReportForm.value['staff'],
          date_from: this.generateReportForm.value['fromDate'],
          date_to: this.generateReportForm.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.generateReportForm.value['date']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          staff_id: this.generateReportForm.value['staff'],
          specify_date: true,
          date: this.generateReportForm.value['date'],
        }
      }
    }
    else {
      postParams = {
        entity_id: this.generateReportForm.value['entity'],
        branch_id: this.generateReportForm.value['branch_id'],
        staff_id: this.generateReportForm.value['staff'],
        current_date: true
      }
    }
    this.dataSource.data = [];
    //this.totalAmount = 0;
    if (postParams) {
      this.httpService.post('batch-production-report', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            const data: any = [];
            this.processeddata = result.data;
            this.processeddata.forEach((obj: any) => {
              let objData = {
                id: obj.id,
                process_no: obj.batch_process_reference_no,
                staff: obj.staff_name,
                location: obj.branch_name,
                process_date: obj.date
              }
              data.push(objData)
            });
            this.dataSource.data = data as BatchList[];
          } else {
            console.log("Error in batch-process");
          }

        });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
    }
  }


  addHistory(stock_id: any, item_name: any): void {
    const dialogRef = this.dialog.open(AddHistoryComponent, {
      width: '100%', data: { 'stock_id': stock_id, 'item_name': item_name, 'branch_id': this.branch_id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

