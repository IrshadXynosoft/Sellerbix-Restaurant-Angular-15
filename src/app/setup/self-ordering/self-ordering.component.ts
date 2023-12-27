import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-self-ordering',
  templateUrl: './self-ordering.component.html',
  styleUrls: ['./self-ordering.component.scss']
})
export class SelfOrderingComponent implements OnInit {
  id=this.route.snapshot.params.id;
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
  }
  location() {
   
    this.router.navigate(['setup/'+this.id+'/editLocation'])
  
   
  }
}
