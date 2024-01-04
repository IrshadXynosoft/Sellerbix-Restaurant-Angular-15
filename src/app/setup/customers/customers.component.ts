import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EditCustomerSetupComponent } from '../edit-customer-setup/edit-customer-setup.component';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Customers {
  id: number;
  name: any;
  contactno: any;
  email: any;
  dob: any;
  loyalty: any;
  delivery_area: any
}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  public displayedColumns: string[] = ['index', 'name', 'contactno', 'email', 'dob', 'delivery_area', 'loyalty', 'button'];
  public dataSource = new MatTableDataSource<Customers>();
  customersArray: any = [];
  current_page: any = 1;
  last_page: any = 2;
  processingResponseStr = "";
  id: any;
  tableIndex: any = 0;
  customerData = new UntypedFormControl();
  customerListArray: any = [];
  customer_filteredOptions: Observable<any[]> | undefined;
  list_options: any = [];
  customerInsights:any=[];
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getCustomers();
    this.customer_filteredOptions = this.customerData.valueChanges.pipe(
      startWith(''),
      map(value => this._filtercustomerlist(value)),
    );
    this.getCustomerCards()
  }

  private _filtercustomerlist(value: string): string[] {
    const filterValue = value.toLowerCase();
    const results = this.list_options.filter((option: any) => option.contact_no.toString().toLowerCase().includes(filterValue) || option.name.toString().toLowerCase().includes(filterValue));
    return results.length ? results : [{ id: 0, contact_no: 'Not found' }];
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  reset() {
    this.customersArray = [];
    this.current_page = 1;
    this.last_page = 2;
  }

  searchContactNumber(contactNumber: any) {
    if (contactNumber.length > 0) {
      this.httpService.get('getCustomerBysearch/' + contactNumber)
        .subscribe(result => {
          if (result.status == 200) {
            this.customerListArray = [];
            if (result.data.length > 0) {
              this.customerListArray = result.data;
            }
            else {
              this.customerListArray.push(
                { id: 0, contact_no: 'Customer Not found', name: '' }
              )
            }

          } else {
            console.log("Error while fetching customer details");
          }
        });
    }
    else {
      this.customerListArray = [];
      this.getCustomers();
    }
  }

 getCustomerCards() {
    this.httpService.get('customer-data')
      .subscribe(async result => {
        if (result.status == 200) {
          this.customerInsights = result.data;
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  customerSelected(id: any) {
    if (id != 0) {
      this.httpService.get('customer-order/' + id)
        .subscribe(async result => {
          if (result.status == 200) {
            this.reset()
            this.current_page = result.current_page;
            this.last_page = result.last_page;
            if (result.data.length > 0) {
              await this.pushToSalesArray(result.data);
              this.current_page = 2;
            }
          }
          else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
    else {
      this.snackBService.openSnackBar('Please Choose Different Customer', "Close");
      this.getCustomers()
    }
  }

  async getCustomers() {
    this.reset()
    this.httpService.get('customer?page=' + this.current_page)
      .subscribe(async result => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;
          if (result.data.data.length > 0) {
            await this.pushToSalesArray(result.data.data);
            this.current_page = 2;
          }
          // if (this.current_page < this.last_page) {
          //   await this.getIteratedData();
          // }
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  async pushToSalesArray(params: any) {
    params.forEach(async (obj: any) => {
      this.customersArray.push(obj);
      await this.setDataTable();
    });
  }

  // async getIteratedData(initializeCurrentPage = true) {
  //   this.processingResponseStr = "Processing " + this.current_page + " / " + this.last_page + " please wait";
  //   if (initializeCurrentPage) {
  //     this.current_page = 2;
  //   }
  //   console.log(this.current_page, this.last_page);

  //   this.httpService
  //     .get('customer?page=' + this.current_page, false)
  //     .subscribe(async (result) => {
  //       if (result.status == 200) {
  //         if (result.data.data.length > 0) {
  //           await this.pushToSalesArray(result.data.data);
  //         }
  //       }
  //       if (this.current_page < this.last_page) {
  //         this.current_page++;
  //         this.getIteratedData(false);
  //       } else {
  //         this.processingResponseStr = "Ready to download.";
  //       }
  //     });
  // }



  handlePageEvent(event: any) {
    const previousPageIndex = this.tableIndex;
    this.tableIndex = event.pageIndex;
    if (this.tableIndex > previousPageIndex) {
      if (this.current_page <= this.last_page) {
        this.httpService.get('customer?page=' + this.current_page, false)
          .subscribe(async (result) => {
            if (result.status == 200) {
              if (result.data.data.length > 0) {
                await this.pushToSalesArray(result.data.data);
                this.current_page++;
              }
            }
          });
      }
    }
  }

  async setDataTable() {
    const data: any = [];
    this.customersArray?.forEach((obj: any) => {
      let objData = {
        id: obj.id,
        name: obj.name,
        contactno: obj.contact_no,
        email: obj.email ? obj.email : '--',
        dob: obj.dob,
        loyalty: obj.loyalty_point.toFixed(2),
        delivery_area: obj.customer_delivery_location ? obj.customer_delivery_location[0].delivery_area_name : '-',
      }
      data.push(objData)
    });
    this.dataSource.data = data as Customers[];
  }

  back() {
    this.router.navigate(['setup/' + this.id + '/editLocation'])
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
  editcustomer(id: any): void {

    const dialogRef = this.dialog.open(EditCustomerSetupComponent, {
      width: '500px',
      data: { 'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomers();
    });
  }



  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Customer_report', sheet: 'Customer_report' });
  }


}
