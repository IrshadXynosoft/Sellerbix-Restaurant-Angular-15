import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSalesTaxComponent } from '../add-sales-tax/add-sales-tax.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { EditSalesTaxComponent } from '../edit-sales-tax/edit-sales-tax.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TaxRates } from './tax-rates.model';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { TaxSubstituteComponent } from '../tax-substitute/tax-substitute.component';
@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.scss']
})
export class TaxRatesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'name', 'rate', 'type', 'status', 'button'];
  public dataSource = new MatTableDataSource<TaxRates>();
  taxArray: any = []
  id: any;
  branch_id: any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
    this.branch_id = this.localService.get('branch_id')
  }
  ngOnInit(): void {
    this.getSalesTax();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getSalesTax() {
    this.httpService.get('get-tax-by-location/' + this.id, false)
      .subscribe(result => {
        if (result.status == 200) {
          this.taxArray = result.data;
          const data: any = [];
          let tax = result.data;
          tax.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.tax_name,
              rate: parseFloat(obj.rate).toFixed(2),
              is_default: obj.is_default,
              type: obj.type
            }
            data.push(objData)
          });
          this.dataSource.data = data as TaxRates[];
        } else {
          console.log("Error in tax");
        }
      });
  }
  back() {

    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }
  addTax(): void {
    const dialogRef = this.dialog.open(AddSalesTaxComponent, {
      width: '500px', data: { 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSalesTax();
    });
  }
  editTax(taxId: any): void {

    const dialogRef = this.dialog.open(EditSalesTaxComponent, {
      width: '500px', data: { 'taxId': taxId, 'branch_id': this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSalesTax();
    });
  }
  deleteTax(id: any, name: any): void {
    const options = {
      title: 'Delete Tax',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('tax/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("tax Deleted Successfully!!", "Close");
              this.getSalesTax();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }



  statusChange(status: any, element: any) {
    let body = {
      rate: element.rate,
      tax_name: element.name,
      is_default: status._checked
    }
    this.httpService.put('tax/' + element.id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar("Status updated successfully", "Close");
          const data: any = [];
          let tax = result.data;
          tax.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.tax_name,
              rate: parseFloat(obj.rate).toFixed(2),
              is_default: obj.is_default,
              type: obj.type
            }
            data.push(objData)
          });
          this.dataSource.data = data as TaxRates[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }
}
