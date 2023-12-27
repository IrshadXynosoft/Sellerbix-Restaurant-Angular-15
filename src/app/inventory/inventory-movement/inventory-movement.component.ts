import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-inventory-movement',
  templateUrl: './inventory-movement.component.html',
  styleUrls: ['./inventory-movement.component.scss']
})
export class InventoryMovementComponent implements OnInit {

  constructor(private router:Router,private dataservice:DataService) { }

  ngOnInit(): void {
  }
  inventoryRequest(){
    this.router.navigate(['inventory/stockRequests'])
  }
  inventoryTransfer(){
    this.router.navigate(['inventory/stockTransfer'])
  }
  menuRequest(){
    this.router.navigate(['inventory/menuRequests']) 
  }
  menuTransfer(){
    this.router.navigate(['inventory/menuTransfer']) 
    
  }
}
