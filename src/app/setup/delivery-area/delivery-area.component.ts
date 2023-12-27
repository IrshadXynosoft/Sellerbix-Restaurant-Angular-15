import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { AddDeliveryAreaComponent } from '../add-delivery-area/add-delivery-area.component';
import { EditDeliveryAreaComponent } from '../edit-delivery-area/edit-delivery-area.component';
import { UploadDeliveryAreaComponent } from '../upload-delivery-area/upload-delivery-area.component';
export interface DeliveryArea {
  id: number;
  name: any;
}
@Component({
  selector: 'app-delivery-area',
  templateUrl: './delivery-area.component.html',
  styleUrls: ['./delivery-area.component.scss']
})

export class DeliveryAreaComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'name', 'button'];
  public dataSource = new MatTableDataSource<DeliveryArea>();
  deliveryAreaRecords: any = [];
  id = this.localservice.get('branch_id');
  branch_id: any
  constructor(private router: Router, public dialog: MatDialog, private route: ActivatedRoute, private snackBService: SnackBarService, private httpService: HttpServiceService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private localservice: LocalStorage) {
    this.branch_id = this.localService.get('branch_id')
  }
  ngOnInit(): void {
    this.getDeliveryArea();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getDeliveryArea() {
    this.httpService.get('list-delivery-areas/' + this.id)
      .subscribe(result => {
        if (result.status == 200) {
          this.deliveryAreaRecords = result.data;
          const data: any = [];
          this.deliveryAreaRecords.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              name: obj.name,
            }
            data.push(objData)
          });
          this.dataSource.data = data as DeliveryArea[];

        } else {
          console.log("Error in get Delivery Area");
        }
      });
  }

  back() {
    this.router.navigate(['setup/delivery_settings'])
  }
  addArea(): void {
    const dialogRef = this.dialog.open(AddDeliveryAreaComponent, {

      width: '1500px', data: { branch_id: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryArea();
    });
  }
  uploadArea(): void {
    const dialogRef = this.dialog.open(UploadDeliveryAreaComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  editArea(id: any) {
    const dialogRef = this.dialog.open(EditDeliveryAreaComponent, {
      width: '1500px', data: { 'id': id, branch_id: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getDeliveryArea();
    });
  }
  deleteArea(id: any, name: any) {
    const options = {
      title: 'Delete Delivery Area',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('delivery-area/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Area Deleted Successfully!!", "Close");
              this.getDeliveryArea();
            } else {
              // this.snackBService.openSnackBar(result.message, "Close");
              if (result.data) {
                this.dialogService.close();
                this.deleteConfirmation(result.data,name)
              }
            }
          });
      }
    });
  }

  deleteConfirmation(id: any , name :any) {
    const options = {
      title: 'Delete Delivery Area',
      message: 'Area   ' + name + '  is used by customer.Are you sure to delete these delivery area ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        let body = {
          id: id,
          status: '1'
        }
        this.httpService.post('delete-delivery-area' , body)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Area Deleted Successfully!!", "Close");
              this.getDeliveryArea();
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
