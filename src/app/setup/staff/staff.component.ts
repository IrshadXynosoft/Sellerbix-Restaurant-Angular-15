import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/_services/http-service.service';
import { AddNewStaffRoleComponent } from '../add-new-staff-role/add-new-staff-role.component';
import { AddNewStaffComponent } from '../add-new-staff/add-new-staff.component';
import { StaffEditComponent } from '../staff-edit/staff-edit.component';
import { StaffHistoryComponent } from '../staff-history/staff-history.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from 'src/app/_services/snack-bar.service';
import { Staff } from './staff.model';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { EditStaffRoleComponent } from '../edit-staff-role/edit-staff-role.component';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'name', 'role_id', 'tenant_id', 'email', 'status', 'button'];
  public dataSource = new MatTableDataSource<Staff>();
  staffAllrecords: any = [];
  staffRoleArray: any = [];
  staffSortedArray: any = [];
  branch_id = this.localservice.get('branch_id');
  constructor(private localservice: LocalStorage, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private dialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.getStaffDetails();
    this.getStaffRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getStaffDetails() {
    this.httpService.get('staff')
      .subscribe(result => {
        if (result.status == 200) {
          this.staffAllrecords = result.data.staffs;
          const data: any = [];
          this.staffAllrecords.forEach((obj: any) => {
            let objData = {
              id: obj.id,
              swipe_card_no: obj.swipe_card_no,
              name: obj.user.name,
              role_id: obj.user.role?.name,
              tenant_id: obj.user.branch.name,
              email: obj.user.email,
              contact_no: obj.user.contact_no,
              user_id: obj.user_id,
              status: obj.status
            }
            data.push(objData)
          });
          this.staffSortedArray = data as Staff[];
          this.dataSource.data = data as Staff[];
        } else {
          console.log("Error");
        }
      });
  }

  roleChanged(event: any) {
    let data: any = [];
    if (event.target.value == 0) {
      this.dataSource.data = this.staffSortedArray as Staff[];
    } else {
      this.staffAllrecords.forEach((obj: any) => {
        if (obj.user.role_id == event.target.value) {
          let objData = {
            id: obj.id,
            swipe_card_no: obj.swipe_card_no,
            name: obj.user.name,
            role_id: obj.user.role.name,
            tenant_id: obj.user.branch.name,
            email: obj.user.email,
            contact_no: obj.user.contact_no,
            user_id: obj.user_id
          }
          data.push(objData);
        }
      });
      this.dataSource.data = []
      this.dataSource.data = data as Staff[];
    }
  }

  getStaffRoles() {
    this.httpService.get('role')
      .subscribe(result => {
        if (result.status == 200) {
          this.staffRoleArray = result.data.roles;
        } else {
          console.log("Error in staff role");
        }
      });
  }
  editstaff(id: any, user_id:any,card_no: any, email: any, tenant: any, role: any, name: any, number: any): void {
    const dialogRef = this.dialog.open(StaffEditComponent, {
      width: '700px',
      data: {
        id: id,
        swipe_card_no: card_no,
        email: email,
        tenant_id: tenant,
        role_id: role,
        name: name,
        number: number,
        user_id:user_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStaffDetails();
    });
  }
  editStaffRole(role_id: any) {
    const dialogRef = this.dialog.open(EditStaffRoleComponent, {
      width: '850px',
      data: {
        id: role_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStaffDetails();
    });
  }
  deleteStaff(id: any, name: any) {
    const options = {
      title: 'Delete Staff',
      message: 'Delete ' + name + ' ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('staff' + '/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar("Staff Deleted Successfully!!", "Close");
              this.getStaffDetails();
            } else {
              this.snackBService.openSnackBar("Unable to delete", "Close");
              console.log("Error");
            }
          });
      }
    });
  }

  history(id: any, userName: any): void {
    const dialogRef = this.dialog.open(StaffHistoryComponent, {
      width: '500px', data: { user_id: id, user_name: userName }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStaffDetails();
    });
  }


  addNewStaff(): void {
    const dialogRef = this.dialog.open(AddNewStaffComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStaffDetails();
    });
  }
  addNewStaffRole(): void {
    const dialogRef = this.dialog.open(AddNewStaffRoleComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStaffDetails();
      this.getStaffRoles();
    });
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

}
