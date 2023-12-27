import { Component } from '@angular/core';
import { LocalStorage } from './_services/localstore.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMqttMessage } from "ngx-mqtt";
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { NewOrderService } from './_services/mqtt/new-order-mqtt.service';
import { HttpServiceService } from './_services/http-service.service';
import { EorderConfirmationComponent } from './eorder-confirmation/eorder-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sellerbix';
  status: OnlineStatusType = this.onlineStatusService.getStatus();
  onlineStatusCheck: any = OnlineStatusType;
  constructor(private localStorage: LocalStorage, private httpService: HttpServiceService, private router: Router, private onlineStatusService: OnlineStatusService, private readonly newOrderMqtt: NewOrderService, public dialog: MatDialog) {
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // Retrieve Online status Type
      this.status = status;
    })
    if (this.localStorage.get('accessToken')) {
      this.router.navigate(['home/walkin']);
    }
  }
}
