import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadIngredientComponent } from '../upload-ingredient/upload-ingredient.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { FinishedGoods } from './finished-goods.model';
import { DeleteInventoryItemComponent } from '../delete-inventory-item/delete-inventory-item.component';
@Component({
  selector: 'app-finished-goods',
  templateUrl: './finished-goods.component.html',
  styleUrls: ['./finished-goods.component.scss']
})
export class FinishedGoodsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public displayedColumns: string[] = ['index','name','unit_name','cost_per_unit','supplier','is_track_inventory','button'];
  public dataSource = new MatTableDataSource<FinishedGoods>();
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
   constructor(private router: Router,public dialog: MatDialog,private httpService: HttpServiceService, private snackBService: SnackBarService,private dialogService:ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getFinishedGood(this.current_page);
    
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onScrollDown(ev: any) {
    this.current_page = this.current_page + 1;
    if (this.current_page <= this.last_page) {
      this.getFinishedGood(this.current_page);
      this.direction = 'down';
    }
  }
  getFinishedGood(page_number: any)  {
    this.httpService.get('finished-good?page=' + page_number)
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
          this.dataSource.data = this.ingredientArray as FinishedGoods[];
      }}
     else {
        console.log("Error in ingredient");
      }
    });
  }
  

  
  upload(): void {
    const dialogRef = this.dialog.open(UploadIngredientComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  deleteIngredient(id: any, name: any): void {
    const dialogRef = this.dialog.open(DeleteInventoryItemComponent, {
      data:{id:id,name:name,delete_url:'finished-good/'+id}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  back() {
    this.router.navigate(['setup/inventorySetup'])
  }
  add() {
    this.router.navigate(['setup/inventorySetup/finishedGoods/add']) 
  }

  doFilter(filterText: any) {
    if(filterText.length==0){
      this.dataSource.data = this.ingredientArray as FinishedGoods[];
    }
   // this.dataSource.filter = filterText.trim().toLocaleLowerCase();
   if(filterText.length>2){
    
    this.httpService.get('finishedgood-list-by-search/'+filterText)
    .subscribe(result => {
      if (result.status == 200) {
          this.Options=result.data
      } else {
        this.snackBService.openSnackBar('No Finished Good Found','Close')
      }
    });
   }
  }

  finishedGoodSelected(option:any){
    let finishedGoodListFromSearch: any = [];
    finishedGoodListFromSearch.push(option)
    this.dataSource.data = finishedGoodListFromSearch as FinishedGoods[];
    this.Options=[];
  }

}