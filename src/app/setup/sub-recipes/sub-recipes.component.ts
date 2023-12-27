import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadIngredientComponent } from '../upload-ingredient/upload-ingredient.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Ingredients } from './sub-recipes.model';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { DeleteInventoryItemComponent } from '../delete-inventory-item/delete-inventory-item.component';

@Component({
  selector: 'app-sub-recipes',
  templateUrl: './sub-recipes.component.html',
  styleUrls: ['./sub-recipes.component.scss']
})
export class SubRecipesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name','unit_name','cost_per_unit','category','button'];
  public dataSource = new MatTableDataSource<Ingredients>();
  categoryArray:any=[]
  IngredientData:any = [];
  ingredientArray:any=[];
  Options:any=[];
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
   constructor(private router: Router,public dialog: MatDialog,private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService) { }

  ngOnInit(): void {
    this.geCategories()
    this.getSubRecipe(this.current_page);
    
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

   onScrollDown(ev: any) {
   if(this.category_id==0){
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getSubRecipe(this.current_page);
      this.direction = 'down';
    }
   }
   else{
    this.current_page_search = this.current_page_search + 1;
    if (this.current_page_search <= this.last_page_search) {
      this.getSubRecipeCatSearch(this.current_page_search);
      this.direction = 'down';
    }
   }
  }
  getSubRecipe(page_number: any)
  {
    this.httpService.get('sub-recipe?page=' + page_number)
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
      }}else {
        console.log("Error in ingredient");
      }
    });
  }
  geCategories()
  {
    this.httpService.get('ingredient-category')
    .subscribe(result => {
      if (result.status == 200) {
       this.categoryArray = result.data.ingredient_category;
  
      } else {
        console.log("Error in category");
      }
    });
  }
  filterWithCategory(event:any) {
    let data:any=[];
   this.category_id=event.target.value;
    if(event.target.value == 0) {
      this.current_page=1;
      this.last_page=1;
      this.dataSource.data = data as Ingredients[];
      this.getSubRecipe(this.current_page);
    }else{
        
       this.current_page_search=1
       this.last_page_search=1
       this.getSubRecipeCatSearch(this.current_page_search);
    
    }
  }
  getSubRecipeCatSearch(page_number:any)
  {     
    this.httpService.get('subrecipe-list-by-category/'+this.category_id+'?page=' + page_number)
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
  back() {
    this.router.navigate(['setup/inventorySetup'])
  }
  add() {
    this.router.navigate(['setup/inventorySetup/subrecipes/add'])
  }
  upload(): void {
    const dialogRef = this.dialog.open(UploadIngredientComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  doFilter(filterText: any) {
    if(filterText.length==0){
      this.dataSource.data = this.ingredientArray as Ingredients[];
    }
   // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
   if(filterText.length>2){
    
    this.httpService.get('subrecipe-list-by-search/'+filterText)
    .subscribe(result => {
      if (result.status == 200) {
          this.Options=result.data
      } else {
        this.snackBService.openSnackBar('No Sub Recipe Found','Close')
      }
    });
   }
  }
  
  deleteSubRecipe(id: any, name: any): void {
    const dialogRef = this.dialog.open(DeleteInventoryItemComponent, {
      data:{id:id,name:name,delete_url:'sub-recipe/'+id}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  

  subRecipeSelected(option:any){
    let subRecipeFromSearch: any = [];
    subRecipeFromSearch.push(option)
    this.dataSource.data = subRecipeFromSearch as Ingredients[];
    this.Options=[];

  }
}
