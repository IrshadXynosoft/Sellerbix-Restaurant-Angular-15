import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-online-settings',
  templateUrl: './online-settings.component.html',
  styleUrls: ['./online-settings.component.scss']
})
export class OnlineSettingsComponent implements OnInit {
  id = this.route.snapshot.params.id;
  constructor(private router: Router,public route:ActivatedRoute) { }

  ngOnInit(): void {
  }
  deliveryCharge()
  {
    this.router.navigate(['setup/location/'+this.id+'/online/deliveryCharge']) 
  }
  coupons()
  {
    this.router.navigate(['setup/location/'+this.id+'/online/coupons'])
    
  }
  back()
  {
    this.router.navigate(['setup/location/'+this.id+'/online'])
  }
}
