import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  UntypedFormBuilder,
  FormControl,
  FormGroup,
  Validators,
  UntypedFormGroup,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { WastageReportDetailComponent } from '../wastage-report-detail/wastage-report-detail.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
export interface StockIssue {
  id: any;
  stock_issuing_number: any;
  issuing_type: any;
  staff: any;
  location: any;
}
@Component({
  selector: 'app-wastage-report',
  templateUrl: './wastage-report.component.html',
  styleUrls: ['./wastage-report.component.scss']
})
export class WastageReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'stock_issuing_number', 'date', 'issuing_type', 'staff', 'location','amount', 'button'];
  public dataSource = new MatTableDataSource<StockIssue>();
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_id: any;
  branchRecords: any = [];
  getIssuesArray = [];
  public generateReportForm!: UntypedFormGroup;
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(
    private router: Router,
    private httpService: HttpServiceService,
    private formBuilder: UntypedFormBuilder,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    private dataservice: DataService,
    public dialog: MatDialog, 
  ) {
    this.branch_id = this.localService.get('branch_id');
  }

  ngOnInit(): void {
    this.onBuildForm();
    this.getBranch();


  }
  onBuildForm() {
    this.generateReportForm = this.formBuilder.group({
      searchBy: ['0'],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      branch_id: [this.branch_id],
      date: [''],
      inventory_type:[null],
      issuing_type:[1]
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
  generateReport() {
    let postParams: any;
    if (this.searchByPeriod) {
      if (this.generateReportForm.value['fromDate'] && this.generateReportForm.value['toDate']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          inventory_type: this.generateReportForm.value['inventory_type'],
          issuing_type: this.generateReportForm.value['issuing_type'],
          date_from: this.generateReportForm.value['fromDate'],
          date_to: this.generateReportForm.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.generateReportForm.value['date']) {
        postParams = {
          branch_id: this.generateReportForm.value['branch_id'],
          inventory_type: this.generateReportForm.value['inventory_type'],
          issuing_type:this.generateReportForm.value['issuing_type'],
          specify_date: true,
          date: this.generateReportForm.value['date'],
        }
      }
    }
    else {
      postParams = {
        branch_id: this.generateReportForm.value['branch_id'],
        inventory_type: this.generateReportForm.value['inventory_type'],
        issuing_type: this.generateReportForm.value['issuing_type'],
        current_date: true
      }
    }
    this.dataSource.data = [];
    //this.totalAmount = 0;
    if (postParams) {
      this.httpService.post('reports/stock-issue-report', postParams)
        .subscribe(result => {
          if (result.status == 200) {
            this.getIssuesArray = result.data;
            this.dataSource.data = this.getIssuesArray as StockIssue[];
          } else {
            console.log('Error in stock issue');
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
    }

  }
  getBranch() {
     this.httpService.get('branches-for-inventory/'+this.localService.get('tenant_id')).subscribe((result) => {
      if (result.status == 200) {
        this.branchRecords = result.data.tenant_branches;
      } else {
        console.log('Error');
      }
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }



  viewDetailIssue(element: any) {
  
    const dialogRef = this.dialog.open(WastageReportDetailComponent, {
      width: '900px',data:{id:element.id}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  newStockIssue() {
    this.router.navigate(['inventory/newstockissue'])
  }
}
