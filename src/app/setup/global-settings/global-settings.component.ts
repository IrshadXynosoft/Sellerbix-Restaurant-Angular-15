import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  entity(){
    this.router.navigate(['setup/globalSettings/entities']) 
  }
  orderCancellation() {
    this.router.navigate(['setup/globalSettings/orderCancellation'])
  }
  orderModify() {
    this.router.navigate(['setup/globalSettings/orderModify'])
  }
  comboSections(){
    this.router.navigate(['setup/globalSettings/comboSections'])
  }
  passwords() {
    this.router.navigate(['setup/globalSettings/passwords'])
  }
  payment() {
    this.router.navigate(['setup/globalSettings/payment'])
  }
  referals() {
    this.router.navigate(['setup/globalSettings/referals'])
  }
  modifierList() {
    this.router.navigate(['setup/globalSettings/modifierList'])
  }
  modifierGroup() {
    this.router.navigate(['setup/globalSettings/modifierGroup'])
  }
  customerGroup() {
    this.router.navigate(['setup/globalSettings/customerGroup'])
  }
  crm() {
    this.router.navigate(['setup/globalSettings/crm'])
  }
  alternativelanguages() {
    this.router.navigate(['setup/globalSettings/alternativelanguages'])
  }
  showOnWebSettings(){
    this.router.navigate(['setup/globalSettings/showBranchOnWeb']) 
  }
  
  Utilities(){
    this.router.navigate(['setup/globalSettings/utilities']) 
  }
}
