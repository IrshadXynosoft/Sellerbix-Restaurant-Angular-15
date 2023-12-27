import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ViewStockRequestsComponent } from '../view-stock-requests/view-stock-requests.component';
import { MatDialog } from '@angular/material/dialog';
export interface StockRequest{
  id:any;
  stock_request_number:any;
  staff:any;
  location:any;
 }
@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginatorForReceived!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorForProcessed!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumnsForReceived: string[] = ['index','stock_request_number','date','staff','location', 'button'];
  public displayedColumnsForProcessed: string[] = ['index','stock_request_number','date','staff','location', 'button'];
  public dataSourceForReceived = new MatTableDataSource<StockRequest>();
  public dataSourceForProcessed = new MatTableDataSource<StockRequest>();
  currency_symbol = localStorage.getItem('currency_symbol');
  branch_id=this.localService.get('branch_id')
  getRequestArray: any = []
  branchRecords: any = []
  getProcessedArray: any = []
  constructor(private dialog:MatDialog,private dataService:DataService,private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
  
  }

  ngOnInit(): void {
    this.getBranch();
     this.getStockRequests();
  }
  ngAfterViewInit(): void {
    this.dataSourceForReceived.paginator = this.paginatorForReceived;
    this.dataSourceForProcessed.paginator = this.paginatorForProcessed;
  }
  getStockRequests()
  {
    //.get('list-all-received-request/' + this.branch_id)
      this.httpService
      .get('list-all-received-request/' + this.branch_id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.getRequestArray = result.data;
          this.dataSourceForReceived.data = this.getRequestArray as StockRequest[];
        } else {
          console.log('Error in stock Request');
        }
      });
    
  }
  getProcessedRequests() {
    this.dataSourceForProcessed.data=[];
    this.httpService
      .get('list-all-stock-transfered/' + this.branch_id)
      .subscribe((result) => {
        if (result.status == 200) {
          this.getProcessedArray = result.data;
          this.dataSourceForProcessed.data = this.getProcessedArray as StockRequest[];

        } else {
          console.log('Error in stock Request');
        }
      });

  }
  tabClick(tab: any) {
  
    switch (tab.index) {
      case 0:
        this.getStockRequests();
        break;
      case 1:
        this.getProcessedRequests();}
  }
  receiveRequest(id:any){
    this.getRequestArray.forEach((element:any) => {
      if(id==element.id)
      {
        this.dataService.setData('stockreceivetItem',element);
        this.router.navigate(['inventory/receivestockrequest'])
        
      }
    });     
  }
  branchName(branch_id:any)
  {
    let branch_name:any;
    this.branchRecords.forEach((element:any) => {
       if(element.id==branch_id){
         branch_name=element.name
       }
    });
    return branch_name;
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
  viewRequestDetail(id:any)
  {
    const dialogRef = this.dialog.open(ViewStockRequestsComponent, {
      width: '1200px', data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteRequestDetail(id: any, reqNumber: any) {
    const options = {
      title: 'Reject Inventory Request',
      message: 'Reject ' + reqNumber + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        let postParams:any={
          action_status:2
        }
        this.httpService.put('stock-request/' + id,postParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Inventory Request- " + reqNumber + " Rejected Successfully!!", "Close");
              this.getStockRequests();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  acceptRequestDetail(id: any, reqNumber: any) {
    const options = {
      title: 'Accept Inventory Request',
      message: 'Accept ' + reqNumber + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        let postParams:any={
          action_status:1
        }
        this.httpService.put('stock-request/' + id,postParams)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Inventory Request- " + reqNumber + " Accepted Successfully!!", "Close");
              this.getStockRequests();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
}
