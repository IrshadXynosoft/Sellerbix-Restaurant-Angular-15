import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-details-found',
  templateUrl: './no-details-found.component.html',
  styleUrls: ['./no-details-found.component.scss']
})
export class NoDetailsFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  newCustomer() {
    this.router.navigate(['callcenter/CreateNewCustomer'])
  }
}
