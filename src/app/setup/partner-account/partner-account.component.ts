import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-account',
  templateUrl: './partner-account.component.html',
  styleUrls: ['./partner-account.component.scss']
})
export class PartnerAccountComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['setup/partner'])
  }
}
