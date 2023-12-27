import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddCustomerGroupComponent } from '../add-customer-group/add-customer-group.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { EditCustomerGroupComponent } from '../edit-customer-group/edit-customer-group.component';
export interface CustomerGroup{
  id:any,
  name:any,
}
@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.scss']
})
export class CustomerGroupComponent implements OnInit {
  @ViewChild("customerTable", { read: MatPaginator,static: false })
  set pagination(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  public displayedColumns: string[] = ['index','name','button'];
  public dataSource = new MatTableDataSource<CustomerGroup>();
  getrecords:any=[];
  constructor(private router: Router, public dialog: MatDialog,private httpService: HttpServiceService,private snackBService: SnackBarService,private dialogService:ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getCustomerGroups();
  }
  getCustomerGroups()
  {
    this.httpService.get('customer-group')
    .subscribe(result => {
      if (result.status == 200) {
        this.getrecords = result.data.customer_groups;
        const data:any = [];
        this.getrecords.forEach((obj: any) =>{
          let objData = {
            id: obj.id,
            name:obj.name
          }
          data.push(objData)
        });
        this.dataSource.data = data as CustomerGroup[];
      } else {
        console.log("Error");
      }
    });
  }
 
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
  addCustomerGroup(): void {
    const dialogRef = this.dialog.open(AddCustomerGroupComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerGroups();
    });
  }
  deleteCustomerGroup(id:any,name:any){
    const options = {
      title: 'Delete Customer Group',
      message: 'Delete '+name+'?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('customer-group' + '/' + id )
        .subscribe(result => {
          if (result.status == 200) {
            this.snackBService.openSnackBar("Deleted Successfully!!", "Close");
            this.getCustomerGroups();
          } else {
            this.snackBService.openSnackBar(result.message, "Close");
            console.log("Error");
          }
        });
      }
    });
   
  }
  
  editCustomerGroup(id:any): void {
    const dialogRef = this.dialog.open(EditCustomerGroupComponent, {
      width: '500px',
      data:{id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCustomerGroups();
    });
  }
  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
