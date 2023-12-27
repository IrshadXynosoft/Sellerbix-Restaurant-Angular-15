import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { PoReportDetailComponent } from '../po-report-detail/po-report-detail.component';
import { SupplierPerformanceGraphComponent } from '../supplier-performance-graph/supplier-performance-graph.component';
import { log } from 'console';
export interface Report {
  id: number;
  name: any;
  inventory_type: any;
  stock_on_hand: any;
  cost_unit: any;
  reorder_qty: any;
  buying_unit: any;
 
  
}
@Component({
  selector: 'app-supplier-performance-report',
  templateUrl: './supplier-performance-report.component.html',
  styleUrls: ['./supplier-performance-report.component.scss']
})
export class SupplierPerformanceReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'name', 'inventory_type','stock_on_hand', 'cost_unit', 'reorder_qty', 'buying_unit','unit_value','button'];
  public dataSource = new MatTableDataSource<Report>();
  public SupplierForm!: UntypedFormGroup;
  data: any;
 supplierArray:any=[];
 PurchaseOrderReportArray: any = [];
 totalAmount: any = 0;
 reportArray:any=[];
 throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  current_page: any = 1;
  last_page: number = 1;
  branch_id:any=this.localService.get('branch_id');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute, 
              private formBuilder: UntypedFormBuilder, public dialog: MatDialog,private localService:LocalStorage) {
              
               }

  ngOnInit(): void {
     this.getSuppler();
    this.onBuildForm();
  }
  
  getSuppler() {
    this.httpService.get('supplier')
      .subscribe(result => {
        if (result.status == 200) {
          this.supplierArray = result.data.suppliers;
        } else {
          console.log("Error in Get Branch");
        }
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onBuildForm() {
    this.SupplierForm = this.formBuilder.group({
    
      supplier_id:[''],
    
    });
  }
 
  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.generateReport(this.current_page);
      this.direction = 'down';
    }
  }
  generateReport(page_number:any) {
    let postParams: any;
  
      if (this.SupplierForm.value['supplier_id']) {
        
        postParams = {
          branch_id:this.branch_id,
          supplier_id: this.SupplierForm.value['supplier_id'],
       
        }
      }
   
   
    //this.totalAmount = 0;
    if (postParams) {
    this.httpService.post('reports/supplier-report?page=' + page_number,postParams)
      .subscribe(result => {
        if (result.status == 200) {
         
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;

          if (result.data.data.length > 0) {

            if (page_number == 1) {
              this.reportArray = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.reportArray.push(obj)
              });
            }
            this.dataSource.data =  this.reportArray as Report[];
          }
         
        } else {
          console.log("Error");
        }
      });
    }
    else {
      this.snackBService.openSnackBar('Please Select Supplier to Generate Report', "Close")
    }
  }

  viewDetails(stock_id: any,supplier_id:any,name:any) {
  
    const dialogRef = this.dialog.open(SupplierPerformanceGraphComponent, {
          width: '1200px',data:{supplier_id:supplier_id,stock_id:stock_id,name:name}
        });
    
        dialogRef.afterClosed().subscribe(result => {
    
        });
  }
}

