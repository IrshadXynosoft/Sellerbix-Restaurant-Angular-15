import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddExpenseCategoryComponent } from '../add-expense-category/add-expense-category.component';

export interface expenseCategory {
  id:any;
  name: string;
  description: string; 
}

@Component({
  selector: 'app-expense-categories',
  templateUrl: './expense-categories.component.html',
  styleUrls: ['./expense-categories.component.scss']
})
export class ExpenseCategoriesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['index','name','description','type','button'];
  public dataSource = new MatTableDataSource<expenseCategory>();
  expenseRecords:any =[];
  constructor(private snackBService: SnackBarService,private dialogService: ConfirmationDialogService,private httpService: HttpServiceService,private router: Router,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getExpenseCategory();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  back() {
    this.router.navigate(['accounts'])
  }

  getExpenseCategory() {
    this.httpService.get('expense-category')
      .subscribe(result => {
        if (result.status == 200) {
          this.expenseRecords = result.data.categories;
          const data: any = [];
          this.expenseRecords.forEach((obj: any) => {
            let objData = {
              id:obj.id,
              name: obj.name,
              description : obj.description,
              type:obj.type
            }
            data.push(objData)
          });
          this.dataSource.data = data as expenseCategory[];
        } else {
          console.log("Error");
        }
      });
  }

  addExpenseCategory(){
    const dialogRef = this.dialog.open(AddExpenseCategoryComponent, {
      width: '600px',
      data: {
        operation: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseCategory();
    });
  }

  doFilter(value:any) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  editCategory(categoryid:any){
    const dialogRef = this.dialog.open(AddExpenseCategoryComponent, {
      width: '600px',
      data: {
        operation: 'edit',
        id:categoryid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseCategory();
    });
  }

  deleteExpenseCategory(id:any, name:any) {
    const options = {
      title: 'Delete',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('expense-category' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Expense Category Deleted Successfully!!", "Close");
              this.getExpenseCategory();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
              console.log("Error");
            }
          });
      }
    });
  }
}
