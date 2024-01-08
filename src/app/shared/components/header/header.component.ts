import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { LocalStorage } from 'src/app/_services/localstore.service';
import { HttpServiceService } from '../../../_services/http-service.service';
import { SnackBarService } from '../../../_services/snack-bar.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { ProfileUpdateComponent } from 'src/app/setup/profile-update/profile-update.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewOrderService } from 'src/app/_services/mqtt/new-order-mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { EorderConfirmationComponent } from 'src/app/eorder-confirmation/eorder-confirmation.component';
import { PrintMqttService } from 'src/app/_services/mqtt/print-mqtt.service';
import { CustomerSupportComponent } from 'src/app/home/customer-support/customer-support.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  selected: any = 1;
  isMenuOpened: boolean = false;
  walkInDropdownTag: boolean = false;
  menuList: any = [];
  dropFlag = false;
  currentURL: any = '';
  menuname: any;
  subscription!: Subscription;
  oldSubscription!: Subscription; // for old listener
  messageType: string = 'NotificationListener'; // for new listener
  oldMessage: string = 'OnlineOrderListener'; // for old listener
  isStatus: boolean;
  labelPosition: any = 'before';
  branch_id = this.localService.get('branch_id');
  drawer_status = this.localService.get('drawer_status');
  busyModeCheck: any = false;
  showBusyStatus: any = this.localService.get('busy_mode');
  notification_status: any = this.localService.get('notification_status');
  audio: any;
  printOfflineStatus: any = this.localService.get('printOffline');
  branchSettings: any = this.localService.get('branch_settings');
  customer_support: any = this.localService.get('customer_support')
    ? this.localService.get('customer_support')
    : null;
  constructor(
    private readonly newOrderMqtt: NewOrderService,
    public dialog: MatDialog,
    private dialogService: ConfirmationDialogService,
    private location: Location,
    private router: Router,
    private httpService: HttpServiceService,
    private snackBService: SnackBarService,
    private localService: LocalStorage,
    private dataService: DataService,
    private printMqtt: PrintMqttService
  ) {
    this.isStatus = this.dataService.getData('isStatus');
    this.busyModeCheck = this.branchSettings?.is_busy_mode;
  }

  ngOnInit(): void {
    this.currentURL = this.location.path();
    this.getmenuList();
    this.audio = new Audio();
    this.audio.src = 'assets/audio/driver.wav';
  }

  ngAfterViewInit(): void {
    console.log(this.isStatus);

    if (this.isStatus == null || undefined) {
      setTimeout(() => {
        this.subscribeToTopic();
      }, 1000);
    }
  }

  subscribeToTopic() {
    this.dataService.setData('isStatus', false);
    // code for new listner
    this.subscription = this.newOrderMqtt
      .topic(this.messageType)
      .subscribe((data: IMqttMessage) => {
        let item = data.payload.toString();
        let result = JSON.parse(item);
        let message: any;
        console.log(result);

        if (result.status == 0) {
          this.getOrderDetails(result.order_id);
        } else {
          if (result.status == 1) {
            message = 'accepted';
          } else if (result.status == 2) {
            message = 'rejected';
          } else if (result.status == 3) {
            message = 'delivered';
          } else {
            message = 'not delivered';
          }
          if (this.notification_status == 'true') {
            this.audio.load();
            this.audio.play();
            this.snackBService.openSnackBar(
              'Order no:  #' + result.order_no + ' ' + message + '  by driver',
              ''
            );
          }
        }
      });
    // **
    //  code for old listener
    // this.oldSubscription = this.newOrderMqtt
    //   .topic(this.oldMessage)
    //   .subscribe((data: IMqttMessage) => {
    //     let item = data.payload.toString();
    //     this.getOrderDetails(item);
    //   });
    //  **
  }

  getOrderDetails(item: any) {
    if (this.notification_status == 'true') {
      if (parseFloat(item) != 0) {
        this.httpService
          .get('order-detail/' + item, false)
          .subscribe((result) => {
            if (result.status == 200) {
              const dialogRef = this.dialog.open(EorderConfirmationComponent, {
                disableClose: true,
                width: '70%',
                maxHeight: '100%',
                data: {
                  Orders: result.data[0],
                },
              });
              dialogRef.afterClosed().subscribe((result) => {});
            } else {
              console.log(result.message);
            }
          });
      } else {
        Swal.fire({
          title: 'You received a new Order!',
          icon: 'success',
        });
      }
    }
  }

  getmenuList() {
    this.menuList = this.localService.get('menuList');
  }

  performanceReport() {
    this.router.navigate(['performace-report']);
  }

  menuOnClick(menu_url: any, page: any) {
    let url_name = menu_url.substring(1);
    this.router.navigate([url_name]);
    if (page) {
      this.dataService.setData('pages', page);
    }
  }

  printOffline() {
    this.localService.store('printOffline', this.printOfflineStatus);
  }

  backToHome() {
    this.selected = 1;
    this.router.navigate(['home/walkin']);
  }
  transaction() {
    this.selected = 4;
    this.router.navigate(['transactions']);
  }
  booking() {
    this.selected = 5;
    this.router.navigate(['booking']);
  }
  driverPoolOrders() {
    // this.selected = 5;
    this.router.navigate(['driver-pool-orders']);
  }
  orderStatus() {
    this.selected = 6;
    this.router.navigate(['order-status']);
  }
  backToDashboard() {
    this.router.navigate(['dashboard']);
  }
  menu() {
    if (this.isMenuOpened) {
      this.isMenuOpened = false;
    } else {
      this.isMenuOpened = true;
    }
  }
  people() {
    this.router.navigate(['people']);
  }
  wallet() {
    this.router.navigate(['wallet']);
  }
  items() {
    this.router.navigate(['items']);
  }
  setup() {
    this.selected = 7;
    this.router.navigate(['setup']);
  }
  reviews() {
    this.router.navigate(['reviews']);
  }
  authentication() {
    this.router.navigate(['authentication']);
  }
  setting() {
    this.router.navigate(['setting']);
  }
  support() {
    this.router.navigate(['support']);
  }
  terms() {
    this.router.navigate(['terms']);
  }
  logout() {
    Swal.fire({
      text: 'Are you sure?',
      title: 'LOG OUT',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.post('logout', null).subscribe((result) => {
          this.localService.remove('accessToken');
          this.localService.remove('branchname');
          this.localService.remove('menuList');
          this.localService.remove('branch_id');
          this.localService.remove('coordinates');
          this.localService.remove('country_id');
          this.localService.clear();
          this.router.navigate(['']);
        });
      }
    });
  }
  inventory() {
    this.selected = 8;
    this.router.navigate(['inventory']);
  }
  walkIn() {
    this.selected = 1;
    this.router.navigate(['walkin']);
  }
  walkInDropdown() {
    this.walkInDropdownTag = !this.walkInDropdownTag;
  }
  walkInOrders(params: any) {
    this.selected = 1;
    this.router.navigate([params]);
  }
  showDropdown() {
    this.dropFlag = !this.dropFlag;
  }

  crm() {
    this.selected = 2;
    this.router.navigate(['callcenter']);
  }
  dinein() {
    this.selected = 3;
    this.router.navigate(['dinein']);
  }
  menuName(menuName: any) {
    this.menuname = menuName;
  }
  showsubmenu(menuname: any) {
    if (this.menuname == menuname) {
      return true;
    } else {
      return false;
    }
  }
  partyOrders() {
    this.router.navigate(['party_orders/new_order/list']);
  }
  profile() {
    const dialogRef = this.dialog.open(ProfileUpdateComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDrawer() {
    this.httpService.get('open-drawer').subscribe((result) => {
      if (result.status == 200) {
        this.printMqtt
          .publish('print', JSON.stringify(result.data[0].printObj))
          .subscribe((data: any) => {});
      } else {
        this.snackBService.openSnackBar(result.message, 'Close');
      }
    });
  }

  busyMode() {
    const title =
      this.busyModeCheck == false || this.busyModeCheck == 0
        ? 'Deactivate'
        : 'Activate';
    const options = {
      title: title + ' Busy mode',
      message: 'Are you sure ?',
      cancelText: 'NO',
      confirmText: 'YES',
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        let body = {
          branch_id: this.branch_id,
          status: this.busyModeCheck,
        };
        this.httpService
          .post('change-status-busy-mode', body)
          .subscribe((result) => {
            if (result.status == 200) {
              this.snackBService.openSnackBar(result.message, 'Close');
              this.localService.store('branch_settings', result.data);
            } else {
              this.snackBService.openSnackBar(result.message, 'Close');
            }
          });
      } else {
        this.busyModeCheck = !this.busyModeCheck;
      }
    });
  }

  customerSupport() {
    const dialogRef = this.dialog.open(CustomerSupportComponent, {
      // disableClose: true,
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
