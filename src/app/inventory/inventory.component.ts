import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  selectedMenuItem:any;
  constructor(private router:Router,private dataservice:DataService) {
    this.selectedMenuItem = this.dataservice.getData('pages');
    
   }

  ngOnInit(): void {
  }
  menuOnClick(menu_url:any)
  {

    let url_name = menu_url.substring(1);
    this.router.navigate([url_name])
  }
//   stockOnHand() {
//     this.router.navigate(['inventory/stockOnHand'])
//   }
// purchaseOrders(){
//   this.router.navigate(['inventory/purchaseOrders'])
// }
// stockRequests(){
//   this.router.navigate(['inventory/stockRequests'])
// }
// stockTransfer(){
//   this.router.navigate(['inventory/stockTransfer'])
// }
// batchProduction(){
//   this.router.navigate(['inventory/batchProduction'])
// }
// stockReceipts(){
//   this.router.navigate(['inventory/stockReceipts'])
// }
// stockIssues(){
//   this.router.navigate(['inventory/stockIssues'])
// }
// stockTakes(){
//   this.router.navigate(['inventory/stockTakes'])
// }
reports(){
  this.router.navigate(['inventory/reports'])
}
inventoryMovements(){
  this.router.navigate(['inventory/inventoryMovement'])
  
}

}
