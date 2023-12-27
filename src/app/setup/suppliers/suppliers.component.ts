import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { AddSupplierComponent } from '../add-supplier/add-supplier.component';
import { EditSupplierComponent } from '../edit-supplier/edit-supplier.component';
import { Suppliers } from './suppliers.model';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','code','name','contact_no','email','button'];
  public dataSource = new MatTableDataSource<Suppliers>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService ) { }

  ngOnInit(): void {
    this.getSupplier();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
  getSupplier()
  {
    this.httpService.get('supplier',false)
    .subscribe(result => {
      if (result.status == 200) {
       const data:any = [];
        let supplierArray = result.data.suppliers;
        supplierArray.forEach(function (obj:any) {
         let objData = {
            id: obj.id,
            name: obj.name,
            code:obj.code,
            contact_no:obj.contact_no,
            email:obj.email
            }
          data.push(objData)
        });
      this.dataSource.data = data as Suppliers[];  
      } else {
        console.log("Error in supplier");
      }
    });
  }
 
  deleteSupplier(id: any, name: any): void {
    const options = {
      title: 'Delete Supplier',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('supplier/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Supplier Deleted Successfully!!", "Close");
              this.getSupplier();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(AddSupplierComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSupplier();
    });
  }
  editSupplier(id: any,name:any): void {

    const dialogRef = this.dialog.open(EditSupplierComponent, {
      width: '500px', data: { 'id': id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSupplier();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
 
}
