import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Constants } from 'src/constants';
import { MatPaginator } from '@angular/material/paginator';
import { AddCategoryScheduleComponent } from '../add-category-schedule/add-category-schedule.component';
import { EditCategoryScheduleComponent } from '../edit-category-schedule/edit-category-schedule.component';

export interface Categories{
  id: number;
  name: any;
  priority:any;
  icons:any;
}

@Component({
  selector: 'app-category-schedule',
  templateUrl: './category-schedule.component.html',
  styleUrls: ['./category-schedule.component.scss']
})
export class CategoryScheduleComponent implements OnInit {
  categoryArray:any=[]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'button'];
  public dataSource = new MatTableDataSource<Categories>();
  constructor(private router: Router, public dialog: MatDialog,private httpService: HttpServiceService,private snackBService: SnackBarService,private constant: Constants,) {
   
   }
 
  ngOnInit(): void {
    this.getCategories();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getCategories(){
  
    this.httpService.get('schedule')
    .subscribe(result => {     
     
      if (result.status == 200) {
      this.categoryArray = result.data;
      const data:any = [];
      this.categoryArray.forEach(function (obj:any) {
       let objData = {
          id: obj.id,
          name:obj.name,
          }
        data.push(objData)
      });
     this.dataSource.data = data as Categories[];   
      } else {
        this.snackBService.openSnackBar(result.message,"")
      }
  }); 
  }
  addCategories(): void {
    const dialogRef = this.dialog.open(AddCategoryScheduleComponent, {
      width: '850px',
      maxHeight: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }
  back() {
    //this.router.navigate(['setup/globalSettings'])
    this.router.navigate(['setup/menuSetup'])
  }
  
  edit(id:any): void {
    const dialogRef = this.dialog.open(EditCategoryScheduleComponent, {
      width: '850px',      maxHeight: '700px',
      data:{'catId':id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }
  
  SearchCategory(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
