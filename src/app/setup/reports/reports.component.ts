import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  id:any;
  constructor(private router: Router,private route:ActivatedRoute) {
    this.id=this.route.snapshot.params.id;
   }

  ngOnInit(): void {

  }
  location() {
    this.router.navigate(['home/walkin'])
  }
  
  salesReport() {
  this.router.navigate(['setup/reports/salesReport']) 
 
   }
   itemWiseReport(){
    this.router.navigate(['setup/reports/itemWiseReport']) 
   }
   itemWiseSalesReport(){
    this.router.navigate(['setup/reports/itemWiseSalesReport']) 
   }
   catWiseReport(){
    this.router.navigate(['setup/reports/catWiseReport']) 
   }
   unpaidOrderReport(){
    this.router.navigate(['setup/reports/unPaidCustomerReport']) 
   }
   commercialInvoiceReport() {
    this.router.navigate(['setup/reports/CommercialInvoiceReport']) 
   }
   voidReport() {
    this.router.navigate(['setup/reports/voidReport']) 
   }
   refundReport(){
    this.router.navigate(['setup/reports/refundReport']) 
   }
   unpaidReport() {
    this.router.navigate(['setup/reports/unPaidOrderReport']) 
   }
   paymentReport() {
    this.router.navigate(['setup/reports/paymentReport']) 
   }
   discounts(){
    this.router.navigate(['setup/reports/discounts']) 
   }
}


