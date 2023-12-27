import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss']
})
export class InventoryHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  stockOnHand() {
    this.router.navigate(['inventory/stockOnHand'])
  }
  purchaseOrder() {
    this.router.navigate(['inventory/purchaseOrders'])
  }
}
