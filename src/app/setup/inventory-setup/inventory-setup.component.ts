import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-setup',
  templateUrl: './inventory-setup.component.html',
  styleUrls: ['./inventory-setup.component.scss']
})
export class InventorySetupComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
recipes() {
  this.router.navigate(['setup/inventorySetup/recipes']) 
}
inventorySetup() {
  this.router.navigate(['setup/inventorySetup/finishedGoods']) 
}
subRecipes() {
  this.router.navigate(['setup/inventorySetup/subrecipes']) 
}
ingredients()
{
  this.router.navigate(['setup/inventorySetup/ingredients']) 
}
settings() {
  this.router.navigate(['setup/inventorySetup/settings']) 
}

}
