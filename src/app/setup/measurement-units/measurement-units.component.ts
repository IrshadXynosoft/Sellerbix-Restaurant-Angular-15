import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Units } from './measurement-units.model';
import { MatSort } from '@angular/material/sort';
import { EditIngredientCategoryComponent } from '../edit-ingredient-category/edit-ingredient-category.component';
import { EditMeasurementUnitsComponent } from '../edit-measurement-units/edit-measurement-units.component';
@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styleUrls: ['./measurement-units.component.scss']
})
export class MeasurementUnitsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'button'];
  public dataSource = new MatTableDataSource<Units>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService ) { }

  ngOnInit(): void {
    this.getUnits();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
  getUnits()
  {
    this.httpService.get('measurement-unit')
    .subscribe(result => {
      if (result.status == 200) {
       const data:any = [];
        let categoryArray = result.data.measurement_unit;
        categoryArray.forEach(function (obj:any) {
         let objData = {
            id: obj.id,
            name: obj.name,
            }
          data.push(objData)
        });
      this.dataSource.data = data as Units[];  
      } else {
        console.log("Error in unit");
      }
    });
  }
 
  deleteMeasurementUnits(id: any, name: any): void {
    const options = {
      title: 'Delete Measurement Unit',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('measurement-unit/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Measurement unit Deleted Successfully!!", "Close");
              this.getUnits();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(AddMeasurementUnitComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUnits();
    });
  }
  editMeasurementUnits(id: any,name:any): void {

    const dialogRef = this.dialog.open(EditMeasurementUnitsComponent, {
      width: '500px', data: { 'id': id,'name':name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUnits();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
 
}
