import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { LocalStorage } from 'src/app/_services/localstore.service';
@Component({
  selector: 'app-food-costing-report',
  templateUrl: './food-costing-report.component.html',
  styleUrls: ['./food-costing-report.component.scss']
})
export class FoodCostingReportComponent implements OnInit {
  recipeCostArray: any = [];
  subRecipeCostArray: any = [];
  categoriesCostArray: any = [];
 
  current_page_subrecipe: any = 1;
  last_page_subrecipe: any = 1;
  current_page_categories: any = 1;
  last_page_categories: any = 2;
  recipeArray:any=[];
  menuItem_filteredOptions: Observable<any[]> | undefined;
  menuItemArray: any = []
  menuItemData = new UntypedFormControl();
  list_options: any = []
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle1 = 300;
  scrollDistance1 = 1;
  scrollUpDistance1 = 2;
  direction = '';
  scrolledData: any = [];
  start: number = 0;
  current_page: any = 1;
  last_page: number = 1;
  processingResponseStr = "";
  constructor(private httpService: HttpServiceService, private snackBService: SnackBarService,private localStorage:LocalStorage) { }

  ngOnInit(): void {
    this.getRecipeCosts(this.current_page);
   //this.getMenuItem();
     this.menuItem_filteredOptions = this.menuItemData.valueChanges.pipe(
      startWith(''),
      map(value => this._filtermenulist(value)),
    );
  }
  private _filtermenulist(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.list_options.filter((option: any) => option.name.toString().toLowerCase().includes(filterValue));
  }
  itemFilter(filterText: any) {
   this.list_options=[];
    // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
    if (filterText.length > 2) {
      this.list_options=[];
      this.httpService.get('autocomplete_search_for_recipeOrModifierInventory/' + filterText)
        .subscribe(result => {
          if (result.status == 200) {
             if (result.data.length > 0) {
              this.list_options=result.data }
              else{
                this.snackBService.openSnackBar('No Data Found','Close')
              }
          } 
        });
    }
   
  }
   
  menuItemSelected(item:any , input: HTMLInputElement) {
    //4-recipe,5-modofier
    let type= item.type==='recipe'?4:5
    let id=type==4?item.recipe_id:item.modifier_id;
    if(id){
      this.httpService.get('reports/recipe-costing-report/'+id+'/'+type)
      .subscribe(result => {
        if (result.status == 200) {
          this.recipeCostArray=result.data
          } else {
          console.log("Error");
        }
      });
    }
    else{
      this.snackBService.openSnackBar('No Data Found',"Close")
    }
    input.value = '';
    input.blur();
    this.list_options=[];
  }
  reset() {
    this.recipeCostArray = [];
    this.current_page = 1;
    this.last_page = 2;
  }
  resetSubrecipeArray(){
    this.subRecipeCostArray=[];
    this.current_page_subrecipe=1;
    this.last_page_subrecipe=2;
  }
  resetCategoriesArray(){
    this.categoriesCostArray=[];
    this.current_page_categories=1;
    this.last_page_categories=2;
  }
  getRecipeCosts(page_number:any) {
    
    this.httpService.post('reports/recipe-costing-report?page=' + page_number,null)
      .subscribe(async result => {
        if (result.status == 200) {
          this.current_page = result.data.current_page;
          this.last_page = result.data.last_page;
          if (result.data.data.length > 0) {

            if (page_number == 1) {
              this.recipeCostArray = result.data.data;
            } else {
              result.data.data.forEach(async (obj: any) => {
                this.recipeCostArray.push(obj)
              });
            }
           
          }
          else {
          console.log("Error");
        }
      }});
  }

  getSubrecipeCosts(page_number:any) {
   
    this.httpService.post('reports/sub-recipe-costing-report?page=' + page_number, null)
    .subscribe(async (result) => {
      if (result.status == 200) {

        this.current_page_subrecipe = result.data.current_page;
        this.last_page_subrecipe = result.data.last_page;
        if (result.data.data.length > 0) {

          if (page_number == 1) {
            this.subRecipeCostArray = result.data.data;
          } else {
            result.data.data.forEach(async (obj: any) => {
              this.subRecipeCostArray.push(obj)
            });
          }
         
        }
        else {
        console.log("Error");
      }

       
      }
     
    });
  }
  async pushToRecipeArray(params: any) {
    params.forEach(async (obj: any) => {
      this.recipeCostArray.push(obj);
     });
    
  }
  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getRecipeCosts(this.current_page);
      this.direction = 'down';
    }
  }
  onScrollDownSubRecipe(ev: any) {
    this.current_page_subrecipe = this.current_page_subrecipe + 1;
    if (this.current_page_subrecipe <= this.last_page_subrecipe) {
      this.getSubrecipeCosts(this.current_page_subrecipe);
      this.direction = 'down';
    }
  }
  async getIteratedData( initializeCurrentPage = true) {
    if (initializeCurrentPage) {
      this.current_page = 2;
    }
    // for (this.current_page = 2;this.current_page <= this.last_page; this.current_page++) {
    this.httpService
      .post('reports/recipe-costing-report?page=' + this.current_page, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.data.length > 0) {
            await this.pushToRecipeArray(result.data.data);
          
          }
        }
        if (this.current_page < this.last_page) {
          this.current_page++;
          this.getIteratedData( false);
        }
      });
    // }
  }
 
  async pushToSubRecipeArray(params: any) {
    params.forEach(async (obj: any) => {
      this.subRecipeCostArray.push(obj);
     });
    
  }
  async getIteratedSubRecipeData( initializeCurrentPage = true) {
    if (initializeCurrentPage) {
      this.current_page_subrecipe = 2;
    }
    // for (this.current_page = 2;this.current_page <= this.last_page; this.current_page++) {
    this.httpService
      .post('reports/sub-recipe-costing-report?page=' + this.current_page_subrecipe, false)
      .subscribe(async (result) => {
        if (result.status == 200) {
          if (result.data.data.length > 0) {
            await this.pushToSubRecipeArray(result.data.data);
          
          }
        }
        if (this.current_page_subrecipe < this.last_page_subrecipe) {
          this.current_page_subrecipe++;
          this.getIteratedSubRecipeData( false);
        }
      });
    // }
  }
  getCategoryCosts() {
    this.httpService.get('reports/category-costing-report')
      .subscribe(result => {
        if (result.status == 200) {

        } else {
          console.log("Error");
        }
      });
  }
  tabClick(tab: any) {
   
    switch (tab.index) {
      case 0:
        this.current_page=1;
        this.getRecipeCosts(this.current_page);
        break;
      case 1:
        this.current_page_subrecipe=1;
        this.getSubrecipeCosts(this.current_page_subrecipe);
      //   break;
      // case 2:
      //   this.getCategoryCosts();

    }
  }
}
