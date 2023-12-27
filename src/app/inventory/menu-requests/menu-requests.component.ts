import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DataService } from 'src/app/_services/data.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ViewMenuRequestComponent } from '../view-menu-request/view-menu-request.component';
import { MatDialog } from '@angular/material/dialog';
export interface StockRequest {
  id: any;
  menu_request_number: any;
  staff: any;
  from_branch_name: any;
  to_branch_name: any;
}

@Component({
  selector: 'app-menu-requests',
  templateUrl: './menu-requests.component.html',
  styleUrls: ['./menu-requests.component.scss']
})
export class MenuRequestsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'menu_request_number', 'staff', 'from_branch_name', 'to_branch_name','status', 'button'];
  public dataSource = new MatTableDataSource<StockRequest>();
  currency_symbol = localStorage.getItem('currency_symbol');
  public newStockRequestForm!: UntypedFormGroup;
  branch_id: any;
  order_no: any;
  reOrderItemsArray: any = [];
  branchRecords: any = [];
  stockOnHandBranch: any;
  total: any;
  suppliersData = new UntypedFormControl();
  options: any = [];
  filteredOptions: Observable<any[]> | undefined;
  supplierArray: any = []
  supplierArrays: any = []
  branch_selected: boolean = false;
  purchaseOrderArray: any = [];
  ingredientArray: any = [];
  finishedGoodArray: any = [];
  recipeArray: any = [];
  subrecipeArray = [];
  total_price: any = 0;
  selectedStockIDs: any = [];
  allItemArray: any = [];
  today: any;
  isItemsSelected: boolean = false;
  getRequestArray = [];
  branch_name: any
  constructor(public dialog: MatDialog, private dataService: DataService, private router: Router, private httpService: HttpServiceService, private formBuilder: UntypedFormBuilder, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.branch_id = this.localService.get('branch_id');
    this.branch_name = this.localService.get('branchname');

  }
  ngOnInit(): void {
    this.generateOrderNo();
    this.getBranch();
    this.onBuildForm();
    this.getRequests();
  }


  generateOrderNo() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hh = new Date().getHours();
    let mm = new Date().getMinutes();
    let ss = new Date().getSeconds();
    this.order_no = "STREQ_" + date + "." + month + "." + year + "_" + hh + ":" + mm + ":" + ss;
    this.today = date + '/' + month + '/' + year

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

  // branchSelected(id: any, name: any) {
  //   if (id) {
  //     this.branch_id = id
  //     this.branch_selected = true;
  //     this.newStockRequestForm.patchValue({
  //       branch_selected: name,
  //       branch_id_for_requst:id
  //     })

  //   }
  // }
  onBuildForm() {
    this.newStockRequestForm = this.formBuilder.group({
      stock_request_number: [this.order_no, Validators.compose([Validators.required])],
      branch_selected: [this.branch_name],
      from_branch: [this.branch_id],
      branch_id_for_requst: [this.branch_id],
      req_date: [this.today],
      comments: ['', Validators.compose([Validators.required])],
      suppliersData: new UntypedFormArray([]),
      to_branch: ['', Validators.compose([Validators.required])],
    });
    this.newStockRequestForm.controls['branch_selected'].disable();
    this.newStockRequestForm.controls['req_date'].disable();
  }

  getRequests() {
    this.httpService
      .get('list-all-menu-stock-request/' + this.newStockRequestForm.value['branch_id_for_requst'])
      .subscribe((result) => {
        if (result.status == 200) {
          this.getRequestArray = result.data;
          this.dataSource.data = this.getRequestArray as StockRequest[];
        } else {
          console.log('Error in stock Request');
        }
      });
  }
  listStockrequestsByLocation() {
    this.getRequests();
  }


  back() {
    this.router.navigate(['/inventory'])
  }


  viewRequestDetail(id: any) {

    const dialogRef = this.dialog.open(ViewMenuRequestComponent, {
      width: '1200px', data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  newStockRequest() {
    this.router.navigate(['inventory/newmenuRequests'])
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  editRequestDetail(id: any) {
    this.router.navigate(['inventory/editmenurequest/'+id])

    
  }
  deleteRequestDetail(id: any, reqNumber: any) {
    const options = {
      title: 'Delete Menu Request',
      message: 'Delete ' + reqNumber + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('menu-request/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Menu Request- " + reqNumber + " Deleted Successfully!!", "Close");
              this.getRequests();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
}

