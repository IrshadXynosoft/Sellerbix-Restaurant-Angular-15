import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddReceiptDialogComponent } from '../add-receipt-dialog/add-receipt-dialog.component';

export interface expenseCategory {
  id: any;
  name: string;
  category_id: any;
  reference: any;
  description: any;
  date: any;
  amount: any;
}

@Component({
  selector: 'app-not-approved-receipt',
  templateUrl: './not-approved-receipt.component.html',
  styleUrls: ['./not-approved-receipt.component.scss']
})
export class NotApprovedReceiptComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['categoryname', 'reference', 'description', 'date', 'price', 'approval', 'createdby', 'actions'];
  public dataSource = new MatTableDataSource<expenseCategory>();
  expenseRecords: any = [];
  notapprovedledger: any = 0;
  approvedledger: any = 0;
  constructor(private snackBService: SnackBarService, private dialogService: ConfirmationDialogService, private httpService: HttpServiceService, public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getExpenseCategory();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getExpenseCategory() {
    this.httpService.get('receipts/2')
      .subscribe(result => {
        if (result.status == 200) {
          let notapprovedcategory = [];
          this.expenseRecords = [];
          // notapprovedcategory =result.data.categories;
          // notapprovedcategory.forEach((obj:any) => {
          //   if(obj.status == 0){
          //     this.expenseRecords.push(obj)
          //   }
          // });
          this.expenseRecords = result.data.categories;
          const data: any = [];
          this.expenseRecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              category_id: obj.expense_category_id,
              date: obj.date,
              amount: obj.amount,
              reference: obj.reference,
              name: obj.name,
              description: obj.description,
              approval: obj.status,
              user: obj.user
            }
            data.push(objData)
          });
          this.dataSource.data = data as expenseCategory[];
          this.checkApprovedStatus()
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  checkApprovedStatus() {
    this.approvedledger = 0;
    this.notapprovedledger = 0;
    this.expenseRecords.forEach((item: any) => {
      if (item.status == 1) {
        this.approvedledger++;
      } else {
        this.notapprovedledger++;
      }
    });
  }

  back() {
    this.router.navigate(['accounts'])
  }

  addexpense() {
    const dialogRef = this.dialog.open(AddReceiptDialogComponent, {
      width: '500px',
      data: {
        operation: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseCategory();
    });
  }

  statusChange(value: any, id: any) {

    let body = {
      status: value == true ? 1 : 0
    }
    this.httpService.post('update-expense-status/' + id, body)
      .subscribe(result => {
        if (result.status == 200) {
          this.snackBService.openSnackBar(result.message, "Close");
          this.getExpenseCategory();
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  doFilter(value: any) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  deleteExpenseCategory(id: any, name: any) {
    const options = {
      title: 'Delete',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('expense' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.getExpenseCategory();
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }

  editCategory(categoryid: any) {
    const dialogRef = this.dialog.open(AddReceiptDialogComponent, {
      width: '500px',
      data: {
        operation: 'edit',
        id: categoryid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getExpenseCategory();
    });
  }

}
