import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from "../../_services/http-service.service";
import { SnackBarService } from '../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { SendPushNotificationDialogComponent } from '../send-push-notification-dialog/send-push-notification-dialog.component';
import moment from 'moment';

export interface Notifications {
  id: any;
  name: any;
}
@Component({
  selector: 'app-send-push-notification',
  templateUrl: './send-push-notification.component.html',
  styleUrls: ['./send-push-notification.component.scss']
})
export class SendPushNotificationComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public displayedColumns: string[] = ['index', 'title', 'message', 'delivered_count', 'resend_count', 'created_at', 'updated_at', 'buttons'];
  public dataSource = new MatTableDataSource<Notifications>();
  bannerData: any = [];
  id: any;
  constructor(private router: Router, public dialog: MatDialog, private httpService: HttpServiceService, private snackBService: SnackBarService, private localService: LocalStorage, private dialogService: ConfirmationDialogService, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }
  ngOnInit(): void {
    this.getHistory();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  back() {
    this.router.navigate(['setup/location/' + this.id + '/online'])
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  dayCheck(day: any) {
    let newDate = moment(day).format("DD-MM-YYYY");
    return newDate;
  }

  getHistory() {
    this.httpService.get('customer-push-notification')
      .subscribe(result => {
        if (result.status == 200) {
          const data: any = [];
          result.data.notifications.forEach(function (obj: any) {
            let objData = {
              id: obj.id,
              title: obj.title,
              message: obj.message,
              delivered_count: obj.delivered_count,
              created_at: obj.created_at,
              updated_at: obj.updated_at,
              resend_count: obj.resend_count
            }
            data.push(objData)
          });
          this.dataSource.data = data as Notifications[];
        } else {
          this.snackBService.openSnackBar(result.message, "Close");
        }
      });
  }

  sendNotification(): void {
    const dialogRef = this.dialog.open(SendPushNotificationDialogComponent, {
      width: '800px', data: { 'flag': 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHistory()
    });
  }

  editNotification(id: any) {
    const dialogRef = this.dialog.open(SendPushNotificationDialogComponent, {
      width: '800px', data: { 'id': id, 'flag': 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHistory()
    });
  }

  deleteNotification(id: any, name: any) {
    const options = {
      title: 'Delete',
      message: 'Do you want to delete  ' + name + '?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.delete('customer-push-notification/' + id)
          .subscribe(result => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, "Close");
              this.getHistory()
            } else {
              this.snackBService.openSnackBar(result.message, "Close");
            }
          });
      }
    })
  }

  sendResendNotification(element: any) {
    let post = {
      resend_flag: element.delivered_count > 0 ? true : false,
      notification_id: element.id
    }
    const options = {
      title: 'Send Notification',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.httpService.post('send-customer-notification', post)
          .subscribe(result => {
            this.snackBService.openSnackBar('Notification Sent successfully', "Close");
            this.getHistory()
          });
      }
    })
  }

}
