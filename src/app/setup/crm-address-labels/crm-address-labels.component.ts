import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm-address-labels',
  templateUrl: './crm-address-labels.component.html',
  styleUrls: ['./crm-address-labels.component.scss']
})
export class CrmAddressLabelsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['setup/globalSettings'])
  }
}
