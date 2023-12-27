import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddDeliveryEntitiesComponent } from '../add-delivery-entities/add-delivery-entities.component';
import { AddMeasurementUnitComponent } from '../add-measurement-unit/add-measurement-unit.component';
import { EditDeliveryEntitiesComponent } from '../edit-delivery-entities/edit-delivery-entities.component';
import { EditMeasurementUnitsComponent } from '../edit-measurement-units/edit-measurement-units.component';
import { Units } from '../measurement-units/measurement-units.model';

@Component({
  selector: 'app-delivery-entities',
  templateUrl: './delivery-entities.component.html',
  styleUrls: ['./delivery-entities.component.scss']
})
export class DeliveryEntitiesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'button'];
  public dataSource = new MatTableDataSource<Units>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService ) { }

  ngOnInit(): void {
    this.getDeliveryEntities();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
  getDeliveryEntities()
  {
    this.httpService.get('entities')
    .subscribe(result => {
      if (result.status == 200) {
       const data:any = [];
        let categoryArray = result.data;
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
              this.getDeliveryEntities();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  add(): void {
    const dialogRef = this.dialog.open(AddDeliveryEntitiesComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryEntities();
    });
  }
  editMeasurementUnits(id: any,name:any): void {

    const dialogRef = this.dialog.open(EditDeliveryEntitiesComponent, {
      width: '500px', data: { 'id': id,'name':name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryEntities();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
 
}
