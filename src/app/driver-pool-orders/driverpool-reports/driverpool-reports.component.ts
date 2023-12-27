import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driverpool-reports',
  templateUrl: './driverpool-reports.component.html',
  styleUrls: ['./driverpool-reports.component.scss']
})
export class DriverpoolReportsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  orderReport() {
    this.router.navigate(['driver-pool-orders/reports/order-report'])
  }

  settlementReport() {
    this.router.navigate(['reports'])
  }
}
