import { Component, OnInit,AfterViewInit, ViewChild  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddReasonComponent } from '../add-reason/add-reason.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EditReasonComponent } from '../edit-reason/edit-reason.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Order{
  id:any,
  reason:any,
  entity_id:any
}
@Component({
  selector: 'app-order-cancellation',
  templateUrl: './order-cancellation.component.html',
  styleUrls: ['./order-cancellation.component.scss']
})
export class OrderCancellationComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['index','Reasons','button'];
  public dataSource = new MatTableDataSource<Order>();
  getrecords:any=[];
  recordsarray:any=[];
  constructor(private snackBService:SnackBarService,private httpService:HttpServiceService,private router: Router, public dialog: MatDialog,private dialogService:ConfirmationDialogService) { }
  
  ngOnInit(): void {
    this.getReasons();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getReasons(){
    this.httpService.get('cancellation-reason')
    .subscribe(result => {
      if (result.status == 200) {
        this.getrecords = result.data.cancellation_reasons;
        const data:any = [];
        this.getrecords.forEach((obj: any) =>{
          let objData = {
            id: obj.id,
            reason:obj.reason,
            entity_id:obj.entity_id
          }
          data.push(objData)
        });
        this.dataSource.data = data as Order[];
      } else {
        console.log("Error");
      }
    });
  }
  deleteReason(id:any){
    const options = {
      title: 'Delete Cancellation Reason',
      message: 'Delete ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('cancellation-reason' + '/' + id )
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Deleted Successfully!!", "Close");
            this.getReasons();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
            console.log("Error");
          }
        });
      }
    });
   
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addReason(): void {
    const dialogRef = this.dialog.open(AddReasonComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getReasons();
    });
  }
  editReason(id:any,reason:any,entity_id:any): void {
    const dialogRef = this.dialog.open(EditReasonComponent, {
      width: '500px',
      data:{ 
        id: id,
        reason: reason,
        entity_id:entity_id==1?'normal':'online'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getReasons();
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
