import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from 'src/app/_services/localstore.service';

@Component({
  selector: 'app-accounts-report',
  templateUrl: './accounts-report.component.html',
  styleUrls: ['./accounts-report.component.scss']
})
export class AccountsReportComponent implements OnInit {
  id:any;
  constructor(private router: Router,private route:ActivatedRoute,private localservice:LocalStorage) {
    this.id=this.localservice.get('branch_id');
   }

  ngOnInit(): void {

  }
  paymentReport(){
    this.router.navigate(['accounts/reports/paymentReport']) 
  }
  receiptReport(){
    this.router.navigate(['accounts/reports/receiptReport']) 
  }
  daybookReport(){
    this.router.navigate(['accounts/reports/daybookReport']) 
  }
  dailyReport(){
    this.router.navigate(['accounts/reports/dailyReport']) 
  }
  ledgerReport(){
    this.router.navigate(['accounts/reports/ledgerReport']) 
  }
  revenueReport(){
    this.router.navigate(['accounts/reports/revenueReport']) 
  }
  daybookSummary(){
    this.router.navigate(['accounts/reports/daybookSummary']) 
  }
  stockReport(){
    this.router.navigate(['accounts/reports/stockReport']) 
  }
  tipReport() {
    this.router.navigate(['accounts/reports/tipReport']) 
  }
}

