import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadIngredientComponent } from '../upload-ingredient/upload-ingredient.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Ingredients } from './ingredient.model';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DeleteInventoryItemComponent } from '../delete-inventory-item/delete-inventory-item.component';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'name', 'category', 'unit_name', 'cost_per_unit', 'supplier', 'supplier_unit', 'supplier_price', 'is_track_inventory', 'button'];
  public dataSource = new MatTableDataSource<Ingredients>();
  categoryArray: any = []
  IngredientData: any = [];
  ingredientArray: any = [];
  Options: any = [];
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  current_page: any = 1;
  last_page: number = 1;
  current_page_search: any = 1;
  last_page_search: number = 1;
  category_id:any=0;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private dialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.geCategories();
    this.getIngredients(this.current_page);

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onScrollDown(ev: any) {
    if(this.category_id==0){
      this.current_page = this.current_page + 1;
      if (this.current_page <= this.last_page) {
        this.getIngredients(this.current_page);
        this.direction = 'down';
      }
     }
     else{
      this.current_page_search = this.current_page_search + 1;
      if (this.current_page_search <= this.last_page_search) {
        this.getIngredientsCatSearch(this.current_page_search);
        this.direction = 'down';
      }
     }
  }
  getIngredients(page_number: any) {
    this.httpService.get('ingredient-list?page=' + page_number)
      .subscribe(result => {
        if (result.status == 200) {

          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;

          if (result.data.data.length > 0) {

            if (page_number == 1) {
              this.ingredientArray = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.ingredientArray.push(obj)
              });
            }
            
            this.dataSource.data = this.ingredientArray as Ingredients[];

          }
        } else {
          console.log("Error in ingredient");
        }
      });
  }
  getIngredientsCatSearch(page_number:any)
  {     
    this.httpService.get('ingredient-list-by-category/'+this.category_id+'?page=' + page_number)
    .subscribe(result => {
      if (result.status == 200) {
        this.current_page = result.data.current_page;
        this.last_page = result.data.last_page;

        if (result.data.data.length > 0) {

          if (page_number == 1) {
            this.ingredientArray = result.data.data;
          } else {
            result.data.data.forEach(async (obj: any) => {
              this.ingredientArray.push(obj)
            });
          }
          this.dataSource.data = this.ingredientArray as Ingredients[];
      }else {
        this.dataSource.data =[];
      }}
      else {
        this.dataSource.data =[];
      }
    });
  }
  geCategories() {
    this.httpService.get('ingredient-category')
      .subscribe(result => {
        if (result.status == 200) {
          this.categoryArray = result.data.ingredient_category;

        } else {
          console.log("Error in category");
        }
      });
  }
  filterWithCategory(event: any) {
    let data:any=[];
    this.category_id=event.target.value;
     if(event.target.value == 0) {
       this.current_page=1;
       this.last_page=1;
       this.dataSource.data = data as Ingredients[];
       this.getIngredients(this.current_page);
     }else{
         
        this.current_page_search=1
        this.last_page_search=1
        this.getIngredientsCatSearch(this.current_page_search);
     
     
   }
  }
  IngredientSelected(option: any) {

    let ingredientListFromSearch: any = [];
    ingredientListFromSearch.push(option)
    this.dataSource.data = ingredientListFromSearch as Ingredients[];
    this.Options=[];
  }
  back() {
    this.router.navigate(['setup/inventorySetup'])
  }
  add() {
    this.router.navigate(['setup/inventorySetup/ingredient/add'])
  }
  upload(): void {
    const dialogRef = this.dialog.open(UploadIngredientComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  doFilter(filterText: any) {
    if (filterText.length == 0) {
      this.dataSource.data = this.ingredientArray as Ingredients[];
    }
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {

      this.httpService.get('ingredient-list-by-search/' + filterText)
        .subscribe(result => {
          if (result.status == 200) {
            this.Options = result.data
          } else {
            this.snackBService.openSnackBar('No Ingredient Found','Close')
          }
        });
    }
  }

  deleteIngredient(id: any, name: any): void {
    const dialogRef = this.dialog.open(DeleteInventoryItemComponent, {
      data: { id: id, name: name, delete_url: 'ingredient/' + id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  showDialog(name: any) {
    const options = {
      title: 'Delete Ingredient',
      message: 'Cannot delete.' + name + ',Ingredient used in recipe/finished good.',
      cancelText: 'Cancel',
      confirmText: 'OK'
    };
    this.dialogService.open(options);

  }
  trackConsumption(event: any, id: any) { }

  getUnit(data: any) {
    let buyingQty = data.unit_equals_measurement_unit;

    let uingsubqty = data.unit_equals_sub_unit;
    let quantity = buyingQty * uingsubqty
    if (quantity > 0) {
      return 1 + " " + data.buying_unit + '=' + quantity + " " + data.measurement_unit_name
    }
    else {
      return '1 ' + data.buying_unit + '=' + data.unit_equals_measurement_unit + data.measurement_unit_name;
    }

  }
}
