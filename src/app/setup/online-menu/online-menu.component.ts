import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddLocationComponent } from '../add-location/add-location.component';
import { HttpServiceService } from "../../_services/http-service.service";
@Component({
  selector: 'app-online-menu',
  templateUrl: './online-menu.component.html',
  styleUrls: ['./online-menu.component.scss']
})
export class OnlineMenuComponent implements OnInit {
  id: any;
  constructor(private router: Router, public dialog: MatDialog, public httpService: HttpServiceService, public route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }
  ngOnInit(): void { }
  categoryHeader() {
    this.router.navigate(['setup/location/' + this.id + '/online/category'])
  }
  banners() {
    this.router.navigate(['setup/location/' + this.id + '/online/banners'])
  }
  sectonHeads() {
    this.router.navigate(['setup/location/' + this.id + '/online/sectonHeads'])
  }
  itemWiseDiscount() {
    this.router.navigate(['setup/location/' + this.id + '/online/itemWiseDiscount'])
  }
  onlineDeliveryManager() {
    this.router.navigate(['setup/location/' + this.id + '/online/onlineDeliveryManager'])
  }
  socialMediaEntities() {
    this.router.navigate(['setup/location/' + this.id + '/online/socialMediaEntities'])
  }
  onlineSettings() {
    this.router.navigate(['setup/location/' + this.id + '/online/settings'])
  }
  deliverySettings() {
    //this.router.navigate(['setup/location/'+this.id+'/online/deliveryCharge']) 
    this.router.navigate(['setup/location/' + this.id + '/online/onlineSettings'])
  }
  advanceDiscount() {
    this.router.navigate(['setup/location/' + this.id + '/online/advanceDiscount'])
  }
  pushNotifications() {
    this.router.navigate(['setup/location/' + this.id + '/online/pushNotification'])
  }

  back() {
    this.router.navigate(['setup/' + this.id + '/editLocation'])
  }

  deliveryCharge() {
    this.router.navigate(['setup/location/' + this.id + '/online/deliveryCharge'])
  }
  coupons() {
    this.router.navigate(['setup/location/' + this.id + '/online/coupons'])

  }
}
