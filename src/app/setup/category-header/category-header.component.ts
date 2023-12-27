import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { AddCategoryHeaderComponent } from '../add-category-header/add-category-header.component';
import { EditCategoryHeaderComponent } from '../edit-category-header/edit-category-header.component';
export interface Category{
  id:any;
  name:any;
  from_date:any;
  to_date:any;
}
@Component({
  selector: 'app-category-header',
  templateUrl: './category-header.component.html',
  styleUrls: ['./category-header.component.scss']
})
export class CategoryHeaderComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name', 'from_date','to_date','status', 'button'];
  public dataSource = new MatTableDataSource<Category>();
  categoryHeaderData:any=[];
  id:any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
   }
  ngOnInit(): void {
    this.getCategoryHeader();
   
   }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getCategoryHeader() {
    this.httpService.get('online/category-header',false)
      .subscribe(result => {
        if (result.status == 200) {
         this.categoryHeaderData = result.data.category_header;
          const data:any = [];
          this.categoryHeaderData .forEach(function (obj:any) {
           let objData = {
                id:obj.id,
                name:obj.name,
                from_date:obj.from_date,
                to_date:obj.to_date,
                status:obj.status
              }
            data.push(objData)
          });
         this.dataSource.data = data as Category[];  
        } else {
          console.log("Error in category");
        }
      });
  }
  back() {
    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
  addCategoryheader(): void {
    const dialogRef = this.dialog.open(AddCategoryHeaderComponent, {
      width: '500px',data: { 'branch_id': this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategoryHeader();
    });
  }
  editCategory(id: any): void {

    const dialogRef = this.dialog.open(EditCategoryHeaderComponent, {
      width: '500px', data: { 'id': id,'branch_id': this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategoryHeader();
    });
  }
  deleteCategory(id: any, name: any): void {
    const options = {
      title: 'Delete Category Header',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('online/category-header/'+id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.data, "Close");
              this.getCategoryHeader();
            } else {
              this.snackBService.openSnackBar(result.data, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  statusChange(status:any,element:any){
    let body ={
    
    }
    this.httpService.put('', body)
    .subscribe(result => {
     if (result.status == 200) {
        this.snackBService.openSnackBar("Status updated successfully", "Close");
      } else {
      this.snackBService.openSnackBar(result.message, "Close");
      }
    });
  }
}
