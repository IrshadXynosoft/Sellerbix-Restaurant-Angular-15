import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

import { Units } from '../measurement-units/measurement-units.model';
import { AddUtilitiesComponent } from '../add-utilities/add-utilities.component';


@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})
export class UtilitiesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'button'];
  public dataSource = new MatTableDataSource<Units>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService ) { }

  ngOnInit(): void {
    this.getUtilities();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
  getUtilities()
  {
    this.httpService.get('utility')
    .subscribe(result => {
      if (result.status == 200) {
       const data:any = [];
        let utilityArray = result.data;
        this.dataSource.data = utilityArray as Units[];  
      } else {
        console.log("Error in utility");
      }
    });
  }
 

  add(): void {
    const dialogRef = this.dialog.open(AddUtilitiesComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUtilities();
    });
  }
  editUtilities(id: any): void {

    const dialogRef = this.dialog.open(AddUtilitiesComponent, {
      width: '500px', data: { 'id': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUtilities();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
 
}
