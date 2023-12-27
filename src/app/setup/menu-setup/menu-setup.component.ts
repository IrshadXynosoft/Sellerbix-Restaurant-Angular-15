import { SnackBarService } from './../../_services/snack-bar.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddMenuCategoryComponent } from '../add-menu-category/add-menu-category.component';
import { ManageMenuComponent } from '../manage-menu/manage-menu.component';
import { UploadMenuComponent } from '../upload-menu/upload-menu.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { EditMenuCategoryComponent } from '../edit-menu-category/edit-menu-category.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Menu } from './menu.model';
import { Constants } from 'src/constants';
import { DataService } from 'src/app/_services/data.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DeleteMenuComponent } from './delete-menu/delete-menu.component';

@Component({
  selector: 'app-menu-setup',
  templateUrl: './menu-setup.component.html',
  styleUrls: ['./menu-setup.component.scss']
})
export class MenuSetupComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'ProductInformation', 'code', 'ProductName', 'Status', 'priority', 'Price', 'button'];
  public dataSource = new MatTableDataSource<Menu>();
  categoryrecords: any = [];
  menuItemRecords: any = [];
  menuarray: any = [];
  categoryActive: any = 0;
  typeWiseFilter: any = this.dataservice.getData('getType') ? this.dataservice.getData('getType') : 0;//for filtering based on item type
  currency_symbol = localStorage.getItem('currency_symbol');
  constructor(private dialogService: ConfirmationDialogService, private snackBService: SnackBarService, private dataservice: DataService, public constant: Constants, private router: Router, public dialog: MatDialog, private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.getMenuCtegory();
    if (this.dataservice.getData('getType') || this.dataservice.getData('categoryActive')) {
      console.log(this.dataservice.getData('getType'));
      this.categoryChosen(this.dataservice.getData('categoryActive') ? this.dataservice.getData('categoryActive') : this.categoryActive);
    }
    else {
      this.getMenuItems();
    }

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getMenuCtegory() {
    this.httpService.get('category')
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryrecords = result.data.categories;
          this.categoryrecords.unshift({ 'id': 0, 'name': 'ALL' })
        } else {
          console.log("Error");
        }
      });
  }

  categoryChosen(id: any) {
    this.menuarray = [];
    this.menuItemRecords = [];
    this.categoryActive = id;
    if (id != 0) {
      this.httpService.get('items-all-by-category/' + id)
        .subscribe(result => {
          if (result.status == 200) {
            this.menuItemRecords = result.data.items;
            this.menuItemRecords.forEach((obj: any) => {
              let objData = {
                id: obj.id,
                name: obj.name,
                description: obj.description,
                default_price: obj.default_price,
                status: obj.status,
                image_url: obj.image_url,
                item_code: obj.item_code
              }
              this.menuarray.push(objData);
            });
            this.dataSource.data = this.menuarray as Menu[];
            this.menuChanged()
          } else {
            console.log("Error");
          }
        });
    }
    else {
      this.getMenuItems()
    }
  }

  getMenuItems() {
    this.httpService.get('item')
      .subscribe(result => {
        if (result.status == 200) {
          this.menuarray = []
          this.menuItemRecords = result.data.items;
          this.menuItemRecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              name: obj.name,
              description: obj.description,
              default_price: obj.default_price,
              status: obj.status,
              image_url: obj.image_url,
              priority: obj.priority,
              item_code: obj.item_code
            }
            this.menuarray.push(objData);
          });
          this.dataSource.data = this.menuarray as Menu[];
          this.menuChanged()
        } else {
          console.log("Error");
        }
      });
  }

  changePriority(input: any, id: any) {
    if (input.match('^[0-9]*$') && input != '') {
      let body = {
        id: id,
        priority: input
      }
      this.httpService.post('update-priority', body)
        .subscribe(result => {
          if (result.status == 200) {
            this.getMenuItems()
          } else {
            this.snackBService.openSnackBar(result.message, "Close")
          }
        });
    }
    else {
      this.snackBService.openSnackBar("Invalid Number", "Close")
    }
  }

  statusChange(event: any, id: any) {
    let body = {
      'id': id,
      'status': event.checked
    }
    this.httpService.post('update-status', body)
      .subscribe(result => {
        if (result.status == 200) {
          this.getMenuItems()
        } else {
          this.snackBService.openSnackBar(result.message, "Close")
        }
      });
  }

  menuChanged() {
    let data: any = [];
    if (this.typeWiseFilter == 0) {
      this.dataSource.data = this.menuarray as Menu[];
    } else {
      if (this.typeWiseFilter == 4) {
        this.menuItemRecords.forEach((obj: any) => {
          if (obj.status == 1) {
            data.push(obj)
          }
        });
      }
      else if (this.typeWiseFilter == 5) {
        this.menuItemRecords.forEach((obj: any) => {
          if (obj.status == 0) {
            data.push(obj)
          }
        });
      }
      else {
        this.menuItemRecords.forEach((obj: any) => {
          if (obj.item_type == this.typeWiseFilter) {
            data.push(obj)
          }
        });
      }
      this.dataSource.data = []
      this.dataSource.data = data as Menu[];
    }
  }



  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();


  }
  uploadMenu(): void {
    const dialogRef = this.dialog.open(UploadMenuComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  addCategory(): void {
    const dialogRef = this.dialog.open(AddMenuCategoryComponent, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMenuCtegory();
    });
  }
  editCategory(id: any) {
    const dialogRef = this.dialog.open(EditMenuCategoryComponent, {
      width: '1000px', data: { 'catId': id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getMenuCtegory();
    });
  }
  manage(): void {
    const dialogRef = this.dialog.open(ManageMenuComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  addMenuItem() {
    this.dataservice.setData('categoryActive', this.categoryActive);
    this.dataservice.setData('getType', this.typeWiseFilter)
    this.router.navigate(['setup/menuSetup/addNewMenuItem'])
  }
  edit(id: any) {
    this.dataservice.setData('categoryActive', this.categoryActive);
    this.dataservice.setData('getType', this.typeWiseFilter)
    this.router.navigate(['setup/menuSetup/editmenuItem/' + id])
  }
  back() {
    this.router.navigate(['setup/menuSetup'])
  }

  deleteItem(id: any, name: any) {
    const options = {
      title: 'Delete',
      message: 'Delete menu' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        const dialogRef = this.dialog.open(DeleteMenuComponent, {
          width: '500px',
          data: {
            id: id
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.getMenuItems()
          }
        });
      }
    });
  }

  copyItem(id: any) {
    this.dataservice.setData('categoryActive', this.categoryActive);
    this.dataservice.setData('getType', this.typeWiseFilter)
    this.router.navigate(['setup/copyMenu/' + id])
  }

}
