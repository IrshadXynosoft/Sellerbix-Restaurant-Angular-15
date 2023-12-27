import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import moment from 'moment';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { SalesReportItemDetailsComponent } from 'src/app/setup/sales-report-item-details/sales-report-item-details.component';

@Component({
  selector: 'app-businessday-stock-report',
  templateUrl: './businessday-stock-report.component.html',
  styleUrls: ['./businessday-stock-report.component.scss']
})
export class BusinessdayStockReportComponent implements OnInit {
  currency_symbol = localStorage.getItem('currency_symbol');
  public daybookForm!: UntypedFormGroup;
 
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  
  data: any;
  id = this.localservice.get('branch_id');
  staffRecords: any = []
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  salesReportArray: any = [];
  selectedBusinessday: any;
  // totalAmount: any = 0;
  entityRecords: any = [];
  todayDate: any = moment()
  minDate: any =moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  public generateVoidReport!: UntypedFormGroup;
  daybookRecords: any;
  businessdayRecords: any = [];

  today_date = moment().format('MMM Do YYYY, h:mm:ss a');
  staff = this.localservice.get('user1');
  branch_id = this.localservice.get('branch_id');
  finishedGoods: any = [];
  ingredients: any = [];
  batchProcessed: any = [];
  branch_name: any = this.localservice.get('branchname')
  constructor(
    private printMqtt: PrintMqttService, private localservice: LocalStorage, private localService: LocalStorage, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute,
    private dialogService: ConfirmationDialogService,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog
  ) {
    this.todayDate = this.todayDate.format('YYYY-MM-DD')
  }

  ngOnInit(): void {
 
    this.onBuildForm();
    this.getBuisnessday()
  }


  onBuildForm() {
    this.daybookForm = this.formBuilder.group({
      searchBy: ['', Validators.compose([Validators.required])],
    })
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
      this.httpService.post('daybook-summery', body)
        .subscribe(result => {
          if (result.status == 200) {
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

 
  filterReport(event: any) {
    this.selectedBusinessday = event.target.value;
  }

  back() {
    this.router.navigate(['setup/reports'])
  }

  viewDetails(orderDetails: any): void {
    const dialogRef = this.dialog.open(SalesReportItemDetailsComponent, {
      width: '70%',
      data: {
        Orders: orderDetails
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  

  }


  getData() {
    this.httpService.get('get-inventory-stock/1/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.finishedGoods = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
    this.httpService.get('get-inventory-stock/2/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.ingredients = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
    this.httpService.get('batch-production-recipe-stock-on-hand/' + this.branch_id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.batchProcessed = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  qtyCheck(qty:any){
    if(parseFloat(qty)>=0){
      return true
    }
    else{
      return false
    }
  }
}

