import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  modifierList() {
    this.router.navigate(['setup/menuHeader/modifierList'])
  }
  modifierGroup() {
    this.router.navigate(['setup/menuHeader/modifierGroup'])
  }
  menuCategory() {
    this.router.navigate(['setup/menuHeader/menuCategory'])
  }
  menuSetup() {
    this.router.navigate(['setup/menuHeader/menu'])
  }
   categorySchedule(){
    this.router.navigate(['setup/menuHeader/categorySchedule'])
   }

}
