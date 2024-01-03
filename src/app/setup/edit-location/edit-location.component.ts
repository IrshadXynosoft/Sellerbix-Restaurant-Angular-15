import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})
export class EditLocationComponent implements OnInit {
  id: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {

  }
  location() {

    this.router.navigate(['setup/location'])
  }

  generalDetails() {

    if (this.id != null || this.id != undefined) {
      this.router.navigate(['setup/location/' + this.id + '/generalDetails'])
    }

  }
  menu() {
    this.id = this.route.snapshot.params.id;
    this.router.navigate(['setup/location/' + this.id + '/menuManagement'])
  }
  staff() {
    this.id = this.route.snapshot.params.id;
    this.router.navigate(['setup/location/' + this.id + '/staff'])
  }
  reports() {
    this.router.navigate(['setup/reports'])
  }
  dining() {
    this.id = this.route.snapshot.params.id;
    this.router.navigate(['setup/location/' + this.id + '/dining'])
  }
  print() {
    this.id = this.route.snapshot.params.id;
    this.router.navigate(['setup/location/' + this.id + '/printers'])
  }
  delivery() {
    this.router.navigate(['setup/delivery_settings'])
  }
  selfOrder() {
    this.id = this.route.snapshot.params.id;
    this.router.navigate(['setup/location/' + this.id + '/selfOrdering'])
  }
  customers() {
    this.router.navigate(['setup/location/' + this.id + '/customers'])
  }
  onlineMenus() {
    this.router.navigate(['setup/location/' + this.id + '/online'])
  }
  settings() {
    this.router.navigate(['setup/location/' + this.id + '/settings'])
  }
  loyaltyGroup() {
    this.router.navigate(['setup/location/' + this.id + '/loyaltyGroup'])
  }
  loyaltyCoupon() {
    this.router.navigate(['setup/location/' + this.id + '/loyaltyCoupon'])
  }
  feedback() {
    this.router.navigate(['setup/location/' + this.id + '/feedback'])
  }
}
