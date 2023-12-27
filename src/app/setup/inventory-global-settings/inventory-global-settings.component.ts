import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-global-settings',
  templateUrl: './inventory-global-settings.component.html',
  styleUrls: ['./inventory-global-settings.component.scss']
})
export class InventoryGlobalSettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['setup/inventorySetup/settings'])
  }
}
