import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {
  id = this.route.snapshot.params.id;
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
  }
  back() {
    this.router.navigate(['setup/'+ this.id + '/editLocation'])
  }
  posSettings(){
    this.router.navigate(['setup/location/'+this.id+ '/settings/pos'])
  }
  pushnotificationsSettings(){
    this.router.navigate(['setup/location/'+this.id+ '/settings/push-notifications'])
  }
}
