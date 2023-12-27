import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddModifyReasonComponent } from '../add-modify-reason/add-modify-reason.component';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { EditModifyReasonComponent } from '../edit-modify-reason/edit-modify-reason.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Modifyreasons{
  id:any,
  reason:any,
}
@Component({
  selector: 'app-order-modify-reasons',
  templateUrl: './order-modify-reasons.component.html',
  styleUrls: ['./order-modify-reasons.component.scss']
})
export class OrderModifyReasonsComponent implements OnInit, AfterViewInit {
  getModifiedReasons:any=[];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  constructor(private snackBService:SnackBarService,private httpService:HttpServiceService,private router: Router, public dialog: MatDialog,private dialogService:ConfirmationDialogService) { }
  public displayedColumns: string[] = ['index','Reasons','button'];
  public dataSource = new MatTableDataSource<Modifyreasons>();
  ngOnInit(): void {
    this.getModifiedreasons();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  getModifiedreasons(){
    this.httpService.get('modify-reason')
    .subscribe(result => {
      if (result.status == 200) {
        this.getModifiedReasons = result.data.modifier_reasons;
        const data:any = [];
        this.getModifiedReasons.forEach((obj: any) =>{
          let objData = {
            id: obj.id,
            reason:obj.reason
          }
          data.push(objData)
        });
        this.dataSource.data = data as Modifyreasons[];
      } else {
        console.log("Error");
      }
    });
  }
  deleteReason(id:any){
    const options = {
      title: 'Delete Modify Reason',
      message: 'Delete ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('modify-reason' + '/' + id )
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Deleted Successfully!!", "Close");
            this.getModifiedreasons();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
            console.log("Error");
          }
        });
      }
    });
    
  }
  editReason(id:any,reason:any): void {
    const dialogRef = this.dialog.open(EditModifyReasonComponent, {
      width: '500px',
      data:{ 
        id: id,
        reason: reason,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getModifiedreasons();
    });
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addReason(): void {
    const dialogRef = this.dialog.open(AddModifyReasonComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getModifiedreasons();
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}
