import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';

export interface Report {
  id: number;
  number: any;
  location:any;
  date : any;
  created: any;
  updated: any;
  completed: any;
  reconciled:any
}


@Component({
  selector: 'app-stock-takes',
  templateUrl: './stock-takes.component.html',
  styleUrls: ['./stock-takes.component.scss']
})
export class StockTakesComponent implements OnInit {
  branches:any=[];
  branch_name: any;
  branch_id:any;
  stockTakeArray:any=[];
  inCompleteStockTakeArray:any=[];
  underReviewStockTakeArray:any=[];
  completedStockTakeArray:any=[];
  public dataSourceinCompleteStockTakeArray = new MatTableDataSource<Report>();
  public dataSourceunderReviewStockTakeArray = new MatTableDataSource<Report>();
  public dataSourcecompletedStockTakeArray = new MatTableDataSource<Report>();
  public displayedColumnsInComplete: string[] = ['index', 'number', 'location','date', 'created', 'updated', 'button'];
  public displayedColumnsForUnderReview: string[] = ['index', 'number', 'location','date', 'created', 'updated', 'button'];
  public displayedColumnsForCompleted: string[] = ['index', 'number', 'location','date', 'created', 'completed','reconciled', 'button'];
  constructor(private formBuilder: UntypedFormBuilder,private router: Router,private httpService: HttpServiceService, private snackBService: SnackBarService,private localService:LocalStorage,private dialogService:ConfirmationDialogService,private route:ActivatedRoute) {
    this.branch_id=this.localService.get('branch_id');
    this.branch_name=this.localService.get('branchname')
   }

  ngOnInit(): void {
    this.getBranch();
    this.getStockTake();
  }

  getStockTake()
  {
    this.inCompleteStockTakeArray=[];
    this.underReviewStockTakeArray=[];
    this.completedStockTakeArray=[];
    this.httpService.get('get-stock-take-by-branch/' + this.branch_id)
    .subscribe(result => {
        this.stockTakeArray=result.data
        this.stockTakeArray.forEach((element:any) => {
         if(element.status==0){
           this.inCompleteStockTakeArray.push(element)
         
         }
         else if(element.status==1){
           this.underReviewStockTakeArray.push(element)

         }
         else if(element.status==2){
           this.completedStockTakeArray.push(element)
         }
       });
       this.dataSourceinCompleteStockTakeArray.data=this.inCompleteStockTakeArray;
       this.dataSourcecompletedStockTakeArray.data=this.completedStockTakeArray;
       this.dataSourceunderReviewStockTakeArray.data=this.underReviewStockTakeArray;
    });
  } 
  getStockTakeByBranch(id:any)
  {
      this.branch_id=id;
      this.getStockTake();
  }
  newStockTake() {
    this.router.navigate(['inventory/newStocktake/' + this.branch_id]);
  }

  getBranch() {
    this.httpService.get('branch',false)
    .subscribe(result => {
       this.branches = result.data.tenant_branches;
    });
  }
  reviewStockTake(item:any){
    this.router.navigate(['inventory/reviewStocktake/' + item.id]);
 
  }
 
  deleteStocktake(id:any,stock_take_number:any)
  {
      
    const options = {
      title: 'Delete Purchase Order',
      message: 'Delete ' + stock_take_number + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('stock-take/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("stock Take- "+ stock_take_number+" Deleted Successfully!!", "Close");
             this.getStockTake();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
  editStockTake(id:any){
    this.router.navigate(['inventory/editStocktake/' + id]);
  }
  viewStockTake(id:any){
    this.router.navigate(['inventory/viewStocktake/' + id]);
  }


}
