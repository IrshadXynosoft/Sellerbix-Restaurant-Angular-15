import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from 'src/app/walkin/detail/detail.component';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { PoReportDetailComponent } from '../po-report-detail/po-report-detail.component';
import moment from 'moment';
export interface Report {
  id: number;
  purchase_order_no: any;
  staff_name: any;
  branch_name: any;
  supplier_name: any;
  due_date: any;
  status: any;
  amount: any;
  
}

@Component({
  selector: 'app-purchase-order-reports',
  templateUrl: './purchase-order-reports.component.html',
  styleUrls: ['./purchase-order-reports.component.scss']
})
export class PurchaseOrderReportsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'purchase_order_no', 'branch_name','supplier_name', 'staff_name', 'due_date', 'status', 'amount','button'];
  public dataSource = new MatTableDataSource<Report>();
  public generatePurchaseOrderReport!: UntypedFormGroup;
  data: any;
  branch_id:any;
  branchRecords: any = []
  supplierArray:any=[];
  searchByPeriod: boolean = false;
  searchBySpecificDate: boolean = false;
  PurchaseOrderReportArray: any = [];
  totalAmount: any = 0;
  date = moment();
  todayDate = this.date.format('YYYY-MM-DD');
  minDate:any =  moment(this.todayDate).subtract(2, 'months').format('YYYY-MM-DD');
  constructor(private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private route: ActivatedRoute, 
              private formBuilder: UntypedFormBuilder, public dialog: MatDialog,private localService:LocalStorage) {
                this.branch_id=this.localService.get('branch_id') 
               }

  ngOnInit(): void {
    this.getBranch();
    this.getSuppler();
    this.onBuildForm();
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
    this.generatePurchaseOrderReport = this.formBuilder.group({
      branch_id: [this.branch_id],
      supplier_id:[null],
      status: [null],
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
      if (this.generatePurchaseOrderReport.value['fromDate'] && this.generatePurchaseOrderReport.value['toDate']) {
        postParams = {
          branch_id: this.generatePurchaseOrderReport.value['branch_id'],
          status: this.generatePurchaseOrderReport.value['status'],
          supplier_id: this.generatePurchaseOrderReport.value['supplier_id'],
          date_from: this.generatePurchaseOrderReport.value['fromDate'],
          date_to: this.generatePurchaseOrderReport.value['toDate']
        }
      }
    }
    else if (this.searchBySpecificDate) {
      if (this.generatePurchaseOrderReport.value['date']) {
        postParams = {
          branch_id: this.generatePurchaseOrderReport.value['branch_id'],
          status: this.generatePurchaseOrderReport.value['status'],
          supplier_id: this.generatePurchaseOrderReport.value['supplier_id'],
          specify_date: true,
          date: this.generatePurchaseOrderReport.value['date'],
        }
      }
    }
    else {
      postParams = {
        branch_id: this.generatePurchaseOrderReport.value['branch_id'],
          status: this.generatePurchaseOrderReport.value['status'],
          supplier_id: this.generatePurchaseOrderReport.value['supplier_id'],
        current_date: true
      }
    }
    this.dataSource.data = [];
    //this.totalAmount = 0;
    if (postParams) {
    this.httpService.post('reports/purchase-report',postParams)
      .subscribe(result => {
        if (result.status == 200) {
          this.PurchaseOrderReportArray = result.data;
          const data: any = [];
          this.totalAmount = 0;
          this.PurchaseOrderReportArray.forEach((obj: any) => {
              let status:any;
               status=this.getStatus(obj.status)
              let objData = {
                id: obj.id,
                purchase_order_no: obj.purchase_order_number,
                staff_name: obj.staff,
                branch_name: obj.branch,
                supplier_name: obj.supplier_name,
                due_date: obj.due_date,
                status: status,
                amount: obj.total_amount,
               
              }
              this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
              data.push(objData)
            
          });
          this.dataSource.data = data as Report[];
        } else {
          console.log("Error");
        }
      });
    }
    else {
      this.snackBService.openSnackBar('Please Select Date to Generate Report', "Close")
    }
  }
  getStatus(status:any){
     let poStatus:any;
     if(status==0){
       poStatus='Open'
     }
     else if(status==1){
      poStatus='Send'
     }
     else if(status==2){
      poStatus='Received'
     }
     else if(status==3){
      poStatus='Rejected'
     }
     return poStatus;
  }
  purchaseOrderForLocation(event:any){
    this.generateReport();
  }
  purchaseOrderFortype(event:any){
    let status=event.target.value
    if (status == 0) {
      const data: any = [];
      this.totalAmount = 0;
      this.PurchaseOrderReportArray.forEach((obj: any) => {
          let status:any;
           status=this.getStatus(obj.status)
          let objData = {
            id: obj.id,
            purchase_order_no: obj.purchase_order_number,
            staff_name: obj.staff,
            branch_name: obj.branch,
            supplier_name: obj.supplier_name,
            due_date: obj.due_date,
            status: status,
            amount: obj.total_amount,
           
          }
          this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
          data.push(objData)
        
      });
      this.dataSource.data = data as Report[];
    }
    else if(status==1){
    
     const data: any = [];
     this.totalAmount = 0;
     this.PurchaseOrderReportArray.forEach((obj: any) => {
         let status:any;
          status=this.getStatus(obj.status)
         if(obj.status==0){
          let objData = {
            id: obj.id,
            purchase_order_no: obj.purchase_order_number,
            staff_name: obj.staff,
            branch_name: obj.branch,
            supplier_name: obj.supplier_name,
            due_date: obj.due_date,
            status: status,
            amount: obj.total_amount,
           
          }
          this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
         data.push(objData)
         }
     });
     this.dataSource.data = data as Report[];
    }
    else if(status==2){
      const data: any = [];
      this.totalAmount = 0;
      this.PurchaseOrderReportArray.forEach((obj: any) => {
          let status:any;
           status=this.getStatus(obj.status)
          if(obj.status==1){
           let objData = {
             id: obj.id,
             purchase_order_no: obj.purchase_order_number,
             staff_name: obj.staff,
             branch_name: obj.branch,
             supplier_name: obj.supplier_name,
             due_date: obj.due_date,
             status: status,
             amount: obj.total_amount,
            
           }
           this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
          data.push(objData)
          }
      });
      this.dataSource.data = data as Report[];
    }
    else if(status==3){
      const data: any = [];
      this.totalAmount = 0;
      this.PurchaseOrderReportArray.forEach((obj: any) => {
          let status:any;
           status=this.getStatus(obj.status)
          if(obj.status==2){
           let objData = {
             id: obj.id,
             purchase_order_no: obj.purchase_order_number,
             staff_name: obj.staff,
             branch_name: obj.branch,
             supplier_name: obj.supplier_name,
             due_date: obj.due_date,
             status: status,
             amount: obj.total_amount,
            
           }
           this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
          data.push(objData)
          }
      });
      this.dataSource.data = data as Report[];
    }
    else if(status==4){
      const data: any = [];
      this.totalAmount = 0;
      this.PurchaseOrderReportArray.forEach((obj: any) => {
          let status:any;
           status=this.getStatus(obj.status)
          if(obj.status==3){
           let objData = {
             id: obj.id,
             purchase_order_no: obj.purchase_order_number,
             staff_name: obj.staff,
             branch_name: obj.branch,
             supplier_name: obj.supplier_name,
             due_date: obj.due_date,
             status: status,
             amount: obj.total_amount,
            
           }
           this.totalAmount = (parseFloat(this.totalAmount) + parseFloat(obj.total_amount)).toFixed(2)
          data.push(objData)
          }
      });
      this.dataSource.data = data as Report[];
    }


  }
  viewDetails(id: any) {
    const dialogRef = this.dialog.open(PoReportDetailComponent, {
      width: '1200px',data:{id:id}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

