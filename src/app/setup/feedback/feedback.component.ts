import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Coupons } from '../coupon/coupon.component';
import { AddFeedbackComponent } from '../add-feedback/add-feedback.component';
import { EditFeedbackComponent } from '../edit-feedback/edit-feedback.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  currency_symbol = localStorage.getItem('currency_symbol');
  public displayedColumns: string[] = ['index', 'question', 'button'];
  public dataSource = new MatTableDataSource<Coupons>();
  branch_id: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dialogService: ConfirmationDialogService,
    private route: ActivatedRoute
  ) {
    this.branch_id = this.route.snapshot.params.id;
  }
  ngOnInit(): void {
    this.getFeedback();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getFeedback() {
    this.httpService.get('branch-feedback-form').subscribe((result) => {
      if (result.status == 200) {
        this.dataSource.data =  result.data as Coupons[];
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }
  timeCheck(time: any) {
    let newTime = moment(time, 'h:mm:ss a').format('h:mm:ss a');
    return newTime;
  }
  dateFormat(day: any) {
    let newDate = moment(day).format('DD MMM YY');
    return newDate;
  }
  back() {
    this.router.navigate(['setup/' + this.branch_id + '/editLocation']);
  }
  addFeedback(): void {
    const dialogRef = this.dialog.open(AddFeedbackComponent, {
      width: '1200px',
      data: { branch_id: this.branch_id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getFeedback();
    });
  }
  editFeedback(element: any): void {
    console.log(element);
    
    const dialogRef = this.dialog.open(EditFeedbackComponent, {
      width: '1200px',
      data: { editData:element },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getFeedback();
    });
  }

  deleteFeedback(element:any) {
    const options = {
      title: 'Delete Feedback' ,
      message: 'Are you sure to delete '  + element.question + '?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('branch-feedback-form/' +element.id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.getFeedback()
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    });
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
