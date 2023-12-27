import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { exit } from 'process';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Recipe } from './recipe.model';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { MatDialog } from '@angular/material/dialog';
import { FoodCostCalculatorComponent } from '../food-cost-calculator/food-cost-calculator.component';
import { DeleteInventoryItemComponent } from '../delete-inventory-item/delete-inventory-item.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  public displayedColumns: string[] = ['index', 'item', 'cost', 'sale_price', 'profitability', 'button'];
  public dataSource = new MatTableDataSource<Recipe>();
  recipeData: any = [];
  recipeArray: any = [];
  menuItemArray: any = []
  menuItemData = new UntypedFormControl();
  list_options: any = []
  filteredOptions: Observable<any[]> | undefined;
  menuItem_filteredOptions: Observable<any[]> | undefined;
  currency_symbol = localStorage.getItem('currency_symbol');
  flagNewItem: boolean = false;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  current_page: any = 1;
  last_page: number = 1;
  processingResponseStr = "";
  menuItems:any=[];
  constructor(public dialog: MatDialog, private router: Router, private httpService: HttpServiceService, private snackBService: SnackBarService, private dialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    //this.getMenuItem();
    //this.getRecipe();
    this.getRecipePagination(this.current_page);
    this.menuItem_filteredOptions = this.menuItemData.valueChanges.pipe(
      startWith(''),
      map(value => this._filtermenulist(value)),
    );
  }
  private _filtermenulist(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.list_options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterText: any) {

    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {
      this.httpService.get('recipe-search/' + filterText)
        .subscribe(result => {
          if (result.status == 200) {
            let data: any = [];
            if (result.data.data.length > 0) {

              result.data.data.forEach(async (obj: any) => {
              data.push(obj)
              });
              this.dataSource.data = data as Recipe[];

            }
            else {
              this.dataSource.data = data as Recipe[];
            }
          } else {

            console.log("Error");
          }
        });
    }
    else {
      this.dataSource.data = this.recipeData as Recipe[];
    }
  }
  itemFilter(filterText: any) {
    this.menuItems=[];
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {
      this.httpService.get('autocomplete_search_for_recipeOrModifier/' + filterText)
        .subscribe(result => {
          if (result.status == 200) {
             if (result.data.length > 0) {

              this.menuItems=result.data

            }
           
          } else {

            console.log("Error");
          }
        });
    }
    else {
      this.dataSource.data = this.recipeData as Recipe[];
    }
  }
  add() {
    this.flagNewItem = true;
  }

  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getRecipePagination(this.current_page);
      this.direction = 'down';
    }
  }


  getRecipePagination(page_number: any) {

    this.httpService.get('recipe?page=' + page_number)
      .subscribe((result) => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;

          if (result.data.data.length > 0) {

            if (page_number == 1) {
              this.recipeData = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.recipeData.push(obj)
              });
            }
            this.dataSource.data = this.recipeData as Recipe[];
          }
        } else {
          console.log('Error');
        }
      });
  }

  menuItemSelected(item: any) {
    let isEdit: boolean = false
    let recipeId: any;
    // this.dataSource.data.forEach((objdata: any) => {
    //   if (objdata.item_id == item.id && objdata.type == item.type) {
    //     recipeId = objdata.id
    //     isEdit = true;
    //   }
    // });
    if(item.recipe_id || item.modifier_id){
      recipeId = item.recipe_id?item.recipe_id:item.modifier_id
      isEdit = true;
    }
    if (isEdit) {
      this.router.navigate(['setup/inventorySetup/recipes/edit/' + recipeId + '/' + item.name + '/' + item.type])
    }
    else {
      this.router.navigate(['setup/inventorySetup/recipes/add/' + item.id + '/' + item.name + '/' + item.default_price + '/' + item.type])
    }




  }
  back() {
    this.router.navigate(['setup/inventorySetup'])
  }

  costCalculator(element: any) {
    const dialogRef = this.dialog.open(FoodCostCalculatorComponent, {
      width: window.innerWidth+'px',
      data: {
        id: element.recipe_id ? element.recipe_id : element.modifier_id,
        type: element.recipe_id ? 'recipe' : 'modifier',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    // this.router.navigate(['setup/inventorySetup/recipes/foodCostCalculator/' + element.id + '/' + element.type])
  }

  deleteRecipe(id: any, name: any): void {

    const dialogRef = this.dialog.open(DeleteInventoryItemComponent, {
      data: { id: id, name: name, delete_url: 'recipe/' + id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
 
  exportExcel() {
    this.matTableExporter.exportTable('xlsx', { fileName: 'Recipes', sheet: 'recipes' });
  }

}
