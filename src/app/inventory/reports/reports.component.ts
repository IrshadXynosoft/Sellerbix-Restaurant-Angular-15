import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  purchaseReport(){
    this.router.navigate(['inventory/purchaseOrderReport'])
  }
  stockReport()
  {
   this.router.navigate(['inventory/stockReport'])
  }
  itemStockReport(){
   this.router.navigate(['inventory/itemStockReport'])
  }
  batchProductionReport(){
    this.router.navigate(['inventory/batchProductionReport'])
  }
  stockMovementReport(){
    this.router.navigate(['inventory/stockMovement'])
  }
  reOrderReport(){
    this.router.navigate(['inventory/reOrderReport'])
  }
  wastageReport(){
    this.router.navigate(['inventory/wastageReport'])
  }
  stockIssueReport(){
    this.router.navigate(['inventory/stockIssueReport'])
  }
  stockConsumption(){
    this.router.navigate(['inventory/stockConsumptionReport'])
  }
  foodCosting(){
    this.router.navigate(['inventory/foodCostingReport'])
  }
  supplierReport(){
    this.router.navigate(['inventory/supplierReport'])
  }
}
