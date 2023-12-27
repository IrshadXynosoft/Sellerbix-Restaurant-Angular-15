import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-subscription-expired-page',
  templateUrl: './subscription-expired-page.component.html',
  styleUrls: ['./subscription-expired-page.component.scss']
})
export class SubscriptionExpiredPageComponent implements OnInit {
  message:any = this.localservice.get('subscriptionExpiredMessage')
  constructor(private localservice : LocalStorage) { }

  ngOnInit(): void {
  }

}
