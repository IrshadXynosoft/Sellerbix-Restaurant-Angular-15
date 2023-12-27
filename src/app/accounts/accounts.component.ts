import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  selectedMenuItem = this.dataservice.getData('pages');
  constructor(private dataservice:DataService,private router:Router) { }

  ngOnInit(): void {
  }
  menuOnClick(menu_url:any)
  {
    let url_name = menu_url.substring(1);    
    this.router.navigate([url_name])
  }
}
