import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discounts-report',
  templateUrl: './discounts-report.component.html',
  styleUrls: ['./discounts-report.component.scss'],
})
export class DiscountsReportComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  itemReport() {
    this.router.navigate(['setup/reports/discounts/item']);
  }
  orderReport() {
    this.router.navigate(['setup/reports/discounts/order']);
  }
}
