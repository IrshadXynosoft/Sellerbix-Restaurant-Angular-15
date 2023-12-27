import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss']
})
export class MenuManagementComponent implements OnInit {
  id: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }
  location() {

    this.router.navigate(['setup/' + this.id + '/editLocation'])
  }
  subDiscount() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/subchargesDiscount'])
  }
  tax() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/taxRates'])
  }
  menu() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/menuInner'])
  }
  utensils() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/utensils'])
  }
  itemNote() {
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/itemNote'])
  }
  pricePlan(){
    this.router.navigate(['setup/location/' + this.id + '/menuManagement/pricePlan'])
  }
}
