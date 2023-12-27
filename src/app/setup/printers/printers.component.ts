import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit {
  id=this.route.snapshot.params.id;
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
  }
  location() {
    this.router.navigate(['setup/'+this.id+'/editLocation'])
  
  }
  printerSettings()
  { this.router.navigate(['setup/location/'+this.id+'/printers/settings'])
  }
}
