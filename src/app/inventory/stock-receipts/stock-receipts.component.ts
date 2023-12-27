import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ViewStockRecieptsComponent } from '../view-stock-reciepts/view-stock-reciepts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
export interface Receipt {
  id: number;
  process_no: any
  count: any;
  type:any;
  staff: any;
  location: any;
}

@Component({
  selector: 'app-stock-receipts',
  templateUrl: './stock-receipts.component.html',
  styleUrls: ['./stock-receipts.component.scss']
})
export class StockReceiptsComponent implements OnInit {
  branch_id:any;
  branch_name:any;
  branches:any=[];
  stockReceiptArray:any=[];
  @ViewChild("stockreceipt", { read: MatPaginator, static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  public displayedColumns: string[] = ['index', 'process_no', 'count', 'type', 'staff','location', 'button'];
  public dataSource = new MatTableDataSource<Receipt>();
  constructor(private dataservice: DataService,private dialog: MatDialog,private router: Router,private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.branch_id=this.localService.get('branch_id');
    this.branch_name=this.localService.get('branchname')
   }

  ngOnInit(): void {
    this.getBranch();
    this.getStockReceipts();
  }
  getBranch() {
    this.httpService.get('branch',false)
    .subscribe(result => {
       this.branches = result.data.tenant_branches;
    });
  }
  getStockReceipts()
  {
    this.stockReceiptArray=[];
    this.httpService.get('list-all-stock-receipt/' + this.branch_id)
    .subscribe(result => {
      if(result.status==200){
        this.stockReceiptArray=result.data
        this.dataSource.data = this.stockReceiptArray as Receipt[];
      }
     });
   }
  newStockRecipts(){
    this.router.navigate(['inventory/newstockReceipt']);
  }
  getStockReceiptsByBranch(id:any)
  {
      this.branch_id=id;
      this.getStockReceipts();
  }
  viewRecipeDetail(item:any){
    this.dataservice.setData('receiptItem', item);
    
    const dialogRef = this.dialog.open(ViewStockRecieptsComponent, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}


