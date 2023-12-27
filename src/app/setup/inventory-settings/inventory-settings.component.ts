import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-settings',
  templateUrl: './inventory-settings.component.html',
  styleUrls: ['./inventory-settings.component.scss']
})
export class InventorySettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  ingredientCategory() {
    this.router.navigate(['setup/inventorySetup/ingredientCategory']) 
  }
  mesurementUnits() {
    this.router.navigate(['setup/inventorySetup/mesurementUnits']) 
  }
  suppliers() {
    this.router.navigate(['setup/inventorySetup/suppliers']) 
  }
  itemPreferences() {
    this.router.navigate(['setup/inventorySetup/itemPreferences']) 
  }
  inventoryGlobal() {
    this.router.navigate(['setup/inventorySetup/inventoryGlobal']) 
  }
  back() {
    this.router.navigate(['setup/inventorySetup']) 
  }
}
