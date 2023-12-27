import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-integrations',
  templateUrl: './partner-integrations.component.html',
  styleUrls: ['./partner-integrations.component.scss']
})
export class PartnerIntegrationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  partners() {
    this.router.navigate(['setup/partner/account'])
  }
}
