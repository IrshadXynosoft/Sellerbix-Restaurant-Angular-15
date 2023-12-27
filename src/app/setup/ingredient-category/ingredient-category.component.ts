import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddIngredientCategoryComponent } from '../add-ingredient-category/add-ingredient-category.component';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientsCategory } from './ingredient-category.model';
import { EditIngredientCategoryComponent } from '../edit-ingredient-category/edit-ingredient-category.component';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-ingredient-category',
  templateUrl: './ingredient-category.component.html',
  styleUrls: ['./ingredient-category.component.scss']
})
export class IngredientCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name','button'];
  public dataSource = new MatTableDataSource<IngredientsCategory>();
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService ) { }

  ngOnInit(): void {
    this.getInventoryCategory();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
  getInventoryCategory()
  {
    this.httpService.get('ingredient-category')
    .subscribe(result => {
      if (result.status == 200) {
       const data:any = [];
        let categoryArray = result.data.ingredient_category;
        categoryArray.forEach(function (obj:any) {
         let objData = {
            id: obj.id,
            name: obj.name,
            }
          data.push(objData)
        });
      this.dataSource.data = data as IngredientsCategory[];  
      } else {
        console.log("Error in category");
      }
    });
  }
 
  deleteIngredientCategory(id: any, name: any): void {
    const options = {
      title: 'Delete Ingredient Category',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('ingredient-category/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Category Deleted Successfully!!", "Close");
              this.getInventoryCategory();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  addIngredientCategory(): void {
    const dialogRef = this.dialog.open(AddIngredientCategoryComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getInventoryCategory();
    });
  }
  editIngredientCategory(id: any,name:any): void {

    const dialogRef = this.dialog.open(EditIngredientCategoryComponent, {
      width: '500px', data: { 'id': id,'name':name }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getInventoryCategory();
    });
  }
  doFilter(filterValue:any)
  {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
