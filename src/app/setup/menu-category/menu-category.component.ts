import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AddMenuCategoryComponent } from '../add-menu-category/add-menu-category.component';
import { EditMenuCategoryComponent } from '../edit-menu-category/edit-menu-category.component';
import { Constants } from 'src/constants';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CategoryDeleteConfirmationComponent } from '../category-delete-confirmation/category-delete-confirmation.component';
export interface Categories {
  id: number;
  name: any;
  priority: any;
  icons: any;
  status: any;
}
@Component({
  selector: 'app-menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss']
})
export class MenuCategoryComponent implements OnInit {
  categoryArray: any = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }
  @ViewChild('table') table!: MatTable<Categories>;
  public displayedColumns: string[] = ['index', 'icons', 'name', 'priority', 'status', 'button'];
  public dataSource = new MatTableDataSource<Categories>();
  imageBasePath = this.constant.imageBasePath;
  constructor(private dialogService: ConfirmationDialogService, private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, public constant: Constants,) {

  }

  ngOnInit(): void {
    this.getCategories();

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getCategories() {
    this.httpService.get('category')
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryArray = result.data.categories;
          const data: any = [];
          let iconPath = this.constant.imageBasePath + '/icons/'
          console.log(iconPath + this.categoryArray[0].icon_name);
          this.categoryArray.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
              priority: obj.priority,
              icons: obj.icon_name ? iconPath + obj.icon_name : "assets/images/ic_fastfood.png",
              status: obj.active,
              image_url: obj.image_url ,
            }
            data.push(objData)
          });
          this.dataSource.data = data as Categories[];
        } else {
          console.log("Error in get  category");
        }
      });
  }
  addCategories(): void {
    const dialogRef = this.dialog.open(AddMenuCategoryComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }
  back() {
    //this.router.navigate(['setup/globalSettings'])
    this.router.navigate(['setup/menuSetup'])
  }

  edit(id: any): void {
    const dialogRef = this.dialog.open(EditMenuCategoryComponent, {
      width: '1200px', data: { 'catId': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }

  SearchCategory(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  deleteCategory(element: any) {
    const options = {
      title: 'Delete',
      message: 'Delete ' + element.name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        const dialogRef = this.dialog.open(CategoryDeleteConfirmationComponent, {
          width: '500px',
          data: {
            id: element.id
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getCategories()
          }
        });
      }
    });
  }

  dropTable(event: CdkDragDrop<any>) {
    let newArray: Categories[] = [];
    moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);
    newArray = this.dataSource.data;
    this.dataSource.data = newArray as Categories[];
    let body = {
      filtered_array : event.container.data.filteredData
    }
    this.httpService.post('category-priority',body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.getCategories();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
          console.log("Error");
        }
      });
  }
}
